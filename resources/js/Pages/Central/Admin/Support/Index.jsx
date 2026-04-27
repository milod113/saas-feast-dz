import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ metrics, resources }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                        Accompagnement
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-stone-900">
                        Support
                    </h2>
                </div>
            }
        >
            <Head title="Support" />

            <div className="space-y-8">
                <section className="grid gap-4 md:grid-cols-3">
                    <MetricCard title="Locataires actifs" value={metrics.activeTenants} tone="emerald" />
                    <MetricCard title="Locataires suspendus" value={metrics.suspendedTenants} tone="rose" />
                    <MetricCard title="Nouveaux 7 jours" value={metrics.newTenants} tone="amber" />
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <article
                            key={resource.title}
                            className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200"
                        >
                            <h3 className="text-xl font-semibold text-stone-950">{resource.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-stone-600">
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
