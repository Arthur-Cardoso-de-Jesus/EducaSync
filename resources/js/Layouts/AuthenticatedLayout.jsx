import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    //Constantes de validação técnica de acesso
    const isSuperAdmin = user.role === 'admin' && user.unidade_id === null;
    const isGestor = user.role === 'admin' || user.role === 'co-admin';
    const isPendente = user.role === 'pendente';

    // REDIRECIONAMENTO FORÇADO EM CAMADA
    useEffect(() => {
        // Se a conta for pendente e o usuário tentar acessar qualquer página que NÃO seja o Dashboard, expulsa ele de volta
        if (isPendente && !route().current('dashboard')) {
            router.visit(route('dashboard'));
        }
    }, [isPendente]);

    return (
        <div className="min-h-screen bg-slate-950"> {/* Ajustado o fundo da página principal para Dark */}
            <nav className="bg-slate-950 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')} className="flex items-center gap-3 group">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent uppercase leading-none">
                                            EducaSync
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                            by Artware
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* 🖥️ MENU DESKTOP */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* 🔒 Se a conta for PENDENTE, bloqueia toda a navegação e mostra apenas o aviso */}
                                {isPendente ? (
                                    <span className="inline-flex items-center px-1 pt-1 text-xs font-bold uppercase tracking-wider text-amber-500 animate-pulse">
                                        ⚠️ Aguardando Liberação de Unidade
                                    </span>
                                ) : (
                                    /* Se a conta estiver homologada, renderiza os módulos por nível */
                                    <>
                                        <NavLink href={route('dashboard')} className="text-slate-50" active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>

                                        <NavLink href={route('salas.index')} className="text-slate-50" active={route().current('salas.index')}>
                                            Salas
                                        </NavLink>

                                        <NavLink href={route('locacoes.index')} className="text-slate-50" active={route().current('locacoes.index')}>
                                            Locação de Salas
                                        </NavLink>

                                        {/* Visível apenas para Administradores / Co-Admins */}
                                        {isGestor && (
                                            <>
                                                <NavLink href={route('ativos.index')} className="text-slate-50" active={route().current('ativos.index')}>
                                                    Inventário de Ativos
                                                </NavLink>

                                                <NavLink href={route('funcionarios.index')} className="text-slate-50" active={route().current('funcionarios.index')}>
                                                    Equipe / Funcionários
                                                </NavLink>
                                            </>
                                        )}

                                        {/* Link de Unidades EXCLUSIVO para o SuperAdmin */}
                                        {isSuperAdmin && (
                                            <NavLink href={route('unidades.index')} className="text-slate-50" active={route().current('unidades.index')}>
                                                Gerenciar Unidades
                                            </NavLink>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* MENU USUÁRIO (DROPDOWN) */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-gray-800 text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-900 hover:text-white focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* BOTÃO HAMBÚRGUER (MOBILE) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-900 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📱 MENU RESPONSIVO MOBILE */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1 bg-gray-950 border-t border-gray-900">
                        {isPendente ? (
                            <div className="block w-full ps-3 pe-4 py-2 border-l-4 border-amber-500 text-start text-xs font-bold tracking-wider uppercase text-amber-500 bg-amber-500/5">
                                ⏳ Cadastro Pendente de Vínculo
                            </div>
                        ) : (
                            <>
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('salas.index')} active={route().current('salas.index')}>
                                    Salas
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('locacoes.index')} active={route().current('locacoes.index')}>
                                    Locação de Salas
                                </ResponsiveNavLink>
                                {isGestor && (
                                    <>
                                        <ResponsiveNavLink href={route('ativos.index')} active={route().current('ativos.index')}>
                                            Inventário de Ativos
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('funcionarios.index')} active={route().current('funcionarios.index')}>
                                            Equipe / Funcionários
                                        </ResponsiveNavLink>
                                    </>
                                )}
                                {isSuperAdmin && (
                                    <ResponsiveNavLink href={route('unidades.index')} active={route().current('unidades.index')}>
                                        Gerenciar Unidades
                                    </ResponsiveNavLink>
                                )}
                            </>
                        )}
                    </div>

                    {/* DADOS DO USUÁRIO NO MOBILE */}
                    <div className="pt-4 pb-1 border-t border-gray-900 bg-gray-950">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-200">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-slate-950 border-b border-gray-900/60">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}