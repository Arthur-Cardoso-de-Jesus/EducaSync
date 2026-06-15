import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-3xl text-gray-200 leading-tight">Configurações do Perfil</h2>}
        >
            <Head title="Meu Perfil" />

            <div className="py-12 bg-gray-950 min-h-screen text-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* CARD 1: Dados Cadastrais */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl transition-all">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* CARD 2: Atualização de Senha */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-gray-800 sm:rounded-2xl shadow-xl transition-all">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* CARD 3: Exclusão / Desativação de Conta */}
                    <div className="p-6 sm:p-8 bg-gray-900 border border-red-950/40 sm:rounded-2xl shadow-xl transition-all">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}