import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            environmentOptions: {
                jsdom: {
                    url: 'http://localhost',
                },
            },
            setupFiles: './src/test/setup.js',
            clearMocks: true,
            restoreMocks: true,
        },
    }),
);
