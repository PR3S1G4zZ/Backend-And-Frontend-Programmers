<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'project_id',
        'created_by',
        'subject',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'conversation_participants');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
