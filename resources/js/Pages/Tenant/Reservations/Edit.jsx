import { useForm } from '@inertiajs/react';
import FormPage from './Form';

export default function Edit({ reservation, clients, statuses, services, unavailableDates = [] }) {
    const selectedServices = reservation.services ?? [];
    const serviceOptions = [
        ...services,
        ...selectedServices
            .filter((line) => line.service_id && !services.some((service) => String(service.id) === String(line.service_id)))
            .map((line) => ({
                id: line.service_id,
                name: line.service_name,
                description: 'Deja ajoute a cette reservation',
                pricing_type: line.pricing_type,
                price: Number(line.unit_price || 0),
            })),
    ];

    const form = useForm({
        client_id: reservation.client_id ? String(reservation.client_id) : '',
        event_date: reservation.event_date ?? '',
        status: reservation.status ?? 'pending',
        location_price: reservation.location_price ?? reservation.total_price ?? '',
        service_items: selectedServices
            .filter((line) => line.service_id)
            .map((line) => ({
                service_id: line.service_id,
                quantity: String(line.quantity || 1),
            })),
    });

    return (
        <FormPage
            title="Modifier la reservation"
            form={form}
            submitLabel="Enregistrer"
            submit={() => form.put(route('tenant.reservations.update', reservation.id))}
            clients={clients}
            statuses={statuses}
            services={serviceOptions}
            unavailableDates={unavailableDates}
            mode="edit"
            reservation={reservation}
        />
    );
}
