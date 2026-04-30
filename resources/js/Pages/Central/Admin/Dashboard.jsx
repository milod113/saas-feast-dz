import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const statusClasses = {
    active: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
    suspended: 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20',
};

const statusLabels = {
    active: 'Actif',
    suspended: 'Suspendu',
};

function formatDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

export default function Dashboard({ stats, recentTenants }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-stone-950 dark:text-white">
                        Vue d ensemble
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Croissance, locataires et accompagnement de la plateforme.
                    </p>
                </div>
            }
        >
            <Head title="Vue d ensemble" />

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20">
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">
                                Plateforme centrale
                            </p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Pilotez votre SaaS depuis une console inspiree messagerie.
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-orange-50 sm:text-base">
                                Un suivi rapide des salles, des offres et des prochains demarrages, avec les accents visuels Salla.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <HeroMetric label="Locataires" value={stats.totalTenants} />
                            <HeroMetric label="Actifs" value={stats.activeTenants} />
                            <HeroMetric label="Ce mois" value={stats.newThisMonth} />
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total locataires" value={stats.totalTenants} icon={BuildingIcon} />
                    <StatCard title="Actifs" value={stats.activeTenants} icon={CheckIcon} tone="emerald" />
                    <StatCard title="Suspendus" value={stats.suspendedTenants} icon={AlertIcon} tone="rose" />
                    <StatCard title="Nouveaux ce mois" value={stats.newThisMonth} icon={SparkIcon} tone="amber" />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="salla-panel overflow-hidden">
                        <div className="flex flex-col gap-4 border-b border-stone-200/80 px-6 py-5 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-stone-950 dark:text-white">
                                    Derniers locataires
                                </h3>
                                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                    Apercu rapide des derniers espaces crees.
                                </p>
                            </div>
                            <Link
                                href={route('central.admin.tenants.index')}
                                className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                            >
                                Gerer les locataires
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
                                <thead className="bg-stone-50/80 dark:bg-stone-950/70">
                                    <tr className="text-left text-xs font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                                        <th className="px-6 py-4">Salle</th>
                                        <th className="px-6 py-4">Domaine</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 bg-white/60 dark:divide-stone-800 dark:bg-stone-900/30">
                                    {recentTenants.map((tenant) => (
                                        <tr key={tenant.id} className="text-sm text-stone-700 transition hover:bg-amber-50/70 dark:text-stone-300 dark:hover:bg-amber-500/5">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                                        {tenant.name?.charAt(0).toUpperCase() ?? 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-stone-950 dark:text-white">{tenant.name}</div>
                                                        <div className="text-xs text-stone-500 dark:text-stone-400">{formatDate(tenant.created_at)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{tenant.domain}</td>
                                            <td className="px-6 py-4 capitalize">{tenant.plan}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses[tenant.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700'}`}>
                                                    {statusLabels[tenant.status] ?? tenant.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <QuickPanel
                            title="Catalogue d offres"
                            description="Mettez a jour vos plans et gardez une offre claire pour vos salles."
                            href={route('central.admin.plans.index')}
                            cta="Voir les plans"
                        />
                        <QuickPanel
                            title="Support"
                            description="Accedez aux ressources d aide et suivez les priorites de support."
                            href={route('central.admin.support.index')}
                            cta="Ouvrir le support"
                        />
                        <QuickPanel
                            title="Onboarding"
                            description="Structurez les prochaines mises en service avec une checklist centralisee."
                            href={route('central.admin.onboarding.index')}
                            cta="Voir l onboarding"
                        />
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function HeroMetric({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, tone = 'stone' }) {
    const tones = {
        stone: 'text-stone-700 bg-stone-100 dark:bg-stone-800 dark:text-stone-200',
        emerald: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300',
        rose: 'text-rose-700 bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300',
        amber: 'text-amber-700 bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300',
    };

    return (
        <article className="salla-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
                    <p className="mt-3 text-3xl font-extrabold text-stone-950 dark:text-white">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </article>
    );
}

function QuickPanel({ title, description, href, cta }) {
    return (
        <article className="salla-card p-6">
            <h3 className="text-xl font-bold text-stone-950 dark:text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
            <Link
                href={href}
                className="mt-5 inline-flex rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
                {cta}
            </Link>
        </article>
    );
}

function BuildingIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 20.25h14.5M6.75 20.25V6.75a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v13.5M9.25 9.25h.5m4.5 0h.5m-5 3.5h.5m4.5 0h.5m-5 3.5h.5m4.5 0h.5" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.25 4.25L19 7" />
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

function SparkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-.813-2.096a2.25 2.25 0 0 0-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 0 0 1.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 0 0 1.341 1.341l2.096.813-2.096.813a2.25 2.25 0 0 0-1.341 1.341ZM18 7l.375 1.125A1.5 1.5 0 0 0 19.5 9.25L20.625 9l-1.125.375A1.5 1.5 0 0 0 18.375 10.5L18 11.625l-.375-1.125A1.5 1.5 0 0 0 16.5 9.375L15.375 9l1.125-.25A1.5 1.5 0 0 0 17.625 7.625L18 6.5l.375 1.125Z" />
        </svg>
    );
}
