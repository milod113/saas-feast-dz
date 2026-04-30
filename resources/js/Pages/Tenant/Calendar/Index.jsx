import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusClasses = {
    confirmed: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    pending: 'bg-gradient-to-r from-amber-400 to-orange-400',
    cancelled: 'bg-gradient-to-r from-rose-500 to-red-500',
};

const paymentStatusClasses = {
    paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    partial: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    unpaid: 'bg-stone-500/20 text-stone-400 border-stone-500/30',
};

const daysLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Index({ month, days }) {
    const [hoveredReservation, setHoveredReservation] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'

    const changeMonth = (value) => {
        router.get(route('tenant.calendar.index'), { month: value }, { preserveState: true });
    };

    const getDayStats = (day) => {
        const totalReservations = day.reservations.length;
        const totalAmount = day.reservations.reduce((sum, r) => sum + r.total_price, 0);
        const paidAmount = day.reservations.reduce((sum, r) => sum + r.paid_amount, 0);
        const occupancyRate = (totalReservations / 10) * 100; // Assuming max 10 reservations per day
        
        return { totalReservations, totalAmount, paidAmount, occupancyRate };
    };

    return (
        <TenantLayout>
            <Head title="Calendrier" />

            <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/20">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 shadow-2xl shadow-orange-500/20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-6 w-6 text-white/80" />
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">
                                        Planning
                                    </p>
                                </div>
                                <h1 className="mt-3 text-4xl font-black text-white">
                                    Calendrier des réservations
                                </h1>
                                <p className="mt-2 text-sm text-white/80">
                                    Visualisez rapidement les dates occupées et l'état des paiements.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex gap-2 rounded-xl bg-white/10 p-1 backdrop-blur-sm">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            viewMode === 'grid'
                                                ? 'bg-white text-amber-600 shadow-lg'
                                                : 'text-white hover:bg-white/20'
                                        }`}
                                    >
                                        Grille
                                    </button>
                                    <button
                                        onClick={() => setViewMode('compact')}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                            viewMode === 'compact'
                                                ? 'bg-white text-amber-600 shadow-lg'
                                                : 'text-white hover:bg-white/20'
                                        }`}
                                    >
                                        Compact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month Navigation */}
                    <div className="mb-6 flex items-center justify-between">
                        <button
                            onClick={() => changeMonth(month.previous)}
                            className="group flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                            Mois précédent
                        </button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 blur-xl opacity-30"></div>
                            <div className="relative rounded-2xl bg-white/90 px-6 py-3 text-center shadow-xl backdrop-blur-sm dark:bg-stone-800/90">
                                <h2 className="text-xl font-black text-transparent bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text dark:from-amber-300 dark:to-orange-300">
                                    {month.label}
                                </h2>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => changeMonth(month.next)}
                            className="group flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl dark:bg-stone-800/80 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            Mois suivant
                            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="rounded-2xl bg-white/60 backdrop-blur-sm shadow-2xl dark:bg-stone-900/60">
                        {/* Day Labels */}
                        <div className="grid grid-cols-7 gap-px rounded-t-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-2 dark:from-stone-800 dark:to-stone-700">
                            {daysLabels.map((label, index) => (
                                <div
                                    key={label}
                                    className="py-3 text-center text-xs font-black uppercase tracking-wider"
                                    style={{
                                        background: `linear-gradient(135deg, ${index % 2 === 0 ? '#f59e0b' : '#ea580c'}, transparent)`,
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-stone-800">
                            {days.map((day) => {
                                const stats = getDayStats(day);
                                const hasReservations = day.reservations.length > 0;
                                
                                return (
                                    <div
                                        key={day.date}
                                        className={`group relative min-h-[200px] transition-all duration-300 ${
                                            day.inMonth
                                                ? 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50 dark:bg-stone-900 dark:hover:from-stone-900 dark:hover:to-amber-950/30'
                                                : 'bg-stone-50/50 dark:bg-stone-950/30'
                                        } ${day.isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}`}
                                    >
                                        {/* Day Header */}
                                        <div className="flex items-center justify-between border-b border-stone-100 p-3 dark:border-stone-800">
                                            <span className={`text-lg font-black ${
                                                !day.inMonth ? 'text-stone-400 dark:text-stone-600' : 'text-stone-700 dark:text-stone-300'
                                            }`}>
                                                {day.day}
                                            </span>
                                            {hasReservations && day.inMonth && (
                                                <div className="flex items-center gap-1">
                                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                                        {stats.totalReservations}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Reservations */}
                                        <div className={`space-y-2 p-2 ${
                                            viewMode === 'compact' ? 'max-h-[150px] overflow-y-auto' : ''
                                        }`}>
                                            {day.reservations.map((reservation, idx) => (
                                                <Link
                                                    key={reservation.id}
                                                    href={route('tenant.reservations.edit', reservation.id)}
                                                    onMouseEnter={() => setHoveredReservation(reservation.id)}
                                                    onMouseLeave={() => setHoveredReservation(null)}
                                                    className="group/reservation relative block transform rounded-xl border border-stone-200/50 bg-gradient-to-br from-white to-stone-50/50 p-2 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 dark:border-stone-700/50 dark:from-stone-800 dark:to-stone-900/50"
                                                >
                                                    {/* Status Indicator */}
                                                    <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${
                                                        statusClasses[reservation.status]
                                                    }`}></div>
                                                    
                                                    <div className="pl-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                                                                {reservation.client_name}
                                                            </h4>
                                                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                                                                {formatCurrency(reservation.total_price)} DZD
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="mt-1 flex flex-wrap items-center gap-1">
                                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                                                paymentStatusClasses[reservation.payment_status]
                                                            }`}>
                                                                {reservation.payment_status === 'paid' ? '✓ Payé' : 
                                                                 reservation.payment_status === 'partial' ? '⏸ Partiel' : '○ Non payé'}
                                                            </span>
                                                            
                                                            {reservation.payment_status !== 'paid' && (
                                                                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                                                                    Reste: {formatCurrency(reservation.remaining_balance)} DZD
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Hover Details */}
                                                    {hoveredReservation === reservation.id && (
                                                        <div className="absolute -top-2 left-1/2 z-50 w-48 -translate-x-1/2 transform rounded-lg bg-stone-900 p-2 text-center text-xs text-white shadow-xl dark:bg-white dark:text-stone-900">
                                                            <p>💰 {formatCurrency(reservation.paid_amount)} DZD encaissés</p>
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                            
                                            {/* Empty State */}
                                            {day.reservations.length === 0 && day.inMonth && (
                                                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50/30 dark:border-stone-700 dark:bg-stone-800/30">
                                                    <p className="text-xs text-stone-400 dark:text-stone-600">Aucune réservation</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Badge */}
                                        {hasReservations && day.inMonth && viewMode === 'grid' && (
                                            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">
                                                <TrendingUp className="h-3 w-3 text-amber-600" />
                                                <span className="text-amber-700">
                                                    {Math.round(stats.occupancyRate)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend & Summary */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/50 p-4 backdrop-blur-sm dark:bg-stone-800/50">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Statuts:</span>
                            <div className="flex gap-3">
                                {Object.entries(statusClasses).map(([status, classes]) => (
                                    <div key={status} className="flex items-center gap-1">
                                        <div className={`h-3 w-3 rounded-full ${classes}`}></div>
                                        <span className="text-xs capitalize text-stone-600 dark:text-stone-300">
                                            {status === 'confirmed' ? 'Confirmé' : status === 'pending' ? 'En attente' : 'Annulé'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs text-stone-600 dark:text-stone-300">
                                    Total: {formatCurrency(days.reduce((sum, day) => sum + getDayStats(day).totalAmount, 0))} DZD
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-500" />
                                <span className="text-xs text-stone-600 dark:text-stone-300">
                                    Réservations: {days.reduce((sum, day) => sum + day.reservations.length, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}

function ChevronLeft(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 5-7 7 7 7" />
        </svg>
    );
}

function ChevronRight(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
    );
}

function CalendarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.25 4.75v2.5m9.5-2.5v2.5M5.75 9.75h12.5M6.75 6.75h10.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
        </svg>
    );
}

function TrendingUp(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 16.25 9.5 11.5l3.25 3.25 6.5-6.5m-5.5 0h5.5v5.5" />
        </svg>
    );
}

function CreditCard(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 8.75h14.5m-13.5-3h12.5a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1V6.75a1 1 0 0 1 1-1Zm2 9h3" />
        </svg>
    );
}

function Users(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0M18.25 10.25a2.5 2.5 0 0 1 0 5M20.75 19.25a4.5 4.5 0 0 0-2.5-4" />
        </svg>
    );
}
