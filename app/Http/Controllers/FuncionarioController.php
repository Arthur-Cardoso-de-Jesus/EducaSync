<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Unidade;

class FuncionarioController extends Controller
{
    public function index()
    {
        $userLogado = auth()->user();

        // 1. Se for Super Admin Geral (unidade_id nula)
        if ($userLogado->unidade_id === null) {
            // Vê TODOS os funcionários do sistema e traz o nome da unidade deles
            $funcionarios = User::with('unidade')->get();

            // Carrega todas as unidades para o select de cadastro (caso precise criar novos Co-Admins)
            $unidades = Unidade::all();
        }
        // 2. Se for Co-Admin de uma unidade específica (Multi-Tenant)
        else {
            // Traz apenas os funcionários que pertencem à MESMA unidade
            $funcionarios = User::where('unidade_id', $userLogado->unidade_id)
                ->with('unidade')
                ->get();

            // O Co-Admin não precisa escolher unidade no cadastro, fica travado na dele
            $unidades = Unidade::where('id', $userLogado->unidade_id)->get();
        }

        return Inertia::render('Funcionarios/Index', [
            'funcionarios' => $funcionarios,
            'unidades' => $unidades
        ]);
    }




    // Salva o funcionário atrelando-o automaticamente à unidade do Admin
    public function store(Request $request)
    {
        $userLogado = auth()->user();

        // 1. Regras básicas de cadastro
        $regras = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,co-admin', // Define o papel do novo funcionário
        ];

        // EXCLUSIVO SUPERADMIN: Se o admin logado for global (unidade nula), a unidade_id é obrigatória
        if ($userLogado->unidade_id === null) {
            $regras['unidade_id'] = 'required|exists:unidades,id';
        }

        $request->validate($regras);

        // 2. Definição da Unidade do Novo Funcionário
        // SuperAdmin -> Pega o ID que ele selecionou no formulário
        // Co-Admin -> Pega automaticamente o ID da unidade dele que está na sessão
        $unidadeIdFinal = $userLogado->unidade_id === null
            ? $request->unidade_id
            : $userLogado->unidade_id;

        // 3. Criação do usuário no banco
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'unidade_id' => $unidadeIdFinal, // Vinculo multi-tenant injetado com segurança
        ]);

        return redirect()->back()->with('success', 'Funcionário cadastrado com sucesso!');
    }





    // Remove o funcionário
    public function destroy($funcionario)
    {
        $userLogado = auth()->user();
        $user = \App\Models\User::findOrFail($funcionario);

        // 1. Regra de Ouro: O SuperAdmin Geral (unidade_id nula) PODE DELETAR QUALQUER UM
        if ($userLogado->unidade_id === null) {
            // Permitido! Passa direto pela validação de escopo escolar
        } else {
            // 2. Se for um Co-Admin local, ele SÓ pode deletar se o funcionário for da MESMA unidade dele
            if ($userLogado->unidade_id !== $user->unidade_id) {
                abort(403, 'Ação não autorizada para esta unidade.');
            }

            // 3. Segurança extra: Um Co-Admin não pode deletar outro Co-Admin ou Admin por aqui
            if (in_array($user->role, ['admin', 'co-admin']) && $userLogado->role !== 'admin') {
                abort(403, 'Você não tem permissão para remover este nível de acesso.');
            }
        }

        // Evitar que o SuperAdmin se delete por acidente
        if ($userLogado->id === $user->id) {
            return redirect()->back()->withErrors([
                'exclusao' => 'Você não pode remover a sua própria conta de administrador!'
            ]);
        }

        // 4. Executa a exclusão com segurança
        $user->delete();

        return redirect()->back()->with('success', 'Funcionário removido com sucesso!');
    }


    //update
    public function update(Request $request, User $funcionario)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $funcionario->id,
            'role' => 'required|string',
            'unidade_id' => 'nullable|exists:unidades,id',
            'password' => 'nullable|confirmed|min:8', // nullable faz a mágica de ser opcional
        ]);

        $funcionario->name = $request->name;
        $funcionario->email = $request->email;
        $funcionario->role = $request->role;
        $funcionario->unidade_id = $request->unidade_id ?: null;

        if ($request->filled('password')) {
            $funcionario->password = Hash::make($request->password);
        }

        $funcionario->save();

        return redirect()->back()->with('success', 'Colaborador atualizado com sucesso!');
    }
}
