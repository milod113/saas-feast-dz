import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TenantLayout from '@/Layouts/TenantLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AirVent,
    Camera,
    Compass,
    Landmark,
    MapPin,
    ParkingCircle,
    Phone,
    Power,
    Trash2,
    TentTree,
    Ticket,
    Users,
} from 'lucide-react';

export default function EditTenantProfile({ tenant }) {
    const { flash } = usePage().props;
    const existingPhotos = tenant.photos ?? [];
    const form = useForm({
        name: tenant.name ?? '',
        wilaya: tenant.wilaya ?? '',
        commune: tenant.commune ?? '',
        address: tenant.address ?? '',
        gps_latitude: tenant.gps_latitude ?? '',
        gps_longitude: tenant.gps_longitude ?? '',
        phone_primary: tenant.phone_primary ?? '',
        phone_secondary: tenant.phone_secondary ?? '',
        capacity_max: tenant.capacity_max ?? '',
        has_separated_spaces: Boolean(tenant.has_separated_spaces),
        parking_capacity: tenant.parking_capacity ?? '',
        has_generator: Boolean(tenant.has_generator),
        has_air_conditioning: Boolean(tenant.has_air_conditioning),
        allow_outside_caterer: Boolean(tenant.allow_outside_caterer),
        instagram_url: tenant.instagram_url ?? '',
        tiktok_url: tenant.tiktok_url ?? '',
        photos: [],
        delete_photo_ids: [],
    });
    const photosToDelete = new Set(form.data.delete_photo_ids ?? []);
    const visibleExistingPhotos = existingPhotos.filter((photo) => !photosToDelete.has(photo.id));
    const newPhotos = Array.from(form.data.photos ?? []);

    const submit = (event) => {
        event.preventDefault();
        form
            .transform((data) => ({
                ...data,
                _method: 'put',
            }))
            .post(route('tenant.profile.update'), {
                forceFormData: true,
            });
    };

    return (
        <TenantLayout>
            <Head title="Profil de la salle" />

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#422006_0%,_#9a3412_45%,_#f97316_100%)] p-6 text-white shadow-xl shadow-orange-500/20 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-100">
                                Identite de la salle
                            </p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Profil de la salle
                            </h1>
                            <p className="mt-3 text-sm leading-7 text-orange-50">
                                Renseignez votre localisation, vos capacites et vos equipements pour inspirer confiance au premier regard sur la page publique.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <HeroStat icon={Users} label="Capacite" value={tenant.capacity_max ? `${tenant.capacity_max} pers.` : 'A completer'} />
                            <HeroStat icon={Phone} label="Contact" value={tenant.phone_primary ?? 'A completer'} />
                            <HeroStat icon={MapPin} label="Zone" value={tenant.wilaya ?? 'A completer'} />
                        </div>
                    </div>
                </section>

                {flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <div className="space-y-6">
                        <FormSection
                            title="Localisation"
                            description="Aidez les clients a situer rapidement votre salle."
                            icon={MapPin}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Nom de la salle" error={form.errors.name} className="sm:col-span-2">
                                    <TextInput
                                        value={form.data.name}
                                        onChange={(event) => form.setData('name', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                        required
                                    />
                                </Field>
                                <Field label="Wilaya" error={form.errors.wilaya}>
                                    <TextInput
                                        value={form.data.wilaya}
                                        onChange={(event) => form.setData('wilaya', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="Commune" error={form.errors.commune}>
                                    <TextInput
                                        value={form.data.commune}
                                        onChange={(event) => form.setData('commune', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="Adresse" error={form.errors.address} className="sm:col-span-2">
                                    <textarea
                                        rows="4"
                                        value={form.data.address}
                                        onChange={(event) => form.setData('address', event.target.value)}
                                        className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                    />
                                </Field>
                                <Field label="Latitude GPS" error={form.errors.gps_latitude}>
                                    <TextInput
                                        value={form.data.gps_latitude}
                                        onChange={(event) => form.setData('gps_latitude', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="Longitude GPS" error={form.errors.gps_longitude}>
                                    <TextInput
                                        value={form.data.gps_longitude}
                                        onChange={(event) => form.setData('gps_longitude', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Contact"
                            description="Affichez des numeros faciles a joindre pour les demandes clients."
                            icon={Phone}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Telephone principal" error={form.errors.phone_primary}>
                                    <TextInput
                                        value={form.data.phone_primary}
                                        onChange={(event) => form.setData('phone_primary', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="Telephone secondaire" error={form.errors.phone_secondary}>
                                    <TextInput
                                        value={form.data.phone_secondary}
                                        onChange={(event) => form.setData('phone_secondary', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                            </div>
                        </FormSection>

                        <FormSection
                            title="Caracteristiques"
                            description="Donnez une vision concrete de la capacite et de la logistique sur place."
                            icon={Landmark}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Capacite maximale" error={form.errors.capacity_max}>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={form.data.capacity_max}
                                        onChange={(event) => form.setData('capacity_max', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="Capacite parking" error={form.errors.parking_capacity}>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={form.data.parking_capacity}
                                        onChange={(event) => form.setData('parking_capacity', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <ToggleField
                                    label="Espaces separes hommes / femmes"
                                    description="Indique si la salle permet une organisation separee."
                                    checked={form.data.has_separated_spaces}
                                    onChange={(checked) => form.setData('has_separated_spaces', checked)}
                                    error={form.errors.has_separated_spaces}
                                    className="sm:col-span-2"
                                />
                            </div>
                        </FormSection>

                        <FormSection
                            title="Equipements"
                            description="Mettez en avant les prestations qui rassurent les familles."
                            icon={Power}
                        >
                            <div className="grid gap-4">
                                <ToggleField
                                    label="Groupe electrogene"
                                    description="Pour garantir la continuite de l'evenement."
                                    checked={form.data.has_generator}
                                    onChange={(checked) => form.setData('has_generator', checked)}
                                    error={form.errors.has_generator}
                                />
                                <ToggleField
                                    label="Climatisation"
                                    description="Confort thermique dans la salle."
                                    checked={form.data.has_air_conditioning}
                                    onChange={(checked) => form.setData('has_air_conditioning', checked)}
                                    error={form.errors.has_air_conditioning}
                                />
                                <ToggleField
                                    label="Traiteur externe autorise"
                                    description="Le client peut faire appel a un traiteur externe."
                                    checked={form.data.allow_outside_caterer}
                                    onChange={(checked) => form.setData('allow_outside_caterer', checked)}
                                    error={form.errors.allow_outside_caterer}
                                />
                            </div>
                        </FormSection>

                        <FormSection
                            title="Photos de la salle"
                            description="Ajoutez plusieurs photos pour montrer l'ambiance, la scene, les tables ou l'entree."
                            icon={Camera}
                        >
                            <div className="space-y-5">
                                <div>
                                    <InputLabel value="Ajouter des photos" />
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(event) => form.setData('photos', Array.from(event.target.files ?? []))}
                                        className="mt-1 block w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-600 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-700 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300"
                                    />
                                    <InputError message={form.errors.photos ?? form.errors['photos.0']} className="mt-2" />
                                </div>

                                {newPhotos.length > 0 && (
                                    <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200 dark:bg-stone-950 dark:ring-stone-800">
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Nouvelles photos a envoyer
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {newPhotos.map((photo) => (
                                                <span
                                                    key={`${photo.name}-${photo.lastModified}`}
                                                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800"
                                                >
                                                    {photo.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {existingPhotos.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Photos actuelles
                                        </p>
                                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                            {existingPhotos.map((photo) => {
                                                const markedForDeletion = photosToDelete.has(photo.id);

                                                return (
                                                    <div
                                                        key={photo.id}
                                                        className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition dark:bg-stone-900 ${
                                                            markedForDeletion
                                                                ? 'border-rose-300 opacity-60 dark:border-rose-500/40'
                                                                : 'border-stone-200 dark:border-stone-800'
                                                        }`}
                                                    >
                                                        <img
                                                            src={photo.url}
                                                            alt=""
                                                            className="h-40 w-full object-cover"
                                                        />
                                                        <div className="flex items-center justify-between px-4 py-3">
                                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                                                                {markedForDeletion ? 'Supprimee' : 'Visible'}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    form.setData(
                                                                        'delete_photo_ids',
                                                                        markedForDeletion
                                                                            ? form.data.delete_photo_ids.filter((id) => id !== photo.id)
                                                                            : [...form.data.delete_photo_ids, photo.id],
                                                                    )
                                                                }
                                                                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                                    markedForDeletion
                                                                        ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200'
                                                                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300'
                                                                }`}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                {markedForDeletion ? 'Annuler' : 'Retirer'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection
                            title="Reseaux sociaux"
                            description="Ajoutez des liens utiles pour montrer vos realisations."
                            icon={Camera}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Instagram URL" error={form.errors.instagram_url}>
                                    <TextInput
                                        type="url"
                                        value={form.data.instagram_url}
                                        onChange={(event) => form.setData('instagram_url', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                                <Field label="TikTok URL" error={form.errors.tiktok_url}>
                                    <TextInput
                                        type="url"
                                        value={form.data.tiktok_url}
                                        onChange={(event) => form.setData('tiktok_url', event.target.value)}
                                        className="mt-1 block w-full rounded-xl py-3"
                                    />
                                </Field>
                            </div>
                        </FormSection>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Apercu public
                            </p>
                            <div className="mt-5 space-y-4">
                                <PreviewRow icon={Users} label="Capacite" value={form.data.capacity_max ? `${form.data.capacity_max} invites` : 'Non renseignee'} />
                                <PreviewRow icon={ParkingCircle} label="Parking" value={form.data.parking_capacity ? `${form.data.parking_capacity} places` : 'Non renseigne'} />
                                <PreviewRow icon={Compass} label="Coordonnees GPS" value={form.data.gps_latitude && form.data.gps_longitude ? `${form.data.gps_latitude}, ${form.data.gps_longitude}` : 'Non renseignees'} />
                                <PreviewRow icon={Ticket} label="Traiteur externe" value={form.data.allow_outside_caterer ? 'Autorise' : 'Non autorise'} />
                                <PreviewRow icon={Camera} label="Galerie" value={visibleExistingPhotos.length + newPhotos.length > 0 ? `${visibleExistingPhotos.length + newPhotos.length} photo(s)` : 'Aucune photo'} />
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                Conseils
                            </p>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
                                <li>Ajoutez une adresse detaillee pour reduire les appels de clarification.</li>
                                <li>Les equipements visibles augmentent la confiance avant la premiere visite.</li>
                                <li>Les liens sociaux donnent des preuves concretes de vos evenements recents.</li>
                            </ul>
                        </div>

                        <div className="flex justify-end">
                            <PrimaryButton disabled={form.processing}>
                                Enregistrer le profil
                            </PrimaryButton>
                        </div>
                    </aside>
                </form>
            </div>
        </TenantLayout>
    );
}

function HeroStat({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-orange-100">
                <Icon className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.18em]">{label}</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{value}</p>
        </div>
    );
}

function FormSection({ title, description, icon: Icon, children }) {
    return (
        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-8">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-stone-950 dark:text-white">{title}</h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
                </div>
            </div>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function Field({ label, error, className = '', children }) {
    return (
        <label className={className}>
            <InputLabel value={label} />
            {children}
            <InputError message={error} className="mt-2" />
        </label>
    );
}

function ToggleField({ label, description, checked, onChange, error, className = '' }) {
    return (
        <div className={className}>
            <label className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 dark:border-stone-800 dark:bg-stone-950">
                <span className="min-w-0">
                    <span className="block text-sm font-semibold text-stone-900 dark:text-stone-100">{label}</span>
                    <span className="mt-1 block text-sm text-stone-500 dark:text-stone-400">{description}</span>
                </span>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
            </label>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

function PreviewRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-3 dark:bg-stone-950">
            <div className="mt-0.5 rounded-xl bg-white p-2 text-amber-700 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-amber-300 dark:ring-stone-800">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{label}</p>
                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">{value}</p>
            </div>
        </div>
    );
}
