import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';


export default function Index({ auth, unidades, errors }) {
    // Estado para controlar se estamos editando uma unidade
    const [editandoId, setEditandoId] = useState(null);

    // Formulário reativo do Inertia
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        nome: '',
        endereco: '',
        telefone: '',

    });

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        if (editandoId) {
            // Rota de Edição (PUT)
            put(route('unidades.update', editandoId), {
                onSuccess: () => cancelarEdicao()
            });
        } else {
            // Rota de Criação (POST)
            post(route('unidades.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const iniciarEdicao = (unidade) => {
        setEditandoId(unidade.id);
        setData({
            nome: unidade.nome,
            endereco: unidade.endereco || ''
        });
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        reset();
    };

    const depletarUnidade = (id) => {
        if (confirm('Tem certeza que deseja remover esta unidade? Esta ação apagará todos os ativos e locações realcionados a esta unidade e não poderá ser desfeita.')) {
            router.delete(route('unidades.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className=" font-semibold text-3xl text-gray-200 leading-tight">Gerenciar Unidades de Ensino</h2>}
        >
            <Head title="Gerenciar Unidades" />

            <div className="py-12 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Exibição de erros globais de exclusão */}
                    {errors.exclusao && (
                        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2 animate-pulse">
                            ⚠️ {errors.exclusao}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 1. FORMULÁRIO (Criação / Edição) */}
                        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl h-fit">
                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                {editandoId ? 'Editar Unidade' : 'Nova Unidade'}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">
                                {editandoId ? 'Modifique os dados da unidade selecionada.' : 'Cadastre um novo campus ou polo no sistema.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Unidade / Campus</label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={e => setData('nome', e.target.value)}
                                        placeholder="Ex: ULBRA - Polo São Lucas"
                                        className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                        required
                                    />
                                    {errors.nome && <div className="text-red-500 text-xs mt-1">{errors.nome}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Endereço / Localização</label>
                                    <input
                                        type="text"
                                        value={data.endereco}
                                        onChange={e => setData('endereco', e.target.value)}
                                        placeholder="Ex: Av. Principal, 123 - Centro"
                                        className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                    />
                                    {errors.endereco && <div className="text-red-500 text-xs mt-1">{errors.endereco}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        value={data.telefone}
                                        onChange={e => setData('telefone', e.target.value)}
                                        placeholder="Ex: Av. Principal, 123 - Centro"
                                        className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                    />
                                    {errors.telefone && <div className="text-red-500 text-xs mt-1">{errors.telefone}</div>}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-600/10"
                                    >
                                        {processing ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar Unidade'}
                                    </button>

                                    {editandoId && (
                                        <button
                                            type="button"
                                            onClick={cancelarEdicao}
                                            className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* 2. LISTAGEM DAS UNIDADES */}
                        <div className="lg:col-span-2 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-1">
                                📋 Unidades Registradas
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">Lista de instituições monitoradas pelo EducaSync.</p>

                            {unidades.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                                    <p className="text-gray-500 text-sm">Nenhuma unidade cadastrada no sistema.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="pb-3 font-semibold">Instituição</th>
                                                <th className="pb-3 font-semibold">Endereço</th>
                                                <th className="pb-3 font-semibold text-center">Salas Ativas</th>
                                                <th className="pb-3 text-right font-semibold">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800/50 text-sm">
                                            {unidades.map(unidade => (
                                                <tr key={unidade.id} className="hover:bg-gray-800/20 transition-colors">
                                                    <td className="py-4 font-medium text-white">
                                                        🏢 {unidade.nome}
                                                    </td>
                                                    <td className="py-4 text-gray-400">
                                                        {unidade.endereco || <span className="text-gray-600 italic">Não informado</span>}
                                                    </td>
                                                    <td className="py-4 text-center font-bold text-blue-400">
                                                        {unidade.salas_count}
                                                    </td>
                                                    <td className="py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => iniciarEdicao(unidade)}
                                                            className="text-xs font-semibold text-amber-400 hover:text-amber-300 p-1.5 bg-amber-950/20 border border-amber-500/10 rounded-md hover:border-amber-500/30 transition-all"
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() => depletarUnidade(unidade.id)}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-400 p-1.5 bg-red-950/20 border border-red-500/10 rounded-md hover:border-red-500/30 transition-all"
                                                        >
                                                            Apagar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}