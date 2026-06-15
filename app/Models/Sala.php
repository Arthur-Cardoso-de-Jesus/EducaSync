<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;
    protected $fillable = [
        'nome',
        'bloco',
        'descricao',
        'tem_ar_condicionado',
        'tem_projetor', 
        'qtd_pcs',
        'unidade_id'
    ];

    public function unidade() // <-- O nome desta função é o que vai dentro do with()
{
    return $this->belongsTo(Unidade::class, 'unidade_id');
}
}
