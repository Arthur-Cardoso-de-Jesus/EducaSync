<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locacao extends Model
{
    protected $table = 'locacoes';

    protected $fillable = [
        'sala_id', 'user_id', 'data', 'periodos', 'motivo'
    ];

    // 🌟 Transforma o array do React automaticamente em JSON para o MySQL
    protected $casts = [
        'periodos' => 'array',
        'data_locacao' => 'date'
    ];

    public function sala() {
        return $this->belongsTo(Sala::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}