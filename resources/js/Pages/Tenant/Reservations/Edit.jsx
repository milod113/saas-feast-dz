import { useForm } from '@inertiajs/react';
import FormPage from './Form';

export default function Edit({ reservation, clients, statuses }) {
    const form = useForm({
        client_id: reservation.client_id ? String(reservation.client_id) : '',
        event_date: reservation.event_date ?? '',
        status: reservation.status ?? 'pending',
        total_price: reservation.total_price ?? '',
    });

    return (
        <FormPage
            title="Modifier la reservation"
            form={form}
            submitLabel="Enregistrer"
            submit={() => form.put(route('tenant.reservations.update', reservation.id))}
            clients={clients}
            statuses={statuses}
            mode="edit"
            reservation={reservation}
        />
    );
}
