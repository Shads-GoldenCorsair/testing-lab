<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'to', 'amount'];

    protected function casts(): array
    {
        return ['amount' => 'float'];
    }
}
