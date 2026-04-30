import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ plans }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold leading-tight text-stone-950 dark:text-white">
                        Plans
                    </h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Catalogue des offres disponibles pour les salles.
                    </p>
                </div>
            }
        >
            <Head title="Plans" />

            <div className="grid gap-6 lg:grid-cols-2">
                {plans.map((plan, index) => (
                    <article key={plan.name} className="salla-panel overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                        <div className="p-7 sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                                        {index === 0 ? 'Essentiel' : 'Populaire'}
                                    </div>
                                    <h3 className="mt-5 text-2xl font-extrabold text-stone-950 dark:text-white">{plan.name}</h3>
                                </div>
                                <p className="text-4xl font-extrabold text-stone-950 dark:text-white">{plan.price}</p>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-stone-600 dark:text-stone-300">{plan.description}</p>

                            <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-200">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.25 4.25L19 7" />
        </svg>
    );
}
