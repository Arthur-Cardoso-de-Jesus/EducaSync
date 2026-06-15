import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

// RECEBENDO AS UNIDADES NAS PROPS
export default function Index({ auth, funcionarios = [], unidades = [], errors }) {

    // CONTROLADOR DE ESTADO DE EDIÇÃO
    const [editandoId, setEditandoId] = useState(null);

    // FILTROS DA TABELA DE FUNCIONÁRIOS
    const [pesquisa, setPesquisa] = useState('');
    const [filtroRole, setFiltroRole] = useState('');
    const [filtroUnidade, setFiltroUnidade] = useState('');

    // INICIANDO O CAMPOS DO FORMULÁRIO (Adicionado campo ID para controle interno)
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',       // Padrão: Professor/Funcionário comum
        unidade_id: ''     // Guardará a escola escolhida pelo SuperAdmin
    });

    // ATIVAR MODO DE EDIÇÃO NO FORMULÁRIO
    const handleEdit = (colaborador) => {
        clearErrors();
        setEditandoId(colaborador.id);
        setData({
            id: colaborador.id,
            name: colaborador.name,
            email: colaborador.email,
            password: '', // Deixa vazio; opcional na edição
            password_confirmation: '',
            role: colaborador.role,
            unidade_id: colaborador.unidade_id || ''
        });
    };

    // CANCELAR EDIÇÃO E LIMPAR FORMULÁRIO
    const handleCancelarEdicao = () => {
        setEditandoId(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        if (editandoId) {
            // 🔄 ROTA DE UPDATE (PUT)
            put(route('funcionarios.update', editandoId), {
                onSuccess: () => {
                    setEditandoId(null);
                    reset();
                }
            });
        } else {
            // 📥 ROTA DE STORE (POST)
            post(route('funcionarios.store'), {
                onSuccess: () => reset('name', 'email', "role", 'unidade_id', 'password', 'password_confirmation')
            });
        }
    };

    // FILTRAGEM MULTI-CRITÉRIO EM TEMPO REAL (JAVASCRIPT)
    const funcionariosFiltrados = funcionarios.filter(colaborador => {
        const termo = pesquisa.toLowerCase();
        const bateTexto = colaborador.name.toLowerCase().includes(termo) ||
            colaborador.email.toLowerCase().includes(termo);

        let bateRole = true;
        if (filtroRole === 'superadmin') {
            bateRole = (colaborador.role === 'admin' || colaborador.id === 1) && colaborador.unidade_id === null;
        } else if (filtroRole === 'co-admin') {
            bateRole = colaborador.role === 'co-admin';
        } else if (filtroRole === 'user') {
            bateRole = colaborador.role === 'user';
        } else if (filtroRole === 'pendente') {
            bateRole = colaborador.role === 'pendente';
        }

        const bateUnidade = filtroUnidade === '' || String(colaborador.unidade_id) === String(filtroUnidade);

        return bateTexto && bateRole && bateUnidade;
    });

    const isSuperAdmin = auth.user.unidade_id === null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-3xl text-gray-200 leading-tight">Gerenciar Funcionários</h2>}
        >
            <Head title="Funcionários" />

            <div className="py-4 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* FORMULÁRIO DINÂMICO: CADASTRO OU EDIÇÃO */}
                        <div className={`p-6 bg-gray-900 border rounded-2xl h-fit shadow-xl transition-all duration-300 ${
                            editandoId ? 'border-amber-500/40 shadow-amber-950/5' : 'border-gray-800'
                        }`}>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                                <span>{editandoId ? '📝 Editar Colaborador' : '➕ Novo Colaborador'}</span>
                                {editandoId && (
                                    <button 
                                        type="button" 
                                        onClick={handleCancelarEdicao}
                                        className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-950 rounded border border-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20" required />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                {/* E-mail */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">E-mail Institucional</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20" required />
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>

                                {/* Nível de Acesso */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nível de Permissão</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500">
                                        <option value="user">Professor / Colaborador</option>
                                        <option value="co-admin">Admin (Gestor de Unidade)</option>
                                        <option value="pendente">Pendente (Acesso Restrito)</option>
                                    </select>
                                </div>

                                {/* SELECT DE UNIDADE EXCLUSIVO PARA O SUPERADMIN GERAL */}
                                {isSuperAdmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-blue-400 mb-1 font-bold">🏢 Vincular à Unidade / Campus</label>
                                        <select
                                            value={data.unidade_id}
                                            onChange={e => setData('unidade_id', e.target.value)}
                                            className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                            required={data.role !== 'pendente'} // Opcional se for pendente
                                        >
                                            <option value="">Selecione a qual escola ele pertence...</option>
                                            {unidades.map(u => (
                                                <option key={u.id} value={u.id}>🏢 {u.nome}</option>
                                            ))}
                                        </select>
                                        {errors.unidade_id && <div className="text-red-500 text-xs mt-1">{errors.unidade_id}</div>}
                                    </div>
                                )}

                                {/* Senha - Opcional na Edição */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        {editandoId ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha Inicial'}
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500" required={!editandoId} />
                                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                </div>

                                {/* Confirmar Senha */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirmar Senha</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500" required={!!data.password} />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className={`w-full py-2.5 text-white font-bold rounded-lg transition-all mt-2 shadow-lg ${
                                        editandoId 
                                            ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/10' 
                                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/10'
                                    }`}
                                >
                                    {processing ? 'Salvando...' : editandoId ? 'Atualizar Dados' : 'Cadastrar Usuário'}
                                </button>
                            </form>
                        </div>

                        {/* LISTAGEM DOS FUNCIONÁRIOS COM FILTROS INTEGRADOS */}
                        <div className="lg:col-span-2 p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl space-y-4">
                            <h3 className="text-lg font-bold text-white">Quadro de Colaboradores</h3>

                            {/* BARRA DE FILTROS REATIVOS */}
                            <div className={`grid grid-cols-1 gap-3 p-3 bg-gray-950 rounded-xl border border-gray-800 ${isSuperAdmin ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Buscar por Nome / Email</label>
                                    <input
                                        type="text"
                                        value={pesquisa}
                                        onChange={e => setPesquisa(e.target.value)}
                                        placeholder="Filtrar colaborador..."
                                        className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Permissão</label>
                                    <select
                                        value={filtroRole}
                                        onChange={e => setFiltroRole(e.target.value)}
                                        className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
                                    >
                                        <option value="">Todos os níveis</option>
                                        <option value="superadmin">👑 Super Admin</option>
                                        <option value="co-admin">Gestor de unidade</option>
                                        <option value="user">Professor / Colaborador</option>
                                        <option value="pendente">PENDENTE</option>
                                    </select>
                                </div>

                                {isSuperAdmin && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Filtrar por Unidade</label>
                                        <select
                                            value={filtroUnidade}
                                            onChange={e => setFiltroUnidade(e.target.value)}
                                            className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
                                        >
                                            <option value="">Todas as escolas</option>
                                            <option value="all_schools">Todas as escolas</option>
                                            {unidades.map(u => (
                                                <option key={u.id} value={u.id}>🏢 {u.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* TABELA */}
                            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="bg-gray-900/40 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="p-4">Nome</th>
                                            <th className="p-4">Permissão</th>
                                            <th className="p-4">Unidade Ativa</th>
                                            <th className="p-4 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {funcionariosFiltrados.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                                    Nenhum colaborador encontrado com os filtros aplicados.
                                                </td>
                                            </tr>
                                        ) : (
                                            funcionariosFiltrados.map(colaborador => (
                                                <tr key={colaborador.id} className="hover:bg-gray-900/30 transition-colors">
                                                    <td className="p-4">
                                                        <span className="font-medium text-white block">{colaborador.name}</span>
                                                        <span className="text-xs text-gray-500">{colaborador.email}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        {colaborador.unidade_id === null && (colaborador.role === 'admin' || colaborador.id === 1) ? (
                                                            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-950 text-blue-400 border border-blue-500/20">
                                                                Super Admin
                                                            </span>
                                                        ) : colaborador.role === 'co-admin' ? (
                                                            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-purple-900/80 text-purple-400 border border-purple-500/20">
                                                                Co-Admin
                                                            </span>
                                                        ) : colaborador.role === 'pendente' ? (
                                                            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-950 text-amber-400 border border-amber-500/20">
                                                                PENDENTE
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-gray-800 text-gray-400 border border-gray-700/30">
                                                                Professor / Colaborador
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-gray-400">
                                                        {colaborador.role === 'pendente' ? (
                                                            <span className="text-amber-500 font-semibold italic">❌ Não atribuído</span>
                                                        ) : colaborador.unidade?.nome ? (
                                                            <span className="text-gray-200">🏢 {colaborador.unidade.nome}</span>
                                                        ) : (
                                                            <span className="text-blue-400 font-bold italic">🌐 Global (SuperAdmin)</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center flex items-center justify-center gap-2">
                                                        {/*  BOTÃO EDITAR */}
                                                        <button
                                                            onClick={() => handleEdit(colaborador)}
                                                            className="text-xs font-semibold text-amber-500 hover:text-amber-400 p-1.5 bg-amber-950/20 border border-amber-500/10 rounded-md transition-all shadow-sm"
                                                        >
                                                            Editar
                                                        </button>

                                                        {/* BOTÃO REMOVER */}
                                                        <button
                                                            onClick={() => confirm('Remover Usuário?') && router.delete(route('funcionarios.destroy', colaborador.id))}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-400 p-1.5 bg-red-950/20 border border-red-500/10 rounded-md transition-all shadow-sm"
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}