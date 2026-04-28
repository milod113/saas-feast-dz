import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const paymentStatusClasses = {
    paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800',
    partial: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800',
    unpaid: 'bg-stone-200 text-stone-700 ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700',
};

const paymentStatusLabels = {
    paid: 'Paye',
    partial: 'Partiel',
    unpaid: 'Non paye',
};

const paymentMethodLabels = {
    cash: 'Especes',
    bank_transfer: 'Virement bancaire',
    ccp: 'CCP',
    cheque: 'Cheque',
};

function formatDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

function formatCurrency(value) {
    return `${new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)} DZD`;
}

export default function Index({ filters, payments, reservations, paymentMethods, paymentStatuses, stats, tenant }) {
    const { flash } = usePage().props;

    const handleFilterChange = (nextFilters) => {
        router.get(route('tenant.payments.index'), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <TenantLayout>
            <Head title={`Paiements - ${tenant?.name || 'Dashboard'}`} />

            <div className="space-y-6">
                <section className="rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white shadow-lg shadow-orange-200 dark:shadow-none sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-100">
                                Tresorerie
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                Paiements
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-orange-50 sm:text-base">
                                Suivez les encaissements de vos reservations et gerez chaque versement depuis des pages dediees.
                            </p>
                        </div>

                        <Link
                            href={route('tenant.payments.create', {
                                status: filters.status,
                                method: filters.method,
                                reservation_id: filters.reservation_id,
                            })}
                            className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
                        >
                            Nouveau paiement
                        </Link>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Encaisse total" value={formatCurrency(stats.totalCollected)} tone="emerald" />
                    <StatCard label="Reservations non payees" value={stats.unpaidReservations} tone="rose" />
                    <StatCard label="Paiements partiels" value={stats.partialReservations} tone="sky" />
                    <StatCard label="Versements" value={payments.length} tone="stone" />
                </section>

                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900">
                        {flash.success}
                    </div>
                )}

                <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                    <div className="grid gap-3 md:grid-cols-4">
                        <select
                            value={filters.status}
                            onChange={(event) => handleFilterChange({
                                status: event.target.value,
                                method: filters.method,
                                reservation_id: filters.reservation_id,
                            })}
                            className="rounded-xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        >
                            <option value="">Tous les paiements</option>
                            {paymentStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.method}
                            onChange={(event) => handleFilterChange({
                                status: filters.status,
                                method: event.target.value,
                                reservation_id: filters.reservation_id,
                            })}
                            className="rounded-xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        >
                            <option value="">Tous les modes</option>
                            {paymentMethods.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.reservation_id}
                            onChange={(event) => handleFilterChange({
                                status: filters.status,
                                method: filters.method,
                                reservation_id: event.target.value,
                            })}
                            className="rounded-xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        >
                            <option value="">Toutes les reservations</option>
                            {reservations.map((reservation) => (
                                <option key={reservation.id} value={reservation.id}>
                                    {reservation.label}
                                </option>
                            ))}
                        </select>

                        <Link
                            href={route('tenant.reservations.index')}
                            className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            Voir les reservations
                        </Link>
                    </div>
                </section>

                <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
                            <thead className="bg-stone-50 dark:bg-stone-950/60">
                                <tr className="text-left text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                                    <th className="px-6 py-4">Reservation</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Mode</th>
                                    <th className="px-6 py-4">Montant</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white dark:divide-stone-800 dark:bg-stone-900">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-sm text-stone-500 dark:text-stone-400">
                                            Aucun paiement trouve.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="text-sm text-stone-700 dark:text-stone-300">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-stone-900 dark:text-stone-100">
                                                    {payment.reservation?.client_name ?? 'Reservation'}
                                                </div>
                                                {payment.reservation?.event_date && (
                                                    <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                        Evenement: {formatDate(payment.reservation.event_date)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{formatDate(payment.payment_date)}</td>
                                            <td className="px-6 py-4">
                                                {paymentMethodLabels[payment.payment_method] ?? payment.payment_method}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-900 dark:text-stone-100">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${paymentStatusClasses[payment.reservation?.payment_status] ?? 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700'}`}>
                                                        {paymentStatusLabels[payment.reservation?.payment_status] ?? 'Inconnu'}
                                                    </span>
                                                    <span className="text-xs text-stone-500 dark:text-stone-400">
                                                        Reste: {formatCurrency(payment.reservation?.remaining_balance ?? 0)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        href={route('tenant.payments.edit', {
                                                            payment: payment.id,
                                                            status: filters.status,
                                                            method: filters.method,
                                                            reservation_id: filters.reservation_id,
                                                        })}
                                                        className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <Link
                                                        href={route('tenant.payments.destroy', payment.id)}
                                                        method="delete"
                                                        as="button"
                                                        data={{
                                                            status: filters.status,
                                                            method: filters.method,
                                                            reservation_id_filter: filters.reservation_id,
                                                        }}
                                                        className="rounded-full border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/30"
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
                </section>
            </div>
        </TenantLayout>
    );
}

function StatCard({ label, value, tone }) {
    const tones = {
        emerald: 'bg-white text-stone-900 ring-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800',
        rose: 'bg-white text-stone-900 ring-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800',
        sky: 'bg-white text-stone-900 ring-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800',
        stone: 'bg-white text-stone-900 ring-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800',
    };

    return (
        <article className={`rounded-[1.5rem] p-5 shadow-sm ring-1 ${tones[tone]}`}>
            <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
        </article>
    );
}
