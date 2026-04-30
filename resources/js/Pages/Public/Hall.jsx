import InputError from '@/Components/InputError';
import PublicTenantProfile from '@/Pages/Public/PublicTenantProfile';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CalendarDays, ChevronRight, LayoutGrid, Ticket } from 'lucide-react';
import { useState } from 'react';

const fallbackHeroImage =
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80';

const statusLabels = {
    confirmed: 'Confirmee',
    pending: 'En attente',
    cancelled: 'Annulee',
};

export default function Hall({
    tenant,
    marketplaceUrl,
    reservations,
    unavailableDates,
    services = [],
    bookingActionUrl = null,
}) {
    const { flash } = usePage().props;
    const heroImage = tenant.photos?.[0]?.url ?? fallbackHeroImage;
    const [activePanel, setActivePanel] = useState(flash?.success ? 'booking' : 'overview');
    const form = useForm({
        client_name: '',
        phone: '',
        email: '',
        event_date: '',
        service_items: [],
        notes: '',
    });
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
    const servicesTotal = selectedServices.reduce((sum, item) => sum + item.subtotal, 0);
    const serviceItemsError = form.errors.service_items
        ?? Object.entries(form.errors).find(([key]) => key.startsWith('service_items.'))?.[1];

    const submit = (event) => {
        event.preventDefault();

        const actionUrl = bookingActionUrl ?? route('public.hall.booking.store');

        form.post(actionUrl, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
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

    const servicePriceLabel = (service) => {
        if (service.pricing_type === 'quote') {
            return 'Sur devis';
        }

        const pricingTypeLabels = {
            fixed: 'Prix fixe',
            per_guest: 'Par invite',
            per_hour: 'Par heure',
        };

        return `${formatCurrency(Number(service.price || 0))} DZD - ${pricingTypeLabels[service.pricing_type] ?? 'Prix'}`;
    };

    return (
        <>
            <Head title={tenant.name} />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.14),_transparent_30%),linear-gradient(180deg,_#fafaf9_0%,_#ffffff_42%,_#fff7ed_100%)] text-stone-950">
                <section
                    className="relative min-h-[76vh] overflow-hidden bg-cover bg-center text-white"
                    style={{
                        backgroundImage: `linear-gradient(115deg, rgba(28,25,23,0.88) 0%, rgba(120,53,15,0.66) 42%, rgba(190,24,93,0.46) 100%), url(${heroImage})`,
                    }}
                >
                    <div className="absolute inset-0">
                        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-amber-400/18 blur-3xl"></div>
                        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-400/16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-300/12 blur-3xl"></div>
                    </div>

                    <div className="mx-auto flex min-h-[76vh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                        <header className="flex items-center justify-between py-5">
                            <a href={marketplaceUrl} className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-white backdrop-blur-md ring-1 ring-white/20">
                                    <SparkIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold">Salla</p>
                                    <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                                        Marketplace
                                    </p>
                                </div>
                            </a>

                            <Link
                                href={route('login')}
                                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/16"
                            >
                                Espace gerant
                            </Link>
                        </header>

                        <div className="flex flex-1 items-center py-10">
                            <div className="max-w-3xl">
                                <p className="inline-flex rounded-full border border-amber-300/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                                    Salle des fetes
                                </p>
                                <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                                    {tenant.name}
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-8 text-white/82">
                                    Consultez les prochaines dates occupees et envoyez une demande de reservation. La salle confirmera les details avec vous.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {tenant.commune || tenant.wilaya ? (
                                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                                            {[tenant.commune, tenant.wilaya].filter(Boolean).join(', ')}
                                        </span>
                                    ) : null}
                                    {tenant.capacity_max ? (
                                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                                            {tenant.capacity_max} invites
                                        </span>
                                    ) : null}
                                    {tenant.has_air_conditioning ? (
                                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                                            Climatisation
                                        </span>
                                    ) : null}
                                </div>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href="#reservation"
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-amber-900/20 transition hover:scale-[1.01]"
                                    >
                                        Demander une reservation
                                    </a>
                                    <a
                                        href={marketplaceUrl}
                                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/12"
                                    >
                                        Retour marketplace
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
                    <section className="rounded-[2rem] bg-white/90 p-4 shadow-2xl ring-1 ring-amber-100 backdrop-blur sm:p-5">
                        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                                    Experience dynamique
                                </p>
                                <h2 className="mt-2 text-2xl font-black text-stone-950 sm:text-3xl">
                                    Explorez la salle par etapes
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-stone-600">
                                    On affiche d abord l essentiel, puis le visiteur ouvre seulement la section qui l interesse.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={() => setActivePanel('overview')}
                                    className={tabClassName(activePanel === 'overview')}
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                    <span>Presentation</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivePanel('calendar')}
                                    className={tabClassName(activePanel === 'calendar')}
                                >
                                    <CalendarDays className="h-5 w-5" />
                                    <span>Planning</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivePanel('booking')}
                                    className={tabClassName(activePanel === 'booking')}
                                >
                                    <Ticket className="h-5 w-5" />
                                    <span>Reservation</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr]">
                        <aside className="space-y-4">
                            <div className="rounded-[1.75rem] bg-gradient-to-br from-stone-950 via-stone-900 to-rose-950 p-6 text-white shadow-xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                                    Apercu rapide
                                </p>
                                <h3 className="mt-3 text-2xl font-black">{tenant.name}</h3>
                                <p className="mt-2 text-sm leading-7 text-white/72">
                                    Une navigation plus moderne: moins d informations visibles d un coup, plus de focus sur l action.
                                </p>
                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                                        <span className="text-white/70">Photos</span>
                                        <span className="font-semibold">{tenant.photos?.length ?? 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                                        <span className="text-white/70">Dates publiques</span>
                                        <span className="font-semibold">{reservations.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                                        <span className="text-white/70">Services</span>
                                        <span className="font-semibold">{services.length}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActivePanel('booking')}
                                className="flex w-full items-center justify-between rounded-[1.5rem] bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-4 text-left text-white shadow-lg shadow-amber-200"
                            >
                                <span>
                                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                                        Action rapide
                                    </span>
                                    <span className="mt-1 block text-base font-bold">
                                        Ouvrir la reservation
                                    </span>
                                </span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </aside>

                        <div className="space-y-6">
                            {activePanel === 'overview' && (
                                <div className="animate-[fadeIn_.35s_ease]">
                                    <PublicTenantProfile tenant={tenant} />
                                </div>
                            )}

                            {activePanel === 'calendar' && (
                                <section className="animate-[fadeIn_.35s_ease] space-y-5 rounded-[1.75rem] bg-white/85 p-6 shadow-xl ring-1 ring-amber-100 backdrop-blur">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                                            Planning public
                                        </p>
                                        <h2 className="mt-2 text-3xl font-black text-stone-950">
                                            Dates deja demandees
                                        </h2>
                                        <p className="mt-2 text-sm leading-7 text-stone-600">
                                            Les demandes confirmees ou en attente sont visibles pour eviter les doublons.
                                        </p>
                                    </div>

                                    {reservations.length === 0 ? (
                                        <p className="text-sm text-stone-600">
                                            Aucune date publique pour le moment.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {reservations.map((reservation) => (
                                                <div
                                                    key={reservation.id}
                                                    className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-white to-rose-50/45 px-4 py-3 ring-1 ring-stone-200/80"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-stone-950">
                                                            {formatDate(reservation.event_date)}
                                                        </p>
                                                        <p className="mt-1 text-xs text-stone-500">
                                                            {reservation.client_name}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full bg-gradient-to-r from-amber-100 to-rose-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                                                        {statusLabels[reservation.status] ?? reservation.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {activePanel === 'booking' && (
                                <section id="reservation" className="animate-[fadeIn_.35s_ease] rounded-[1.75rem] bg-white/92 p-6 shadow-2xl ring-1 ring-amber-100 backdrop-blur sm:p-8">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">
                                            Reservation
                                        </p>
                                        <h2 className="mt-2 text-3xl font-black text-stone-950">
                                            Demander une date
                                        </h2>
                                        <p className="mt-2 text-sm leading-7 text-stone-600">
                                            La demande sera creee en statut en attente dans l espace de la salle.
                                        </p>
                                    </div>

                                    {flash?.success && (
                                        <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                                            {flash.success}
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
                                <Field label="Nom complet" error={form.errors.client_name} className="sm:col-span-2">
                                    <input
                                        value={form.data.client_name}
                                        onChange={(event) => form.setData('client_name', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        required
                                    />
                                </Field>

                                <Field label="Telephone" error={form.errors.phone}>
                                    <input
                                        value={form.data.phone}
                                        onChange={(event) => form.setData('phone', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        required
                                    />
                                </Field>

                                <Field label="Email" error={form.errors.email}>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) => form.setData('email', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                    />
                                </Field>

                                <Field label="Date souhaitee" error={form.errors.event_date} className="sm:col-span-2">
                                    <input
                                        type="date"
                                        min={new Date().toISOString().slice(0, 10)}
                                        value={form.data.event_date}
                                        onChange={(event) => form.setData('event_date', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        required
                                    />
                                    {unavailableDates.length > 0 && (
                                        <p className="mt-2 text-xs text-stone-500">
                                            Dates occupees proches: {unavailableDates.map(formatShortDate).join(', ')}
                                        </p>
                                    )}
                                </Field>

                                {services.length > 0 && (
                                    <div className="sm:col-span-2">
                                        <div className="rounded-[1.5rem] bg-gradient-to-br from-stone-50 to-rose-50/60 p-4 ring-1 ring-stone-200">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-stone-950">
                                                        Services souhaites
                                                    </p>
                                                    <p className="mt-1 text-sm text-stone-600">
                                                        Vous pouvez demander decoration, traiteur, photographe ou toute prestation disponible.
                                                    </p>
                                                </div>
                                                {servicesTotal > 0 && (
                                                    <div className="rounded-2xl bg-white px-4 py-2 text-right text-sm font-semibold text-stone-950 shadow-sm ring-1 ring-stone-200">
                                                        {formatCurrency(servicesTotal)} DZD
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 grid gap-3">
                                                {services.map((service) => {
                                                    const isSelected = selectedServiceIds.has(String(service.id));
                                                    const selectedLine = selectedServices.find((item) => String(item.service.id) === String(service.id));

                                                    return (
                                                        <div
                                                            key={service.id}
                                                            className={`rounded-2xl border bg-white p-4 transition ${
                                                                isSelected ? 'border-amber-300 bg-amber-50/50 ring-2 ring-amber-100' : 'border-stone-200'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                                <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={(event) => toggleService(service, event.target.checked)}
                                                                        className="mt-1 rounded border-stone-300 text-sky-600 focus:ring-sky-500"
                                                                    />
                                                                    <span className="min-w-0">
                                                                        <span className="block font-semibold text-stone-950">
                                                                            {service.name}
                                                                        </span>
                                                                        {service.description && (
                                                                            <span className="mt-1 block text-sm text-stone-500">
                                                                                {service.description}
                                                                            </span>
                                                                        )}
                                                                        <span className="mt-2 block text-sm font-medium text-rose-700">
                                                                            {servicePriceLabel(service)}
                                                                        </span>
                                                                    </span>
                                                                </label>

                                                                {isSelected && service.pricing_type !== 'quote' && (
                                                                    <div className="flex items-center gap-3 sm:justify-end">
                                                                        <label className="text-sm font-medium text-stone-600" htmlFor={`public-service-${service.id}-quantity`}>
                                                                            Quantite
                                                                        </label>
                                                                        <input
                                                                            id={`public-service-${service.id}-quantity`}
                                                                            type="number"
                                                                            min="1"
                                                                            value={serviceItems.find((item) => String(item.service_id) === String(service.id))?.quantity ?? '1'}
                                                                            onChange={(event) => updateServiceQuantity(service.id, event.target.value)}
                                                                            className="w-24 rounded-xl border-stone-300 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                                        />
                                                                        <span className="min-w-[7rem] text-right text-sm font-semibold text-stone-950">
                                                                            {formatCurrency(selectedLine?.subtotal ?? 0)} DZD
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <InputError message={serviceItemsError} className="mt-3" />
                                        </div>
                                    </div>
                                )}

                                <Field label="Details de l evenement" error={form.errors.notes} className="sm:col-span-2">
                                    <textarea
                                        rows="5"
                                        value={form.data.notes}
                                        onChange={(event) => form.setData('notes', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        placeholder="Type d'evenement, nombre d'invites, preferences..."
                                    />
                                </Field>

                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
                                    >
                                        Envoyer la demande
                                    </button>
                                </div>
                                    </form>
                                </section>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

function Field({ label, error, className = '', children }) {
    return (
        <label className={className}>
            <span className="text-sm font-medium text-stone-700">{label}</span>
            {children}
            <InputError message={error} className="mt-2" />
        </label>
    );
}

function formatDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

function formatShortDate(value) {
    return new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: 'short',
    }).format(new Date(value));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function SparkIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-.813-2.096a2.25 2.25 0 0 0-1.341-1.341L4.75 13.75l2.096-.813a2.25 2.25 0 0 0 1.341-1.341L9 9.5l.813 2.096a2.25 2.25 0 0 0 1.341 1.341l2.096.813-2.096.813a2.25 2.25 0 0 0-1.341 1.341ZM18 7l.375 1.125A1.5 1.5 0 0 0 19.5 9.25L20.625 9l-1.125.375A1.5 1.5 0 0 0 18.375 10.5L18 11.625l-.375-1.125A1.5 1.5 0 0 0 16.5 9.375L15.375 9l1.125-.25A1.5 1.5 0 0 0 17.625 7.625L18 6.5l.375 1.125Z" />
        </svg>
    );
}

function tabClassName(isActive) {
    return `flex items-center justify-center gap-2 rounded-[1.4rem] px-4 py-4 text-sm font-semibold transition ${
        isActive
            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-200'
            : 'bg-stone-50 text-stone-600 ring-1 ring-stone-200 hover:bg-white'
    }`;
}
