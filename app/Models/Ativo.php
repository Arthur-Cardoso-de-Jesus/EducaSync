<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ativo extends Model
{
    // Nome da tabela se não seguir o padrão plural em inglês do Laravel
    protected $table = 'ativos';

    protected $fillable = [
        'nome', 
        'codigo_patrimonio',
        'numero_serie', 
        'tipo', 
        'status', 
        'sala_id', 
        'observacoes'
    ];

    // Relacionamento inversa: Um ativo pertence a uma sala
    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }
}