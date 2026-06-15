import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    // 👑 Definições de constantes reativas de controle de acesso
    const isSuperAdmin = auth.user.role === 'admin' && auth.user.unidade_id === null;
    const isGestor = auth.user.role === 'admin' || auth.user.role === 'co-admin';
    const isProfessor = auth.user.role === 'user';
    const contaBloqueada = auth.user.role === 'pendente';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-200 leading-tight">Painel EducaSync</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-4 bg-slate-950">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-slate-950">
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl relative overflow-hidden">
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-100">Bem-vindo, {auth.user.name}!</h3>
                            <p className="text-gray-400">
                                {contaBloqueada ? '⚠️ Status: Aguardando Homologação' : '✅ Status: Autenticado'}
                            </p>
                        </div>

                        {/* 🌟 CONDICIONAL 1: Exibe o alerta de bloqueio estrito para usuários pendentes */}
                        {contaBloqueada ? (
                            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-center max-w-2xl mx-auto my-6 space-y-3">
                                <span className="text-4xl block">⏳</span>
                                <h4 className="text-lg font-bold text-amber-400">Acesso Restrito ao Sistema</h4>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Sua conta foi criada, mas você ainda não possui permissões ativas. 
                                    **Entre em contato com um administrador para ser alocado a uma unidade** de ensino correspondente.
                                </p>
                                <div className="text-xs text-gray-500 font-mono pt-2 border-t border-gray-800/60">
                                    Identificador da Conta: #{auth.user.id}
                                </div>
                            </div>
                        ) : (
                            /*  CONDICIONAL 2: Se não estiver bloqueado, exibe os cards com permissões cruzadas */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Card Funcionários (Recursos Humanos) - Visível apenas para Administradores/Gestores */}
                                {isGestor && (
                                    <Link
                                        href={route('funcionarios.index')}
                                        className={`group p-8 bg-blue-800/70 hover:bg-blue-700/80 border-2 border-blue-900 rounded-2xl transition-all duration-300 col-span-1'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-4xl mb-4 block">🏃‍♂️</span>
                                                <h4 className="text-xl font-bold text-blue-200 group-hover:text-white transition-colors">Recursos humanos</h4>
                                                <p className="text-blue-200 group-hover:text-blue-50 transition-colors">Gerencie colaboradores e seus cargos.</p>
                                            </div>
                                            <span className="text-blue-300 group-hover:text-white text-2xl">→</span>
                                        </div>
                                    </Link>
                                )}

                                {/* Card Salas - Visível para TODOS os homologados (SuperAdmin, Gestor e Professor) */}
                                <Link
                                    href={route('salas.index')}
                                    className="group p-8 bg-blue-800/70 hover:bg-blue-700/80 border-2 border-blue-900 rounded-2xl transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-4xl mb-4 block">🚪</span>
                                            <h4 className="text-xl font-bold text-blue-200 group-hover:text-white transition-colors">Gestão de Salas</h4>
                                            <p className="text-blue-200 group-hover:text-blue-50 transition-colors">Cadastre laboratórios, salas de aula e infraestrutura.</p>
                                        </div>
                                        <span className="text-blue-300 group-hover:text-white text-2xl">→</span>
                                    </div>
                                </Link>

                                {/* Card Locações - Visível para TODOS os homologados */}
                                <Link
                                    href={route('locacoes.index')}
                                    className="group p-8 bg-blue-800/70 hover:bg-blue-700/80 border-2 border-blue-900 rounded-2xl transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-4xl mb-4 block">🔑</span>
                                            <h4 className="text-xl font-bold text-blue-200 group-hover:text-white transition-colors">Locações</h4>
                                            <p className="text-blue-200 group-hover:text-blue-50 transition-colors">Reserve salas e gerencie seus agendamentos ativos.</p>
                                        </div>
                                        <span className="text-blue-300 group-hover:text-white text-2xl">→</span>
                                    </div>
                                </Link>

                                {/* Card Ativos - Visível apenas para Administradores/Gestores */}
                                {isGestor && (
                                    <Link
                                        href={route('ativos.index')}
                                        className="group p-8 bg-blue-800/70 hover:bg-blue-700/80 border-2 border-blue-900 rounded-2xl transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-4xl mb-4 block">💻</span>
                                                <h4 className="text-xl font-bold text-blue-200 group-hover:text-white transition-colors">Controle de Patrimônio</h4>
                                                <p className="text-blue-200 group-hover:text-blue-50 transition-colors">Gerencie computadores, projetores e equipamentos de TI.</p>
                                            </div>
                                            <span className="text-blue-300 group-hover:text-white text-2xl">→</span>
                                        </div>
                                    </Link>
                                )}

                                {/* Card Unidades - Exclusivo do SuperAdmin Geral */}
                                {isSuperAdmin && (
                                    <Link
                                        href={route('unidades.index')}
                                        className="group p-8 bg-blue-800/70 hover:bg-blue-700/80 border-2 border-blue-900 rounded-2xl transition-all duration-300 md:col-span-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-4xl mb-4 block">🏢</span>
                                                <h4 className="text-xl font-bold text-blue-200 group-hover:text-white transition-colors">Unidades</h4>
                                                <p className="text-blue-200 group-hover:text-blue-50 transition-colors">Gerencie as Unidades e Polos de atuação ativos.</p>
                                            </div>
                                            <span className="text-blue-300 group-hover:text-white text-2xl">→</span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Status Rápido Inferior */}
                        <div className="mt-10 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4">
                                <span className="block text-gray-500 text-sm uppercase font-bold tracking-widest mb-1">
                                    Nível de Acesso
                                </span>
                                {isSuperAdmin ? (
                                    <span className="text-blue-400 font-bold block">SuperAdmin (Plataforma)</span>
                                ) : isGestor ? (
                                    <span className="text-green-400 font-bold block">🏢 Gestor Escolar</span>
                                ) : contaBloqueada ? (
                                    <span className="text-amber-500 font-bold block">⏳ Pendente de Alocação</span>
                                ) : (
                                    <span className="text-gray-400 font-bold block">👨‍🏫 Professor / Colaborador</span>
                                )}
                            </div>
                            <div className="text-center p-4">
                                <span className="block text-gray-500 text-sm uppercase font-bold tracking-widest mb-1">Status do Banco</span>
                                <span className="text-emerald-500 font-bold">Conectado (MySQL)</span>
                            </div>
                            <div className="text-center p-4">
                                <span className="block text-gray-500 text-sm uppercase font-bold tracking-widest mb-1">Versão</span>
                                <span className="text-gray-400 font-bold">EducaSync v1.0</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}