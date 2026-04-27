import { Link, usePage } from '@inertiajs/react';

const navigation = [
    { name: 'Tableau de bord', href: 'tenant.dashboard' },
    { name: 'Calendrier', href: 'tenant.calendar.index' },
    { name: 'Reservations', href: 'tenant.reservations.index' },
    { name: 'Clients', href: 'tenant.clients.index' },
    { name: 'Factures', href: '#' },
    { name: 'Parametres', href: '#' },
];

export default function TenantLayout({ children }) {
    const { url, props } = usePage();
    const tenant = props.tenant ?? {};
    const user = props.auth?.user ?? null;

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
                <aside className="border-b border-stone-200 bg-white lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
                    <div className="border-b border-stone-200 px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                            Salle des fetes
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-stone-900">
                            {tenant.name ?? 'Espace locataire'}
                        </h1>
                        <p className="mt-1 text-sm text-stone-500">
                            {tenant.domain ?? 'Sous-domaine locataire'}
                        </p>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3">
                        {navigation.map((item) => {
                            const isCurrent =
                                item.href !== '#' &&
                                ((item.href === 'tenant.dashboard' && url.startsWith('/dashboard')) ||
                                    (item.href === 'tenant.calendar.index' && url.startsWith('/calendar')) ||
                                    (item.href === 'tenant.reservations.index' && url.startsWith('/reservations')) ||
                                    (item.href === 'tenant.clients.index' && url.startsWith('/clients')) ||
                                    route().current(item.href));

                            const className = isCurrent
                                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200'
                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900';

                            return item.href === '#' ? (
                                <span
                                    key={item.name}
                                    className={`inline-flex whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium ${className}`}
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`inline-flex whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium transition ${className}`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-stone-200 px-4 py-4 lg:px-3">
                        {user && (
                            <p className="mb-3 px-3 text-xs uppercase tracking-[0.18em] text-stone-400">
                                {user.name}
                            </p>
                        )}

                        <Link
                            href={route('tenant.logout')}
                            method="post"
                            as="button"
                            className="inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
                        >
                            Se deconnecter
                        </Link>
                    </div>
                </aside>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
