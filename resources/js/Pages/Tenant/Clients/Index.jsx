import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function emptyForm() {
    return {
        id: null,
        name: '',
        email: '',
        phone: '',
        notes: '',
    };
}

export default function Index({ clients }) {
    const { flash } = usePage().props;
    const form = useForm(emptyForm());

    const submit = () => {
        if (form.data.id) {
            form.put(route('tenant.clients.update', form.data.id), {
                onSuccess: () => form.reset(),
            });
            return;
        }

        form.post(route('tenant.clients.store'), {
            onSuccess: () => form.reset(),
        });
    };

    const editClient = (client) => {
        form.setData({
            id: client.id,
            name: client.name ?? '',
            email: client.email ?? '',
            phone: client.phone ?? '',
            notes: client.notes ?? '',
        });
        form.clearErrors();
    };

    return (
        <TenantLayout>
            <Head title="Clients" />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200">
                    <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                                Relation client
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-stone-950">
                                Clients
                            </h1>
                        </div>

                        <Link
                            href={route('tenant.reservations.create')}
                            className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                        >
                            Nouvelle reservation
                        </Link>
                    </div>

                    {flash?.success && (
                        <div className="mx-6 mt-6 rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-x-auto px-0 py-2">
                        <table className="min-w-full divide-y divide-stone-200">
                            <thead className="bg-stone-50">
                                <tr className="text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Reservations</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-sm text-stone-500">
                                            Aucun client pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.id} className="text-sm text-stone-700">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-stone-900">{client.name}</div>
                                                {client.notes && (
                                                    <div className="mt-1 line-clamp-1 text-xs text-stone-500">
                                                        {client.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{client.phone ?? '-'}</div>
                                                <div className="text-xs text-stone-500">{client.email ?? '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">{client.reservations_count}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => editClient(client)}
                                                        className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <Link
                                                        href={route('tenant.clients.destroy', client.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="rounded-full border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                                                    >
                                                        Supprimer
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
                    <h2 className="text-2xl font-semibold text-stone-950">
                        {form.data.id ? 'Modifier le client' : 'Nouveau client'}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                        Centralisez les informations de contact avant de creer une reservation.
                    </p>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}
                        className="mt-6 space-y-5"
                    >
                        <div>
                            <InputLabel htmlFor="name" value="Nom du client" />
                            <TextInput
                                id="name"
                                value={form.data.name}
                                className="mt-1 block w-full"
                                onChange={(event) => form.setData('name', event.target.value)}
                                required
                            />
                            <InputError message={form.errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="phone" value="Telephone" />
                                <TextInput
                                    id="phone"
                                    value={form.data.phone}
                                    className="mt-1 block w-full"
                                    onChange={(event) => form.setData('phone', event.target.value)}
                                />
                                <InputError message={form.errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Adresse e-mail" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    className="mt-1 block w-full"
                                    onChange={(event) => form.setData('email', event.target.value)}
                                />
                                <InputError message={form.errors.email} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes" />
                            <textarea
                                id="notes"
                                value={form.data.notes}
                                onChange={(event) => form.setData('notes', event.target.value)}
                                rows="5"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            />
                            <InputError message={form.errors.notes} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            {form.data.id && (
                                <button
                                    type="button"
                                    onClick={() => form.reset()}
                                    className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                                >
                                    Annuler
                                </button>
                            )}
                            <PrimaryButton disabled={form.processing}>
                                {form.data.id ? 'Enregistrer' : 'Creer le client'}
                            </PrimaryButton>
                        </div>
                    </form>
                </section>
            </div>
        </TenantLayout>
    );
}
