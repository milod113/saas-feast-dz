import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const emptyForm = {
    id: null,
    name: '',
    description: '',
    price: '',
    is_active: true,
    service_items: [],
};

export default function Index({ packs, services, stats, tenant }) {
    const { flash } = usePage().props;
    const form = useForm(emptyForm);
    const isEditing = Boolean(form.data.id);
    const serviceItems = Array.isArray(form.data.service_items) ? form.data.service_items : [];
    const selectedServiceIds = new Set(serviceItems.map((item) => String(item.service_id)));
    const selectedServices = serviceItems
        .map((item) => {
            const service = services.find((option) => String(option.id) === String(item.service_id));

            if (!service) {
                return null;
            }

            const quantity = Math.max(1, Number(item.quantity || 1));
            const unitPrice = Number(service.price || 0);
            const subtotal = service.pricing_type === 'quote' ? 0 : unitPrice * quantity;

            return { service, quantity, subtotal };
        })
        .filter(Boolean);
    const servicesValue = selectedServices.reduce((sum, item) => sum + item.subtotal, 0);
    const serviceItemsError = form.errors.service_items
        ?? Object.entries(form.errors).find(([key]) => key.startsWith('service_items.'))?.[1];

    const submit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: resetForm,
        };

        if (isEditing) {
            form.put(route('tenant.packs.update', form.data.id), options);
            return;
        }

        form.post(route('tenant.packs.store'), options);
    };

    const resetForm = () => {
        form.clearErrors();
        form.setData({ ...emptyForm });
    };

    const editPack = (pack) => {
        form.clearErrors();
        form.setData({
            id: pack.id,
            name: pack.name ?? '',
            description: pack.description ?? '',
            price: String(pack.price ?? 0),
            is_active: Boolean(pack.is_active),
            service_items: (pack.services ?? [])
                .filter((line) => line.service_id)
                .map((line) => ({
                    service_id: line.service_id,
                    quantity: String(line.quantity || 1),
                })),
        });
    };

    const toggleService = (service, checked) => {
        if (checked) {
            form.setData('service_items', [
                ...serviceItems,
                { service_id: service.id, quantity: '1' },
            ]);
            return;
        }

        form.setData(
            'service_items',
            serviceItems.filter((item) => String(item.service_id) !== String(service.id)),
        );
    };

    const updateServiceQuantity = (serviceId, value) => {
        form.setData(
            'service_items',
            serviceItems.map((item) =>
                String(item.service_id) === String(serviceId)
                    ? { ...item, quantity: value }
                    : item,
            ),
        );
    };

    return (
        <TenantLayout>
            <Head title={`Packs - ${tenant?.name ?? 'Salla'}`} />

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-stone-900 via-amber-800 to-orange-700 p-6 text-white shadow-xl shadow-orange-500/20 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">
                                Offres composees
                            </p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Packs
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-orange-50">
                                Regroupez plusieurs services dans une offre claire avec un prix pack.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <HeroMetric label="Packs" value={stats.total} />
                            <HeroMetric label="Actifs" value={stats.active} />
                            <HeroMetric label="Moyen" value={formatCurrency(stats.averagePrice)} />
                        </div>
                    </div>
                </section>

                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Catalogue
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-stone-950 dark:text-white">
                                    Packs disponibles
                                </h2>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4">
                            {packs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                                    Aucun pack pour le moment.
                                </div>
                            ) : (
                                packs.map((pack) => (
                                    <article key={pack.id} className="rounded-2xl border border-stone-200 bg-white/80 p-5 transition hover:border-amber-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-950/40 dark:hover:border-amber-500/40">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-bold text-stone-950 dark:text-white">{pack.name}</h3>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pack.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
                                                        {pack.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </div>
                                                {pack.description && (
                                                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{pack.description}</p>
                                                )}
                                                {pack.services.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {pack.services.map((line) => (
                                                            <span key={line.id} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                                                                {line.service_name} x{line.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                                                <p className="text-2xl font-extrabold text-stone-950 dark:text-white">
                                                    {formatCurrency(pack.price)}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => editPack(pack)}
                                                        className="rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:text-stone-200 dark:hover:border-amber-500"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <Link
                                                        href={route('tenant.packs.destroy', pack.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
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

                    <form onSubmit={submit} className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                            {isEditing ? 'Edition' : 'Nouveau'}
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-stone-950 dark:text-white">
                            {isEditing ? 'Modifier le pack' : 'Creer un pack'}
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nom du pack" />
                                <TextInput
                                    id="name"
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    required
                                />
                                <InputError message={form.errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    rows="3"
                                    value={form.data.description}
                                    onChange={(event) => form.setData('description', event.target.value)}
                                    className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                />
                                <InputError message={form.errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="price" value="Prix du pack (DZD)" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.price}
                                    onChange={(event) => form.setData('price', event.target.value)}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    required
                                />
                                <InputError message={form.errors.price} className="mt-2" />
                            </div>

                            <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Services inclus</p>
                                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                            Valeur services: {formatCurrency(servicesValue)}
                                        </p>
                                    </div>
                                </div>

                                {services.length === 0 ? (
                                    <div className="mt-4 rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                                        Ajoutez d'abord des services actifs.
                                    </div>
                                ) : (
                                    <div className="mt-4 space-y-3">
                                        {services.map((service) => {
                                            const isSelected = selectedServiceIds.has(String(service.id));

                                            return (
                                                <div key={service.id} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(event) => toggleService(service, event.target.checked)}
                                                                className="mt-1 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                                            />
                                                            <span className="min-w-0">
                                                                <span className="block text-sm font-semibold text-stone-950 dark:text-stone-100">
                                                                    {service.name}
                                                                </span>
                                                                <span className="mt-1 block text-xs text-stone-500 dark:text-stone-400">
                                                                    {service.pricing_type === 'quote' ? 'Sur devis' : formatCurrency(service.price)}
                                                                </span>
                                                            </span>
                                                        </label>

                                                        {isSelected && (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={serviceItems.find((item) => String(item.service_id) === String(service.id))?.quantity ?? '1'}
                                                                onChange={(event) => updateServiceQuantity(service.id, event.target.value)}
                                                                className="w-24 rounded-xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                                                aria-label={`Quantite ${service.name}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <InputError message={serviceItemsError} className="mt-3" />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) => form.setData('is_active', event.target.checked)}
                                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                                    Disponible
                                </span>
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 dark:border-stone-700 dark:text-stone-200"
                                    >
                                        Annuler
                                    </button>
                                )}
                                <PrimaryButton disabled={form.processing}>
                                    {isEditing ? 'Enregistrer' : 'Ajouter le pack'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </TenantLayout>
    );
}

function HeroMetric({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-100">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
        </div>
    );
}

function formatCurrency(value) {
    return `${new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)} DZD`;
}
