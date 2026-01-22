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
        $q = Project::query()->with('company:id,name');
        if ($r->filled('status')) $q->where('status',$r->status);
        if ($r->filled('search')) $q->where('title','like','%'.$r->search.'%');
        return $q->latest()->paginate(12);
    }

    public function show(Project $project)
    {
        return $project->load(['company:id,name','applications'=>function($q){
            $q->with('developer:id,name');
        }]);
    }

    public function store(Request $r)
    {
        abort_unless($r->user()->user_type==='company', 403);
        $data = $r->validate([
          'title'=>'required|string|max:150',
          'description'=>'required|string',
          'budget_min'=>'nullable|integer',
          'budget_max'=>'nullable|integer',
        ]);
        $data['company_id'] = $r->user()->id;
        $project = Project::create($data);
        return response()->json($project, 201);
    }

    public function update(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='company' && $project->company_id==$r->user()->id, 403);
        $project->update($r->only('title','description','budget_min','budget_max','status'));
        return $project;
    }

    public function destroy(Request $r, Project $project)
    {
        abort_unless($r->user()->user_type==='company' && $project->company_id==$r->user()->id, 403);
        $project->delete();
        return response()->noContent();
    }
}
