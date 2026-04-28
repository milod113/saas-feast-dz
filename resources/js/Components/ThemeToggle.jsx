import { useEffect, useState } from 'react';

function resolveTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const storedTheme = window.localStorage.getItem('theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle({ className = '', compact = false }) {
    const [theme, setTheme] = useState(resolveTheme);

    useEffect(() => {
        const nextTheme = resolveTheme();

        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        document.documentElement.style.colorScheme = nextTheme;
        setTheme(nextTheme);
    }, []);

    const isDark = theme === 'dark';

    const toggleTheme = () => {
        const nextTheme = isDark ? 'light' : 'dark';

        window.localStorage.setItem('theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        document.documentElement.style.colorScheme = nextTheme;
        setTheme(nextTheme);
    };

    if (compact) {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-300 bg-white/90 text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900/90 dark:text-stone-200 dark:hover:bg-stone-800 ${className}`}
                aria-label="Changer le theme"
            >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-3 rounded-full border border-stone-300 bg-white/90 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900/90 dark:text-stone-200 dark:hover:bg-stone-800 ${className}`}
            aria-label="Changer le theme"
        >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950">
                {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </span>
            <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
    );
}

function SunIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v1.5m0 13.5v1.5m8.25-8.25h-1.5m-13.5 0h-1.5m11.985 5.985-1.06-1.06M8.325 8.325l-1.06-1.06m8.47 0-1.06 1.06M8.325 15.675l-1.06 1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
    );
}

function MoonIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z" />
        </svg>
    );
}
