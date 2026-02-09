<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'company' => new UserResource($this->whenLoaded('company')),
            'budget_min' => $this->budget_min,
            'budget_max' => $this->budget_max,
            'budget_type' => $this->budget_type,
            'status' => $this->status,
             // ... other fields
            'applications_count' => $this->whenCounted('applications'),
            'has_applied' => $this->when(isset($this->has_applied), $this->has_applied),
            'created_at' => $this->created_at,
        ];
    }
}
