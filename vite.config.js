import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const appUrl = env.APP_URL || 'http://localhost';
    const appHost = new URL(appUrl).hostname;
    const devServerUrl = env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    const hmrHost = env.VITE_HMR_HOST || appHost || 'localhost';

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            origin: devServerUrl,
            cors: {
                origin: [
                    /^https?:\/\/([a-z0-9-]+\.)?lvh\.me(?::\d+)?$/,
                    /^https?:\/\/localhost(?::\d+)?$/,
                    /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
                ],
            },
            hmr: {
                host: hmrHost,
            },
        },
    };
});
