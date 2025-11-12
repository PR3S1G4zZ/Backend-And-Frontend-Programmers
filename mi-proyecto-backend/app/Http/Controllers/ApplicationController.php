<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{Application, Project};

class ApplicationController extends Controller
{
    public function apply(Request $r, Project $project)
    {
        abort_unless($r->user()->role==='programmer', 403);
        $data = $r->validate(['cover_letter'=>'nullable|string']);
        $app = Application::create([
          'project_id'=>$project->id,
          'developer_id'=>$r->user()->id,
          'cover_letter'=>$data['cover_letter'] ?? null,
        ]);
        return response()->json($app->load('project:id,title'), 201);
    }

    public function myApplications(Request $r)
    {
        abort_unless($r->user()->role==='programmer', 403);
        return Application::where('developer_id',$r->user()->id)
            ->with('project:id,title,status')
            ->latest()->get();
    }
}
