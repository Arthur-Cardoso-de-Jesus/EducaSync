<?php

namespace App\Http\Controllers;

use App\Models\Unidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnidadeController extends Controller
{
    public function index()
    {
        // Apenas Admin Geral (SuperAdmin) ou Co-Admins devem gerenciar unidades
        // Se for SuperAdmin, vê todas. Se for Co-Admin, idealmente só vê a dele (ou bloqueia o acesso)
        $userLogado = auth()->user();

        if (!in_array($userLogado->role, ['admin', 'co-admin'])) {
            abort(403, 'Acesso não autorizado.');
        }

        $unidades = $userLogado->unidade_id === null
            ? Unidade::withCount(['salas'])->get()
            : Unidade::where('id', $userLogado->unidade_id)->withCount(['salas'])->get();

        return Inertia::render('Unidades/Index', [
            'unidades' => $unidades
        ]);
    }

    public function store(Request $request)
    {
        // 1. Inclua a 'cidade' na validação como obrigatória
        $dadosValidados = $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255', // <-- Garante que o dado venha do front
            'telefone' => 'required|string|max:15'
        ]);

        // 2. Salva usando os dados validados com segurança
        \App\Models\Unidade::create($dadosValidados);

        return redirect()->route('unidades.index')->with('success', 'Unidade cadastrada com sucesso!');
    }




    // Função para atualizar os dados da unidade
public function update(Request $request, \App\Models\Unidade $unidade)
{
    // 1. Validação idêntica ao store, incluindo a 'cidade'
    $dadosValidados = $request->validate([
        'nome' => 'required|string|max:255',
        'enderecos' => 'required|string|max:255', // <-- Garante a validação na edição 
        'telefone' => 'required|string|max:15'
    ]);

    // 2. Atualiza os dados no banco usando apenas os dados que passaram na validação
    $unidade->update($dadosValidados);

    return redirect()->route('unidades.index')->with('success', 'Unidade atualizada com sucesso!');
}


    //Apaga o item selecionado
   public function destroy(Unidade $unidade)
{
    \DB::transaction(function () use ($unidade) {
        
        // 1. Buscamos os IDs de todas as salas pertencentes a esta unidade
        $salasIds = $unidade->salas()->pluck('id');

        if ($salasIds->isNotEmpty()) {
            // 2. Apaga primeiro as locações e agendamentos vinculados a essas salas
            \App\Models\Locacao::whereIn('sala_id', $salasIds)->delete();

            // 3. Apaga os ativos de TI (computadores, switches) alocados nessas salas
            \App\Models\Ativo::whereIn('sala_id', $salasIds)->delete();

            // 4. Agora que as dependências sumiram, apaga as salas de uma vez
            $unidade->salas()->delete();
        }

        // 5. Por fim, remove a Unidade do mapa de forma limpa
        $unidade->delete();
    });

    return redirect()->back()->with('success', 'Unidade e toda a sua infraestrutura foram removidas com sucesso!');
    }
}
