import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const statusLabels = {
    active: 'Actif',
    suspended: 'Suspendu',
};

export default function Index({ checklist, latestTenants }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-stone-950 dark:text-white">
                        Onboarding
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Checklist de mise en service et derniers espaces a accompagner.
                    </p>
                </div>
            }
        >
            <Head title="Onboarding" />

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <section className="salla-card p-6">
                    <h3 className="text-xl font-bold text-stone-950 dark:text-white">Checklist standard</h3>
                    <ul className="mt-6 space-y-4">
                        {checklist.map((item, index) => (
                            <li key={item} className="flex items-start gap-4 text-sm text-stone-700 dark:text-stone-300">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                                    {index + 1}
                                </span>
                                <span className="leading-7">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="salla-panel overflow-hidden">
                    <div className="border-b border-stone-200/80 px-6 py-5 dark:border-stone-800">
                        <h3 className="text-xl font-bold text-stone-950 dark:text-white">
                            Derniers espaces a accompagner
                        </h3>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Utilisez cette liste pour prioriser les mises en service.
                        </p>
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
                                {latestTenants.map((tenant) => (
                                    <tr key={tenant.id} className="text-sm text-stone-700 transition hover:bg-amber-50/70 dark:text-stone-300 dark:hover:bg-amber-500/5">
                                        <td className="px-6 py-4 font-semibold text-stone-950 dark:text-white">{tenant.name}</td>
                                        <td className="px-6 py-4">{tenant.domain}</td>
                                        <td className="px-6 py-4 capitalize">{tenant.plan}</td>
                                        <td className="px-6 py-4">{statusLabels[tenant.status] ?? tenant.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
