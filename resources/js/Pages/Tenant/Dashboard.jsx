import { Head, Link } from '@inertiajs/react';
import TenantLayout from '../../Layouts/TenantLayout';

const statusClasses = {
    confirmed: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
    pending: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20',
    cancelled: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20',
};

const statusLabels = {
    confirmed: 'Confirmee',
    pending: 'En attente',
    cancelled: 'Annulee',
};

const paymentStatusClasses = {
    paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
    partial: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/20',
    unpaid: 'bg-stone-200 text-stone-700 ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700',
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
    const collectionRate = stats.totalRevenue > 0
        ? Math.min(100, Math.round((stats.totalCollected / stats.totalRevenue) * 100))
        : 0;

    return (
        <TenantLayout>
            <Head title="Tableau de bord" />

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20">
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">
                                Vue d ensemble
                            </p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Tableau de bord de votre salle.
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-orange-50 sm:text-base">
                                Reservations, revenus et encaissements dans une lecture rapide inspiree des interfaces de messagerie.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href={route('tenant.reservations.create')} className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-orange-50">
                                    Nouvelle reservation
                                </Link>
                                <Link href={route('tenant.calendar.index')} className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18">
                                    Ouvrir le calendrier
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/12 p-5 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-100">Encaissement</p>
                                    <p className="mt-1 text-3xl font-extrabold">{collectionRate}%</p>
                                </div>
                                <PaymentIcon className="h-10 w-10 text-orange-100" />
                            </div>
                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/16">
                                <div
                                    className="h-full rounded-full bg-white"
                                    style={{ width: `${collectionRate}%` }}
                                />
                            </div>
                            <p className="mt-3 text-sm text-orange-50">
                                {formatCurrency(stats.totalCollected)} encaisses sur {formatCurrency(stats.totalRevenue)} confirmes.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Reservations" value={stats.totalReservations} icon={CalendarIcon} />
                    <StatCard title="CA confirme" value={formatCurrency(stats.totalRevenue)} icon={ChartIcon} />
                    <StatCard title="Montant encaisse" value={formatCurrency(stats.totalCollected)} icon={PaymentIcon} tone="emerald" />
                    <StatCard title="Reste a encaisser" value={formatCurrency(stats.outstandingBalance)} icon={AlertIcon} tone="amber" />
                </section>

                <section className="salla-panel overflow-hidden">
                    <div className="flex flex-col gap-4 border-b border-stone-200/80 px-6 py-5 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-stone-950 dark:text-white">
                                Dernieres reservations
                            </h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                Les 5 reservations les plus recentes.
                            </p>
                        </div>
                        <Link
                            href={route('tenant.reservations.index')}
                            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                        >
                            Voir toutes
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
                            <thead className="bg-stone-50/80 dark:bg-stone-950/70">
                                <tr className="text-left text-xs font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Paiement</th>
                                    <th className="px-6 py-4">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white/60 dark:divide-stone-800 dark:bg-stone-900/30">
                                {recentReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-stone-500 dark:text-stone-400">
                                            Aucune reservation pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    recentReservations.map((reservation) => (
                                        <tr key={reservation.id} className="text-sm text-stone-700 transition hover:bg-amber-50/70 dark:text-stone-300 dark:hover:bg-amber-500/5">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                                        {reservation.client_name?.charAt(0).toUpperCase() ?? '?'}
                                                    </div>
                                                    <span className="font-semibold text-stone-950 dark:text-white">
                                                        {reservation.client_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{formatDate(reservation.event_date)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses[reservation.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'}`}>
                                                    {statusLabels[reservation.status] ?? reservation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${paymentStatusClasses[reservation.payment_status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'}`}>
                                                    {reservation.payment_status === 'paid' ? 'Paye' : reservation.payment_status === 'partial' ? 'Partiel' : 'Non paye'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-stone-950 dark:text-white">
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

function StatCard({ title, value, icon: Icon, tone = 'stone' }) {
    const tones = {
        stone: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    };

    return (
        <article className="salla-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
                    <p className="mt-3 break-words text-2xl font-extrabold text-stone-950 dark:text-white">{value}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </article>
    );
}

function CalendarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.25 4.75v2.5m9.5-2.5v2.5M5.75 9.75h12.5M6.75 6.75h10.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
    );
}

function ChartIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.75 18.25V13m6.25 5.25V7.75m6.25 10.5v-8.5M4.75 19.25h14.5" />
        </svg>
    );
}

function PaymentIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 8.75h14.5m-13.5-3h12.5a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1V6.75a1 1 0 0 1 1-1Zm2 9h3" />
        </svg>
    );
}

function AlertIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v4.5m0 3h.01M10.75 4.75 3.75 18a1 1 0 0 0 .88 1.5h14.74a1 1 0 0 0 .88-1.5l-7-13.25a1.4 1.4 0 0 0-2.5 0Z" />
        </svg>
    );
}
