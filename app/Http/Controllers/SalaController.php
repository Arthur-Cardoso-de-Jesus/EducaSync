<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use App\Models\Unidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaController extends Controller
{
    // Tela que lista as salas
    public function index()
{
    $userLogado = auth()->user();

    // Se for admin global (SuperAdmin)
    if ($userLogado->role === 'admin' && $userLogado->unidade_id === null) {
        $salas = \App\Models\Sala::with('unidade')->get();
    } else {
        // Se for gestor da unidade, filtra direto no banco
        $salas = \App\Models\Sala::where('unidade_id', $userLogado->unidade_id)
            ->with('unidade')
            ->get();
    }

    // Injeta as salas e a lista de unidades (usamos o plural 'unidades' para ficar correto)
    return Inertia::render('Salas/Index', [
        'salas' => $salas,
        'unidades' => \App\Models\Unidade::all()
    ]);
}


    // Função que recebe os dados do formulário do React e salva no banco
    public function store(Request $request)
    {
        $userLogado = auth()->user();

        // 1. Validação dos campos da sala
        $dadosValidados = $request->validate([
            'nome' => 'required|string|max:255',
            'bloco' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'tem_ar_condicionado' => 'required|boolean',
            'tem_projetor' => 'required|boolean',
            'qtd_pcs' => 'required|integer|min:0',
        ]);

        // 2. Define a unidade: Se for SuperAdmin, usa a da request. Se for Co-Admin, injeta a dele da sessão.
        $unidadeFinal = $userLogado->unidade_id === null
            ? $request->unidade_id
            : $userLogado->unidade_id;

        // 3. Criação segura unindo os arrays
        \App\Models\Sala::create(array_merge($dadosValidados, [
            'unidade_id' => $unidadeFinal
        ]));
        return redirect()->route('salas.index')->with('success', 'Sala cadastrada com sucesso!');
    }


    // Função para atualizar os dados da sala
    public function update(Request $request, Sala $sala)
    {
        $userLogado = auth()->user();

        // 1. CORRIGIDO: Removemos o 'unidade_id' daqui para evitar o erro de array_key_first
        $dadosValidados = $request->validate([
            'nome' => 'required|string|max:255',
            'bloco' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'tem_ar_condicionado' => 'required|boolean',
            'tem_projetor' => 'required|boolean',
            'qtd_pcs' => 'required|integer|min:0',
        ]);

        // 2. Mantém a mesma inteligência Multi-Tenant na hora de editar
        $unidadeFinal = $userLogado->unidade_id === null
            ? $request->unidade_id
            : $userLogado->unidade_id;

        // 3. Atualiza os dados mesclando a validação e a unidade blindada
        $sala->update(array_merge($dadosValidados, [
            'unidade_id' => $unidadeFinal
        ]));

        return redirect()->route('salas.index')->with('success', 'Sala atualizada com sucesso!');
    }

    // Função para deletar a sala
    public function destroy(Sala $sala)
    {
        // Deleta a sala do banco de dados
        $sala->delete();

        return redirect()->route('salas.index');
    }
}
