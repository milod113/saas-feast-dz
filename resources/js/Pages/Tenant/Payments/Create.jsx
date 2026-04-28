// resources/js/Pages/Tenant/Payments/Create.jsx

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const paymentMethodIcons = {
    cash: '💰',
    bank_transfer: '🏦',
    ccp: '📮',
    cheque: '📝',
};

const paymentMethodLabels = {
    cash: 'Espèces',
    bank_transfer: 'Virement bancaire',
    ccp: 'CCP',
    cheque: 'Chèque',
};

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function Create({ reservations, paymentMethods, tenant }) {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const form = useForm({
        reservation_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        notes: '',
        status: '',
        method: '',
        reservation_id_filter: '',
    });

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

    useEffect(() => {
        const reservation = reservations.find(r => r.id == form.data.reservation_id);
        setSelectedReservation(reservation);
    }, [form.data.reservation_id, reservations]);

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

    const submit = (e) => {
        e.preventDefault();
        form.post(route('tenant.payments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setSelectedReservation(null);
            },
        });
    };

    const remainingAfterPayment = () => {
        if (!selectedReservation) return 0;
        const amount = parseFloat(form.data.amount) || 0;
        const remaining = selectedReservation.remaining_balance - amount;
        return Math.max(0, remaining);
    };

    const isOverPayment = () => {
        if (!selectedReservation) return false;
        const amount = parseFloat(form.data.amount) || 0;
        return amount > selectedReservation.remaining_balance;
    };

    return (
        <TenantLayout>
            <Head title={`Nouveau paiement - ${tenant?.name || 'Dashboard'}`} />

            <div className="min-h-screen bg-gradient-to-br from-stone-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
                <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('tenant.payments.index')}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm transition-all hover:bg-stone-100 dark:bg-gray-800 dark:text-stone-300 dark:hover:bg-gray-700"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                                        Nouveau
                                    </span>
                                </div>
                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-800 dark:text-white">
                                    Nouveau paiement
                                </h1>
                                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                    Enregistrez un versement pour une réservation existante
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

                    {/* Form Card */}
                    <div className="overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/90 md:rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
                        <form onSubmit={submit} className="p-6 sm:p-8">
                            {/* Hidden filter fields to preserve navigation */}
                            <input type="hidden" name="status" value={form.data.status} />
                            <input type="hidden" name="method" value={form.data.method} />
                            <input type="hidden" name="reservation_id_filter" value={form.data.reservation_id_filter} />

                            {/* Reservation Selection */}
                            <div className="mb-6">
                                <InputLabel htmlFor="reservation_id" value="Réservation *" />
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <select
                                        id="reservation_id"
                                        value={form.data.reservation_id}
                                        onChange={(e) => form.setData('reservation_id', e.target.value)}
                                        className="block w-full rounded-xl border-stone-200 bg-white pl-10 pr-4 py-2.5 text-stone-800 shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Sélectionner une réservation</option>
                                        {reservations.map((reservation) => (
                                            <option key={reservation.id} value={reservation.id}>
                                                {reservation.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={form.errors.reservation_id} className="mt-2" />
                            </div>

                            {/* Reservation Summary Card */}
                            {selectedReservation && (
                                <div className="mb-8 overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/20">
                                    <div className="border-b border-amber-200 bg-amber-100/50 px-4 py-3 dark:border-amber-800/30 dark:bg-amber-900/30">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                                Détails de la réservation
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-medium text-stone-900 dark:text-white">
                                            {selectedReservation.label}
                                        </p>
                                        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-stone-600 dark:text-stone-300">
                                                    Total: <span className="font-semibold">{formatCurrency(selectedReservation.total_price)} DZD</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-stone-600 dark:text-stone-300">
                                                    Déjà payé: <span className="font-semibold">{formatCurrency(selectedReservation.paid_amount)} DZD</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-stone-600 dark:text-stone-300">
                                                    Restant dû: <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(selectedReservation.remaining_balance)} DZD</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Amount and Date Grid */}
                            <div className="mb-6 grid gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel htmlFor="amount" value="Montant (DZD) *" />
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg className="h-5 w-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.data.amount}
                                            className={`block w-full rounded-xl border-stone-200 pl-10 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white ${
                                                isOverPayment() ? 'border-rose-500 ring-rose-500' : ''
                                            }`}
                                            onChange={(e) => form.setData('amount', e.target.value)}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {isOverPayment() && (
                                        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                                            ⚠️ Le montant dépasse le solde restant dû
                                        </p>
                                    )}
                                    {selectedReservation && !isOverPayment() && parseFloat(form.data.amount) > 0 && (
                                        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                            ✅ Après ce paiement, il restera {formatCurrency(remainingAfterPayment())} DZD
                                        </p>
                                    )}
                                    <InputError message={form.errors.amount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_date" value="Date du paiement *" />
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg className="h-5 w-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="payment_date"
                                            type="date"
                                            value={form.data.payment_date}
                                            className="block w-full rounded-xl border-stone-200 pl-10 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            onChange={(e) => form.setData('payment_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={form.errors.payment_date} className="mt-2" />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-6">
                                <InputLabel htmlFor="payment_method" value="Mode de paiement *" />
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <select
                                        id="payment_method"
                                        value={form.data.payment_method}
                                        onChange={(e) => form.setData('payment_method', e.target.value)}
                                        className="block w-full rounded-xl border-stone-200 bg-white pl-10 pr-4 py-2.5 text-stone-800 shadow-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        required
                                    >
                                        {paymentMethods.map((method) => (
                                            <option key={method.value} value={method.value}>
                                                {paymentMethodIcons[method.value]} {method.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={form.errors.payment_method} className="mt-2" />
                            </div>

                            {/* Notes */}
                            <div className="mb-8">
                                <InputLabel htmlFor="notes" value="Notes" />
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute left-3 top-3">
                                        <svg className="h-5 w-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <textarea
                                        id="notes"
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows="3"
                                        className="block w-full rounded-xl border-stone-200 pl-10 focus:border-amber-400 focus:ring-amber-400/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        placeholder="Référence de transaction, informations complémentaires..."
                                    />
                                </div>
                                <InputError message={form.errors.notes} className="mt-2" />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 dark:border-gray-700 sm:flex-row sm:justify-end">
                                <Link
                                    href={route('tenant.payments.index')}
                                    className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-50 dark:border-gray-600 dark:bg-gray-800 dark:text-stone-200 dark:hover:bg-gray-700"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Annuler
                                </Link>
                                <PrimaryButton
                                    disabled={form.processing || isOverPayment()}
                                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    {form.processing ? (
                                        <>
                                            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Enregistrer le paiement
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Informations</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Le statut de la réservation sera automatiquement mis à jour (Partiel/Payé) en fonction du montant total encaissé.
                                    Vous ne pouvez pas dépasser le montant total restant dû.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}