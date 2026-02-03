<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectController extends Controller
{

    public function index(Request $r)
    {
        // filtros simples: status, search
        $q = Project::query()
            ->with([
                'company:id,name,email_verified_at',
                'categories:id,name',
                'skills:id,name',
            ])
            ->withCount('applications');
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
        return $q->latest()->paginate(12);
    }

    public function show(Project $project)
    {
        return $project->load(['company:id,name','categories:id,name','skills:id,name','applications'=>function($q){
            $q->with('developer:id,name');
        }]);
    }

    public function companyProjects(Request $request)
    {
        abort_unless($request->user()->user_type === 'company', 403);

        $projects = Project::with(['categories:id,name', 'skills:id,name', 'applications.developer:id,name'])
            ->withCount('applications')
            ->where('company_id', $request->user()->id)
            ->latest()
            ->get();

        return $projects;
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
        return response()->json($project, 201);
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
            'status'=>'nullable|in:open,in_progress,completed,cancelled,draft',
            'category_ids'=>'nullable|array',
            'category_ids.*'=>'integer|exists:project_categories,id',
            'skill_ids'=>'nullable|array',
            'skill_ids.*'=>'integer|exists:skills,id',
        ]);
        $project->update($data);
        if (array_key_exists('category_ids', $data)) {
            $project->categories()->sync($data['category_ids'] ?? []);
        }
        if (array_key_exists('skill_ids', $data)) {
            $project->skills()->sync($data['skill_ids'] ?? []);
        }
        return $project;
    }

    public function destroy(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='company' && $project->company_id==$r->user()->id, 403);
        $project->delete();
        return response()->noContent();
    }
}
