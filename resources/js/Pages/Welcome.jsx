import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

// --- Icons (Heroicons style) ---
                <div className="relative isolate overflow-hidden">
                    <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.16),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#fffaf5_65%,_#fffaf5_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,_#1c1917_0%,_#09090b_65%,_#09090b_100%)]" />
                    <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="flex items-center justify-between py-5 sm:py-6">
                            <Link href={route('central.home')} className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                                    <SparklesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Salla
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                                        SaaS pour salles des fetes
                                    </p>
                                </div>
                            </Link>

                            <nav className="hidden items-center gap-8 md:flex">
                                <a href="#fonctionnalites" className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100">
                                    Fonctionnalites
                                </a>
                                <a href="#tarifs" className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100">
                                    Tarifs
                                </a>
                            </nav>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <ThemeToggle compact />
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white/80 hover:text-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                                    >
                                        Se connecter
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-stone-300 transition hover:bg-stone-800"
                                    >
                                        S&apos;inscrire
                                    </Link>
                                )}
                            </div>
                        </header>

                        <main>
                            <section className="pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28">
                                <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-amber-900 shadow-sm backdrop-blur dark:border-amber-900/50 dark:bg-stone-900/70 dark:text-amber-200">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Solution pensee pour les salles des fetes en Algerie
                                        </div>

                                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-5xl lg:text-6xl">
                                            Gerez votre salle des fetes en toute serenite.
                                        </h1>

                                        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-lg">
                                            Dites adieu aux agendas papier. Simplifiez vos reservations,
                                            vos contrats et vos paiements avec la solution No 1 en Algerie.
                                        </p>

                                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                            <Link
                                                href={canRegister ? route('register') : '#'}
                                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-200 transition hover:scale-[1.01] hover:shadow-2xl"
                                            >
                                                Demarrer l&apos;essai gratuit
                                            </Link>
                                            {canLogin && (
                                                <Link
                                                    href={route('login')}
                                                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
                                                >
                                                    Voir la demo
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-3xl bg-amber-200/60 blur-2xl" />
                                        <div className="absolute -bottom-6 left-4 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl" />

                                        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-24px_rgba(120,53,15,0.28)] backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
                                            <div className="rounded-[1.5rem] bg-stone-950 p-5 text-white">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-stone-300">Salle El Hana</p>
                                                        <p className="mt-1 text-2xl font-semibold">12 reservations</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-right">
                                                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                                                            Ce mois
                                                        </p>
                                                        <p className="mt-1 text-lg font-semibold text-emerald-200">
                                                            485 000 DZD
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid gap-3">
                                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span>Mariage | Famille Bensaid</span>
                                                            <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs text-amber-200">
                                                                En attente
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center justify-between text-xs text-stone-300">
                                                            <span>12 juin 2026</span>
                                                            <span>120 000 DZD</span>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl bg-white p-4 text-stone-900 shadow-sm">
                                                        <div className="flex items-center justify-between text-sm font-medium">
                                                            <span>Fiancailles | Mme Rahmani</span>
                                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                                                                Confirme
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                                                            <span>18 juin 2026</span>
                                                            <span>95 000 DZD</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="fonctionnalites" className="py-16 sm:py-20">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
                                        Fonctionnalites
                                    </p>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-4xl">
                                        Tout ce qu&apos;il faut pour piloter votre activite.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-300">
                                        Une interface claire pour gerer vos dates, vos paiements et vos documents
                                        sans dependre d&apos;un tableur ou d&apos;un cahier.
                                    </p>
                                </div>

                                <div className="mt-12 grid gap-5 md:grid-cols-3">
                                    {features.map((feature) => {
                                        const Icon = feature.icon;

                                        return (
                                            <article
                                                key={feature.title}
                                                className="rounded-[1.75rem] border border-white/80 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(28,25,23,0.35)] ring-1 ring-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:ring-stone-800"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="mt-5 text-xl font-semibold text-stone-950 dark:text-stone-100">
                                                    {feature.title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                                    {feature.description}
                                                </p>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>

                            <section id="tarifs" className="py-16 sm:py-20">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
                                        Tarifs
                                    </p>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-4xl">
                                        Des offres simples, sans complexite inutile.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-300">
                                        Choisissez le plan adapte a la taille de votre salle et demarrez rapidement.
                                    </p>
                                </div>

                                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                                    {plans.map((plan) => (
                                        <article
                                            key={plan.name}
                                            className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_60px_-32px_rgba(28,25,23,0.3)] dark:border-stone-800 dark:bg-stone-900"
                                        >
                                            <div className={`h-2 w-full bg-gradient-to-r ${plan.accent}`} />
                                            <div className="p-7 sm:p-8">
                                                <h3 className="text-2xl font-semibold text-stone-950 dark:text-stone-100">{plan.name}</h3>
                                                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                                    {plan.description}
                                                </p>
                                                <div className="mt-6 flex items-end gap-2">
                                                    <span className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-stone-100">
                                                        {plan.price}
                                                    </span>
                                                    <span className="pb-1 text-sm text-stone-500 dark:text-stone-400">/ mois</span>
                                                </div>
                                                <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-200">
                                                    {plan.items.map((item) => (
                                                        <li key={item} className="flex items-center gap-3">
                                                            <CheckIcon className="h-5 w-5 text-emerald-600" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-8">
                                                    <Link
                                                        href={canRegister ? route('register') : '#'}
                                                        className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                                                    >
                                                        Choisir ce plan
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </main>
                    </div>
                </div>

                <footer className="border-t border-stone-200/80 bg-white/80 dark:border-stone-800 dark:bg-stone-900/80">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                        <p>Salla, la solution de gestion pour salles des fetes en Algerie.</p>
                        <p>(c) 2026 Tous droits reserves.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function SparklesIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-.813-2.096a2.25 2.25 0 0 0-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 0 0 1.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 0 0 1.341 1.341l2.096.813-2.096.813a2.25 2.25 0 0 0-1.341 1.341ZM18.25 8.75 18 10l-.25-1.25a1.5 1.5 0 0 0-.9-.9L15.6 7.6l1.25-.25a1.5 1.5 0 0 0 .9-.9L18 5.2l.25 1.25a1.5 1.5 0 0 0 .9.9l1.25.25-1.25.25a1.5 1.5 0 0 0-.9.9ZM17 17l-.375 1.125A1.5 1.5 0 0 1 15.5 19.25L14.375 19l1.125-.375A1.5 1.5 0 0 0 16.625 17.5L17 16.375l.375 1.125A1.5 1.5 0 0 0 18.5 18.625L19.625 19l-1.125.25a1.5 1.5 0 0 0-1.125 1.125L17 21.5l-.25-1.125a1.5 1.5 0 0 0-1.125-1.125L14.5 19l1.125-.375A1.5 1.5 0 0 0 16.75 17.5L17 16.375Z" />
        </svg>
    );
}

function CalendarIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v3m8-3v3M3.75 9.75h16.5M5.25 4.5h13.5A1.5 1.5 0 0 1 20.25 6v12.75a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z" />
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

function DocumentIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25V8.625a2.625 2.625 0 0 0-.77-1.856l-3.999-3.999A2.625 2.625 0 0 0 12.875 2H8.25A2.25 2.25 0 0 0 6 4.25v15.5A2.25 2.25 0 0 0 8.25 22h7.5A3.75 3.75 0 0 0 19.5 18.25v-4Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.75V8.25h4.5M9 13.5h6m-6 3h4.5" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function MoonIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.75 9.75 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.75 9.75 0 0 0 9.002-5.998Z" />
        </svg>
    );
}

function SunIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
    );
}

function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    );
}

function XMarkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}

// --- Features Data ---
const features = [
    {
        title: 'Calendrier Intelligent',
        description: 'Visualisez vos événements en un coup d\'œil et dites adieu aux doubles réservations.',
        icon: CalendarIcon,
    },
    {
        title: 'Gestion des Paiements',
        description: 'Suivi des avances, soldes restants et encaissements en DZD, sans erreur de calcul.',
        icon: WalletIcon,
    },
    {
        title: 'Contrats Automatisés',
        description: 'Générez vos bons de réservation et documents clients en quelques secondes seulement.',
        icon: DocumentIcon,
    },
];

// --- Pricing Plans Data ---
const plans = [
    {
        name: 'Plan Standard',
        price: '4 900 DZD',
        description: 'L\'essentiel pour centraliser vos réservations et paiements.',
        items: ['Calendrier interactif', 'Carnet clients', 'Historique complet'],
        badge: 'Populaire',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        cardGradient: 'from-white to-amber-50/40 dark:from-stone-800 dark:to-stone-800/80',
        buttonVariant: 'secondary',
    },
    {
        name: 'Plan Pro',
        price: '8 900 DZD',
        description: 'L\'automatisation complète pour piloter votre salle sereinement.',
        items: ['Contrats automatiques', 'Tableaux de bord avancés', 'Support prioritaire'],
        badge: 'Recommandé',
        badgeColor: 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-900',
        cardGradient: 'from-stone-50 to-stone-100/60 dark:from-stone-800 dark:to-stone-800',
        buttonVariant: 'primary',
    },
];

// --- Theme Provider Component (to be used in _app.jsx or root layout) ---
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored === 'dark' || stored === 'light') return stored;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => React.useContext(ThemeContext);

// --- Main Welcome Component ---
export default function Welcome({ canLogin, canRegister }) {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu when a link is clicked
    const handleNavClick = () => setMobileMenuOpen(false);

    return (
        <>
            <Head title="Salla - Gestion salles des fêtes en Algérie" />
            <div className="min-h-screen bg-white text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
                {/* Enhanced background patterns with dark mode awareness */}
                <div className="relative isolate overflow-hidden">
                    {/* Light mode gradient */}
                    <div className="absolute inset-x-0 -top-40 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.2),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#fffaf5_65%,_#fffaf5_100%)] dark:opacity-0" />
                    
                    {/* Dark mode subtle gradient */}
                    <div className="absolute inset-x-0 -top-40 -z-10 h-[32rem] opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.08),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.05),_transparent_30%),linear-gradient(180deg,_#1c1917_0%,_#292524_65%,_#1c1917_100%)]" />
                    
                    <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/5" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <header className="flex items-center justify-between py-5 sm:py-6">
                            <Link href={route('central.home')} className="flex items-center gap-3 transition-transform active:scale-95">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
                                    <SparklesIcon className="h-6 w-6" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-base font-semibold tracking-tight text-stone-900 dark:text-white">
                                        Salla
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                                        SaaS pour salles des fêtes
                                    </p>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden items-center gap-8 md:flex">
                                <a href="#fonctionnalites" className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-amber-400">
                                    Fonctionnalités
                                </a>
                                <a href="#tarifs" className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-amber-400">
                                    Tarifs
                                </a>
                            </nav>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                                    aria-label="Basculer le mode sombre/clair"
                                >
                                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                                </button>

                                {/* Auth Buttons (Desktop) */}
                                <div className="hidden items-center gap-2 sm:flex">
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                                        >
                                            Se connecter
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-stone-300 transition-all hover:bg-stone-800 hover:shadow-xl dark:bg-amber-500 dark:text-stone-900 dark:shadow-amber-900/20 dark:hover:bg-amber-400"
                                        >
                                            S&apos;inscrire
                                        </Link>
                                    )}
                                </div>

                                {/* Mobile menu button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 md:hidden"
                                    aria-label="Menu"
                                >
                                    {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                                </button>
                            </div>
                        </header>

                        {/* Mobile Navigation Menu */}
                        {mobileMenuOpen && (
                            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-lg dark:border-stone-800 dark:bg-stone-900 md:hidden">
                                <nav className="flex flex-col gap-4">
                                    <a
                                        href="#fonctionnalites"
                                        onClick={handleNavClick}
                                        className="text-base font-medium text-stone-700 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-amber-400"
                                    >
                                        Fonctionnalités
                                    </a>
                                    <a
                                        href="#tarifs"
                                        onClick={handleNavClick}
                                        className="text-base font-medium text-stone-700 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-amber-400"
                                    >
                                        Tarifs
                                    </a>
                                    <hr className="my-2 border-stone-200 dark:border-stone-700" />
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            onClick={handleNavClick}
                                            className="rounded-full px-4 py-2 text-center text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                                        >
                                            Se connecter
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            onClick={handleNavClick}
                                            className="rounded-full bg-stone-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
                                        >
                                            S&apos;inscrire
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        )}

                        {/* Main Content */}
                        <main>
                            {/* Hero Section */}
                            <section className="pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28">
                                <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-amber-900 shadow-sm backdrop-blur dark:border-amber-800/30 dark:bg-stone-900/60 dark:text-amber-200">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Solution pensée pour les salles des fêtes en Algérie
                                        </div>

                                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl dark:text-white">
                                            Gérez votre salle des fêtes en toute sérénité.
                                        </h1>

                                        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg dark:text-stone-400">
                                            Dites adieu aux agendas papier. Simplifiez vos réservations,
                                            contrats et paiements avec la solution n°1 en Algérie.
                                        </p>

                                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                            <Link
                                                href={canRegister ? route('register') : '#'}
                                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-200 transition-all hover:scale-[1.02] hover:shadow-2xl dark:shadow-orange-900/30"
                                            >
                                                Démarrer l&apos;essai gratuit
                                            </Link>
                                            {canLogin && (
                                                <Link
                                                    href={route('login')}
                                                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                                                >
                                                    Voir la démo
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hero Card Preview - Updated with dark mode styling */}
                                    <div className="relative">
                                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-3xl bg-amber-200/60 blur-2xl dark:bg-amber-500/10" />
                                        <div className="absolute -bottom-6 left-4 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl dark:bg-orange-500/10" />

                                        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-24px_rgba(120,53,15,0.28)] backdrop-blur transition-colors dark:border-stone-800/60 dark:bg-stone-900/80 dark:shadow-stone-950/50">
                                            <div className="rounded-[1.5rem] bg-stone-950 p-5 text-white transition-colors dark:bg-gradient-to-br dark:from-stone-900 dark:to-stone-950">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-stone-300 dark:text-stone-400">Salle El Hana</p>
                                                        <p className="mt-1 text-2xl font-semibold">12 réservations</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-right">
                                                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 dark:text-emerald-400">
                                                            Ce mois
                                                        </p>
                                                        <p className="mt-1 text-lg font-semibold text-emerald-200 dark:text-emerald-300">
                                                            485 000 DZD
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid gap-3">
                                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 dark:bg-white/5">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <span className="text-sm">Mariage | Famille Bensaid</span>
                                                            <span className="self-start rounded-full bg-amber-400/15 px-2.5 py-1 text-xs text-amber-200 sm:self-auto dark:text-amber-300">
                                                                En attente
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 dark:text-stone-400">
                                                            <span>12 juin 2026</span>
                                                            <span className="font-medium">120 000 DZD</span>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl bg-white p-4 text-stone-900 shadow-sm transition-colors dark:bg-stone-800 dark:text-stone-100">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <span className="text-sm font-medium">Fiançailles | Mme Rahmani</span>
                                                            <span className="self-start rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700 sm:self-auto dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                Confirmé
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                                                            <span>18 juin 2026</span>
                                                            <span className="font-medium">95 000 DZD</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Features Section */}
                            <section id="fonctionnalites" className="py-16 sm:py-20 scroll-mt-20">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
                                        Fonctionnalités
                                    </p>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl dark:text-white">
                                        Tout ce qu&apos;il faut pour piloter votre activité.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-400">
                                        Une interface claire pour gérer vos dates, paiements et documents,
                                        sans dépendre d&apos;un tableur ou d&apos;un cahier.
                                    </p>
                                </div>

                                <div className="mt-12 grid gap-6 md:grid-cols-3">
                                    {features.map((feature) => {
                                        const Icon = feature.icon;
                                        return (
                                            <article
                                                key={feature.title}
                                                className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/50 dark:hover:bg-stone-900"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-200 transition-all group-hover:scale-105 dark:shadow-orange-900/30">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="mt-5 text-xl font-semibold text-stone-950 dark:text-white">
                                                    {feature.title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-400">
                                                    {feature.description}
                                                </p>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Pricing Section */}
                            <section id="tarifs" className="py-16 sm:py-20 scroll-mt-20">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
                                        Tarifs
                                    </p>
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl dark:text-white">
                                        Des offres simples, sans complexité inutile.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-400">
                                        Choisissez le plan adapté à la taille de votre salle et démarrez rapidement.
                                    </p>
                                </div>

                                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                                    {plans.map((plan) => (
                                        <article
                                            key={plan.name}
                                            className={`relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br ${plan.cardGradient} p-1 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-stone-800`}
                                        >
                                            <div className="rounded-xl p-7 sm:p-8">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-stone-950 dark:text-white">{plan.name}</h3>
                                                        <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-400">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${plan.badgeColor}`}>
                                                        {plan.badge}
                                                    </span>
                                                </div>
                                                <div className="mt-6 flex items-end gap-2">
                                                    <span className="text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
                                                        {plan.price}
                                                    </span>
                                                    <span className="pb-1 text-sm text-stone-500 dark:text-stone-400">/ mois</span>
                                                </div>
                                                <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-300">
                                                    {plan.items.map((item) => (
                                                        <li key={item} className="flex items-center gap-3">
                                                            <CheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-8">
                                                    <Link
                                                        href={canRegister ? route('register') : '#'}
                                                        className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                                                            plan.buttonVariant === 'primary'
                                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200 hover:shadow-lg dark:shadow-orange-900/30'
                                                                : 'border border-stone-300 bg-white text-stone-800 shadow-sm hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:hover:border-stone-600 dark:hover:bg-stone-700'
                                                        }`}
                                                    >
                                                        Choisir ce plan
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </main>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-stone-200 bg-white/80 transition-colors dark:border-stone-800 dark:bg-stone-950/50">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-stone-400">
                        <p>Salla, la solution de gestion pour salles des fêtes en Algérie.</p>
                        <p>© 2026 Tous droits réservés.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}