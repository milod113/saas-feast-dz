import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link } from '@inertiajs/react';

export default function FormPage({
    title,
    form,
    submitLabel,
    submit,
    clients,
    statuses,
    services = [],
    unavailableDates = [],
    mode,
    reservation = null,
}) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const reservationMode = isCreate ? (form.data.reservation_mode || 'existing') : 'existing';
    const isExpress = isCreate && reservationMode === 'express';
    const locationPrice = Number(form.data.location_price || 0);
    const serviceItems = Array.isArray(form.data.service_items) ? form.data.service_items : [];
    const serviceById = new Map(services.map((service) => [String(service.id), service]));
    const selectedServiceIds = new Set(serviceItems.map((item) => String(item.service_id)));
    const selectedServices = serviceItems
        .map((item) => {
            const service = serviceById.get(String(item.service_id));

            if (!service) {
                return null;
            }

            const quantity = Math.max(1, Number(item.quantity || 1));
            const unitPrice = Number(service.price || 0);
            const subtotal = service.pricing_type === 'quote' ? 0 : unitPrice * quantity;

            return { service, quantity, unitPrice, subtotal };
        })
        .filter(Boolean);
    const servicesTotal = selectedServices.reduce((sum, item) => sum + item.subtotal, 0);
    const total = locationPrice + servicesTotal;
    const initialPayment = Number(form.data.initial_payment_amount || 0);
    const paidAmount = isCreate ? initialPayment : Number(reservation?.paid_amount ?? 0);
    const remaining = Math.max(total - paidAmount, 0);
    const serviceItemsError = form.errors.service_items
        ?? Object.entries(form.errors).find(([key]) => key.startsWith('service_items.'))?.[1];
    const occupiedDateSet = new Set(unavailableDates);
    const smartSuggestions = getNearestAvailableDates(form.data.event_date, occupiedDateSet, 5);
    const selectedDateIsUnavailable = Boolean(form.data.event_date) && occupiedDateSet.has(form.data.event_date);

    const formatCurrency = (value) =>
        `${new Intl.NumberFormat('fr-DZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)} DZD`;

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

    const servicePriceLabel = (service) => {
        if (service.pricing_type === 'quote') {
            return 'Sur devis';
        }

        const pricingTypeLabels = {
            fixed: 'Prix fixe',
            per_guest: 'Par invite',
            per_hour: 'Par heure',
        };

        return `${formatCurrency(Number(service.price || 0))} - ${pricingTypeLabels[service.pricing_type] ?? 'Prix'}`;
    };

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mx-auto max-w-4xl space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-8 text-white shadow-lg shadow-orange-200 dark:shadow-none sm:px-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-100">
                                Reservations
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                                {title}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-orange-50 sm:text-base">
                                {isCreate
                                    ? 'Creez une nouvelle reservation, ajoutez un premier paiement si besoin et suivez le solde restant.'
                                    : 'Mettez a jour les informations de la reservation et accedez rapidement au suivi des paiements.'}
                            </p>
                        </div>

                        <Link
                            href={route('tenant.reservations.index')}
                            className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
                        >
                            Retour
                        </Link>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                        className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-8"
                    >
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Informations principales
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-stone-950 dark:text-stone-100">
                                Fiche reservation
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                {isCreate && (
                                    <div className="mb-4 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                form.setData({
                                                    ...form.data,
                                                    reservation_mode: 'existing',
                                                    client_name: '',
                                                    client_phone: '',
                                                    client_email: '',
                                                })
                                            }
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                !isExpress
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                                                    : 'border border-stone-300 bg-white text-stone-700'
                                            }`}
                                        >
                                            Client existant
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                form.setData({
                                                    ...form.data,
                                                    reservation_mode: 'express',
                                                    client_id: '',
                                                })
                                            }
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                isExpress
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                                                    : 'border border-stone-300 bg-white text-stone-700'
                                            }`}
                                        >
                                            Reservation express
                                        </button>
                                    </div>
                                )}

                                {!isExpress ? (
                                    <>
                                        <InputLabel htmlFor="client_id" value="Client" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                                                <UserIcon className="h-5 w-5" />
                                            </div>
                                            <select
                                                id="client_id"
                                                value={form.data.client_id}
                                                onChange={(event) => form.setData('client_id', event.target.value)}
                                                className="block w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                                required
                                            >
                                                <option value="">Selectionner un client</option>
                                                {clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name}
                                                        {client.phone ? ` - ${client.phone}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <InputError message={form.errors.client_id} className="mt-2" />
                                    </>
                                ) : (
                                    <div className="rounded-[1.5rem] bg-gradient-to-r from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200 dark:from-amber-950/30 dark:to-orange-950/20 dark:ring-amber-900/40">
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Mode express
                                        </p>
                                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                            Saisissez le minimum. Si le client n'existe pas, il sera cree automatiquement.
                                        </p>

                                        <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <InputLabel htmlFor="client_name" value="Nom complet *" />
                                                <TextInput
                                                    id="client_name"
                                                    value={form.data.client_name}
                                                    className="mt-1 block w-full rounded-xl py-3"
                                                    onChange={(event) => form.setData('client_name', event.target.value)}
                                                    required={isExpress}
                                                />
                                                <InputError message={form.errors.client_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="client_phone" value="Telephone *" />
                                                <TextInput
                                                    id="client_phone"
                                                    value={form.data.client_phone}
                                                    className="mt-1 block w-full rounded-xl py-3"
                                                    onChange={(event) => form.setData('client_phone', event.target.value)}
                                                    required={isExpress}
                                                />
                                                <InputError message={form.errors.client_phone} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="client_email" value="E-mail" />
                                                <TextInput
                                                    id="client_email"
                                                    type="email"
                                                    value={form.data.client_email}
                                                    className="mt-1 block w-full rounded-xl py-3"
                                                    onChange={(event) => form.setData('client_email', event.target.value)}
                                                />
                                                <InputError message={form.errors.client_email} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="event_date" value="Date de l evenement" />
                                <TextInput
                                    id="event_date"
                                    type="date"
                                    value={form.data.event_date}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    onChange={(event) => form.setData('event_date', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.event_date} className="mt-2" />
                                {isExpress && (
                                    <div className="mt-3 space-y-3">
                                        {selectedDateIsUnavailable && (
                                            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:ring-rose-900/40">
                                                Cette date semble deja prise. Voici des dates libres proches.
                                            </div>
                                        )}

                                        {smartSuggestions.length > 0 && (
                                            <div className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-200 dark:bg-amber-950/20 dark:ring-amber-900/40">
                                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                                    Dates libres proches
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {smartSuggestions.map((date) => (
                                                        <button
                                                            key={date}
                                                            type="button"
                                                            onClick={() => form.setData('event_date', date)}
                                                            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                                                                form.data.event_date === date
                                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                                                                    : 'bg-white text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 dark:bg-stone-900 dark:text-amber-300 dark:ring-amber-900/40'
                                                            }`}
                                                        >
                                                            {formatShortDate(date)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Statut" />
                                <select
                                    id="status"
                                    value={form.data.status}
                                    onChange={(event) => form.setData('status', event.target.value)}
                                    className="mt-1 block w-full rounded-xl border border-stone-300 bg-white py-3 px-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                    required
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.status} className="mt-2" />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="location_price" value="Prix salle (DZD)" />
                                <TextInput
                                    id="location_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.location_price}
                                    className="mt-1 block w-full rounded-xl py-3"
                                    onChange={(event) => form.setData('location_price', event.target.value)}
                                    required
                                />
                                <InputError message={form.errors.location_price} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                        Services additionnels
                                    </p>
                                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                        Cochez les prestations choisies pour les ajouter au total de la reservation.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white px-4 py-2 text-right ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                                        Services
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-stone-950 dark:text-stone-100">
                                        {formatCurrency(servicesTotal)}
                                    </p>
                                </div>
                            </div>

                            {services.length === 0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
                                    Aucun service actif pour le moment.
                                </div>
                            ) : (
                                <div className="mt-5 grid gap-3">
                                    {services.map((service) => {
                                        const isSelected = selectedServiceIds.has(String(service.id));
                                        const selectedLine = selectedServices.find((item) => String(item.service.id) === String(service.id));

                                        return (
                                            <div
                                                key={service.id}
                                                className={`rounded-2xl border p-4 transition ${
                                                    isSelected
                                                        ? 'border-amber-300 bg-amber-50/70 dark:border-amber-500/40 dark:bg-amber-500/10'
                                                        : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
                                                }`}
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(event) => toggleService(service, event.target.checked)}
                                                            className="mt-1 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                                        />
                                                        <span className="min-w-0">
                                                            <span className="block font-semibold text-stone-950 dark:text-stone-100">
                                                                {service.name}
                                                            </span>
                                                            {service.description && (
                                                                <span className="mt-1 block text-sm text-stone-500 dark:text-stone-400">
                                                                    {service.description}
                                                                </span>
                                                            )}
                                                            <span className="mt-2 block text-sm font-medium text-amber-700 dark:text-amber-300">
                                                                {servicePriceLabel(service)}
                                                            </span>
                                                        </span>
                                                    </label>

                                                    {isSelected && service.pricing_type !== 'quote' && (
                                                        <div className="flex items-center gap-3 sm:justify-end">
                                                            <label className="text-sm font-medium text-stone-600 dark:text-stone-300" htmlFor={`service-${service.id}-quantity`}>
                                                                Quantite
                                                            </label>
                                                            <input
                                                                id={`service-${service.id}-quantity`}
                                                                type="number"
                                                                min="1"
                                                                value={serviceItems.find((item) => String(item.service_id) === String(service.id))?.quantity ?? '1'}
                                                                onChange={(event) => updateServiceQuantity(service.id, event.target.value)}
                                                                className="w-24 rounded-xl border-stone-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                                            />
                                                            <span className="min-w-[7rem] text-right text-sm font-semibold text-stone-900 dark:text-stone-100">
                                                                {formatCurrency(selectedLine?.subtotal ?? 0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <InputError message={serviceItemsError} className="mt-3" />
                        </div>

                        {isCreate ? (
                            <div className="mt-8 rounded-[1.5rem] bg-gradient-to-r from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200 dark:from-amber-950/30 dark:to-orange-950/20 dark:ring-amber-900/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                                        <WalletIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Premier paiement optionnel
                                        </p>
                                        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                            Enregistrez un acompte des la creation si le client a deja verse une avance.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="initial_payment_amount" value="Montant du paiement (DZD)" />
                                        <TextInput
                                            id="initial_payment_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.data.initial_payment_amount}
                                            className="mt-1 block w-full rounded-xl py-3"
                                            onChange={(event) => form.setData('initial_payment_amount', event.target.value)}
                                        />
                                        <InputError message={form.errors.initial_payment_amount} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="initial_payment_date" value="Date du paiement" />
                                        <TextInput
                                            id="initial_payment_date"
                                            type="date"
                                            value={form.data.initial_payment_date}
                                            className="mt-1 block w-full rounded-xl py-3"
                                            onChange={(event) => form.setData('initial_payment_date', event.target.value)}
                                        />
                                        <InputError message={form.errors.initial_payment_date} className="mt-2" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="initial_payment_method" value="Mode du premier paiement" />
                                        <select
                                            id="initial_payment_method"
                                            value={form.data.initial_payment_method}
                                            onChange={(event) => form.setData('initial_payment_method', event.target.value)}
                                            className="mt-1 block w-full rounded-xl border border-stone-300 bg-white py-3 px-4 text-stone-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        >
                                            <option value="cash">Especes</option>
                                            <option value="bank_transfer">Virement bancaire</option>
                                            <option value="ccp">CCP</option>
                                            <option value="cheque">Cheque</option>
                                        </select>
                                        <InputError message={form.errors.initial_payment_method} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Paiements deja encaisses
                                        </p>
                                        <p className="mt-2 text-3xl font-semibold text-stone-950 dark:text-stone-100">
                                            {formatCurrency(Number(reservation?.paid_amount ?? 0))}
                                        </p>
                                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                            Reste a payer: {formatCurrency(Number(reservation?.remaining_balance ?? 0))}
                                        </p>
                                    </div>

                                    <Link
                                        href={route('tenant.payments.index', { reservation_id: reservation?.id })}
                                        className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400"
                                    >
                                        Gerer les paiements
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <PrimaryButton disabled={form.processing}>{submitLabel}</PrimaryButton>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Resume financier
                            </p>
                            <div className="mt-5 space-y-4">
                                <MetricCard
                                    label="Prix salle"
                                    value={formatCurrency(locationPrice)}
                                    tone="stone"
                                />
                                <MetricCard
                                    label="Services additionnels"
                                    value={formatCurrency(servicesTotal)}
                                    tone="amber"
                                />
                                <MetricCard
                                    label="Montant total"
                                    value={formatCurrency(total)}
                                    tone="emerald"
                                />
                                <MetricCard
                                    label={isCreate ? 'Premier paiement' : 'Montant encaisse'}
                                    value={formatCurrency(isCreate ? initialPayment : Number(reservation?.paid_amount ?? 0))}
                                    tone="stone"
                                />
                                <MetricCard
                                    label="Reste a payer"
                                    value={formatCurrency(remaining)}
                                    tone="emerald"
                                />
                            </div>
                        </section>

                        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Bonnes pratiques
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Verifiez la disponibilite de la date avant confirmation.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Ajoutez un premier paiement uniquement si une avance a deja ete recue.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                                    <span>Le solde restant sera mis a jour automatiquement via le module Paiements.</span>
                                </li>
                            </ul>
                        </section>

                        {isEdit && reservation && (
                            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Reservation
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                                    <p>
                                        <span className="font-medium text-stone-900 dark:text-stone-100">Client:</span>{' '}
                                        {reservation.client_name}
                                    </p>
                                    <p>
                                        <span className="font-medium text-stone-900 dark:text-stone-100">Etat:</span>{' '}
                                        {statuses.find((status) => status.value === reservation.status)?.label ?? reservation.status}
                                    </p>
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </TenantLayout>
    );
}

function MetricCard({ label, value, tone }) {
    const tones = {
        stone: 'bg-stone-50 text-stone-900 ring-stone-200 dark:bg-stone-950 dark:text-stone-100 dark:ring-stone-800',
        amber: 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900/40',
        emerald: 'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900/40',
    };

    return (
        <div className={`rounded-2xl p-4 ring-1 ${tones[tone]}`}>
            <p className="text-sm opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

function UserIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}

function WalletIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5v9A2.25 2.25 0 0 1 18.75 18.75H5.25A2.25 2.25 0 0 1 3 16.5v-9A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12h.008v.008H16.5V12Zm-13.5-4.5 11.53-3.295A1.5 1.5 0 0 1 16.5 5.648V5.25" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function getNearestAvailableDates(selectedDate, occupiedDateSet, limit = 5) {
    const suggestions = [];
    const anchor = parseDateValue(selectedDate) ?? startOfToday();
    let cursor = new Date(anchor);

    while (suggestions.length < limit) {
        const isoDate = formatIsoDate(cursor);

        if (!occupiedDateSet.has(isoDate)) {
            suggestions.push(isoDate);
        }

        cursor.setDate(cursor.getDate() + 1);
    }

    return suggestions;
}

function parseDateValue(value) {
    if (!value) {
        return null;
    }

    const [year, month, day] = String(value).split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}

function startOfToday() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function formatIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'short',
    }).format(parseDateValue(value) ?? new Date(value));
}
