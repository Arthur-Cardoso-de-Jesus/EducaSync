import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, salas = [], unidades = [] }) {
    // Identifica se o usuário logado é professor comum
    const isProfessor = auth.user.role === 'user';
    const isSuperAdmin = auth.user.role === 'admin' && auth.user.unidade_id === null;
    // Estado para controlar se estamos editando uma sala e qual o ID dela
    const [editandoId, setEditandoId] = useState(null);

    // ESTADOS DOS FILTROS DA TABELA DE SALAS
    const [pesquisa, setPesquisa] = useState('');
    const [filtroAr, setFiltroAr] = useState('todos');
    const [filtroProjetor, setFiltroProjetor] = useState('todos');
    const [filtroUnidade, setUnidade] = useState('Todas');
    const [ordemPcs, setOrdemPcs] = useState('nenhuma'); // 'nenhuma', 'asc', 'desc'

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome: '',
        bloco: '',
        descricao: '',
        tem_ar_condicionado: false,
        tem_projetor: false,
        qtd_pcs: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editandoId) {
            put(route('salas.update', editandoId), {
                onSuccess: () => cancelarEdicao()
            });
        } else {
            post(route('salas.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const iniciarEdicao = (sala) => {
        setEditandoId(sala.id);
        setData({
            nome: sala.nome,
            bloco: sala.bloco || '',
            descricao: sala.descricao || '',
            tem_ar_condicionado: Boolean(sala.tem_ar_condicionado),
            tem_projetor: Boolean(sala.tem_projetor),
            qtd_pcs: sala.qtd_pcs
        });
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        reset();
    };

    const handleDeletar = (id) => {
        if (confirm('Tem certeza que deseja remover esta sala? Os ativos vinculados ficarão sem sala.')) {
            router.delete(route('salas.destroy', id));
        }
    };

    //  LÓGICA DE FILTRAGEM E ORDENAÇÃO
    const salasFiltradas = salas
        .filter(sala => {
            // Trava de segurança para quem NÃO é SuperAdmin (filtra estritamente pela unidade do usuário)
            if (!isSuperAdmin && String(sala.unidade_id) !== String(auth.user.unidade_id)) {
                return false;
            }

            // Filtro do Select (Exclusivo do SuperAdmin)
            if (isSuperAdmin && filtroUnidade !== 'Todas' && String(sala.unidade_id) !== String(filtroUnidade)) {
                return false;
            }

            // Filtros de texto, ar e projetor que você já tinha
            const termo = pesquisa.toLowerCase();
            const bateTexto = sala.nome.toLowerCase().includes(termo) ||
                (sala.bloco && sala.bloco.toLowerCase().includes(termo));

            const bateAr = filtroAr === 'todos' ||
                (filtroAr === 'sim' && sala.tem_ar_condicionado) ||
                (filtroAr === 'nao' && !sala.tem_ar_condicionado);

            const bateProjetor = filtroProjetor === 'todos' ||
                (filtroProjetor === 'sim' && sala.tem_projetor) ||
                (filtroProjetor === 'nao' && !sala.tem_projetor);

            return bateTexto && bateAr && bateProjetor;
        })
        .sort((a, b) => {
            if (ordemPcs === 'asc') return a.qtd_pcs - b.qtd_pcs;
            if (ordemPcs === 'desc') return b.qtd_pcs - a.qtd_pcs;
            return 0;
        });
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-3xl text-gray-200 leading-tight">Gerenciamento de Salas</h2>}
        >
            <Head title="Salas e Ambientes" />

            <div className="py-4 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* FORMULÁRIO: Ocultado completamente se for Professor (`isProfessor`) */}
                    {!isProfessor && (
                        <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl transition-all duration-300 relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                {editandoId ? '✏️ Alterar Estrutura do Ambiente' : 'Novo Ambiente / Laboratório'}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">
                                {editandoId ? `Modificando dados cadastrais da sala ID #${editandoId}` : 'Registre novas salas, polos de suporte ou salas de aula.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Sala</label>
                                        <input
                                            type="text"
                                            value={data.nome}
                                            onChange={e => setData('nome', e.target.value)}
                                            placeholder="Ex: Laboratório de Redes 2"
                                            className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600"
                                            required
                                        />
                                        {errors.nome && <div className="text-red-500 text-xs mt-1">{errors.nome}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Bloco / Prédio / Polo</label>
                                        <input
                                            type="text"
                                            value={data.bloco}
                                            onChange={e => setData('bloco', e.target.value)}
                                            placeholder="Ex: Bloco B / 3º Andar"
                                            className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Quantidade de Postos/PCs</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.qtd_pcs}
                                            onChange={e => setData('qtd_pcs', parseInt(e.target.value) || 0)}
                                            className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 py-1">
                                    <label className="inline-flex items-center cursor-pointer select-none group">
                                        <input
                                            type="checkbox"
                                            checked={data.tem_ar_condicionado}
                                            onChange={e => setData('tem_ar_condicionado', e.target.checked)}
                                            className="rounded bg-gray-950 border-gray-800 text-blue-600 shadow-sm focus:ring-offset-gray-900 focus:ring-blue-500/50 w-5 h-5 transition-all"
                                        />
                                        <span className="ml-2.5 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Possui Climatização (Ar Cond.)</span>
                                    </label>

                                    <label className="inline-flex items-center cursor-pointer select-none group">
                                        <input
                                            type="checkbox"
                                            checked={data.tem_projetor}
                                            onChange={e => setData('tem_projetor', e.target.checked)}
                                            className="rounded bg-gray-950 border-gray-800 text-blue-600 shadow-sm focus:ring-offset-gray-900 focus:ring-blue-500/50 w-5 h-5 transition-all"
                                        // Configurado para manipulação dinâmica das flags booleanas
                                        />
                                        <span className="ml-2.5 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Possui Multimídia (Projetor/TV)</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Observações Técnicas / Infraestrutura (Opcional)</label>
                                    <textarea
                                        value={data.descricao}
                                        onChange={e => setData('descricao', e.target.value)}
                                        placeholder="Detalhes sobre tomadas, switches locais, infraestrutura de rede corporativa..."
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600"
                                        rows="2"
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`inline-flex justify-center py-2.5 px-5 text-sm font-bold rounded-lg text-white shadow-lg transition-all ${editandoId
                                            ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/10'
                                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/10'
                                            }`}
                                    >
                                        {processing ? 'Gravando...' : editandoId ? 'Salvar Alterações' : 'Adicionar Sala'}
                                    </button>

                                    {editandoId && (
                                        <button
                                            type="button"
                                            onClick={cancelarEdicao}
                                            className="inline-flex justify-center py-2.5 px-5 text-sm font-bold rounded-lg text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white transition-all"
                                        >
                                            Cancelar Edição
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TABELA DE LISTAGEM - Ocupa espaço completo se for Professor */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">📋 Infraestrutura Mapeada</h3>
                            <p className="text-sm text-gray-400">Listagem de salas liberadas para alocação de ativos e reservas.</p>
                        </div>

                        {/* BARRA DE FILTROS */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-950 rounded-xl border border-gray-800">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Buscar por Nome / Bloco</label>
                                <input
                                    type="text"
                                    value={pesquisa}
                                    onChange={e => setPesquisa(e.target.value)}
                                    placeholder="Digite para filtrar..."
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Climatização (Ar Cond.)</label>
                                <select
                                    value={filtroAr}
                                    onChange={e => setFiltroAr(e.target.value)}
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
                                >
                                    <option value="todos">Todos os ambientes</option>
                                    <option value="sim">Apenas Climatizados</option>
                                    <option value="nao"> Sem Climatização</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Multimídia (Projetor)</label>
                                <select
                                    value={filtroProjetor}
                                    onChange={e => setFiltroProjetor(e.target.value)}
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
                                >
                                    <option value="todos">Todos os ambientes</option>
                                    <option value="sim">Apenas com Projetor/TV</option>
                                    <option value="nao">Sem Projetor</option>
                                </select>
                            </div>


                            {isSuperAdmin && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">Unidade</label>
                                    <select
                                        // 🟢 DESTRANCADO: O valor agora acompanha diretamente o estado do filtro
                                        value={filtroUnidade}
                                        onChange={e => setUnidade(e.target.value)}
                                        disabled={auth.user.unidade_id !== null} // Trava apenas se o usuário for de uma unidade específica
                                        className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                                    >
                                        {auth.user.unidade_id === null ? (
                                            <>
                                                <option value="Todas">🏢 Todas as Unidades</option>
                                                {unidades.map(uni => (
                                                    <option key={uni.id} value={uni.id}>🏢 {uni.nome}</option>
                                                ))}
                                            </>
                                        ) : (
                                            <option value={auth.user.unidade_id}>
                                                🏢 {auth.user.unidade?.nome || 'Minha Unidade'}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            )}


                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Ordem por Computadores</label>
                                <select
                                    value={ordemPcs}
                                    onChange={e => setOrdemPcs(e.target.value)}
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
                                >
                                    <option value="nenhuma">Padrão de inserção</option>
                                    <option value="desc">🖥️ Computadores: Maior → Menor</option>
                                    <option value="asc">🖥️ Computadores: Menor → Maior</option>
                                </select>
                            </div>

                        </div>

                        {/* TABELA DE DADOS */}
                        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-900/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4">Nome do Espaço</th>
                                        <th className="px-6 py-4">Localização / Bloco</th>
                                        <th className="px-6 py-4 text-center">Máquinas</th>
                                        <th className="px-6 py-4 text-center">Climatizado</th>
                                        <th className="px-6 py-4 text-center">Projetor</th>

                                        {/* Cabeçalho de ações condicional */}
                                        {isSuperAdmin && <th className="px-6 py-4 text-center">Unidade</th>}
                                        {!isProfessor && <th className="px-6 py-4 text-right">Ações de Gerência</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {salasFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan={isProfessor ? "5" : "6"} className="px-6 py-12 text-center text-gray-500 italic">
                                                Nenhum espaço físico localizado com os filtros aplicados.
                                            </td>
                                        </tr>
                                    ) : (
                                        salasFiltradas.map(sala => (
                                            <tr key={sala.id} className="hover:bg-gray-900/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-white flex items-center gap-2">
                                                    🏢 {sala.nome}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {sala.bloco || <span className="text-gray-600 italic">Não informado</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-gray-200">
                                                    {sala.qtd_pcs} u.
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {sala.tem_ar_condicionado ? (
                                                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">Sim</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-gray-800 text-gray-500 border border-gray-700/30">Não</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {sala.tem_projetor ? (
                                                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">Sim</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-gray-800 text-gray-500 border border-gray-700/30">Não</span>
                                                    )}
                                                </td>
                                                {isSuperAdmin && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                        {/* 🏢 Buscando o nome da unidade direto da relação que vem na sala */}
                                                        {sala.unidade?.nome ? (
                                                            <span className="text-gray-300 font-medium">
                                                                🏢 {sala.unidade.nome}
                                                            </span>
                                                        ) : (
                                                            /* Alternativa de contingência: se for Co-Admin, bate com a unidade do usuário logado */
                                                            auth.user.unidade?.nome && sala.unidade_id === auth.user.unidade_id ? (
                                                                <span className="text-gray-300 font-medium">
                                                                    🏢 {auth.user.unidade.nome}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-600 italic">Não informado</span>
                                                            )
                                                        )}
                                                    </td>
                                                )}


                                                {/* Botões de Ações condicionados ao nível de permissão */}
                                                {!isProfessor && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium space-x-2">
                                                        <button
                                                            onClick={() => iniciarEdicao(sala)}
                                                            className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/30 border border-amber-500/10 px-2.5 py-1.5 rounded-md transition-all"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletar(sala.id)}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-400 bg-red-950/30 border border-red-500/10 px-2.5 py-1.5 rounded-md transition-all"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}