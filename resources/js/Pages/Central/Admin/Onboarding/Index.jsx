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
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                        Accompagnement
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-stone-900">
                        Onboarding
                    </h2>
                </div>
            }
        >
            <Head title="Onboarding" />

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
                    <h3 className="text-xl font-semibold text-stone-950">Checklist standard</h3>
                    <ul className="mt-6 space-y-4">
                        {checklist.map((item, index) => (
                            <li key={item} className="flex items-start gap-4 text-sm text-stone-700">
                                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                                    {index + 1}
                                </span>
                                <span className="leading-7">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="border-b border-stone-200 px-6 py-5">
                        <h3 className="text-xl font-semibold text-stone-950">
                            Derniers espaces a accompagner
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                            Utilisez cette liste pour prioriser les mises en service.
                        </p>
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
                                {latestTenants.map((tenant) => (
                                    <tr key={tenant.id} className="text-sm text-stone-700">
                                        <td className="px-6 py-4 font-medium text-stone-900">{tenant.name}</td>
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
