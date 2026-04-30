import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

const statusStyles = {
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

export default function Index({ tenants, stats, filters }) {
    const { flash } = usePage().props;

    const handleSearch = (value) => {
        router.get(
            route('central.admin.tenants.index'),
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-stone-950 dark:text-white">
                        Gestion des locataires
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Rechercher, suivre et gerer les espaces clients.
                    </p>
                </div>
            }
        >
            <Head title="Administration SaaS" />

            <div className="space-y-6">
                    {flash?.success && (
                        <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900">
                            {flash.success}
                        </div>
                    )}

                    <section className="grid gap-4 md:grid-cols-3">
                        <article className="salla-card p-6">
                            <p className="text-sm text-stone-500 dark:text-stone-400">Total des locataires</p>
                            <p className="mt-4 text-4xl font-extrabold text-stone-950 dark:text-stone-100">{stats.totalTenants}</p>
                        </article>
                        <article className="salla-card p-6">
                            <p className="text-sm text-stone-500 dark:text-stone-400">Locataires actifs</p>
                            <p className="mt-4 text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">{stats.activeTenants}</p>
                        </article>
                        <article className="salla-card p-6">
                            <p className="text-sm text-stone-500 dark:text-stone-400">Locataires suspendus</p>
                            <p className="mt-4 text-4xl font-extrabold text-rose-700 dark:text-rose-300">{stats.suspendedTenants}</p>
                        </article>
                    </section>

                    <section className="salla-panel overflow-hidden p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100">
                                    Liste des locataires
                                </h3>
                                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                                    Recherchez et suspendez un espace client depuis la console centrale.
                                </p>
                            </div>

                            <div className="w-full sm:max-w-xs">
                                <InputLabel htmlFor="search" value="Recherche" />
                                <TextInput
                                    id="search"
                                    value={filters.search}
                                    className="mt-1 block w-full"
                                    placeholder="Nom ou domaine"
                                    onChange={(event) => handleSearch(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                            <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
                                <thead className="bg-stone-50 dark:bg-stone-950/60">
                                    <tr className="text-left text-xs uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                                        <th className="px-4 py-3">Salle</th>
                                        <th className="px-4 py-3">Domaine</th>
                                        <th className="px-4 py-3">Plan</th>
                                        <th className="px-4 py-3">Statut</th>
                                        <th className="px-4 py-3">Creation</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 bg-white/60 dark:divide-stone-800 dark:bg-stone-900/30">
                                    {tenants.map((tenant) => (
                                        <tr key={tenant.id} className="text-sm text-stone-700 transition hover:bg-amber-50/70 dark:text-stone-300 dark:hover:bg-amber-500/5">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-stone-900 dark:text-stone-100">{tenant.name}</div>
                                                <div className="text-xs text-stone-500 dark:text-stone-400">{tenant.owner?.email ?? 'Sans responsable'}</div>
                                            </td>
                                            <td className="px-4 py-4">{tenant.domain}</td>
                                            <td className="px-4 py-4 capitalize">{tenant.plan}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[tenant.status] ?? 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700'}`}
                                                >
                                                    {statusLabels[tenant.status] ?? tenant.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{formatDate(tenant.created_at)}</td>
                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.patch(route('central.admin.tenants.toggle-status', tenant.id))
                                                    }
                                                    className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                                                >
                                                    {tenant.status === 'active' ? 'Suspendre' : 'Activer'}
                                                </button>
                                            </td>
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
