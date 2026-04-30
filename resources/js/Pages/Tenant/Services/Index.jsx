import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function emptyForm() {
    return {
        id: null,
        name: '',
        description: '',
        pricing_type: 'fixed',
        price: '0',
        is_active: true,
    };
}

const pricingTypeLabels = {
    fixed: 'Prix fixe',
    per_guest: 'Par invite',
    per_hour: 'Par heure',
    quote: 'Sur devis',
};

function formatCurrency(value) {
    return `${new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)} DZD`;
}

export default function Index({ services, pricingTypes, stats }) {
    const { flash } = usePage().props;
    const form = useForm(emptyForm());
    const isEditing = form.data.id !== null;

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        };

        if (isEditing) {
            form.put(route('tenant.services.update', form.data.id), options);
            return;
        }

        form.post(route('tenant.services.store'), options);
    };

    const editService = (service) => {
        form.setData({
            id: service.id,
            name: service.name ?? '',
            description: service.description ?? '',
            pricing_type: service.pricing_type ?? 'fixed',
            price: String(service.price ?? 0),
            is_active: Boolean(service.is_active),
        });
        form.clearErrors();
    };

    const cancelEdit = () => {
        form.reset();
        form.clearErrors();
    };

    return (
        <TenantLayout>
            <Head title="Services" />

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">
                                Prestations
                            </p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Services additionnels
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-orange-50 sm:text-base">
                                Ajoutez decoration, traiteur, DJ, nettoyage ou toute prestation que la salle peut vendre avec la location.
                            </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <HeroMetric label="Services" value={stats.total} />
                            <HeroMetric label="Actifs" value={stats.active} />
                            <HeroMetric label="Prix moyen" value={formatCurrency(stats.averagePrice)} />
                        </div>
                    </div>
                </section>

                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <section className="salla-panel overflow-hidden">
                        <div className="border-b border-stone-200/80 px-6 py-5 dark:border-stone-800">
                            <h2 className="text-xl font-bold text-stone-950 dark:text-white">Catalogue</h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                Ces services seront proposés dans les fiches de réservation.
                            </p>
                        </div>

                        <div className="grid gap-4 p-5">
                            {services.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/50 dark:text-stone-400">
                                    Aucun service pour le moment.
                                </div>
                            ) : (
                                services.map((service) => (
                                    <article key={service.id} className="rounded-2xl border border-stone-200 bg-white/80 p-5 transition hover:border-amber-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-950/40 dark:hover:border-amber-500/40">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-bold text-stone-950 dark:text-white">{service.name}</h3>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${service.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
                                                        {service.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                                                        {pricingTypeLabels[service.pricing_type] ?? service.pricing_type}
                                                    </span>
                                                </div>
                                                {service.description && (
                                                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{service.description}</p>
                                                )}
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-xl font-extrabold text-stone-950 dark:text-white">
                                                    {service.pricing_type === 'quote' ? 'Sur devis' : formatCurrency(service.price)}
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => editService(service)}
                                                        className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <Link
                                                        href={route('tenant.services.destroy', service.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                                                    >
                                                        Supprimer
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    <aside className="salla-card p-6">
                        <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                                {isEditing ? 'Edition' : 'Nouveau service'}
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold text-stone-950 dark:text-white">
                                {isEditing ? 'Modifier le service' : 'Ajouter une prestation'}
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nom du service" />
                                <TextInput
                                    id="name"
                                    value={form.data.name}
                                    className="mt-1 block w-full"
                                    placeholder="Decoration, DJ, traiteur..."
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    rows="4"
                                    value={form.data.description}
                                    className="mt-1 block w-full rounded-2xl border-stone-200 bg-white/90 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100"
                                    placeholder="Details de la prestation..."
                                    onChange={(event) => form.setData('description', event.target.value)}
                                />
                                <InputError message={form.errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="pricing_type" value="Type de prix" />
                                <select
                                    id="pricing_type"
                                    value={form.data.pricing_type}
                                    onChange={(event) => form.setData('pricing_type', event.target.value)}
                                    className="mt-1 block w-full rounded-2xl border-stone-200 bg-white/90 py-3 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100"
                                >
                                    {pricingTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.pricing_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="price" value="Prix (DZD)" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.price}
                                    className="mt-1 block w-full"
                                    onChange={(event) => form.setData('price', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.price} className="mt-2" />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) => form.setData('is_active', event.target.checked)}
                                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                />
                                Disponible dans les reservations
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                {isEditing && (
                                    <SecondaryButton type="button" onClick={cancelEdit}>
                                        Annuler
                                    </SecondaryButton>
                                )}
                                <PrimaryButton disabled={form.processing}>
                                    {isEditing ? 'Enregistrer' : 'Ajouter'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </aside>
                </div>
            </div>
        </TenantLayout>
    );
}

function HeroMetric({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">{label}</p>
            <p className="mt-2 text-lg font-extrabold text-white">{value}</p>
        </div>
    );
}
