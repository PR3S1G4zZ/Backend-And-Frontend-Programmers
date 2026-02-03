<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeveloperController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('user_type', 'programmer')
            ->with('developerProfile')
            ->withCount('reviewsReceived')
            ->withAvg('reviewsReceived', 'rating');

        if ($request->filled('search')) {
            $query->where(function ($builder) use ($request) {
                $builder
                    ->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('lastname', 'like', '%' . $request->search . '%');
            });
        }

        $developers = $query->get()->map(function ($developer) {
            $profile = $developer->developerProfile;
            $completedProjects = Application::where('developer_id', $developer->id)
                ->whereHas('project', function ($builder) {
                    $builder->where('status', 'completed');
                })
                ->count();

            return [
                'id' => (string) $developer->id,
                'name' => $developer->name . ' ' . $developer->lastname,
                'title' => $profile?->headline ?? 'Desarrollador',
                'location' => $profile?->location ?? 'Sin ubicación',
                'hourlyRate' => $profile?->hourly_rate ?? null,
                'rating' => round($developer->reviews_received_avg_rating ?? 0, 1),
                'reviewsCount' => $developer->reviews_received_count ?? 0,
                'completedProjects' => $completedProjects,
                'availability' => $profile?->availability ?? 'available',
                'skills' => $profile?->skills ?? [],
                'experience' => $profile?->experience_years ?? null,
                'languages' => $profile?->languages ?? [],
                'bio' => $profile?->bio ?? '',
                'lastActive' => $developer->updated_at?->diffForHumans(),
                'isVerified' => $developer->email_verified_at !== null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $developers,
        ]);
    }
}
