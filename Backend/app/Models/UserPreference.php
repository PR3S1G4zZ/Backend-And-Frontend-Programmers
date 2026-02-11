<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'theme',
        'accent_color',
        'language',
        'two_factor_enabled',
        'two_factor_secret'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
