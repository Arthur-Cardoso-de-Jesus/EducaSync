<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salas', function (Blueprint $blueprint) {
            // Cria a coluna como nullable primeiro para não quebrar dados se já houver salas salvas
            $blueprint->foreignId('unidade_id')
                      ->nullable()
                      ->after('id') // Coloca ela visualmente logo após o ID da sala
                      ->constrained('unidades')
                      ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('salas', function (Blueprint $blueprint) {
            // Remove a chave estrangeira e a coluna caso precise dar rollback
            $blueprint->dropForeign(['unidade_id']);
            $blueprint->dropColumn('unidade_id');
        });
    }
};