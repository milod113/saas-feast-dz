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

    return (
        <div className="min-h-screen bg-[#f6f3ee] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <div className="mx-auto flex min-h-screen max-w-[1600px]">
                <aside className="hidden w-80 flex-col border-r border-stone-200 bg-stone-950 text-white dark:border-stone-800 lg:flex">
                    <SidebarContent user={user} url={url} sidebar={sidebar} />
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <div className="border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-900/90 lg:hidden">
                        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                            <Link href={route('central.home')} className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                                    <SparkIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                                        Salla
                                    </p>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">Admin SaaS</p>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                <ThemeToggle compact />
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen((value) => !value)}
                                    className="rounded-2xl border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 dark:border-stone-700 dark:text-stone-200"
                                >
                                    Menu
                                </button>
                            </div>
                        </div>

                        {mobileOpen && (
                            <div className="border-t border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-900 sm:px-6">
                                <SidebarNavigation url={url} sidebar={sidebar} mobile />
                                <div className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-800">
                                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{user.email}</p>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                                    >
                                        Se deconnecter
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
                        {header && (
                            <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white px-6 py-6 shadow-[0_18px_50px_-28px_rgba(28,25,23,0.35)] ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:px-8">
                                {header}
                            </div>
                        )}

                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

function SidebarContent({ user, url, sidebar }) {
    return (
        <>
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-start justify-between gap-3">
                <Link href={route('central.home')} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20">
                        <SparkIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                            Salla Platform
                        </p>
                        <p className="mt-1 text-xl font-semibold text-white">Console admin</p>
                    </div>
                </Link>
                <ThemeToggle compact className="border-white/10 bg-white/5 text-stone-200 hover:bg-white/10 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10" />
                </div>
            </div>

            <div className="flex-1 px-4 py-6">
                <SidebarNavigation url={url} sidebar={sidebar} />

                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">Pilotage SaaS</p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">
                        Surveillez la croissance, structurez les plans et accompagnez le demarrage de chaque salle.
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10 p-4">
                <div className="rounded-[1.75rem] bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-white">{user.name}</p>
                            <p className="mt-1 text-sm text-stone-400">{user.email}</p>
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Plus
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content contentClasses="py-2 bg-white dark:bg-stone-900">
                                <Dropdown.Link href={route('profile.edit')}>
                                    Mon profil
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Se deconnecter
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    );
}

function SidebarNavigation({ url, sidebar, mobile = false }) {
    return (
        <div className={mobile ? 'space-y-5' : 'space-y-6'}>
            {navigationSections.map((section) => (
                <div key={section.label}>
                    <p className={`${mobile ? 'mb-2' : 'mb-3 px-3'} text-xs font-semibold uppercase tracking-[0.22em] ${mobile ? 'text-stone-400' : 'text-stone-500'}`}>
                        {section.label}
                    </p>
                    <nav className="space-y-2">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = route().current(item.href);
                            const badge = item.badgeKey ? sidebar[item.badgeKey] : null;

                            return (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        active
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : mobile
                                              ? 'text-stone-700 hover:bg-stone-100'
                                              : 'text-stone-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </span>
                                    {badge !== null && badge !== undefined && (
                                        <span
                                            className={`inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                active
                                                    ? 'bg-white/15 text-white'
                                                    : mobile
                                                      ? 'bg-stone-200 text-stone-700'
                                                      : 'bg-white/10 text-stone-200'
                                            }`}
                                        >
                                            {badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ))}
        </div>
    );
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
