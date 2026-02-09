<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectController extends Controller
{

    public function fund(Request $r, Project $project)
    {
        if ($project->company_id !== $r->user()->id) {
            abort(403);
        }

        // Validate amount (50% of budget_min or full amount?)
        // User request: "Anticipo del 50%"
        $amount = $project->budget_min * 0.5;

        try {
            $paymentService = app(\App\Services\PaymentService::class);
            $paymentService->fundProject($r->user(), $amount, $project);
            
            // Activate Project? Maybe change status from 'pending_payment' to 'open'
            if ($project->status === 'pending_payment') {
                $project->update(['status' => 'open']);
            }

            return response()->json(['message' => 'Proyecto financiado con éxito.', 'project' => $project]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function index(Request $r)
    {
        // filtros simples: status, search
        $q = Project::query()
            ->with([
                'company:id,name,email_verified_at',
                'categories:id,name',
                'skills:id,name',
            ])
            ->withCount('applications')
            ->withExists(['applications as has_applied' => function ($query) use ($r) {
                $query->where('developer_id', $r->user()->id ?? 0);
            }]);
        if ($r->filled('status')) {
            $q->where('status', $r->status);
        }
        if ($r->filled('search')) {
            $q->where(function ($builder) use ($r) {
                $builder
                    ->where('title', 'like', '%' . $r->search . '%')
                    ->orWhere('description', 'like', '%' . $r->search . '%');
            });
        }
        if ($r->filled('category')) {
            $q->whereHas('categories', function ($builder) use ($r) {
                $builder->where('name', $r->category)
                    ->orWhere('id', $r->category);
            });
        }
        if ($r->filled('skill')) {
            $q->whereHas('skills', function ($builder) use ($r) {
                $builder->where('name', $r->skill)
                    ->orWhere('id', $r->skill);
            });
        }
        if ($r->filled('level')) {
            $q->where('level', $r->level);
        }
        if ($r->filled('remote')) {
            $q->where('remote', filter_var($r->remote, FILTER_VALIDATE_BOOLEAN));
        }
        return \App\Http\Resources\ProjectResource::collection($q->latest()->paginate(12));
    }

    public function show(Project $project)
    {
        $project->load(['company', 'categories', 'skills']);
        // If owner, load applications with developers
        // Logic for loading applications could be conditional or separate, but ProjectResource handles 'whenLoaded'
        
        return new \App\Http\Resources\ProjectResource($project);
    }

    public function companyProjects(Request $request)
    {
        abort_unless($request->user()->user_type === 'company', 403);

        $projects = Project::with(['categories', 'skills'])
            ->withCount('applications')
            ->where('company_id', $request->user()->id)
            ->latest()
            ->get();

        return \App\Http\Resources\ProjectResource::collection($projects);
    }

    public function store(Request $r)
    {
        abort_unless($r->user()->user_type==='company', 403);
        $data = $r->validate([
          'title'=>'required|string|max:150',
          'description'=>'required|string',
          'budget_min'=>'nullable|integer',
          'budget_max'=>'nullable|integer',
          'budget_type'=>'nullable|in:fixed,hourly',
          'duration_value'=>'nullable|integer|min:1',
          'duration_unit'=>'nullable|in:days,weeks,months',
          'location'=>'nullable|string|max:150',
          'remote'=>'nullable|boolean',
          'level'=>'nullable|in:junior,mid,senior,lead',
          'priority'=>'nullable|in:low,medium,high,urgent',
          'featured'=>'nullable|boolean',
          'deadline'=>'nullable|date',
          'max_applicants'=>'nullable|integer|min:1',
          'tags'=>'nullable|array',
          'status'=>'nullable|in:open,in_progress,completed,cancelled,draft',
          'category_ids'=>'nullable|array',
          'category_ids.*'=>'integer|exists:project_categories,id',
          'skill_ids'=>'nullable|array',
          'skill_ids.*'=>'integer|exists:skills,id',
        ]);
        $data['company_id'] = $r->user()->id;
        if (empty($data['status'])) {
            $data['status'] = 'open';
        }
        $project = Project::create($data);
        if (!empty($data['category_ids'])) {
            $project->categories()->sync($data['category_ids']);
        }
        if (!empty($data['skill_ids'])) {
            $project->skills()->sync($data['skill_ids']);
        }
        return new \App\Http\Resources\ProjectResource($project);
    }

    public function update(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='company' && $project->company_id==$r->user()->id, 403);
        $data = $r->validate([
            'title'=>'sometimes|string|max:150',
            'description'=>'sometimes|string',
            'budget_min'=>'nullable|integer',
            'budget_max'=>'nullable|integer',
            'budget_type'=>'nullable|in:fixed,hourly',
            'duration_value'=>'nullable|integer|min:1',
            'duration_unit'=>'nullable|in:days,weeks,months',
            'location'=>'nullable|string|max:150',
            'remote'=>'nullable|boolean',
            'level'=>'nullable|in:junior,mid,senior,lead',
            'priority'=>'nullable|in:low,medium,high,urgent',
            'featured'=>'nullable|boolean',
            'deadline'=>'nullable|date',
            'max_applicants'=>'nullable|integer|min:1',
            'tags'=>'nullable|array',
            'status'=>'nullable|in:open,in_progress,completed,cancelled,draft,pending_payment',
            'category_ids'=>'nullable|array',
            'category_ids.*'=>'integer|exists:project_categories,id',
            'skill_ids'=>'nullable|array',
            'skill_ids.*'=>'integer|exists:skills,id',
        ]);
        // Check if completing project
        if (($data['status'] ?? '') === 'completed' && $project->status !== 'completed') {
             // Find accepted application
             $acceptedApp = $project->applications()->where('status', 'accepted')->first();
             if ($acceptedApp) {
                 // Release Funds
                 $amount = $project->budget_min ?? 0; // consistent with accept logic
                 if ($amount > 0) {
                     $paymentService = app(\App\Services\PaymentService::class);
                     try {
                        $paymentService->releaseFunds($r->user(), $acceptedApp->developer, $amount, $project);
                     } catch (\Exception $e) {
                         return response()->json(['message' => 'Error liberando fondos: ' . $e->getMessage()], 400);
                     }
                 }
             }
        }
        
        $project->update($data);
        if (array_key_exists('category_ids', $data)) {
            $project->categories()->sync($data['category_ids'] ?? []);
        }
        if (array_key_exists('skill_ids', $data)) {
            $project->skills()->sync($data['skill_ids'] ?? []);
        }
        return new \App\Http\Resources\ProjectResource($project);
    }

    public function destroy(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='company' && $project->company_id==$r->user()->id, 403);
        // Verificar si tiene desarrolladores asignados (aplicaciones aceptadas)
        $hasAcceptedDevelopers = $project->applications()->where('status', 'accepted')->exists();
        
        if ($hasAcceptedDevelopers) {
             return response()->json([
                'message' => 'No se puede eliminar un proyecto que ya tiene un desarrollador asignado.'
             ], 403);
        }

        $project->delete();
        return response()->noContent();
    }
}
