<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'type',
        'initiator_id',
        'participant_id',
        'project_id',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage()
    {
        // return $this->hasOne(Message::class)->latestOfMany();
        return $this->hasOne(Message::class)->latest();
    }

    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
