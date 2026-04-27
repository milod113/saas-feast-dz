import { Head, Link } from '@inertiajs/react';

const features = [
    {
        title: 'Calendrier Intelligent',
        description: 'Evitez les doubles reservations et visualisez vos evenements en un coup d oeil.',
        icon: CalendarIcon,
    },
    {
        title: 'Gestion des Paiements',
        description: 'Suivez les avances, le reste a payer et vos encaissements en DZD sans erreur.',
        icon: WalletIcon,
    },
    {
        title: 'Contrats Automatises',
        description: 'Generez vos bons de reservation et documents clients en quelques secondes.',
        icon: DocumentIcon,
    },
];

const plans = [
    {
        name: 'Plan Standard',
        price: '4 900 DZD',
        description: 'Pour les salles qui veulent centraliser leurs reservations et paiements.',
        items: ['Calendrier complet', 'Suivi des clients', 'Historique des reservations'],
        accent: 'from-amber-400 to-orange-500',
    },
    {
        name: 'Plan Pro',
        price: '8 900 DZD',
        description: 'Pour les equipes qui veulent automatiser la gestion commerciale de la salle.',
        items: ['Contrats automatises', 'Tableaux de bord avances', 'Support prioritaire'],
        accent: 'from-stone-900 to-stone-700',
    },
];

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Accueil" />

            <div className="min-h-screen bg-[#fffaf5] text-stone-900">
                <div className="relative isolate overflow-hidden">
                    <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(245,158,11,0.16),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#fffaf5_65%,_#fffaf5_100%)]" />
                    <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="flex items-center justify-between py-5 sm:py-6">
                            <Link href={route('central.home')} className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                                    <SparklesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold tracking-tight text-stone-900">
                                        Salla
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                                        SaaS pour salles des fetes
                                    </p>
                                </div>
                            </Link>

                            <nav className="hidden items-center gap-8 md:flex">
                                <a href="#fonctionnalites" className="text-sm font-medium text-stone-600 transition hover:text-stone-900">
                                    Fonctionnalites
                                </a>
                                <a href="#tarifs" className="text-sm font-medium text-stone-600 transition hover:text-stone-900">
                                    Tarifs
                                </a>
                            </nav>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white/80 hover:text-stone-900"
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
                                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-amber-900 shadow-sm backdrop-blur">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Solution pensee pour les salles des fetes en Algerie
                                        </div>

                                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                                            Gerez votre salle des fetes en toute serenite.
                                        </h1>

                                        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
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
                                                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
                                                >
                                                    Voir la demo
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-3xl bg-amber-200/60 blur-2xl" />
                                        <div className="absolute -bottom-6 left-4 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl" />

                                        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-24px_rgba(120,53,15,0.28)] backdrop-blur">
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
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                                        Tout ce qu&apos;il faut pour piloter votre activite.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600">
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
                                                className="rounded-[1.75rem] border border-white/80 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(28,25,23,0.35)] ring-1 ring-stone-100"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="mt-5 text-xl font-semibold text-stone-950">
                                                    {feature.title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-7 text-stone-600">
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
                                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                                        Des offres simples, sans complexite inutile.
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-stone-600">
                                        Choisissez le plan adapte a la taille de votre salle et demarrez rapidement.
                                    </p>
                                </div>

                                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                                    {plans.map((plan) => (
                                        <article
                                            key={plan.name}
                                            className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_60px_-32px_rgba(28,25,23,0.3)]"
                                        >
                                            <div className={`h-2 w-full bg-gradient-to-r ${plan.accent}`} />
                                            <div className="p-7 sm:p-8">
                                                <h3 className="text-2xl font-semibold text-stone-950">{plan.name}</h3>
                                                <p className="mt-2 text-sm leading-7 text-stone-600">
                                                    {plan.description}
                                                </p>
                                                <div className="mt-6 flex items-end gap-2">
                                                    <span className="text-4xl font-semibold tracking-tight text-stone-950">
                                                        {plan.price}
                                                    </span>
                                                    <span className="pb-1 text-sm text-stone-500">/ mois</span>
                                                </div>
                                                <ul className="mt-6 space-y-3 text-sm text-stone-700">
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

                <footer className="border-t border-stone-200/80 bg-white/80">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}
