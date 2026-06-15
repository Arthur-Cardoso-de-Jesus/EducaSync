import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, ativos = [], salas = [] }) {
    // Mantém o console log ativo para conferência de sincronização técnica
    console.log("Salas recebidas do Laravel:", salas);

    // Estado para controlar se estamos editando um ativo e qual o ID dele
    const [editandoId, setEditandoId] = useState(null);

    //  ESTADOS DOS FILTROS DA TABELA DE INVENTÁRIO
    const [filtroSala, setFiltroSala] = useState('');
    const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
    const [filtroSerie, setFiltroSerie] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    // Estado inicial do formulário, incluindo o novo campo 'numero_serie' e 'editandoId'
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome: '',
        codigo_patrimonio: '',
        numero_serie: '',
        tipo: '',
        status: 'operacional',
        sala_id: '',
        observacoes: ''
    });

    // Disparado ao enviar o formulário (pode ser Cadastro ou Edição)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editandoId) {
            // Se tem um ID em edição, envia via PUT para a rota de update
            put(route('ativos.update', editandoId), {
                onSuccess: () => cancelarEdicao()
            });
        } else {
            // Se não, faz o cadastro normal via POST
            post(route('ativos.store'), {
                onSuccess: () => reset()
            });
        }
    };

    // Ativa o modo de edição jogando os dados da tabela para o formulário
    const iniciarEdicao = (ativo) => {
        setEditandoId(ativo.id);
        setData({
            nome: ativo.nome,
            codigo_patrimonio: ativo.codigo_patrimonio,
            numero_serie: ativo.numero_serie || '', // Trata nulos
            tipo: ativo.tipo,
            status: ativo.status,
            sala_id: ativo.sala_id || '', // Trata nulos
            observacoes: ativo.observacoes || '' // Trata nulos
        });
    };

    // Limpa o formulário e sai do modo de edição
    const cancelarEdicao = () => {
        setEditandoId(null);
        reset();
    };

    // Função para deletar usando o helper direto do Inertia
    const handleDeletar = (id) => {
        if (confirm('Tem certeza que deseja remover este ativo? Esta ação não pode ser desfeita.')) {
            router.delete(route('ativos.destroy', id));
        }
    };

    // LÓGICA DE FILTRAGEM MULTI-CRITÉRIO EM TEMPO REAL
    const ativosFiltrados = ativos.filter(ativo => {
        // 1. Filtro por Sala / Ambiente
        const bateSala = filtroSala === '' || String(ativo.sala_id) === String(filtroSala);

        // 2. Filtro por Código de Patrimônio (Busca textual parcial)
        const batePatrimonio = filtroPatrimonio === '' || 
                               (ativo.codigo_patrimonio && ativo.codigo_patrimonio.toLowerCase().includes(filtroPatrimonio.toLowerCase()));

        // 3. Filtro por Número de Série (Busca textual parcial)
        const bateSerie = filtroSerie === '' || 
                          (ativo.numero_serie && ativo.numero_serie.toLowerCase().includes(filtroSerie.toLowerCase()));

        // 4. Filtro por Status Operacional
        const bateStatus = filtroStatus === '' || ativo.status === filtroStatus;

        // 5. Filtro por Tipo de Equipamento
        const bateTipo = filtroTipo === '' || ativo.tipo === filtroTipo;

        return bateSala && batePatrimonio && bateSerie && bateStatus && bateTipo;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-3xl text-gray-200 leading-tight">Controle de Patrimônio (Ativos)</h2>}
        >
            <Head title="Ativos e Equipamentos" />

            <div className="py-4 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* FORMULÁRIO DE CADASTRO COMPLETO */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                            {editandoId ? '✏️ Atualizar Ficha do Ativo' : 'Cadastrar Novo Equipamento / Ativo'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {editandoId ? `Modificando dados do hardware ID #${editandoId}` : 'Registre computadores, projetores ou hardwares de rede vinculados à escola.'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* PRIMEIRA LINHA DO GRID - 4 COLUNAS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Equipamento</label>
                                    <input 
                                        type="text" 
                                        value={data.nome} 
                                        onChange={e => setData('nome', e.target.value)} 
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600" 
                                        placeholder="Ex: Computador I5 16GB" 
                                        required 
                                    />
                                    {errors.nome && <div className="text-red-500 text-xs mt-1">{errors.nome}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Patrimônio (Tombo)</label>
                                    <input 
                                        type="text" 
                                        value={data.codigo_patrimonio} 
                                        onChange={e => setData('codigo_patrimonio', e.target.value)} 
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600" 
                                        placeholder="Ex: PAT-2026-042" 
                                        required 
                                    />
                                    {errors.codigo_patrimonio && <div className="text-red-500 text-xs mt-1">{errors.codigo_patrimonio}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Número de Série</label>
                                    <input 
                                        type="text" 
                                        value={data.numero_serie} 
                                        onChange={e => setData('numero_serie', e.target.value)} 
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all placeholder-gray-600" 
                                        placeholder="Ex: BRH938201X" 
                                    />
                                    {errors.numero_serie && <div className="text-red-500 text-xs mt-1">{errors.numero_serie}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Ativo</label>
                                    <select 
                                        value={data.tipo} 
                                        onChange={e => setData('tipo', e.target.value)} 
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring transition-all" 
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Computador">Computador / PC</option>
                                        <option value="Projetor">Projetor</option>
                                        <option value="Roteador">Roteador / Network</option>
                                        <option value="Impressora">Impressora</option>
                                        <option value="Mobiliário">Mobiliário</option>
                                    </select>
                                    {errors.tipo && <div className="text-red-500 text-xs mt-1">{errors.tipo}</div>}
                                </div>
                            </div>

                            {/* SEGUNDA LINHA DO GRID - LOCALIZAÇÃO E STATUS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Status Atual</label>
                                    <select 
                                        value={data.status} 
                                        onChange={e => setData('status', e.target.value)} 
                                        className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring transition-all"
                                    >
                                        <option value="operacional">🟢 Operacional</option>
                                        <option value="manutencao">🟡 Em Manutenção Técnica</option>
                                        <option value="descartado">🔴 Descartado / Baixa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Alocar na Sala</label>
                                    <select
                                        value={data.sala_id}
                                        onChange={e => setData('sala_id', e.target.value)}
                                        className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring transition-all"
                                    >
                                        <option value="">🏢 Sem sala (Ficar no Estoque da TI)</option>
                                        {salas && salas.length > 0 && salas.map(sala => (
                                            <option key={sala.id} value={sala.id}>
                                                🏢 {sala.nome} {sala.bloco ? `(${sala.bloco})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* OBSERVAÇÕES */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Observações Técnicas (Opcional)</label>
                                <textarea 
                                    value={data.observacoes} 
                                    onChange={e => setData('observacoes', e.target.value)} 
                                    className="block w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring transition-all placeholder-gray-600" 
                                    rows="2" 
                                    placeholder="Configurações de hardware, detalhes de rede ou defeitos observados..."
                                ></textarea>
                            </div>

                            {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`inline-flex justify-center py-2.5 px-5 text-sm font-bold rounded-lg text-white shadow-lg transition-all ${
                                        editandoId 
                                            ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/10' 
                                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/10'
                                    }`}
                                >
                                    {processing ? 'Gravando...' : editandoId ? 'Atualizar Ativo' : 'Cadastrar Ativo'}
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

                    {/* TABELA DE LISTAGEM / INVENTÁRIO */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Inventário de Ativos Mapeados</h3>
                            <p className="text-sm text-gray-400">Listagem de hardwares monitorados e suas respectivas alocações.</p>
                        </div>

                        {/* NOVA BARRA DE FILTROS DO INVENTÁRIO */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-950 rounded-xl border border-gray-800">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Sala</label>
                                <select value={filtroSala} onChange={e => setFiltroSala(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0">
                                    <option value="">Todas as salas</option>
                                    <option value="estoque">📦 Estoque da TI</option>
                                    {salas.map(s => <option key={s.id} value={s.id}>🏢 {s.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Buscar Patrimônio</label>
                                <input 
                                    type="text" 
                                    value={filtroPatrimonio} 
                                    onChange={e => setFiltroPatrimonio(e.target.value)}
                                    placeholder="Ex: PAT-2026..." 
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Buscar Nº de Série</label>
                                <input 
                                    type="text" 
                                    value={filtroSerie} 
                                    onChange={e => setFiltroSerie(e.target.value)}
                                    placeholder="Ex: BRH938..." 
                                    className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Status</label>
                                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0">
                                    <option value="">Todos os status</option>
                                    <option value="operacional">🟢 Operacional</option>
                                    <option value="manutencao">🟡 Em Manutenção</option>
                                    <option value="descartado">🔴 Baixa / Descartado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Tipo</label>
                                <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg focus:border-blue-500 focus:ring-0">
                                    <option value="">Todos os tipos</option>
                                    <option value="Computador">Computador / PC</option>
                                    <option value="Projetor">Projetor</option>
                                    <option value="Roteador">Roteador / Network</option>
                                    <option value="Impressora">Impressora</option>
                                    <option value="Mobiliário">Mobiliário</option>
                                </select>
                            </div>
                        </div>

                        {/* TABELA DE COMPONENTES FILTRADOS */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-900/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4">Patrimônio / Tombo</th>
                                        <th className="px-6 py-4">Equipamento</th>
                                        <th className="px-6 py-4">N° de Série</th>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4">Localização Atual</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {ativosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">
                                                Nenhum ativo localizado com os filtros combinados.
                                            </td>
                                        </tr>
                                    ) : (
                                        ativosFiltrados.map(ativo => (
                                            <tr key={ativo.id} className="hover:bg-gray-900/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-blue-400">
                                                    🏷️ {ativo.codigo_patrimonio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                                    {ativo.nome}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">
                                                    {ativo.numero_serie || <span className="text-gray-600 italic">Sem serial</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {ativo.tipo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                                                    {ativo.sala ? (
                                                        <span className="text-gray-200">🏢 {ativo.sala.nome}</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-950/40 text-blue-400 border border-blue-500/15">📦 Estoque da TI</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {ativo.status === 'operacional' ? (
                                                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">OPERACIONAL</span>
                                                    ) : ativo.status === 'manutencao' ? (
                                                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-amber-950/40 text-amber-400 border border-amber-500/20">MANUTENÇÃO</span>
                                                    ) : (
                                                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-red-950/40 text-red-400 border border-red-500/20">BAIXA / DESCARTADO</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-medium space-x-2">
                                                    <button 
                                                        onClick={() => iniciarEdicao(ativo)} 
                                                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/30 border border-amber-500/10 px-2.5 py-1.5 rounded-md transition-all"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeletar(ativo.id)} 
                                                        className="text-xs font-semibold text-red-500 hover:text-red-400 bg-red-950/30 border border-red-500/10 px-2.5 py-1.5 rounded-md transition-all"
                                                    >
                                                        Excluir
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
        </AuthenticatedLayout>
    );
}