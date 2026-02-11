<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\SystemSetting;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    // --- User Preferences ---

    /**
     * Get authenticated user's preferences.
     */
    public function getPreferences(Request $request)
    {
        $user = $request->user();
        
        // Ensure preferences exist
        if (!$user->preferences) {
            $user->preferences()->create([
                'theme' => 'dark',
                'accent_color' => '#00FF85',
                'language' => 'es'
            ]);
            $user->load('preferences');
        }

        return response()->json([
            'success' => true,
            'preferences' => $user->preferences
        ]);
    }

    /**
     * Update authenticated user's preferences.
     */
    public function updatePreferences(Request $request)
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

    // --- Admin System Settings ---

    /**
     * Get all system settings (grouped).
     */
    public function getSystemSettings(Request $request)
    {
        // Authorization check (Ensure only admin can access)
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settings = SystemSetting::all()->groupBy('group');

        return response()->json([
            'success' => true,
            'settings' => $settings
        ]);
    }

    /**
     * Update system settings.
     * Expects an array of settings: [{ key: 'commission_rate', value: '10' }, ...]
     */
    public function updateSystemSettings(Request $request)
    {
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $settingData) {
            SystemSetting::where('key', $settingData['key'])
                ->update(['value' => $settingData['value']]);
        }

        // Log the action
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_system_settings',
            'details' => 'Actualizó configuración del sistema: ' . json_encode($validated['settings']),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Configuración del sistema actualizada.'
        ]);
    }

    /**
     * Get activity logs.
     */
    public function getActivityLogs(Request $request)
    {
        if ($request->user()->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $logs = ActivityLog::with('user:id,name,email')
            ->latest()
            ->paginate(50);

        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }
}
