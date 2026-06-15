<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;        // <-- aponta par o Laravel onde está o Model do Usuário
use App\Models\Unidade;     // <-- aponta para o pro Laravel onde está o Model da Unidade
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Criar as Unidades de Teste no banco
        $unidadeSapucaia = Unidade::create([
            'nome' => 'Unidade Sapucaia do Sul', 
            'cidade' => 'Sapucaia do Sul'
        ]);
        
        $unidadePorto = Unidade::create([
            'nome' => 'Unidade Porto Alegre', 
            'cidade' => 'Porto Alegre'
        ]);

        // 2. Criar Usuário Administrador Geral (Acessa tudo, unidade_id fica nulo)
        User::create([
            'name' => 'Arthur Admin',
            'email' => 'admin@email.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'unidade_id' => null
        ]);

        // 3. Criar Usuário Funcionário Comum vinculado APENAS a Sapucaia
        User::create([
            'name' => 'Técnico Sapucaia',
            'email' => 'user@email.com',
            'password' => Hash::make('12345678'),
            'role' => 'user',
            'unidade_id' => $unidadeSapucaia->id
        ]);
    }
}