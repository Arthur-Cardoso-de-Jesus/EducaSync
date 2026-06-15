<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('bloco')->nullable();
            $table->text('descricao')->nullable();
            $table->boolean('tem_ar_condicionado')->default(false);
            $table->boolean('tem_projetor')->default(false);
            $table->integer('qtd_pcs')->default(0); // Campo apenas para quantidade numérica

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salas');
    }
};
