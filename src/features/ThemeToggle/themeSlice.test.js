import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createLocalStorage = () => {
    const values = new Map();

    return {
        getItem: vi.fn((key) => values.get(key) ?? null),
        setItem: vi.fn((key, value) => values.set(key, String(value))),
        removeItem: vi.fn((key) => values.delete(key)),
        clear: vi.fn(() => values.clear()),
    };
};

const setSystemTheme = (matches) => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
};

describe('theme persistence', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createLocalStorage());
        setSystemTheme(false);
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('prefers a saved theme', async () => {
        localStorage.setItem('theme', 'dark');
        const { default: themeReducer } = await import('./themeSlice.js');

        expect(themeReducer(undefined, { type: '@@INIT' }).mode).toBe('dark');
    });

    it('falls back to the system colour preference', async () => {
        setSystemTheme(true);
        const { default: themeReducer } = await import('./themeSlice.js');

        expect(themeReducer(undefined, { type: '@@INIT' }).mode).toBe('dark');
    });

    it('toggles and saves the next theme', async () => {
        const { default: themeReducer, toggleTheme } = await import('./themeSlice.js');
        const initialState = themeReducer(undefined, { type: '@@INIT' });
        const nextState = themeReducer(initialState, toggleTheme());

        expect(nextState.mode).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });
});
