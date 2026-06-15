import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bem-vindo ao EducaSync" />

            <div className="min-h-screen bg-slate-950 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">

                {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
                <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center space-x-3">

                        <div className="relative p-2  flex items-center justify-center text-gray-200">


                            {/*  TEXTO DA MARCA */}
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent uppercase leading-none">
                                    EducaSync
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                    by Artware
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="space-x-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-all ml-4">
                                Acessar Painel
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-medium text-gray-400 hover:text-white transition-all">
                                    Entrar
                                </Link>
                                <Link href={route('register')} className="text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-all ml-4">
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </div>
                </nav >

                {/* CONTEÚDO PRINCIPAL (HERO SECTION) */}
                < main className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-8"> 
    
                    <div className="inline-flex items-center space-x-2 bg-blue-800/20 border border-blue-800/60 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold tracking-wide uppercase">
                        <span>Gestão de salas e ativos nunca foi tão facil </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Gestão de Ativos e TI com <br />
                        <span className="bg-gradient-to-r from-blue-600 via-blue-300 to-blue-900 bg-clip-text text-transparent">
                            Sincronia Absoluta.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
                        O <strong className="text-white font-semibold">EducaSync</strong> é a solução definitiva para o controle patrimonial de redes escolares. Monitore hardwares e salas.
                    </p>

                    {/* BOTÕES DE CHAMADA PRINCIPAL */}
                    <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="w-full sm:w-auto text-center px-8 py-3.5 bg-blue-600 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-lg shadow-lg shadow-blue-600/30">
                                Ir para o Dashboard ➜
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="w-full sm:w-auto text-center px-8 py-3.5 bg-blue-600 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-lg shadow-lg shadow-blue-600/30">
                                    Iniciar Sessão ➜
                                </Link>
                                <Link
                                    href="/contato"
                                    className="w-full sm:w-auto text-center px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl border border-gray-700 transition-all text-lg"
                                >
                                    Conheça nosso sitema
                                </Link>
                            </>
                        )}
                    </div>
                </main >

                {/* RECURSOS EM DESTAQUE (CARDS) */}
                < section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6" >
                    <div className="p-6 bg-gray-800/40 border border-gray-800 rounded-2xl">
                        <div className="text-3xl mb-3">🏢</div>
                        <h3 className="text-lg font-bold text-white mb-2">Crie seu ambiente escolar</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Crie seu ambiente com salas e seus colaboradores e patrimonios tudo de forma integrada com sua equipe.</p>
                    </div>

                    <div className="p-6 bg-gray-800/40 border border-gray-800 rounded-2xl">
                        <div className="text-3xl mb-3">🖥️</div>
                        <h3 className="text-lg font-bold text-white mb-2">Inventário Inteligente</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Controle total de computadores, roteadores e periféricos com rastreamento por Número de Série e código de patrimônio único.</p>
                    </div>

                    <div className="p-6 bg-gray-800/40 border border-gray-800 rounded-2xl">
                        <div className="text-3xl mb-3">📙</div>
                        <h3 className="text-lg font-bold text-white mb-2">Locação</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Gerencie locação de salas, ativos e dê mais fluidez ao processo de aluguel de salas na sua escola com participação dos professores.</p>
                    </div>
                </section >

                {/* RODAPÉ */}
                < footer className="text-center py-8 text-xs text-gray-600 border-t border-gray-800 mt-12" >
                    & copy; 2026 EducaSync.Desenvolvido por < span className="text-gray-400" > Artware IT Services</span >.Todos os direitos reservados.
                </footer >
            </div >
        </>
    );
}