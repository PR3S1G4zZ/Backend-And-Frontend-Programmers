<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeveloperProfile extends Model
{
    protected $fillable = [
        'user_id',
        'skills',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
