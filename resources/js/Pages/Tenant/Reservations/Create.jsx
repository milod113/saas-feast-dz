import { useForm } from '@inertiajs/react';
import FormPage from './Form';

export default function Create({ clients, statuses }) {
    const form = useForm({
        client_id: '',
        event_date: '',
        status: 'pending',
        total_price: '',
        advance_amount: '0',
    });

    return (
        <FormPage
            title="Nouvelle reservation"
            form={form}
            submitLabel="Creer la reservation"
            submit={() => form.post(route('tenant.reservations.store'))}
            clients={clients}
            statuses={statuses}
        />
    );
}
