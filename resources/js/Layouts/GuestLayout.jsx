import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-slate-950 text-gray-100 font-sans">
            <div className="flex flex-col items-center mb-6">
                <Link href="/" className="flex flex-col items-center space-y-2">
                    {/* ÍCONE PADRÃO: EDUCAÇÃO + SINCRONIA */}
                    

                    {/* TEXTO EM DEGRADÊ ROYAL BLUE -> DEEP SKY BLUE */}
                    <span className="text-3xl font-black tracking-wider bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent uppercase leading-none">
                        EducaSync
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Artware IT Services
                    </span>
                </Link>
            </div>

            {/* CARD DO FORMULÁRIO */}
            <div className="w-full sm:max-w-md mt-2 px-6 py-8 bg-slate-900/80 border border-slate-900 shadow-2xl overflow-hidden sm:rounded-2xl backdrop-blur-sm">
                {children}
            </div>
        </div>
    );
}