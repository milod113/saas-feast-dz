import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusClasses = {
    confirmed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    pending: 'bg-amber-100 text-amber-800 ring-amber-200',
    cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
};

const daysLabels = ['Sam', 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

function formatCurrency(value) {
    return `${new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)} DZD`;
}

export default function Index({ month, days }) {
    const changeMonth = (value) => {
        router.get(route('tenant.calendar.index'), { month: value }, { preserveState: true });
    };

    return (
        <TenantLayout>
            <Head title="Calendrier" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                            Planning
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-stone-950">
                            Calendrier des reservations
                        </h1>
                        <p className="mt-2 text-sm text-stone-500">
                            Visualisez rapidement les dates occupees et l etat des paiements.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => changeMonth(month.previous)}
                            className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                        >
                            Mois precedent
                        </button>
                        <div className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-stone-200">
                            {month.label}
                        </div>
                        <button
                            type="button"
                            onClick={() => changeMonth(month.next)}
                            className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                        >
                            Mois suivant
                        </button>
                    </div>
                </div>

                <section className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:p-6">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {daysLabels.map((label) => (
                            <div key={label} className="py-2">
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-7">
                        {days.map((day) => (
                            <div
                                key={day.date}
                                className={`min-h-40 rounded-2xl border p-3 ${
                                    day.inMonth
                                        ? 'border-stone-200 bg-white'
                                        : 'border-stone-100 bg-stone-50 text-stone-400'
                                } ${day.isToday ? 'ring-2 ring-amber-300' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">{day.day}</span>
                                    <span className="text-xs text-stone-400">{day.reservations.length}</span>
                                </div>

                                <div className="mt-3 space-y-2">
                                    {day.reservations.map((reservation) => (
                                        <Link
                                            key={reservation.id}
                                            href={route('tenant.reservations.edit', reservation.id)}
                                            className="block rounded-xl border border-stone-200 bg-stone-50 p-2 text-left transition hover:border-stone-300 hover:bg-stone-100"
                                        >
                                            <div className="truncate text-sm font-medium text-stone-900">
                                                {reservation.client_name}
                                            </div>
                                            <div className="mt-1 flex items-center justify-between gap-2">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusClasses[reservation.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'}`}>
                                                    {reservation.status}
                                                </span>
                                                <span className="text-[11px] text-stone-500">
                                                    {formatCurrency(reservation.total_price)}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-[11px] text-stone-500">
                                                Avance: {formatCurrency(reservation.advance_amount)}
                                            </div>
                                            <div className="text-[11px] text-stone-500">
                                                Reste: {formatCurrency(reservation.remaining_balance)}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </TenantLayout>
    );
}
