import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navigation = [
    { name: 'Tableau de bord', href: 'tenant.dashboard', icon: DashboardIcon },
    { name: 'Profil salle', href: 'tenant.profile.edit', icon: VenueIcon },
    { name: 'Calendrier', href: 'tenant.calendar.index', icon: CalendarIcon },
    { name: 'Reservations', href: 'tenant.reservations.index', icon: ReservationIcon },
    { name: 'Clients', href: 'tenant.clients.index', icon: ClientsIcon },
    { name: 'Services', href: 'tenant.services.index', icon: ServicesIcon },
    { name: 'Packs', href: 'tenant.packs.index', icon: PackIcon },
    { name: 'Paiements', href: 'tenant.payments.index', icon: PaymentIcon },
];

export default function TenantLayout({ children }) {
    const { url, props } = usePage();
    const tenant = props.tenant ?? {};
    const user = props.auth?.user ?? null;
    const [mobileOpen, setMobileOpen] = useState(false);
    const initials = getInitials(user?.name ?? tenant.name ?? 'Salla');

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.13),_transparent_30%),linear-gradient(135deg,_#fafaf9_0%,_#ffffff_52%,_#fff7ed_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.15),_transparent_28%),linear-gradient(135deg,_#0c0a09_0%,_#1c1917_56%,_#431407_100%)] dark:text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
                <aside className="relative z-30 hidden w-72 shrink-0 border-r border-stone-200/70 bg-white/82 px-4 py-5 shadow-xl shadow-stone-200/30 backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-950/82 dark:shadow-stone-950/30 lg:flex lg:flex-col">
                    <Brand tenant={tenant} />
                    <nav className="mt-6 flex-1 space-y-1">
                        {navigation.map((item) => (
                            <TenantNavLink key={item.name} item={item} url={url} />
                        ))}
                    </nav>
                    <div className="mt-6 space-y-3 border-t border-stone-200/70 pt-4 dark:border-stone-800/70">
                        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-stone-900 dark:to-orange-500/10">
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Espace gerant</p>
                            <p className="mt-2 text-xs leading-5 text-stone-600 dark:text-stone-300">
                                Planning, clients et paiements dans une interface alignee avec votre activite.
                            </p>
                        </div>
                        <UserStrip user={user} initials={initials} />
                        <Link
                            href={route('tenant.logout')}
                            method="post"
                            as="button"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-rose-300 hover:text-rose-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-rose-500 dark:hover:text-rose-300"
                        >
                            <LogOutIcon className="h-4 w-4" />
                            Se deconnecter
                        </Link>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/82 px-4 py-3 shadow-sm shadow-stone-200/40 backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-950/82 dark:shadow-stone-950/30 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(true)}
                                    className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-500 lg:hidden"
                                    aria-label="Ouvrir le menu"
                                >
                                    <MenuIcon className="h-5 w-5" />
                                </button>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <SparkIcon className="h-4 w-4 text-amber-500" />
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                                            Salle des fetes
                                        </p>
                                    </div>
                                    <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                                        {tenant.name ?? 'Espace locataire'}
                                    </h1>
                                    <p className="mt-0.5 truncate text-sm text-stone-500 dark:text-stone-400">
                                        {tenant.domain ?? 'Sous-domaine locataire'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <Link
                                    href={route('public.hall.show')}
                                    className="hidden rounded-2xl border border-stone-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:border-amber-500 sm:inline-flex"
                                >
                                    Page publique
                                </Link>
                                <ThemeToggle compact />
                                <UserStrip user={user} initials={initials} compact />
                            </div>
                        </div>
                    </header>

                    {mobileOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <button
                                type="button"
                                className="absolute inset-0 h-full w-full bg-stone-950/50 backdrop-blur-sm"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Fermer le menu"
                            />
                            <div className="relative flex h-full w-80 max-w-[88vw] flex-col overflow-y-auto border-r border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-950">
                                <div className="flex items-center justify-between border-b border-stone-200 p-4 dark:border-stone-800">
                                    <Brand tenant={tenant} compact />
                                    <button
                                        type="button"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 dark:hover:bg-stone-800"
                                        aria-label="Fermer"
                                    >
                                        <CloseIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="border-b border-stone-200 bg-amber-50/70 p-4 dark:border-stone-800 dark:bg-amber-500/10">
                                    <UserStrip user={user} initials={initials} />
                                </div>
                                <nav className="flex-1 space-y-1 p-4">
                                    {navigation.map((item) => (
                                        <TenantNavLink
                                            key={item.name}
                                            item={item}
                                            url={url}
                                            onNavigate={() => setMobileOpen(false)}
                                        />
                                    ))}
                                </nav>
                                <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                                    <Link
                                        href={route('tenant.logout')}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                                    >
                                        <LogOutIcon className="h-4 w-4" />
                                        Se deconnecter
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto min-w-0 max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function TenantNavLink({ item, url, onNavigate }) {
    const Icon = item.icon;
    const isCurrent = isTenantRouteCurrent(item.href, url) || route().current(item.href);

    return (
        <Link
            href={route(item.href)}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                isCurrent
                    ? 'border border-amber-200/70 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-800 shadow-sm dark:border-amber-500/20 dark:text-amber-200'
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800/70 dark:hover:text-white'
            }`}
        >
            <span className={isCurrent ? 'text-amber-600 dark:text-amber-300' : 'text-stone-400 group-hover:text-amber-500'}>
                <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
            {isCurrent && <ChevronRightIcon className="h-4 w-4 text-amber-500" />}
        </Link>
    );
}

function isTenantRouteCurrent(name, url) {
    const segments = {
        'tenant.dashboard': '/dashboard',
        'tenant.profile.edit': '/profile',
        'tenant.calendar.index': '/calendar',
        'tenant.reservations.index': '/reservations',
        'tenant.clients.index': '/clients',
        'tenant.services.index': '/services',
        'tenant.packs.index': '/packs',
        'tenant.payments.index': '/payments',
    };

    return segments[name] ? url.startsWith(segments[name]) : false;
}

function Brand({ tenant, compact = false }) {
    return (
        <Link
            href={route('tenant.dashboard')}
            className={`block rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-stone-800 dark:bg-stone-900/90 ${compact ? 'border-0 bg-transparent p-0 shadow-none dark:bg-transparent' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                    <SparkIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                        Salla
                    </p>
                    <p className="truncate text-lg font-bold text-stone-950 dark:text-white">
                        {tenant.name ?? 'Espace gerant'}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function UserStrip({ user, initials, compact = false }) {
    return (
        <div className={`rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-sm dark:border-stone-800 dark:bg-stone-900/85 ${compact ? 'hidden sm:block' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/20">
                    {initials}
                </div>
                {!compact && (
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-950 dark:text-white">{user?.name ?? 'Utilisateur'}</p>
                        <p className="truncate text-xs text-stone-500 dark:text-stone-400">{user?.email ?? 'Connecte'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function DashboardIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 5.75h6.5v5.5h-6.5v-5.5Zm8 0h6.5v8.5h-6.5v-8.5Zm-8 7h6.5v6.5h-6.5v-6.5Zm8 3h6.5v3.5h-6.5v-3.5Z" />
        </svg>
    );
}

function VenueIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 19.25h14.5M6.75 19.25V8.75l5.25-3 5.25 3v10.5M9 10.75h.01M15 10.75h.01M9 14.25h.01M15 14.25h.01M11 19.25v-3.5h2v3.5" />
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

function ReservationIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7.75h10M7 12h10M7 16.25h5M5.75 4.75h12.5a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1V5.75a1 1 0 0 1 1-1Z" />
        </svg>
    );
}

function ClientsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0M18.75 8.75h2.5m-1.25-1.25v2.5" />
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

function ServicesIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.75 7.25h12.5M5.75 12h12.5M5.75 16.75h7.5M4.75 4.75h14.5a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1V5.75a1 1 0 0 1 1-1Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.25 16.25.75.75 2-2" />
        </svg>
    );
}

function PackIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.25h13.5v9a1 1 0 0 1-1 1H6.25a1 1 0 0 1-1-1v-9Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 6.25h14.5v3H4.75v-3Zm7.25 0v13m-3.75-13a2 2 0 1 1 3.75 0m3.75 0A2 2 0 1 0 12 6.25" />
        </svg>
    );
}

function SparkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-.813-2.096a2.25 2.25 0 0 0-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 0 0 1.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 0 0 1.341 1.341l2.096.813-2.096.813a2.25 2.25 0 0 0-1.341 1.341ZM18 7l.375 1.125A1.5 1.5 0 0 0 19.5 9.25L20.625 9l-1.125.375A1.5 1.5 0 0 0 18.375 10.5L18 11.625l-.375-1.125A1.5 1.5 0 0 0 16.5 9.375L15.375 9l1.125-.25A1.5 1.5 0 0 0 17.625 7.625L18 6.5l.375 1.125Z" />
        </svg>
    );
}

function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

function CloseIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
        </svg>
    );
}

function ChevronRightIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
    );
}

function LogOutIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 4.75h-3a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h3m5-3.5 3.75-3.75-3.75-3.75M18.5 12H9.25" />
        </svg>
    );
}
