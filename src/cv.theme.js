/**
 * Theme management for CV
 * Handles switching between light and dark modes based on:
 * 1. User preference stored in localStorage
 * 2. System preference (prefers-color-scheme media query)
 * 3. Manual toggle via UI button
 */

/**
 * Theme options
 * @readonly
 * @enum {string}
 */
export const THEMES = Object.freeze({
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
});

/**
 * Local storage key for theme preference
 * @type {string}
 */
const THEME_STORAGE_KEY = 'cv-theme-preference';

/**
 * Theme icons for toggle button
 * @readonly
 * @enum {string}
 */
const THEME_ICONS = Object.freeze({
    [THEMES.LIGHT]: '☀️', // sun
    [THEMES.DARK]: '🌙', // moon
    [THEMES.SYSTEM]: '🌓' // half moon
});

/**
 * Tooltip text for each theme state
 * @readonly
 * @enum {string}
 */
const THEME_TOOLTIPS = Object.freeze({
    [THEMES.LIGHT]: 'Currently using light mode. Click to switch to dark mode.',
    [THEMES.DARK]: 'Currently using dark mode. Click to switch to system theme.',
    [THEMES.SYSTEM]: 'Currently using system theme. Click to switch to light mode.'
});

/**
 * Theme manager class
 */
export class ThemeManager {
    /**
     * Initialize theme manager
     */
    constructor() {
        this.toggleButton = document.getElementById('theme-toggle');
        this.toggleIcon = this.toggleButton?.querySelector('.theme-toggle-icon');
        this.currentTheme = this.getStoredTheme() || THEMES.SYSTEM;

        this.initTheme();
        this.setupEventListeners();
    }

    /**
     * Initialize theme based on stored preference or system preference
     */
    initTheme() {
        if (this.currentTheme === THEMES.SYSTEM) {
            this.applySystemTheme();
        } else {
            this.applyTheme(this.currentTheme);
        }

        this.updateToggleIcon();
    }

    /**
     * Set up event listeners for theme switching
     */
    setupEventListeners() {
        // Toggle button click
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // System preference change
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === THEMES.SYSTEM) {
                this.applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT, false);
            }
        });
    }

    /**
     * Toggle between light, dark, and system themes
     */
    toggleTheme() {
        switch (this.currentTheme) {
            case THEMES.LIGHT:
                this.setTheme(THEMES.DARK);
                break;
            case THEMES.DARK:
                this.setTheme(THEMES.SYSTEM);
                break;
            case THEMES.SYSTEM:
            default:
                this.setTheme(THEMES.LIGHT);
                break;
        }
    }

    /**
     * Set theme and store preference
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.storeTheme(theme);

        if (theme === THEMES.SYSTEM) {
            this.applySystemTheme();
        } else {
            this.applyTheme(theme);
        }

        this.updateToggleIcon();
    }

    /**
     * Apply theme based on system preference
     */
    applySystemTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(isDarkMode ? THEMES.DARK : THEMES.LIGHT, false);
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme to apply
     * @param {boolean} [storeAttribute=true] - Whether to store the theme attribute
     */
    applyTheme(theme, storeAttribute = true) {
        if (storeAttribute) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            // For system preference, we don't set the attribute to allow CSS media query to work
            document.documentElement.removeAttribute('data-theme');
        }
    }

    /**
     * Update toggle button icon and tooltip based on current theme
     */
    updateToggleIcon() {
        if (this.toggleIcon && this.toggleButton) {
            // Update icon
            this.toggleIcon.textContent = THEME_ICONS[this.currentTheme];

            // Update button aria-label for accessibility
            const themeLabels = {
                [THEMES.LIGHT]: 'Switch to dark mode',
                [THEMES.DARK]: 'Switch to system theme',
                [THEMES.SYSTEM]: 'Switch to light mode'
            };

            this.toggleButton.setAttribute('aria-label', themeLabels[this.currentTheme]);

            // Update tooltip
            this.toggleButton.setAttribute('data-tooltip', THEME_TOOLTIPS[this.currentTheme]);
        }
    }

    /**
     * Get stored theme preference
     * @returns {string|null} Stored theme or null if not set
     */
    getStoredTheme() {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to access localStorage:', error);
            return null;
        }
    }

    /**
     * Store theme preference
     * @param {string} theme - Theme to store
     */
    storeTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Failed to store theme preference:', error);
        }
    }
}
