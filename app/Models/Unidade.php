<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unidade extends Model
{
    protected $table = 'unidades';

    protected $fillable = [
        'nome',
        'endereco',
        'telefone'
    ];

    // Uma unidade tem muitas salas
    public function salas()
    {
        return $this->hasMany(Sala::class, 'unidade_id');
    }
}