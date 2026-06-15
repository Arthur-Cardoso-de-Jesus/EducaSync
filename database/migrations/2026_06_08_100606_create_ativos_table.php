<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations (Criar table no banco).
     */
    public function up(): void
{
    Schema::create('ativos', function (Blueprint $table) {
        
    //Campos da tabela
        $table->id();
        $table->string('nome'); // Ex: "Projetor Epson X41", "Notebook Dell Vostro"

        $table->string('codigo_patrimonio')->unique(); // O número de tombo/patrimônio. unique() 

        $table->string('numero_serie'); // Ex: "Numero de série do item"

        $table->string('tipo'); // Ex: "Computador", "Projetor", "Mobiliário"
        
        $table->enum('status', ['operacional', 'manutencao', 'descartado'])->default('operacional'); // Cria uma lista fechada de opções. Por padrão, nasce 'operacional'.
        
        // CHAVE ESTRANGEIRA: Vincula o ativo à tabela 'salas' através do 'sala_id'
        // Se a sala for deletada, o campo fica nulo (onDelete('set null')).
        $table->foreignId('sala_id')->nullable()->constrained('salas')->onDelete('set null');
        
        $table->text('observacoes')->nullable(); // Defeitos anteriores, especificações técnicas
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ativos');
    }
};
