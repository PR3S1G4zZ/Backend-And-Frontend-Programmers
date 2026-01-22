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
    protected $fillable = ['company_id','title','description','budget_min','budget_max','status'];

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
}
