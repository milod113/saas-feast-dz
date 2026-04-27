import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ plans }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                        Catalogue
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-stone-900">
                        Plans
                    </h2>
                </div>
            }
        >
            <Head title="Plans" />

            <div className="grid gap-6 lg:grid-cols-2">
                {plans.map((plan) => (
                    <article
                        key={plan.name}
                        className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200"
                    >
                        <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                            {plan.name}
                        </div>
                        <p className="mt-5 text-4xl font-semibold text-stone-950">{plan.price}</p>
                        <p className="mt-3 text-sm leading-7 text-stone-600">{plan.description}</p>

                        <ul className="mt-6 space-y-3 text-sm text-stone-700">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
