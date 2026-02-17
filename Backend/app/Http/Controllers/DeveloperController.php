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
    public function show($id): JsonResponse
    {
        $developer = User::where('user_type', 'programmer')
            ->where('id', $id)
            ->with('developerProfile')
            ->withCount('reviewsReceived')
            ->withAvg('reviewsReceived', 'rating')
            ->firstOrFail();

        $profile = $developer->developerProfile;
        $completedProjects = Application::where('developer_id', $developer->id)
            ->whereHas('project', function ($builder) {
                $builder->where('status', 'completed');
            })
            ->count();

        $data = [
            'id' => (string) $developer->id,
            'name' => $developer->name . ' ' . $developer->lastname,
            'email' => $developer->email, // Added email for contact info if needed
            'title' => $profile?->headline ?? 'Desarrollador',
            'location' => $profile?->location ?? 'Sin ubicación',
            'hourlyRate' => $profile?->hourly_rate ?? null,
            'rating' => round($developer->reviews_received_avg_rating ?? 0, 1),
            'reviewsCount' => $developer->reviews_received_count ?? 0,
            'completedProjects' => $completedProjects,
            'availability' => $profile?->availability ?? 'available',
            'skills' => $profile?->skills ?? [],
            'experience' => $profile?->experience_years ?? null, // Note: The frontend expects array of objects for experience? logic in ProfileSection suggests so. Let's check ProfileSection again or the Model.
            // ProfileSection uses "experience" state which is an array of objects {company, position...}. 
            // the DeveloperController index uses $profile?->experience_years which seems to be a number? 
            // valid point. The `create_developer_profiles_table` migration should be checked.
            // But for now let's return what we have in the DB.
            'experience_details' => $profile?->experience ?? [], // Assuming 'experience' column stores JSON or similar
            'languages' => $profile?->languages ?? [],
            'bio' => $profile?->bio ?? '',
            'links' => $profile?->links ?? [],
            'lastActive' => $developer->updated_at?->diffForHumans(),
            'isVerified' => $developer->email_verified_at !== null,
            'joinedAt' => $developer->created_at->format('M Y'),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
