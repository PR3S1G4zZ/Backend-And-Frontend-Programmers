<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Project;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Listar reviews recibidas por el developer autenticado
     */
    public function index(Request $request)
    {
        $reviews = Review::where('developer_id', $request->user()->id)
            ->with(['project', 'company'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Crear una review (solo empresas que hayan trabajado con el developer)
     */
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'developer_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Verificar que el proyecto existe y pertenece a la empresa
        $project = Project::where('id', $request->project_id)
            ->where('company_id', $user->id)
            ->first();

        if (!$project) {
            return response()->json([
                'message' => 'No tienes permiso para revisar este proyecto'
            ], 403);
        }

        // Verificar que la empresa haya trabajado con el developer
        $application = Application::where('project_id', $request->project_id)
            ->where('developer_id', $request->developer_id)
            ->where('status', 'accepted')
            ->first();

        if (!$application) {
            return response()->json([
                'message' => 'El developer no ha trabajado en este proyecto'
            ], 400);
        }

        // Crear la review
        $review = Review::create([
            'project_id' => $request->project_id,
            'company_id' => $user->id,
            'developer_id' => $request->developer_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review creada exitosamente',
            'data' => $review->load(['project', 'company'])
        ], 201);
    }

    /**
     * Ver una review específica
     */
    public function show(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where(function ($query) use ($request) {
                $query->where('developer_id', $request->user()->id)
                    ->orWhere('company_id', $request->user()->id);
            })
            ->with(['project', 'company', 'developer'])
            ->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }
}
