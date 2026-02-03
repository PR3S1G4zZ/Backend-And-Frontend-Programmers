<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{Project, Application};
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function company(Request $r)
    {
        abort_unless($r->user()->user_type==='company', 403);
        $uid = $r->user()->id;
        $active = Project::where('company_id',$uid)->whereIn('status',['open','in_progress'])->count();
        $hired = Application::whereHas('project', fn($q)=>$q->where('company_id',$uid))
                  ->where('status','accepted')->count();
        $budget = Project::where('company_id',$uid)->sum(DB::raw('COALESCE(budget_max, budget_min)'));
        $completion = 96; // placeholder: lógica real si agregas entregas
        return compact('active','hired','budget','completion');
    }

    public function programmer(Request $r)
    {
        abort_unless($r->user()->user_type==='programmer', 403);
        $uid = $r->user()->id;
        $activeProjects = Application::where('developer_id',$uid)->where('status','accepted')->count();
        $commits = 142;   // si integras GitHub luego
        $skillPoints = 3847; // si gamificas
        $networkScore = 8.9;
        return [
          'activeProjects'=>$activeProjects,
          'commits'=>$commits,
          'skillPoints'=>$skillPoints,
          'networkScore'=>$networkScore
        ];
    }
}
