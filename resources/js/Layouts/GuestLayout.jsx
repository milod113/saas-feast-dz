import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-stone-100 pt-6 dark:bg-stone-950 sm:justify-center sm:pt-0">
            <div className="mb-4 w-full max-w-md px-6 sm:px-0">
                <div className="flex justify-end">
                    <ThemeToggle compact />
                </div>
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-stone-300" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
