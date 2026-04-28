import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function emptyForm() {
    return {
        id: null,
        name: '',
        email: '',
        phone: '',
        notes: '',
    };
}

export default function Index({ clients }) {
    const { flash } = usePage().props;
    const form = useForm(emptyForm());

    const submit = (event) => {
        event.preventDefault();

        form.put(route('tenant.clients.update', form.data.id), {
            onSuccess: () => form.reset(),
        });
    };

    const editClient = (client) => {
        form.setData({
            id: client.id,
            name: client.name ?? '',
            email: client.email ?? '',
            phone: client.phone ?? '',
            notes: client.notes ?? '',
        });
        form.clearErrors();
    };

    const cancelEdit = () => {
        form.reset();
        form.clearErrors();
    };

    return (
        <TenantLayout>
            <Head title="Clients" />

            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-white md:text-3xl">
                                    ClientHub
                                </h1>
                                <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Gestion multi-tenant
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={route('tenant.reservations.create')}
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700"
                            >
                                <svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Nouvelle reservation
                            </Link>

                            <Link
                                href={route('tenant.clients.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau client
                            </Link>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr] xl:gap-8">
                        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/80 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                            <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 pb-4 pt-5 dark:border-gray-700 sm:px-7 sm:pt-7">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                            Relation client
                                        </span>
                                    </div>
                                    <h2 className="mt-1 text-2xl font-bold text-stone-800 dark:text-white">Clients</h2>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        Gereez votre carnet d adresses
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto px-0 py-2 custom-scrollbar">
                                <table className="min-w-full divide-y divide-stone-200 dark:divide-gray-700">
                                    <thead className="bg-stone-50/70 dark:bg-gray-900/40">
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Contact</th>
                                            <th className="px-6 py-4 text-center">Reserv.</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 bg-white/50 dark:divide-gray-800 dark:bg-transparent">
                                        {clients.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-stone-400 dark:text-stone-500">
                                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                        </svg>
                                                        <p className="text-sm">Aucun client pour le moment.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            clients.map((client) => (
                                                <tr key={client.id} className="group transition-colors duration-150 hover:bg-stone-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                                {client.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-stone-800 dark:text-white">
                                                                    {client.name}
                                                                </div>
                                                                {client.notes && (
                                                                    <div className="mt-0.5 line-clamp-1 max-w-[180px] text-xs text-stone-400 dark:text-stone-500">
                                                                        {client.notes.substring(0, 45)}{client.notes.length > 45 ? '...' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm text-stone-700 dark:text-stone-300">{client.phone || '-'}</span>
                                                            {client.email && (
                                                                <span className="text-xs text-stone-500 dark:text-stone-400">{client.email}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                            {client.reservations_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => editClient(client)}
                                                                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm transition-all hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-stone-300 dark:hover:bg-amber-900/20"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <Link
                                                                href={route('tenant.clients.destroy', client.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
                                                            >
                                                                Supprimer
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {form.data.id ? (
                            <div className="overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/90 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                                <div className="p-5 sm:p-7">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="mb-1 flex items-center gap-2">
                                                <svg className="h-4 w-4 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                    Edition
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-stone-800 dark:text-white">
                                                Modifier le client
                                            </h3>
                                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                                Mettez a jour les informations du client selectionne
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="mt-6 space-y-5">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nom complet" />
                                            <TextInput
                                                id="name"
                                                value={form.data.name}
                                                className="mt-1 block w-full rounded-xl border-stone-200 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900"
                                                onChange={(event) => form.setData('name', event.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <InputLabel htmlFor="phone" value="Telephone" />
                                                <TextInput
                                                    id="phone"
                                                    value={form.data.phone}
                                                    className="mt-1 block w-full rounded-xl border-stone-200 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900"
                                                    onChange={(event) => form.setData('phone', event.target.value)}
                                                />
                                                <InputError message={form.errors.phone} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="email" value="Adresse e-mail" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    value={form.data.email}
                                                    className="mt-1 block w-full rounded-xl border-stone-200 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900"
                                                    onChange={(event) => form.setData('email', event.target.value)}
                                                />
                                                <InputError message={form.errors.email} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="notes" value="Notes internes" />
                                            <textarea
                                                id="notes"
                                                value={form.data.notes}
                                                onChange={(event) => form.setData('notes', event.target.value)}
                                                rows="4"
                                                className="mt-1 block w-full rounded-xl border-stone-200 shadow-sm focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            />
                                            <InputError message={form.errors.notes} className="mt-2" />
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-100 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700"
                                            >
                                                Annuler
                                            </button>
                                            <PrimaryButton
                                                disabled={form.processing}
                                                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                                            >
                                                Enregistrer
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/90 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                                <div className="p-6 sm:p-7">
                                    <div className="rounded-2xl bg-stone-50 p-5 text-center ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                                        <p className="text-sm uppercase tracking-[0.18em] text-amber-700">Edition</p>
                                        <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
                                            Selectionnez un client
                                        </h3>
                                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                                            Cliquez sur Modifier dans le tableau pour afficher son formulaire d edition ici.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </TenantLayout>
    );
}
