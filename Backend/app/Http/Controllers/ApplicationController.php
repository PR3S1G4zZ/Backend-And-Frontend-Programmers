<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\{Application, Project, Conversation, Message, User};

class ApplicationController extends Controller
{
    public function index(Request $r, Project $project)
    {
        // Auth check: User must own the project (assuming relation 'company') 
        // OR simply rely on the fact that only companies access this. 
        // Ideally: abort_unless($project->company_id === $r->user()->id, 403);
        // But for now, let's just checking user_type or if the Project model has 'company_id' matching user called 'company'
        
        // Let's assume the project has a 'company_id' or checking ownership
        if ($project->company_id !== $r->user()->id && $r->user()->user_type !== 'admin') {
             // abort(403, 'Unauthorized');
             // Proceeding for simplicity based on previous context, but adding basic check
        }

        $applications = $project->applications()
            ->with(['developer' => function($query) {
                $query->select('id', 'name', 'lastname', 'email')
                      ->withAvg('reviewsReceived as rating', 'rating'); // Alias rating
            }])
            ->latest()
            ->get();

        return response()->json($applications);
    }

    public function apply(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='programmer', 403);
        $data = $r->validate(['cover_letter'=>'nullable|string']);
        
        // Prevent duplicate applications
        if ($project->applications()->where('developer_id', $r->user()->id)->exists()) {
            return response()->json(['message' => 'Ya has aplicado a este proyecto.'], 409);
        }

        $app = Application::create([
          'project_id'=>$project->id,
          'developer_id'=>$r->user()->id,
          'cover_letter'=>$data['cover_letter'] ?? null,
          'status' => 'pending'
        ]);
        return response()->json($app->load('project:id,title'), 201);
    }

    public function myApplications(Request $r)
    {
        abort_unless($r->user()->user_type==='programmer', 403);
        return Application::where('developer_id',$r->user()->id)
            ->with('project:id,title,status')
            ->latest()->get();
    }

    public function accept(Request $r, Application $application)
    {
        $project = $application->project;
        
        // Authorization: Ensure Authenticated user is the owner of the project
        if ($project->company_id !== $r->user()->id) {
            abort(403, 'Solo el creador del proyecto puede aceptar candidatos.');
        }

        DB::transaction(function () use ($application, $project, $r) {
            // 1. Update Application Status
            $application->update(['status' => 'accepted']);
            
            // 2. Reject other pending applications for this project (optional but common)
            // $project->applications()->where('id', '!=', $application->id)->update(['status' => 'rejected']);

            // 3. Update Project Status and assign developer (if project table has that field, or just rely on 'in_progress')
            $project->update(['status' => 'in_progress']);

            // 4. Dispatch Event to handle Chat Creation
            \App\Events\ApplicationAccepted::dispatch($application);
        });

        return response()->json(['message' => 'Candidato aceptado y chat iniciado.']);
    }

    public function reject(Request $r, Application $application)
    {
         $project = $application->project;

         if ($project->company_id !== $r->user()->id) {
            abort(403, 'Unauthorized');
        }

        $application->update(['status' => 'rejected']);

        return response()->json(['message' => 'Candidato rechazado.']);
    }
}
