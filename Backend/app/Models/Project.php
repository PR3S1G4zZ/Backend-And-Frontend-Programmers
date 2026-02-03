<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Application;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $company_id
 * @property string $title
 * @property string $description
 * @property float $budget_min
 * @property float $budget_max
 * @property string $status
 */
class Project extends Model
{
    use HasFactory;

    //campos asignables
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'budget_min',
        'budget_max',
        'budget_type',
        'duration_value',
        'duration_unit',
        'location',
        'remote',
        'level',
        'priority',
        'featured',
        'deadline',
        'max_applicants',
        'tags',
        'status',
    ];

    protected $casts = [
        'remote' => 'boolean',
        'featured' => 'boolean',
        'deadline' => 'date',
        'tags' => 'array',
    ];

    //funciones de relacion
    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    // un proyecto tiene muchas aplicaciones
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function categories()
    {
        return $this->belongsToMany(ProjectCategory::class, 'project_category_project');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'project_skill');
    }
}
