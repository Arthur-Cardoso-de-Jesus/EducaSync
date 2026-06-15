<?php

namespace App\Http\Controllers;

use App\Models\Locacao;
use App\Models\Sala;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocacaoController extends Controller
{
    // Listar locações da unidade do usuário logado
    public function index()
    {
        $userLogado = auth()->user();

        // 1. Listagem Inteligente Multi-Tenant de Locações e Regra de Cronograma
        if ($userLogado->role === 'admin' && $userLogado->unidade_id === null) {
            $locacoes = Locacao::with(['sala.unidade', 'user'])->get();
            $salas = Sala::all();

            //  SuperAdmin vê apenas as locações de HOJE de todo o sistema
            $proximasLocacoes = Locacao::with('sala','user' )
                ->whereDate('data', \Carbon\Carbon::today()) // <-- Mudado para trazer estritamente hoje
                ->orderBy('data', 'asc')
                ->get();
        } else {
            $locacoes = Locacao::whereHas('sala', function ($query) use ($userLogado) {
                $query->where('salas.unidade_id', $userLogado->unidade_id);
            })->with(['sala', 'user'])->get();

            $salas = Sala::where('unidade_id', $userLogado->unidade_id)->get();

            // CORRIGIDO: Co-Admin vê apenas as locações de HOJE da sua própria escola
            $proximasLocacoes = Locacao::whereHas('sala', function ($query) use ($userLogado) {
                $query->where('unidade_id', $userLogado->unidade_id);
            })
                ->with('sala')
                ->whereDate('data', \Carbon\Carbon::today()) // <-- Mudado para trazer estritamente hoje
                ->orderBy('data', 'asc')
                ->get();
        }

        // 2. Listagem de funcionários (Mantida a sua lógica intacta)
        $funcionarios = [];
        if (in_array($userLogado->role, ['admin', 'co-admin'])) {
            if ($userLogado->unidade_id === null) {
                $funcionarios = User::where('role', 'user')->get();
            } else {
                $funcionarios = User::where('unidade_id', $userLogado->unidade_id)
                    ->where('role', 'user')
                    ->get();
            }
        }

        return Inertia::render('Locacoes/Index', [
            'locacoes' => $locacoes,
            'salas' => $salas,
            'funcionarios' => $funcionarios,
            'proximasLocacoes' => $proximasLocacoes
        ]);
    }




    //Função que armazena dados
    public function store(Request $request)
    {
        $userLogado = auth()->user();

        // 1. Validação dos campos vindos do React
        $regras = [
            'sala_id' => 'required|exists:salas,id',
            'data_locacao' => 'required|date|after_or_equal:today',
            'periodos' => 'required|array|min:1',
            'descricao' => 'nullable|string|max:255',
        ];

        if (in_array($userLogado->role, ['admin', 'co-admin'])) {
            $regras['user_id'] = 'required|exists:users,id';
        }

        $request->validate($regras);

        // 2. Validação anti conflito (Bloqueia o mesmo período/dia/sala)
        foreach ($request->periodos as $periodo) {
            // Remove qualquer espaço invisível que possa ter vindo do Front-end
            $periodoLimpo = trim($periodo);

            $conflito = Locacao::where('sala_id', $request->sala_id)
                ->where('data', $request->data_locacao)
                ->where(function ($query) use ($periodoLimpo) {
                    $query->whereJsonContains('periodos', $periodoLimpo)
                        // Segunda camada de segurança: checa se por acaso o array inteiro veio idêntico
                        ->orWhere('periodos', 'LIKE', '%' . $periodoLimpo . '%');
                })
                ->exists();

            if ($conflito) {
                return redirect()->back()->withErrors([
                    'periodos' => "Conflito detectado! O período '{$periodoLimpo}' já está ocupado nesta sala e data."
                ]);
            }
        }

        // 3. Define quem é o dono da reserva
        $userIdFinal = in_array($userLogado->role, ['admin', 'co-admin']) ? $request->user_id : $userLogado->id;

        // 4. Salva no banco com o mapeamento correto das colunas
        Locacao::create([
            'user_id' => $userIdFinal,
            'sala_id' => $request->sala_id,
            'data' => $request->data_locacao,
            'periodos' => $request->periodos,
            'motivo' => $request->descricao,
        ]);

        return redirect()->route('locacoes.index')->with('success', 'Agenda alocada com sucesso!');
    }




    // Atualizar uma locação existente
    public function update(Request $request, Locacao $locacao)
    {
        $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'data_locacao' => 'required|date|after_or_equal:today',
            'periodos' => 'required|array|min:1',
            'motivo' => 'nullable|string|max:255',
        ]);

        // Checagem de conflito ignorando a própria locação que está sendo editada
        foreach ($request->periodos as $periodo) {
            $conflito = Locacao::where('sala_id', $request->sala_id)
                ->where('data', $request->data_locacao)
                ->whereJsonContains('periodos', $periodo)
                ->where('id', '!=', $locacao->id)
                ->exists();

            if ($conflito) {
                return redirect()->back()->withErrors([
                    'sala_id' => "Impossível alterar: O período '{$periodo}' já foi reservado nesta sala!"
                ]);
            }
        }

        $locacao->update([
            'sala_id' => $request->sala_id,
            'data' => $request->data_locacao,
            'periodos' => $request->periodos,
            'motivo' => $request->motivo,
        ]);

        return redirect()->route('locacoes.index');
    }




    // Deletar / Cancelar Locação
    public function destroy(Locacao $locacao)
    {
        // Segurança: Um professor comum só pode deletar a própria reserva. Admin/Co-Admin deleta qualquer uma.
        if (!in_array(auth()->user()->role, ['admin', 'co-admin']) && $locacao->user_id !== auth()->user()->id) {
            abort(403, 'Você não tem permissão para cancelar a reserva de outro professor.');
        }

        $locacao->delete();

        return redirect()->route('locacoes.index');
    }




    public function verificarPeriodosOcupados(Request $request)
    {
        // Valida os dados de entrada mínimos
        $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'data' => 'required|date',
        ]);

        // Busca todas as locações daquela sala e data
        $locacoes = Locacao::where('sala_id', $request->sala_id)
            ->where('data', $request->data)
            ->get();

        // Junta todos os arrays de períodos que encontrar em uma lista única e plana
        $periodosOcupados = [];
        foreach ($locacoes as $loc) {
            if (is_array($loc->periodos)) {
                $periodosOcupados = array_merge($periodosOcupados, $loc->periodos);
            }
        }

        // Devolve para o React em formato JSON puro
        return response()->json(array_unique($periodosOcupados));
    }
}
