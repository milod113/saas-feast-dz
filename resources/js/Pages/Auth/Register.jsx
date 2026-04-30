import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ baseDomain }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        hall_name: '',
        subdomain: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-stone-950 dark:text-white">Creer un espace</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                    Configurez votre salle et votre compte gerant.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="hall_name" value="Nom de la salle" />

                    <TextInput
                        id="hall_name"
                        name="hall_name"
                        value={data.hall_name}
                        className="mt-1 block w-full"
                        autoComplete="organization"
                        isFocused={true}
                        onChange={(e) => setData('hall_name', e.target.value)}
                        required
                    />

                    <InputError message={errors.hall_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="subdomain" value="Sous-domaine" />

                    <div className="mt-1 flex items-center overflow-hidden rounded-2xl border border-stone-200 bg-white/90 shadow-sm focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 dark:border-stone-700 dark:bg-stone-950/80">
                        <TextInput
                            id="subdomain"
                            name="subdomain"
                            value={data.subdomain}
                            className="block w-full border-0 focus:ring-0"
                            autoComplete="off"
                            onChange={(e) => setData('subdomain', e.target.value.toLowerCase())}
                            required
                        />
                        <span className="border-s border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                            .{baseDomain}
                        </span>
                    </div>

                    <InputError message={errors.subdomain} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nom du responsable" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Adresse e-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route('login')}
                        className="text-sm font-semibold text-amber-700 underline-offset-4 transition hover:underline dark:text-amber-300"
                    >
                        Deja inscrit ?
                    </Link>

                    <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                        Creer mon espace
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
