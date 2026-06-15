import React, { useState, useEffect } from 'react'; // 🌟 Importado useEffect
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import axios from 'axios'; // 🌟 Importado o Axios para consultas em background

export default function Index({ auth, locacoes = [], proximasLocacoes = [], salas = [], funcionarios = [] }) {

    // Identifica se o usuário logado é professor comum
    const isProfessor = auth.user.role === 'user';

    const periodosDisponiveis = [
        'Manhã - P1', 'Manhã - P2', 'Manhã - P3', 'Manhã - P4', 'Manhã - P5', 'Manhã - P6',
        'Tarde - P1', 'Tarde - P2', 'Tarde - P3', 'Tarde - P4', 'Tarde - P5', 'Tarde - P6',
        'Noite - P1', 'Noite - P2', 'Noite - P3', 'Noite - P4', 'Noite - P5', 'Noite - P6'
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        sala_id: '',
        user_id: isProfessor ? auth.user.id : '', // 🔒 Garante o ID inicial na árvore de dados
        data_locacao: '',
        periodos: [],
        descricao: ''
    });

    // FORÇA O PREENCHIMENTO AUTOMÁTICO NA MONTAGEM DA TELA
    useEffect(() => {
        if (isProfessor) {
            setData('user_id', auth.user.id);
        }
    }, []);

    //  Guarda o que já está ocupado no dia/sala selecionados
    const [periodosOcupados, setPeriodosOcupados] = useState([]);

    const [filtroSala, setFiltroSala] = useState('');
    // Se for professor, a listagem de histórico já inicia filtrada estritamente nas locações dele
    const [filtroProfessor, setFiltroProfessor] = useState(isProfessor ? String(auth.user.id) : '');
    const [ordemData, setOrdemData] = useState('asc');

    //  Dispara a busca toda vez que a sala ou a data mudarem no formulário
    useEffect(() => {
        if (data.sala_id && data.data_locacao) {
            axios.get(route('locacoes.verificar'), {
                params: { sala_id: data.sala_id, data: data.data_locacao }
            })
                .then(response => {
                    setPeriodosOcupados(response.data);

                    // Se o professor já tinha clicado em um período que agora descobrimos que está ocupado, desmarca ele automaticamente
                    setData('periodos', data.periodos.filter(p => !response.data.includes(p)));
                })
                .catch(err => console.error("Erro ao checar períodos", err));
        } else {
            // Se limpar a data ou a sala, zera a lista de ocupados
            setPeriodosOcupados([]);
        }
    }, [data.sala_id, data.data_locacao]);

    const handlePeriodoChange = (periodo) => {
        // Se o período estiver ocupado, bloqueia o clique por segurança
        if (periodosOcupados.includes(periodo)) return;

        if (data.periodos.includes(periodo)) {
            setData('periodos', data.periodos.filter(p => p !== periodo));
        } else {
            setData('periodos', [...data.periodos, periodo]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('locacoes.store'), {
            onSuccess: () => {
                reset();
                setPeriodosOcupados([]); // Zera os ocupados pós-sucesso
                if (isProfessor) setData('user_id', auth.user.id); // Re-injeta o ID após o reset
            }
        });
    };

    const handleDeletar = (id) => {
        if (confirm('Tem certeza que deseja cancelar esta reserva de espaço?')) {
            router.delete(route('locacoes.destroy', id), {
                onSuccess: () => {
                    // Força a atualização dos blocos ocupados caso tenha deletado algo do dia selecionado
                    if (data.sala_id && data.data_locacao) {
                        axios.get(route('locacoes.verificar'), {
                            params: { sala_id: data.sala_id, data: data.data_locacao }
                        }).then(res => setPeriodosOcupados(res.data));
                    }
                }
            });
        }
    };

    const locacoesFiltradas = locacoes
        .filter(loc => {
            const bateSala = filtroSala === '' || String(loc.sala_id) === String(filtroSala);
            const bateProfessor = filtroProfessor === '' || String(loc.user_id) === String(filtroProfessor);
            return bateSala && bateProfessor;
        })
        .sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return ordemData === 'asc' ? dataA - dataB : dataB - dataA;
        });

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-3xl text-gray-200">Locação de Espaços</h2>}>
            <Head title="Agendamentos" />

            <div className="py-4 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Barra lateral */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
                            <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider mb-4">📅 Alocações de Hoje</h3>
                            <div className="space-y-3">
                                {proximasLocacoes.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nenhum ambiente reservado para hoje.</p>
                                ) : (
                                    proximasLocacoes.map(prox => (
                                        <div key={prox.id} className="p-3 bg-gray-950 border border-gray-800/60 rounded-xl hover:border-blue-500/30 transition-all">
                                            <div className="text-xs font-bold text-white mb-1">🏢 {prox.sala?.nome}</div>
                                            <div className="text-xs font-bold text-white mb-1">👨‍🏫 {prox.user?.name}</div>
                                            <div className="text-[11px] text-gray-400 flex justify-between">
                                                <span>📅 {prox.data ? new Date(prox.data + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem data'}</span>
                                            </div>
                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                {prox.periodos?.map((p, idx) => (
                                                    <span key={idx} className="px-1.5 py-0.5 text-[9px] font-black bg-blue-950 text-blue-400 rounded border border-blue-500/10">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUNA PRINCIPAL */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* FORMULÁRIO */}
                        <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Reservar Agenda</h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Ambiente</label>
                                        <select value={data.sala_id} onChange={e => setData('sala_id', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500" required>
                                            <option value="">Selecione a sala...</option>
                                            {salas.map(s => <option key={s.id} value={s.id}>🏢 {s.nome}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Professor Responsável</label>
                                        {/* SE FOR PROFESSOR: Renderiza um campo textual travado e desabilitado com os dados dele */}
                                        {isProfessor ? (
                                            <input
                                                type="text"
                                                value={auth.user.name}
                                                className="w-full bg-gray-950 border-gray-800 text-gray-500 rounded-lg cursor-not-allowed opacity-60 font-semibold"
                                                disabled
                                            />
                                        ) : (
                                            /* SE FOR GESTOR: Exibe o select padrão de delegação livre */
                                            <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500" required>
                                                <option value="">Selecione o docente...</option>
                                                {funcionarios.map(func => <option key={func.id} value={func.id}> {func.name}</option>)}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Data da Reserva</label>
                                        <input type="date" value={data.data_locacao} onChange={e => setData('data_locacao', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg focus:border-blue-500" required />
                                    </div>
                                </div>

                                {/* Seleção */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Selecione os Períodos (Clique para marcar vários)</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                        {periodosDisponiveis.map(p => {
                                            const selecionado = data.periodos.includes(p);
                                            const ocupado = periodosOcupados.includes(p); // Verifica se está ocupado

                                            return (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    disabled={ocupado} // Desabilita o botão 
                                                    onClick={() => handlePeriodoChange(p)}
                                                    className={`p-3 text-[11px] font-bold rounded-xl border transition-all text-center ${ocupado
                                                            ? 'bg-gray-900 text-gray-600 border-gray-850 opacity-40 cursor-not-allowed line-through' // Visual esmaecido e riscado
                                                            : selecionado
                                                                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/10'
                                                                : 'bg-gray-950 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Finalidade do Agendamento</label>
                                    <textarea value={data.descricao} onChange={e => setData('descricao', e.target.value)} className="w-full bg-gray-950 border-gray-800 text-gray-200 rounded-lg placeholder-gray-600" rows="2" placeholder="Ex: Aplicação de prova prática..."></textarea>
                                </div>

                                <button type="submit" disabled={processing || data.periodos.length === 0} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 font-bold text-sm text-white rounded-lg transition-all">
                                    {processing ? 'Agendando...' : 'Confirmar Reserva de Períodos'}
                                </button>
                            </form>
                        </div>

                        {/* SEÇÃO: TABELA DE LOCAÇÕES */}
                        <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Histórico e Alocações Ativas</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-950 rounded-xl border border-gray-800">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Ambiente</label>
                                    <select value={filtroSala} onChange={e => setFiltroSala(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg">
                                        <option value="">Todos os ambientes</option>
                                        {salas.map(s => <option key={s.id} value={s.id}>🏢 {s.nome}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Professor</label>
                                    {/* SE FOR PROFESSOR: Deixa o filtro travado de forma estática para ele visualizar apenas suas reservas */}
                                    {isProfessor ? (
                                        <select className="w-full text-xs bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed opacity-70" disabled>
                                            <option value={auth.user.id}> Meus Agendamentos</option>
                                        </select>
                                    ) : (
                                        <select value={filtroProfessor} onChange={e => setFiltroProfessor(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg">
                                            <option value="">Todos os professores</option>
                                            {funcionarios.map(f => <option key={f.id} value={f.id}> {f.name}</option>)}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">Ordenação por Data</label>
                                    <select value={ordemData} onChange={e => setOrdemData(e.target.value)} className="w-full text-xs bg-gray-900 border-gray-800 text-gray-300 rounded-lg">
                                        <option value="asc">📅 Data: Mais próxima (Crescente)</option>
                                        <option value="desc">📅 Data: Mais distante (Decrescente)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950">
                                <table className="w-full text-left border-collapse text-xs text-gray-300">
                                    <thead>
                                        <tr className="bg-gray-900/50 border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                                            <th className="p-4">Ambiente</th>
                                            <th className="p-4">Professor</th>
                                            <th className="p-4">Data</th>
                                            <th className="p-4">Períodos</th>
                                            <th className="p-4">Finalidade</th>
                                            <th className="p-4 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {locacoesFiltradas.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-gray-500 italic">Nenhuma alocação encontrada.</td>
                                            </tr>
                                        ) : (
                                            locacoesFiltradas.map(loc => {
                                                const podeDeletar = auth.user.role === 'admin' || auth.user.role === 'co-admin' || loc.user_id === auth.user.id;
                                                return (
                                                    <tr key={loc.id} className="hover:bg-gray-900/30 transition-colors">
                                                        <td className="p-4 font-bold text-white">🏢 {loc.sala?.nome}</td>
                                                        <td className="p-4 text-gray-200"> {loc.user?.name}</td>
                                                        <td className="p-4 font-medium text-blue-400">{loc.data ? new Date(loc.data + 'T00:00:00').toLocaleDateString('pt-BR') : '---'}</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                                {loc.periodos?.map((p, idx) => <span key={idx} className="px-2 py-0.5 text-[10px] font-semibold bg-gray-900 border border-gray-800 text-gray-400 rounded">{p}</span>)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-gray-400 max-w-[200px] truncate" title={loc.motivo}>{loc.motivo || <span className="text-gray-600 italic">Sem observações</span>}</td>
                                                        <td className="p-4 text-center">
                                                            {podeDeletar ? <button onClick={() => handleDeletar(loc.id)} className="px-2.5 py-1 text-[11px] font-bold text-red-400 bg-red-950/30 border border-red-900/50 rounded-md hover:bg-red-600 hover:text-white transition-all">Excluir</button> : <span className="text-gray-600 text-[11px] italic">Bloqueado</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })
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