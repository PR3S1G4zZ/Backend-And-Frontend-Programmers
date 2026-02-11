<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use App\Models\SystemSetting;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Get current user's preferences
     */
    public function getPreferences(Request $request): JsonResponse
    {
        $preferences = $request->user()->preferences;
        
        if (!$preferences) {
            $preferences = $request->user()->preferences()->create([
                'theme' => 'dark',
                'accent_color' => '#00FF85',
                'language' => 'es'
            ]);
        }

        return response()->json([
            'success' => true,
            'preferences' => $preferences
        ]);
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme' => 'sometimes|in:dark,light,terminal',
            'accent_color' => 'sometimes|string|max:7',
            'language' => 'sometimes|in:es,en',
            'two_factor_enabled' => 'sometimes|boolean'
        ]);

        $user = $request->user();
        
        $preferences = $user->preferences;

        if (!$preferences) {
            $preferences = $user->preferences()->create([
                'theme' => 'dark',
                'accent_color' => '#00FF85',
                'language' => 'es'
            ]);
        }

        $preferences->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Preferencias actualizadas correctamente.',
            'preferences' => $preferences
        ]);
    }

    /**
     * Get System Settings (Admin Only)
     */
    public function getSystemSettings(Request $request): JsonResponse
    {
        // Add Authorization check if not handled by middleware
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $settings = SystemSetting::all();

        return response()->json([
            'success' => true,
            'settings' => $settings
        ]);
    }

    /**
     * Update/Create System Settings (Admin Only)
     */
    public function updateSystemSettings(Request $request): JsonResponse
    {
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.description' => 'nullable|string'
        ]);

        foreach ($validated['settings'] as $item) {
            SystemSetting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'],
                    'description' => $item['description'] ?? null
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Configuración del sistema actualizada.'
        ]);
    }

    /**
     * Get Activity Logs (Admin Only)
     */
    public function getActivityLogs(Request $request): JsonResponse
    {
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = ActivityLog::with('user:id,name,email,user_type')->latest();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', 'like', '%' . $request->action . '%');
        }

        $logs = $query->paginate(20);

        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }
}
