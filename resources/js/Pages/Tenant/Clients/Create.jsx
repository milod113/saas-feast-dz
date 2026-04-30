// resources/js/Pages/Tenant/Clients/Index.jsx (Enhanced with Create mode)

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ clients = [] }) {
    const { flash, tenant } = usePage().props;
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const submit = () => {
        form.post(route('tenant.clients.store'), {
            onSuccess: () => {
                form.reset();
                setShowCreateForm(false);
            },
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
        setShowCreateForm(false);
    };

    const cancelCreate = () => {
        form.reset();
        form.clearErrors();
        setShowCreateForm(false);
    };

    return (
        <TenantLayout>
            <Head title={`Clients - ${tenant.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800 dark:text-white">
                                    Clients
                                </h1>
                                <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {tenant.name}
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
                                Réservation
                            </Link>
                            
                            {!showCreateForm && (
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nouveau client
                                </button>
                            )}
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

                    <div className="grid gap-6">
                        {/* Create Form (conditionally shown) */}
                        {showCreateForm && (
                            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl backdrop-blur-sm transition-all duration-300 dark:from-gray-800/90 dark:to-gray-800/70 md:rounded-3xl ring-1 ring-amber-200 dark:ring-amber-900/30">
                                <div className="p-6 sm:p-8">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-stone-800 dark:text-white">
                                                Nouveau client
                                            </h2>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                                                Remplissez les informations pour ajouter un client
                                            </p>
                                        </div>
                                        <button
                                            onClick={cancelCreate}
                                            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-gray-700"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={submit} className="space-y-5">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nom complet *" />
                                            <TextInput
                                                id="name"
                                                value={form.data.name}
                                                className="mt-1 block w-full rounded-xl"
                                                onChange={(e) => form.setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <InputLabel htmlFor="phone" value="Téléphone" />
                                                <TextInput
                                                    id="phone"
                                                    value={form.data.phone}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                />
                                                <InputError message={form.errors.phone} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="email" value="E-mail" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    value={form.data.email}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => form.setData('email', e.target.value)}
                                                />
                                                <InputError message={form.errors.email} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="notes" value="Notes" />
                                            <textarea
                                                id="notes"
                                                value={form.data.notes}
                                                onChange={(e) => form.setData('notes', e.target.value)}
                                                rows="3"
                                                className="mt-1 block w-full rounded-xl border-stone-200 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900"
                                                placeholder="Informations supplémentaires..."
                                            />
                                            <InputError message={form.errors.notes} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={cancelCreate}
                                                className="rounded-xl border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200"
                                            >
                                                Annuler
                                            </button>
                                            <PrimaryButton
                                                disabled={form.processing}
                                                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2 text-sm font-semibold"
                                            >
                                                {form.processing ? 'Création...' : 'Créer le client'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Clients Table */}
                        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                            {/* ... rest of your table component ... */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-stone-200 dark:divide-gray-700">
                                    <thead className="bg-stone-50/70 dark:bg-gray-900/40">
                                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Contact</th>
                                            <th className="px-6 py-4 text-center">Réserv.</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-gray-800">
                                        {clients.map((client) => (
                                            <tr key={client.id} className="hover:bg-stone-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-stone-900 dark:text-white">{client.name}</div>
                                                    {client.notes && (
                                                        <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                            {client.notes.substring(0, 50)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>{client.phone || '-'}</div>
                                                    <div className="text-xs text-stone-500 dark:text-stone-400">{client.email || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                        {client.reservations_count || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => editClient(client)}
                                                            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <Link
                                                            href={route('tenant.clients.destroy', client.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-400"
                                                        >
                                                            Supprimer
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
