<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=urbanist:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <script>
            (() => {
                const storedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const resolvedTheme = storedTheme === 'dark' || (!storedTheme && systemPrefersDark) ? 'dark' : 'light';

                document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
                document.documentElement.style.colorScheme = resolvedTheme;
            })();
        </script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-urbanist antialiased bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        @inertia
    </body>
</html>
