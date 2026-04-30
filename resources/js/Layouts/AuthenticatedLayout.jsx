import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navigationSections = [
    {
        label: 'Pilotage',
        items: [
            { name: 'Vue d ensemble', href: 'central.admin.dashboard', icon: DashboardIcon, badgeKey: 'activeTenants' },
            { name: 'Locataires', href: 'central.admin.tenants.index', icon: BuildingIcon, badgeKey: 'tenants' },
            { name: 'Plans', href: 'central.admin.plans.index', icon: LayersIcon, badgeKey: 'plans' },
        ],
    },
    {
        label: 'Accompagnement',
        items: [
            { name: 'Support', href: 'central.admin.support.index', icon: LifebuoyIcon, badgeKey: 'suspendedTenants' },
            { name: 'Onboarding', href: 'central.admin.onboarding.index', icon: RocketIcon, badgeKey: 'onboarding' },
        ],
    },
    {
        label: 'Compte',
        items: [{ name: 'Profil', href: 'profile.edit', icon: UserIcon }],
    },
];

export default function AuthenticatedLayout({ header, children }) {
    const { props, url } = usePage();
    const user = props.auth.user;
    const sidebar = props.adminSidebar ?? {};
    const [mobileOpen, setMobileOpen] = useState(false);
    const initials = getInitials(user?.name ?? 'Admin');

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),linear-gradient(135deg,_#fafaf9_0%,_#ffffff_48%,_#fff7ed_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_28%),linear-gradient(135deg,_#0c0a09_0%,_#1c1917_55%,_#431407_100%)] dark:text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
                <aside className="relative z-30 hidden w-72 shrink-0 border-r border-stone-200/70 bg-white/82 px-4 py-5 shadow-xl shadow-stone-200/30 backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-950/82 dark:shadow-stone-950/30 lg:flex lg:flex-col">
                    <SidebarContent user={user} url={url} sidebar={sidebar} initials={initials} />
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
                                            Console centrale
                                        </p>
                                    </div>
                                    <div className="mt-1">
                                        {header ?? (
                                            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                                                Administration SaaS
                                            </h1>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <Link
                                    href={route('central.home')}
                                    className="hidden rounded-2xl border border-stone-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:border-amber-500 sm:inline-flex"
                                >
                                    Marketplace
                                </Link>
                                <ThemeToggle compact />
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/85 px-2.5 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-white hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:border-amber-500"
                                        >
                                            <span className="hidden sm:inline">{user?.name?.split(' ')[0] ?? 'Admin'}</span>
                                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-orange-500/20">
                                                {initials}
                                            </span>
                                            <ChevronDownIcon className="h-4 w-4 text-stone-400" />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content
                                        align="right"
                                        width="48"
                                        contentClasses="overflow-hidden rounded-2xl border border-stone-200 bg-white py-2 shadow-2xl dark:border-stone-800 dark:bg-stone-900"
                                    >
                                        <div className="border-b border-stone-100 px-4 py-3 dark:border-stone-800">
                                            <p className="truncate text-sm font-semibold text-stone-950 dark:text-white">{user?.name}</p>
                                            <p className="truncate text-xs text-stone-500 dark:text-stone-400">{user?.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Mon profil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Se deconnecter
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
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
                                    <BrandBlock compact />
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
                                <div className="flex-1 p-4">
                                    <SidebarNavigation url={url} sidebar={sidebar} mobile onNavigate={() => setMobileOpen(false)} />
                                </div>
                                <div className="border-t border-stone-200 p-4 dark:border-stone-800">
                                    <Link
                                        href={route('logout')}
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

function SidebarContent({ user, url, sidebar, initials }) {
    return (
        <>
            <BrandBlock />

            <div className="mt-6">
                <Link
                    href={route('central.home')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-105"
                >
                    <SparkIcon className="h-4 w-4" />
                    Ouvrir le portail public
                </Link>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto pr-1">
                <SidebarNavigation url={url} sidebar={sidebar} />
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-200/70 pt-4 dark:border-stone-800/70">
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-stone-900 dark:to-orange-500/10">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <SparkIcon className="h-4 w-4" />
                        <p className="text-sm font-semibold">Pilotage rapide</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-stone-600 dark:text-stone-300">
                        Suivez les salles, les plans et l accompagnement depuis une console unifiee.
                    </p>
                </div>
                <UserStrip user={user} initials={initials} />
            </div>
        </>
    );
}

function BrandBlock({ compact = false }) {
    return (
        <Link
            href={route('central.admin.dashboard')}
            className={`block rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-stone-800 dark:bg-stone-900/90 ${compact ? 'border-0 bg-transparent p-0 shadow-none dark:bg-transparent' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                    <SparkIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                        Salla Platform
                    </p>
                    <p className="truncate text-lg font-bold text-stone-950 dark:text-white">Console admin</p>
                </div>
            </div>
        </Link>
    );
}

function UserStrip({ user, initials }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-sm dark:border-stone-800 dark:bg-stone-900/85">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/20">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-950 dark:text-white">{user?.name}</p>
                    <p className="truncate text-xs text-stone-500 dark:text-stone-400">{user?.email}</p>
                </div>
            </div>
        </div>
    );
}

function SidebarNavigation({ sidebar, mobile = false, onNavigate }) {
    return (
        <div className={mobile ? 'space-y-5' : 'space-y-6'}>
            {navigationSections.map((section) => (
                <div key={section.label}>
                    <p className={`mb-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] ${mobile ? 'text-stone-400' : 'text-stone-500 dark:text-stone-500'}`}>
                        {section.label}
                    </p>
                    <nav className="space-y-1">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = route().current(item.href);
                            const badge = item.badgeKey ? sidebar?.[item.badgeKey] : null;

                            return (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    onClick={onNavigate}
                                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                                        active
                                            ? 'border border-amber-200/70 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-800 shadow-sm dark:border-amber-500/20 dark:text-amber-200'
                                            : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800/70 dark:hover:text-white'
                                    }`}
                                >
                                    <span className={active ? 'text-amber-600 dark:text-amber-300' : 'text-stone-400 group-hover:text-amber-500'}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate">{item.name}</span>
                                    {badge !== null && badge !== undefined && (
                                        <span className={`inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                                            active
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                                        }`}>
                                            {badge}
                                        </span>
                                    )}
                                    {active && <ChevronRightIcon className="h-4 w-4 text-amber-500" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ))}
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

function BuildingIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 20.25h14.5M6.75 20.25V6.75a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v13.5M9.25 9.25h.5m4.5 0h.5m-5 3.5h.5m4.5 0h.5m-5 3.5h.5m4.5 0h.5" />
        </svg>
    );
}

function LayersIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m12 4.75 7.25 3.5L12 11.75 4.75 8.25 12 4.75Zm7.25 7L12 15.25l-7.25-3.5M19.25 15.25 12 18.75l-7.25-3.5" />
        </svg>
    );
}

function LifebuoyIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25A8.25 8.25 0 1 0 12 3.75a8.25 8.25 0 0 0 0 16.5Zm0-11.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5.303-1.947 3.181 3.181m4.244 4.244 3.181 3.181m0-10.606-3.181 3.181m-4.244 4.244-3.181 3.181" />
        </svg>
    );
}

function RocketIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 5.409a5.625 5.625 0 0 1 2.651 5.634l-.196 1.178a1.875 1.875 0 0 1-.535.99l-4.984 4.984a1.875 1.875 0 0 1-.99.535l-1.178.196a5.625 5.625 0 0 1-5.634-2.651m10.866-10.866a13.458 13.458 0 0 0-8.774 3.94L4.25 11.916l1.833 1.833 2.567-2.567m6.94-5.773 2.66-2.659m-9.6 12.259L6.99 18.67m-.565-4.92-2.62 2.62a1.875 1.875 0 0 0-.549 1.326V20.25h2.553c.497 0 .974-.198 1.326-.549l2.62-2.62" />
        </svg>
    );
}

function UserIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0" />
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

function ChevronDownIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
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
