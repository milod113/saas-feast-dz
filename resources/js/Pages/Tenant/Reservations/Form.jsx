import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link } from '@inertiajs/react';

export default function FormPage({
    title,
    form,
    submitLabel,
    submit,
    clients,
    statuses,
    mode,
    reservation = null,
}) {
    const total = Number(form.data.total_price || 0);
    const initialPayment = Number(form.data.initial_payment_amount || 0);
    const remaining = Math.max(total - initialPayment, 0);
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';

    const formatCurrency = (value) =>
        `${new Intl.NumberFormat('fr-DZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)} DZD`;

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mx-auto max-w-4xl space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white shadow-lg shadow-orange-200 dark:shadow-none sm:px-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-100">
                                Reservations
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                {title}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-orange-50 sm:text-base">
                                {isCreate
                                    ? 'Creez une nouvelle reservation, ajoutez un premier paiement si besoin et suivez le solde restant.'
                                    : 'Mettez a jour les informations de la reservation et accedez rapidement au suivi des paiements.'}
                            </p>
                        </div>

                        <Link
                            href={route('tenant.reservations.index')}
                            className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
                        >
                            Retour
                        </Link>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                        className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-8"
                    >
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Informations principales
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-stone-950 dark:text-stone-100">
                                Fiche reservation
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="client_id" value="Client" />
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <select
                                        id="client_id"
                                        value={form.data.client_id}
                                        onChange={(event) => form.setData('client_id', event.target.value)}
                                        className="block w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        required
                                    >
                                        <option value="">Selectionner un client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                                {client.phone ? ` - ${client.phone}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={form.errors.client_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="event_date" value="Date de l evenement" />
                                <TextInput
                                    id="event_date"
                                    type="date"
                                    value={form.data.event_date}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    onChange={(event) => form.setData('event_date', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.event_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Statut" />
                                <select
                                    id="status"
                                    value={form.data.status}
                                    onChange={(event) => form.setData('status', event.target.value)}
                                    className="mt-1 block w-full rounded-xl border border-stone-300 bg-white py-3 px-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                    required
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.status} className="mt-2" />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="total_price" value="Montant total (DZD)" />
                                <TextInput
                                    id="total_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.total_price}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    onChange={(event) => form.setData('total_price', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.total_price} className="mt-2" />
                            </div>
                        </div>

                        {isCreate ? (
                            <div className="mt-8 rounded-[1.5rem] bg-gradient-to-r from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200 dark:from-amber-950/30 dark:to-orange-950/20 dark:ring-amber-900/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                                        <WalletIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Premier paiement optionnel
                                        </p>
                                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                            Enregistrez un acompte des la creation si le client a deja verse une avance.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="initial_payment_amount" value="Montant du paiement (DZD)" />
                                        <TextInput
                                            id="initial_payment_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.data.initial_payment_amount}
                                            className="mt-1 block w-full rounded-xl py-3"
                                            onChange={(event) => form.setData('initial_payment_amount', event.target.value)}
                                        />
                                        <InputError message={form.errors.initial_payment_amount} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="initial_payment_date" value="Date du paiement" />
                                        <TextInput
                                            id="initial_payment_date"
                                            type="date"
                                            value={form.data.initial_payment_date}
                                            className="mt-1 block w-full rounded-xl py-3"
                                            onChange={(event) => form.setData('initial_payment_date', event.target.value)}
                                        />
                                        <InputError message={form.errors.initial_payment_date} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="initial_payment_method" value="Mode du premier paiement" />
                                        <select
                                            id="initial_payment_method"
                                            value={form.data.initial_payment_method}
                                            onChange={(event) => form.setData('initial_payment_method', event.target.value)}
                                            className="mt-1 block w-full rounded-xl border border-stone-300 bg-white py-3 px-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        >
                                            <option value="cash">Especes</option>
                                            <option value="bank_transfer">Virement bancaire</option>
                                            <option value="ccp">CCP</option>
                                            <option value="cheque">Cheque</option>
                                        </select>
                                        <InputError message={form.errors.initial_payment_method} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Paiements deja encaisses
                                        </p>
                                        <p className="mt-2 text-3xl font-semibold text-stone-950 dark:text-stone-100">
                                            {formatCurrency(Number(reservation?.paid_amount ?? 0))}
                                        </p>
                                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                            Reste a payer: {formatCurrency(Number(reservation?.remaining_balance ?? 0))}
                                        </p>
                                    </div>

                                    <Link
                                        href={route('tenant.payments.index', { reservation_id: reservation?.id })}
                                        className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400"
                                    >
                                        Gerer les paiements
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <PrimaryButton disabled={form.processing}>{submitLabel}</PrimaryButton>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Resume financier
                            </p>
                            <div className="mt-5 space-y-4">
                                <MetricCard
                                    label="Montant total"
                                    value={formatCurrency(total)}
                                    tone="stone"
                                />
                                <MetricCard
                                    label={isCreate ? 'Premier paiement' : 'Montant encaisse'}
                                    value={formatCurrency(isCreate ? initialPayment : Number(reservation?.paid_amount ?? 0))}
                                    tone="amber"
                                />
                                <MetricCard
                                    label="Reste a payer"
                                    value={formatCurrency(isCreate ? remaining : Number(reservation?.remaining_balance ?? 0))}
                                    tone="emerald"
                                />
                            </div>
                        </section>

                        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Bonnes pratiques
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Verifiez la disponibilite de la date avant confirmation.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Ajoutez un premier paiement uniquement si une avance a deja ete recue.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Le solde restant sera mis a jour automatiquement via le module Paiements.</span>
                                </li>
                            </ul>
                        </section>

                        {isEdit && reservation && (
                            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Reservation
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                                    <p>
                                        <span className="font-medium text-stone-900 dark:text-stone-100">Client:</span>{' '}
                                        {reservation.client_name}
                                    </p>
                                    <p>
                                        <span className="font-medium text-stone-900 dark:text-stone-100">Etat:</span>{' '}
                                        {statuses.find((status) => status.value === reservation.status)?.label ?? reservation.status}
                                    </p>
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </TenantLayout>
    );
}

function MetricCard({ label, value, tone }) {
    const tones = {
        stone: 'bg-stone-50 text-stone-900 ring-stone-200 dark:bg-stone-950 dark:text-stone-100 dark:ring-stone-800',
        amber: 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900/40',
        emerald: 'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900/40',
    };

    return (
        <div className={`rounded-2xl p-4 ring-1 ${tones[tone]}`}>
            <p className="text-sm opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

function UserIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}

function WalletIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5v9A2.25 2.25 0 0 1 18.75 18.75H5.25A2.25 2.25 0 0 1 3 16.5v-9A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12h.008v.008H16.5V12Zm-13.5-4.5 11.53-3.295A1.5 1.5 0 0 1 16.5 5.648V5.25" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}
