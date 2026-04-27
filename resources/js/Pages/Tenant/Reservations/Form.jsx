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
}) {
    const total = Number(form.data.total_price || 0);
    const advance = Number(form.data.advance_amount || 0);
    const remaining = Math.max(total - advance, 0);

    return (
        <TenantLayout>
            <Head title={title} />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                            Reservations
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-stone-950">{title}</h1>
                    </div>

                    <Link
                        href={route('tenant.reservations.index')}
                        className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                        Retour
                    </Link>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                    className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="client_id" value="Client" />
                            <select
                                id="client_id"
                                value={form.data.client_id}
                                onChange={(event) => form.setData('client_id', event.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
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
                            <InputError message={form.errors.client_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="event_date" value="Date de l evenement" />
                            <TextInput
                                id="event_date"
                                type="date"
                                value={form.data.event_date}
                                className="mt-1 block w-full"
                                onChange={(event) => form.setData('event_date', event.target.value)}
                                required
                            />
                            <InputError message={form.errors.event_date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Statut" />
                            <select
                                id="status"
                                value={form.data.status}
                                onChange={(event) => form.setData('status', event.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
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
                            <InputLabel htmlFor="total_price" value="Montant total (DZD)" />
                            <TextInput
                                id="total_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.data.total_price}
                                className="mt-1 block w-full"
                                onChange={(event) => form.setData('total_price', event.target.value)}
                                required
                            />
                            <InputError message={form.errors.total_price} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="advance_amount" value="Montant de l avance (DZD)" />
                            <TextInput
                                id="advance_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.data.advance_amount}
                                className="mt-1 block w-full"
                                onChange={(event) => form.setData('advance_amount', event.target.value)}
                                required
                            />
                            <InputError message={form.errors.advance_amount} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                            <p className="text-sm text-stone-500">Reste a payer</p>
                            <p className="mt-2 text-2xl font-semibold text-stone-950">
                                {new Intl.NumberFormat('fr-DZ', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(remaining)} DZD
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <PrimaryButton disabled={form.processing}>{submitLabel}</PrimaryButton>
                    </div>
                </form>
            </div>
        </TenantLayout>
    );
}
