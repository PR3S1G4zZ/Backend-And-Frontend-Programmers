<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function index(Request $request, Project $project)
    {
        // Verify access (Project Company or Assigned Developer)
        // For now, allow if user is auth
        // TODO: Strict policies
        
        return $project->milestones()->orderBy('order')->get();
    }

    public function store(Request $request, Project $project)
    {
        abort_unless($request->user()->id === $project->company_id, 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
            'order' => 'integer'
        ]);

        $milestone = $project->milestones()->create($data);

        return response()->json($milestone, 201);
    }

    public function update(Request $request, Project $project, Milestone $milestone)
    {
        // Allow Company to edit details, Developer to edit status
        $user = $request->user();
        
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'progress_status' => 'sometimes|in:todo,in_progress,review,completed',
            'due_date' => 'nullable|date'
        ]);
        
        // Use Policies! simplified logic here:
        if ($user->id === $project->company_id) {
            // Company Approval Logic
            if (($data['progress_status'] ?? '') === 'completed' && $milestone->progress_status !== 'completed') {
                try {
                    $paymentService = app(\App\Services\PaymentService::class);
                    $paymentService->releaseMilestone($user, $milestone->amount, $project);
                    $milestone->status = 'released'; // Mark as paid
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Error liberando fondos: ' . $e->getMessage()], 400);
                }
            }
        } elseif ($request->has('progress_status')) {
             // Developer moving status
             // Ensure developer is the assignee
             $isAssigned = $project->applications()
                ->where('developer_id', $user->id)
                ->where('status', 'accepted')
                ->exists();
                
             if (!$isAssigned) {
                 abort(403, 'No estás asignado a este proyecto.');
             }
             
             // Developer cannot mark as completed (only review)
             if ($data['progress_status'] === 'completed') {
                 abort(403, 'Solo la empresa puede aprobar y completar el hito.');
             }
        }

        $milestone->update($data);

        return response()->json($milestone);
    }

    public function destroy(Request $request, Project $project, Milestone $milestone)
    {
        abort_unless($request->user()->id === $project->company_id, 403);
        $milestone->delete();
        return response()->noContent();
    }

    public function submit(Request $request, Project $project, Milestone $milestone)
    {
        $user = $request->user();
        
        // Ensure user is the assigned developer and project status is active stuff...
        // Simplified check:
        // Check if user is the developer of the accepted application
        $isAssigned = $project->applications()
            ->where('developer_id', $user->id)
            ->where('status', 'accepted')
            ->exists();

        if (!$isAssigned) {
            return response()->json(['message' => 'No tienes permiso para entregar este hito.'], 403);
        }

        $data = $request->validate([
            'deliverables' => 'required|array',
            'deliverables.*' => 'required|string' // Array of links or descriptions
        ]);

        $milestone->update([
            'deliverables' => $data['deliverables'],
            'progress_status' => 'review'
        ]);

        // Optional: Create a system message in the conversation?

        return response()->json($milestone);
    }

    public function approve(Request $request, Project $project, Milestone $milestone)
    {
        $user = $request->user();

        if ($user->id !== $project->company_id) {
            return response()->json(['message' => 'Solo la empresa puede aprobar hitos.'], 403);
        }

        if ($milestone->progress_status !== 'review') {
            return response()->json(['message' => 'El hito no está en revisión.'], 400);
        }

        try {
            $paymentService = app(\App\Services\PaymentService::class);
            $paymentService->releaseMilestone($user, $milestone->amount, $project);
            
            $milestone->update([
                'progress_status' => 'completed',
                'status' => 'released' // Funds released
            ]);

            return response()->json($milestone);

        } catch (\Exception $e) {
             return response()->json(['message' => 'Error liberando fondos: ' . $e->getMessage()], 400);
        }
    }

    public function reject(Request $request, Project $project, Milestone $milestone)
    {
        $user = $request->user();

        if ($user->id !== $project->company_id) {
            return response()->json(['message' => 'Solo la empresa puede rechazar entregas.'], 403);
        }

        if ($milestone->progress_status !== 'review') {
             return response()->json(['message' => 'El hito no está en revisión.'], 400);
        }

        // Reset to in_progress
        $milestone->update([
            'progress_status' => 'in_progress',
            // potentially clear deliverables or keep them as history? Keeping them for now.
        ]);

        return response()->json($milestone);
    }
}
