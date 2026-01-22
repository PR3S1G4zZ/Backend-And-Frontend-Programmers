<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property string $skills
 */
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
