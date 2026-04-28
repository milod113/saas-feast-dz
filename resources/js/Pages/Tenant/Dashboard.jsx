import { Head } from '@inertiajs/react';
import TenantLayout from '../../Layouts/TenantLayout';

const statusClasses = {
    confirmed: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    cancelled: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
};

const statusLabels = {
    confirmed: 'Confirmee',
    pending: 'En attente',
    cancelled: 'Annulee',
};

const paymentStatusClasses = {
    paid: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    partial: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
    unpaid: 'bg-stone-200 text-stone-700 ring-1 ring-stone-300',
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

export default function Dashboard({ stats, recentReservations }) {
    return (
        <TenantLayout>
            <Head title="Tableau de bord" />

            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white shadow-lg shadow-orange-200 sm:px-8">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-100">
                        Vue d&apos;ensemble
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                        Tableau de bord
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-orange-50 sm:text-base">
                        Suivez vos reservations, votre chiffre d&apos;affaires et les
                        dernieres activites de votre salle des fetes.
                    </p>
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-stone-900">Statistiques</h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Les indicateurs cles de votre activite.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                            <p className="text-sm font-medium text-stone-500">
                                Total des reservations
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {stats.totalReservations}
                            </p>
                        </article>

                        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                            <p className="text-sm font-medium text-stone-500">
                                Chiffre d&apos;affaires confirme
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                        </article>

                        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                            <p className="text-sm font-medium text-stone-500">
                                Montant encaisse
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {formatCurrency(stats.totalCollected)}
                            </p>
                        </article>

                        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                            <p className="text-sm font-medium text-stone-500">
                                Reste a encaisser
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {formatCurrency(stats.outstandingBalance)}
                            </p>
                        </article>
                    </div>
                </section>

                <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
                        <div>
                            <h2 className="text-xl font-semibold text-stone-900">
                                Dernieres reservations
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                                Les 5 reservations les plus recentes.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200">
                            <thead className="bg-stone-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date de l&apos;evenement</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Paiement</th>
                                    <th className="px-6 py-4">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                                {recentReservations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-stone-500"
                                        >
                                            Aucune reservation pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    recentReservations.map((reservation) => (
                                        <tr key={reservation.id} className="text-sm text-stone-700">
                                            <td className="px-6 py-4 font-medium text-stone-900">
                                                {reservation.client_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(reservation.event_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusClasses[reservation.status] ??
                                                        'bg-stone-100 text-stone-700 ring-1 ring-stone-200'
                                                    }`}
                                                >
                                                    {statusLabels[reservation.status] ?? reservation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusClasses[reservation.payment_status] ?? 'bg-stone-100 text-stone-700 ring-1 ring-stone-200'}`}>
                                                    {reservation.payment_status === 'paid' ? 'Paye' : reservation.payment_status === 'partial' ? 'Partiel' : 'Non paye'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-stone-900">
                                                {formatCurrency(reservation.total_price)}
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
