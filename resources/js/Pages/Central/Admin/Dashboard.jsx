import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const statusClasses = {
    active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    suspended: 'bg-rose-100 text-rose-700 ring-rose-200',
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
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                        Administration SaaS
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-stone-900">
                        Vue d ensemble
                    </h2>
                </div>
            }
        >
            <Head title="Vue d ensemble" />

            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white shadow-lg shadow-orange-200 sm:px-8">
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-orange-100">
                        Plateforme centrale
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                        Pilotez votre SaaS depuis une seule console.
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm text-orange-50 sm:text-base">
                        Suivez la croissance, gerez les locataires et structurez vos offres sans quitter l espace d administration.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total locataires" value={stats.totalTenants} />
                    <StatCard title="Actifs" value={stats.activeTenants} tone="emerald" />
                    <StatCard title="Suspendus" value={stats.suspendedTenants} tone="rose" />
                    <StatCard title="Nouveaux ce mois" value={stats.newThisMonth} tone="amber" />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200">
                        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
                            <div>
                                <h3 className="text-xl font-semibold text-stone-900">
                                    Derniers locataires
                                </h3>
                                <p className="mt-1 text-sm text-stone-500">
                                    Apercu rapide des derniers espaces crees.
                                </p>
                            </div>
                            <Link
                                href={route('central.admin.tenants.index')}
                                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                            >
                                Gerer les locataires
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-stone-200">
                                <thead className="bg-stone-50">
                                    <tr className="text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                                        <th className="px-6 py-4">Salle</th>
                                        <th className="px-6 py-4">Domaine</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 bg-white">
                                    {recentTenants.map((tenant) => (
                                        <tr key={tenant.id} className="text-sm text-stone-700">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-stone-900">{tenant.name}</div>
                                                <div className="text-xs text-stone-500">{formatDate(tenant.created_at)}</div>
                                            </td>
                                            <td className="px-6 py-4">{tenant.domain}</td>
                                            <td className="px-6 py-4 capitalize">{tenant.plan}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[tenant.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200'}`}>
                                                    {statusLabels[tenant.status] ?? tenant.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <QuickPanel
                            title="Catalogue d offres"
                            description="Mettez a jour vos plans et gardez une offre claire pour vos salles."
                            href={route('central.admin.plans.index')}
                            cta="Voir les plans"
                        />
                        <QuickPanel
                            title="Support & accompagnement"
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

function StatCard({ title, value, tone = 'stone' }) {
    const tones = {
        stone: 'text-stone-950',
        emerald: 'text-emerald-700',
        rose: 'text-rose-700',
        amber: 'text-amber-700',
    };

    return (
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <p className="text-sm text-stone-500">{title}</p>
            <p className={`mt-4 text-4xl font-semibold ${tones[tone]}`}>{value}</p>
        </article>
    );
}

function QuickPanel({ title, description, href, cta }) {
    return (
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h3 className="text-xl font-semibold text-stone-950">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
            <Link
                href={href}
                className="mt-5 inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
                {cta}
            </Link>
        </article>
    );
}
