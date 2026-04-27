import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const statusClasses = {
    confirmed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    pending: 'bg-amber-100 text-amber-800 ring-amber-200',
    cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
};

const statusLabels = {
    confirmed: 'Confirmee',
    pending: 'En attente',
    cancelled: 'Annulee',
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

export default function Index({ reservations, filters }) {
    const { flash } = usePage().props;

    const handleStatusFilter = (value) => {
        router.get(
            route('tenant.reservations.index'),
            value ? { status: value } : {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <TenantLayout>
            <Head title="Reservations" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                            Exploitation
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
                            Reservations
                        </h1>
                        <p className="mt-2 text-sm text-stone-500">
                            Suivez toutes les dates reservees et gerez vos confirmations.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={filters.status}
                            onChange={(event) => handleStatusFilter(event.target.value)}
                            className="rounded-2xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmee</option>
                            <option value="cancelled">Annulee</option>
                        </select>

                        <Link
                            href={route('tenant.reservations.create')}
                            className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                        >
                            Nouvelle reservation
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
                        {flash.success}
                    </div>
                )}

                <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200">
                            <thead className="bg-stone-50">
                                <tr className="text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Avance</th>
                                    <th className="px-6 py-4">Reste</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-stone-500">
                                            Aucune reservation trouvee.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((reservation) => (
                                        <tr key={reservation.id} className="text-sm text-stone-700">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-stone-900">
                                                    {reservation.client_name}
                                                </div>
                                                <div className="text-xs text-stone-500">
                                                    {reservation.client?.phone ?? reservation.client?.email ?? 'Client lie'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{formatDate(reservation.event_date)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[reservation.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'}`}>
                                                    {statusLabels[reservation.status] ?? reservation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-900">
                                                {formatCurrency(reservation.total_price)}
                                            </td>
                                            <td className="px-6 py-4">{formatCurrency(reservation.advance_amount)}</td>
                                            <td className="px-6 py-4 font-medium text-stone-900">
                                                {formatCurrency(reservation.remaining_balance)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Link
                                                        href={route('tenant.reservations.edit', reservation.id)}
                                                        className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <Link
                                                        href={route('tenant.reservations.destroy', reservation.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="rounded-full border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
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
