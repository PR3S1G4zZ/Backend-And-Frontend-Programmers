<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Obtener todos los usuarios (solo para administradores)
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado. Solo administradores pueden ver usuarios.'
                ], 403);
            }

            // Obtener usuarios con paginación opcional
            $perPage = $request->get('per_page', 50);
            $users = User::select('id', 'name', 'lastname', 'email', 'user_type', 'created_at', 'email_verified_at')
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage);

            return response()->json([
                'success' => true,
                'users' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un usuario específico
     */
    public function getUser($id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un usuario
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            // Validar datos
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'lastname' => 'sometimes|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'user_type' => 'sometimes|in:programmer,company,admin'
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente.',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un usuario
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            // No permitir que un admin se elimine a sí mismo
            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta.'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de usuarios
     */
    public function getUserStats(): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $stats = [
                'total_users' => User::count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'companies' => User::where('user_type', 'company')->count(),
                'programmers' => User::where('user_type', 'programmer')->count(),
                'verified_emails' => User::whereNotNull('email_verified_at')->count(),
                'unverified_emails' => User::whereNull('email_verified_at')->count(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}