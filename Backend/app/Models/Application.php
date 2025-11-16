<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['project_id','developer_id','cover_letter','status'];

    public function project(){ return $this->belongsTo(Project::class); }
    public function developer(){ return $this->belongsTo(User::class, 'developer_id');}

    
}
