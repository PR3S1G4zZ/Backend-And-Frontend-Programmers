<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_id',
        'company_id',
        'developer_id',
        'rating',
        'comment',
    ];

    protected $uniqueConstraints = [
        'project_developer_unique' => ['project_id', 'developer_id']
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function developer()
    {
        return $this->belongsTo(User::class, 'developer_id');
    }
}
