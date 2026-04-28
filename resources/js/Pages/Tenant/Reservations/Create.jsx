import { useForm } from '@inertiajs/react';
import FormPage from './Form';

export default function Create({ clients, statuses }) {
    const form = useForm({
        client_id: '',
        event_date: '',
        status: 'pending',
        total_price: '',
        initial_payment_amount: '0',
        initial_payment_date: '',
        initial_payment_method: 'cash',
    });

    return (
        <FormPage
            title="Nouvelle reservation"
            form={form}
            submitLabel="Creer la reservation"
            submit={() => form.post(route('tenant.reservations.store'))}
            clients={clients}
            statuses={statuses}
            mode="create"
        />
    );
}
