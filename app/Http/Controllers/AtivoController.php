<?php

namespace App\Http\Controllers;

use App\Models\Ativo;
use App\Models\Sala;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AtivoController extends Controller
{

    // Lista os ativos e carrega as salas para o formulário do React
    public function index()
    {
        $userLogado = auth()->user();

        if ($userLogado->role === 'admin' && $userLogado->unidade_id === null) {
            // SuperAdmin vê absolutamente todos os ativos de todas as escolas
            $ativos = Ativo::with('sala.unidade')->get();
            $salas = \App\Models\Sala::all();
        } else {
            // Agora o whereHas está encadeado corretamente dentro do escopo isolado da subquery
            $ativos = Ativo::where(function ($mainQuery) use ($userLogado) {

                $mainQuery->whereHas('sala', function ($query) use ($userLogado) {
                    $query->where('unidade_id', $userLogado->unidade_id);
                });
            })->with('sala.unidade')->get();

            // No formulário, o Co-Admin só pode ver e escolher as salas da própria unidade
            $salas = \App\Models\Sala::where('unidade_id', $userLogado->unidade_id)->get();
        }

        return Inertia::render('Ativos/Index', [
            'ativos' => $ativos,
            'salas' => $salas
        ]);
    }

    // Salva o equipamento no banco de dados
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'codigo_patrimonio' => 'required|string|unique:ativos,codigo_patrimonio',
            'numero_serie' => 'string|max:255',
            'tipo' => 'required|string',
            'status' => 'required|in:operacional,manutencao,descartado',
            'sala_id' => 'nullable|exists:salas,id',
            'observacoes' => 'nullable|string',
        ]);

        Ativo::create($request->all());

        return redirect()->route('ativos.index');
    }


    //Função de atualizar
    public function update(Request $request, Ativo $ativo)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'codigo_patrimonio' => 'required|string|unique:ativos,codigo_patrimonio,' . $ativo->id,
            'numero_serie' => 'string|max:255',
            'tipo' => 'required|string',
            'status' => 'required|in:operacional,manutencao,descartado',
            'sala_id' => 'nullable|exists:salas,id',
            'observacoes' => 'nullable|string',
        ]);

        // Atualiza os dados no banco
        $ativo->update($request->all());

        return redirect()->route('ativos.index');
    }

    // Função para deletar o ativo
    public function destroy(Ativo $ativo)
    {
        // Deleta o ativo do banco de dados
        $ativo->delete();

        return redirect()->route('ativos.index');
    }
}
