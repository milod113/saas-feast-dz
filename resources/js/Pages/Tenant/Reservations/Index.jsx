import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const reservationStatusClasses = {
    confirmed: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800',
    pending: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800',
    cancelled: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-800',
};

const reservationStatusLabels = {
    confirmed: 'Confirmée',
    pending: 'En attente',
    cancelled: 'Annulée',
};

const paymentStatusClasses = {
    paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800',
    partial: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800',
    unpaid: 'bg-stone-200 text-stone-700 ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700',
};

const paymentStatusLabels = {
    paid: 'Payé',
    partial: 'Partiel',
    unpaid: 'Non payé',
};

function formatDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function Index({ reservations, filters, tenant }) {
    const { flash } = usePage().props;
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleStatusFilter = (value) => {
        router.get(
            route('tenant.reservations.index'),
            value ? { status: value } : {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <TenantLayout>
            <Head title={`Réservations - ${tenant?.name || 'Dashboard'}`} />

            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header with theme toggle */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-800 dark:text-white">
                                    Réservations
                                </h1>
                                <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {tenant?.name || 'Gestion des réservations'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className="relative h-10 w-20 rounded-full bg-stone-200 dark:bg-stone-700 shadow-inner transition-all duration-300"
                        >
                            <span className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${darkMode ? 'translate-x-10 dark:bg-amber-400' : ''}`}>
                                {!darkMode ? (
                                    <svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Filters and Actions */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <div className="relative max-w-xs">
                                <select
                                    value={filters.status}
                                    onChange={(event) => handleStatusFilter(event.target.value)}
                                    className="w-full rounded-xl border-stone-200 bg-white/80 py-2.5 pl-4 pr-10 text-sm shadow-sm backdrop-blur-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white"
                                >
                                    <option value="">📋 Tous les statuts</option>
                                    <option value="pending">⏳ En attente</option>
                                    <option value="confirmed">✅ Confirmée</option>
                                    <option value="cancelled">❌ Annulée</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('tenant.reservations.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nouvelle réservation
                        </Link>
                    </div>

                    {/* Flash Message */}
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

                    {/* Reservations Table */}
                    <div className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/80 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="min-w-full divide-y divide-stone-200 dark:divide-gray-700">
                                <thead className="bg-stone-50/70 dark:bg-gray-900/40">
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Paiement</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4 text-right">Encaisse</th>
                                        <th className="px-6 py-4 text-right">Reste</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 bg-white/50 dark:divide-gray-800 dark:bg-transparent">
                                    {reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3 text-stone-400 dark:text-stone-500">
                                                    <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm">Aucune réservation trouvée.</p>
                                                    <Link
                                                        href={route('tenant.reservations.create')}
                                                        className="mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:shadow-lg"
                                                    >
                                                        Créer une réservation
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        reservations.map((reservation) => (
                                            <tr key={reservation.id} className="group transition-colors duration-150 hover:bg-stone-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                            {reservation.client_name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-stone-900 dark:text-white">
                                                                {reservation.client_name}
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                                                {reservation.client?.phone || reservation.client?.email || 'Client lié'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm text-stone-700 dark:text-stone-300">
                                                            {formatDate(reservation.event_date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${reservationStatusClasses[reservation.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-300'}`}>
                                                        {reservationStatusLabels[reservation.status] ?? reservation.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${paymentStatusClasses[reservation.payment_status] ?? 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-300'}`}>
                                                        {paymentStatusLabels[reservation.payment_status] ?? reservation.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="font-medium text-stone-900 dark:text-white">
                                                        {formatCurrency(reservation.total_price)} DZD
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-stone-700 dark:text-stone-300">
                                                    {formatCurrency(reservation.paid_amount)} DZD
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`font-semibold ${reservation.remaining_balance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                        {formatCurrency(reservation.remaining_balance)} DZD
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('tenant.payments.index', { reservation_id: reservation.id })}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-all hover:bg-sky-100 dark:border-sky-800/40 dark:bg-sky-950/20 dark:text-sky-400 dark:hover:bg-sky-950/30"
                                                        >
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Paiements
                                                        </Link>
                                                        <Link
                                                            href={route('tenant.reservations.edit', reservation.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm transition-all hover:bg-stone-50 dark:border-gray-700 dark:bg-gray-800 dark:text-stone-300 dark:hover:bg-gray-700"
                                                        >
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Modifier
                                                        </Link>
                                                        <Link
                                                            href={route('tenant.reservations.destroy', reservation.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                                        >
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
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

                    {/* Summary Cards */}
                    {reservations.length > 0 && (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-white/80 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/80 ring-1 ring-black/5 dark:ring-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            Total des réservations
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-stone-800 dark:text-white">
                                            {reservations.length}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                                        <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white/80 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/80 ring-1 ring-black/5 dark:ring-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            Chiffre d'affaires
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-stone-800 dark:text-white">
                                            {formatCurrency(reservations.reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0))} DZD
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">
                                        <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white/80 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/80 ring-1 ring-black/5 dark:ring-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            Taux d'occupation
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-stone-800 dark:text-white">
                                            {Math.round((reservations.filter(r => r.status === 'confirmed').length / reservations.length) * 100)}%
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white/80 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/80 ring-1 ring-black/5 dark:ring-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            En attente
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-stone-800 dark:text-white">
                                            {reservations.filter(r => r.status === 'pending').length}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                                        <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
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
            `}</style>
        </TenantLayout>
    );
}