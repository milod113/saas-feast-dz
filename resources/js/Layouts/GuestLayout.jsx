import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.15),_transparent_30%),linear-gradient(135deg,_#fafaf9_0%,_#ffffff_54%,_#fff7ed_100%)] text-stone-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_28%),linear-gradient(135deg,_#0c0a09_0%,_#1c1917_56%,_#431407_100%)] dark:text-stone-100">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                            <SparkIcon className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-lg font-bold tracking-tight text-stone-950 dark:text-white">Salla</span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                                SaaS salles
                            </span>
                        </span>
                    </Link>
                    <ThemeToggle compact />
                </header>

                <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="hidden lg:block">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm backdrop-blur dark:border-amber-500/20 dark:bg-stone-900/70 dark:text-amber-200">
                                <ShieldIcon className="h-4 w-4" />
                                Espace securise pour gerants
                            </div>
                            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-stone-950 dark:text-white">
                                Connectez votre salle a une console claire, rapide et fiable.
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-300">
                                Une experience inspiree des outils de messagerie modernes, adaptee aux reservations, aux clients et aux paiements.
                            </p>
                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <MiniMetric value="24/7" label="Acces" />
                                <MiniMetric value="DZD" label="Paiements" />
                                <MiniMetric value="Live" label="Planning" />
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-xl">
                        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_30px_70px_-32px_rgba(120,53,15,0.38)] backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-900/90 dark:shadow-stone-950/50">
                            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-7 py-6 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                                        <LockIcon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xl font-bold">Acces Salla</p>
                                        <p className="text-sm text-orange-50">Votre espace de gestion centralise.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-7 sm:px-8">
                                {children}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function MiniMetric({ value, label }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <p className="text-lg font-bold text-stone-950 dark:text-white">{value}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{label}</p>
        </div>
    );
}

function SparkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-.813-2.096a2.25 2.25 0 0 0-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 0 0 1.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 0 0 1.341 1.341l2.096.813-2.096.813a2.25 2.25 0 0 0-1.341 1.341ZM18 7l.375 1.125A1.5 1.5 0 0 0 19.5 9.25L20.625 9l-1.125.375A1.5 1.5 0 0 0 18.375 10.5L18 11.625l-.375-1.125A1.5 1.5 0 0 0 16.5 9.375L15.375 9l1.125-.25A1.5 1.5 0 0 0 17.625 7.625L18 6.5l.375 1.125Z" />
        </svg>
    );
}

function ShieldIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25s7.25-3.25 7.25-9.25V5.75L12 3.75 4.75 5.75V11c0 6 7.25 9.25 7.25 9.25Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.25 11.75 1.75 1.75 3.75-4" />
        </svg>
    );
}

function LockIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.25 10.25V8a4.75 4.75 0 0 1 9.5 0v2.25m-10 0h10.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6.75a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
        </svg>
    );
}
