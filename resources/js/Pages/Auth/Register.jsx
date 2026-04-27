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

            <form onSubmit={submit}>
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

                <div className="mt-4">
                    <InputLabel htmlFor="subdomain" value="Sous-domaine" />

                    <div className="mt-1 flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                        <TextInput
                            id="subdomain"
                            name="subdomain"
                            value={data.subdomain}
                            className="block w-full border-0 focus:ring-0"
                            autoComplete="off"
                            onChange={(e) => setData('subdomain', e.target.value.toLowerCase())}
                            required
                        />
                        <span className="border-s border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                            .{baseDomain}
                        </span>
                    </div>

                    <InputError message={errors.subdomain} className="mt-2" />
                </div>

                <div className="mt-4">
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

                <div className="mt-4">
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

                <div className="mt-4">
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

                <div className="mt-4">
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

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Deja inscrit ?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Creer mon espace
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
