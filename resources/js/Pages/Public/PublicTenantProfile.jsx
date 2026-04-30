import {
    AirVent,
    Camera,
    CarFront,
    ExternalLink,
    LocateFixed,
    MapPin,
    Phone,
    Power,
    ShieldCheck,
    SplitSquareVertical,
    Ticket,
    Users,
} from 'lucide-react';

export default function PublicTenantProfile({ tenant }) {
    const photos = tenant.photos ?? [];
    const locationItems = [
        { icon: MapPin, label: 'Wilaya', value: tenant.wilaya },
        { icon: LocateFixed, label: 'Commune', value: tenant.commune },
        { icon: MapPin, label: 'Adresse', value: tenant.address },
    ].filter((item) => hasValue(item.value));

    const contactItems = [
        { icon: Phone, label: 'Telephone principal', value: tenant.phone_primary, href: tenant.phone_primary ? `tel:${tenant.phone_primary}` : null },
        { icon: Phone, label: 'Telephone secondaire', value: tenant.phone_secondary, href: tenant.phone_secondary ? `tel:${tenant.phone_secondary}` : null },
    ].filter((item) => hasValue(item.value));

    const statItems = [
        { icon: Users, label: 'Capacite maximale', value: tenant.capacity_max ? `${tenant.capacity_max} invites` : null },
        { icon: CarFront, label: 'Parking', value: tenant.parking_capacity ? `${tenant.parking_capacity} places` : null },
        { icon: LocateFixed, label: 'GPS', value: tenant.gps_latitude && tenant.gps_longitude ? `${tenant.gps_latitude}, ${tenant.gps_longitude}` : null, href: gpsMapUrl(tenant) },
    ].filter((item) => hasValue(item.value));

    const socialItems = [
        { icon: Camera, label: 'Instagram', value: tenant.instagram_url, href: tenant.instagram_url },
        { icon: Ticket, label: 'TikTok', value: tenant.tiktok_url, href: tenant.tiktok_url },
    ].filter((item) => hasValue(item.value));

    const badges = [
        { label: 'Espaces separes', enabled: Boolean(tenant.has_separated_spaces), icon: SplitSquareVertical },
        { label: 'Groupe electrogene', enabled: Boolean(tenant.has_generator), icon: Power },
        { label: 'Climatisation', enabled: Boolean(tenant.has_air_conditioning), icon: AirVent },
        { label: 'Traiteur externe autorise', enabled: Boolean(tenant.allow_outside_caterer), icon: ShieldCheck },
    ].filter((item) => item.enabled);

    if (
        photos.length === 0 &&
        locationItems.length === 0 &&
        contactItems.length === 0 &&
        statItems.length === 0 &&
        socialItems.length === 0 &&
        badges.length === 0
    ) {
        return null;
    }

    return (
        <section className="space-y-6">
            {photos.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                                Galerie
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-stone-950">
                                Quelques vues de la salle
                            </h2>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className={`overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-stone-200 ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className={`w-full object-cover ${index === 0 ? 'h-[360px]' : 'h-[172px]'}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                    Decouvrir la salle
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-stone-950">
                    Tout ce qu il faut savoir avant la visite
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                    Des informations claires pour aider les familles a se projeter sereinement.
                </p>
            </div>

            {statItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {statItems.map((item) => (
                        <FeatureCard key={item.label} {...item} />
                    ))}
                </div>
            )}

            {badges.length > 0 && (
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_55%,_#fef3c7_100%)] p-6 ring-1 ring-amber-200">
                    <p className="text-sm font-semibold text-stone-950">Equipements et garanties</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {badges.map((badge) => {
                            const Icon = badge.icon;

                            return (
                                <span
                                    key={badge.label}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200"
                                >
                                    <Icon className="h-4 w-4" />
                                    {badge.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {locationItems.length > 0 && (
                    <InfoPanel title="Localisation" items={locationItems} />
                )}
                {contactItems.length > 0 && (
                    <InfoPanel title="Contact" items={contactItems} />
                )}
            </div>

            {socialItems.length > 0 && (
                <InfoPanel title="Reseaux sociaux" items={socialItems} />
            )}
        </section>
    );
}

function FeatureCard({ icon: Icon, label, value, href = null }) {
    const body = (
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-stone-500">{label}</p>
            <p className="mt-2 text-lg font-bold text-stone-950">{value}</p>
        </div>
    );

    if (!href) {
        return body;
    }

    return (
        <a href={href} target="_blank" rel="noreferrer" className="block">
            {body}
        </a>
    );
}

function InfoPanel({ title, items }) {
    return (
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h3 className="text-xl font-semibold text-stone-950">{title}</h3>
            <div className="mt-5 space-y-4">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={`${title}-${item.label}`} className="flex items-start gap-4 rounded-2xl bg-stone-50 px-4 py-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-stone-700 ring-1 ring-stone-200">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{item.label}</p>
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-flex items-center gap-2 break-all text-sm font-semibold text-amber-700 transition hover:text-amber-800"
                                    >
                                        {item.value}
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                ) : (
                                    <p className="mt-1 text-sm font-medium text-stone-900">{item.value}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function hasValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
}

function gpsMapUrl(tenant) {
    if (!tenant.gps_latitude || !tenant.gps_longitude) {
        return null;
    }

    return `https://www.google.com/maps?q=${tenant.gps_latitude},${tenant.gps_longitude}`;
}
