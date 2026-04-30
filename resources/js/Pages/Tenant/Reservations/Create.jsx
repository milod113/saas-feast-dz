import { useForm } from '@inertiajs/react';
import FormPage from './Form';

export default function Create({ clients, statuses, services, unavailableDates = [] }) {
    const form = useForm({
        reservation_mode: 'existing',
        client_id: '',
        client_name: '',
        client_phone: '',
        client_email: '',
        event_date: '',
        status: 'pending',
        location_price: '',
        service_items: [],
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
            services={services}
            unavailableDates={unavailableDates}
            mode="create"
        />
    );
}
