import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ metrics, resources }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-stone-950 dark:text-white">
                        Support
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Ressources et signaux utiles pour l accompagnement.
                    </p>
                </div>
            }
        >
            <Head title="Support" />

            <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-3">
                    <MetricCard title="Locataires actifs" value={metrics.activeTenants} tone="emerald" />
                    <MetricCard title="Locataires suspendus" value={metrics.suspendedTenants} tone="rose" />
                    <MetricCard title="Nouveaux 7 jours" value={metrics.newTenants} tone="amber" />
                </section>

                <section className="grid gap-5 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <article key={resource.title} className="salla-card p-6">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                <LifeIcon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-stone-950 dark:text-white">{resource.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                {resource.description}
                            </p>
                        </article>
                    ))}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function MetricCard({ title, value, tone }) {
    const tones = {
        emerald: 'text-emerald-700 dark:text-emerald-300',
        rose: 'text-rose-700 dark:text-rose-300',
        amber: 'text-amber-700 dark:text-amber-300',
    };

    return (
        <article className="salla-card p-6">
            <p className="text-sm text-stone-500 dark:text-stone-400">{title}</p>
            <p className={`mt-4 text-4xl font-extrabold ${tones[tone]}`}>{value}</p>
        </article>
    );
}

function LifeIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25A8.25 8.25 0 1 0 12 3.75a8.25 8.25 0 0 0 0 16.5Zm0-11.25a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5.303-1.947 3.181 3.181m4.244 4.244 3.181 3.181m0-10.606-3.181 3.181m-4.244 4.244-3.181 3.181" />
        </svg>
    );
}
