import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Contato() {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-blue-600/30">
            <Head title="Contato & Integração" />

            <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                {/* Detalhe estético no fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none"></div>

                {/* Header da Marca */}
                <div className="text-center mb-8">
                    <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent uppercase">
                        EducaSync
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mt-1">
                        By ArtWare IT Services
                    </span>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-50 mb-2">Modelo de Implantação Institucional</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            O EducaSync opera de forma estritamente corporativa e centralizada. O cadastro de novos professores,
                            colaboradores e técnicos de TI é realizado **exclusivamente por requisição de provisionamento automatizado** ou carga de dados efetuada pela administração central da instituição de ensino parceira.
                        </p>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Blocos de Informação Informativos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl space-y-1">
                            <span className="text-base">👨‍🏫</span>
                            <h4 className="font-bold text-blue-400">Sou Professor / Técnico</h4>
                            <p className="text-gray-400 leading-relaxed">
                                Se você realizou o cadastro e sua conta está aguardando homologação, sua ID precisa ser vinculada a um campus ativo pelo gestor da sua unidade.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl space-y-1">
                            <span className="text-base">🏢</span>
                            <h4 className="font-bold text-purple-400">Novas Instituições</h4>
                            <p className="text-gray-400 leading-relaxed">
                                Para integrar o EducaSync aos sistemas legados ou ERP da sua escola via Webhooks/API corporativa, entre em contato com nossa equipe de suporte.
                            </p>
                        </div>
                    </div>

                    {/* CARD DE CONTATO DIRETORIA TÉCNICA (ARTWARE) */}
                    <div className="mt-8 p-5 bg-gray-950 border border-gray-850 rounded-2xl relative overflow-hidden group">
                        {/* Detalhe visual na borda lateral para dar o tom corporativo */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-blue-900 rounded-l-2xl"></div>

                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                            <span>🌐</span> Central de Provisionamento API
                        </h4>

                        <div className="space-y-3 text-xs text-gray-400">
                            <p className="leading-relaxed">
                                Se sua instituição necessita de liberação de novos tokens de produção ou sincronização em lote de professores via Webhooks, acione nosso time de arquitetura:
                            </p>

                            <div className="pt-2 space-y-2 font-mono">
                                {/* E-mail Fictício Corporativo */}
                                <div className="flex items-center gap-2.5 hover:text-gray-200 transition-colors">
                                    <span className="text-sm">✉️</span>
                                    <a href="mailto:integration@artware.net.br">ArtwareSuporte@suporte.net.br</a>
                                </div>

                                {/* Telefone Fictício de Suporte */}
                                <div className="flex items-center gap-2.5 hover:text-gray-200 transition-colors">
                                    <span className="text-sm"></span>
                                    <a href="tel:+555130034004">0800 0000 0000 (Suporte e Vendas)</a>
                                </div>
                            </div>

                            <div className="pt-2 text-[10px] text-gray-600 italic">
                                *Horário de atendimento das requisições: Segunda a Sexta, das 08h às 18h UTC-3.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/60 mt-6">
                        {/* 🏠 Botão Voltar para o Início no Padrão do Sistema */}
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                        >
                            ← Voltar ao Início
                        </Link>
                    </div>

                </div>
            </div>

            {/* Rodapé da Software House */}
            <div className="mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                Artware © 2026 • Todos os direitos reservados
            </div>
        </div>
    );
}