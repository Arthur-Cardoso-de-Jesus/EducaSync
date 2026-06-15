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
        Schema::create('locacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Professor que reservou
            $table->foreignId('sala_id')->constrained('salas')->onDelete('cascade'); // Sala reservada
            $table->date('data'); // Data da reserva
            $table->json('periodos');
            $table->text('motivo')->nullable(); // Ex: Aula de Redes, Reunião de TI
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locacaos');
    }
};
