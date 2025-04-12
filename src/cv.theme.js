/**
 * Theme management for CV
 * Handles switching between light and dark modes based on:
 * 1. User preference stored in localStorage
 * 2. System preference (prefers-color-scheme media query)
 * 3. Manual toggle via UI button
 */

class ThemeProvider {
    static StorageKey = "cv-theme-preference";

    /** @type {Readonly<Theme>} */
    light;
    /** @type {Readonly<Theme>} */
    dark;
    /** @type {Readonly<Theme>} */
    system;

    constructor() {
        if (this.light) return;

        const light = new Theme("light", "☀️");
        const dark = new Theme("dark", "🌙");
        const system = new Theme("system", "🌓");

        // Set up theme cycle
        light.nextTheme = dark;
        dark.nextTheme = system;
        system.nextTheme = light;

        // Freeze all themes
        this.light = Object.freeze(light);
        this.dark = Object.freeze(dark);
        this.system = Object.freeze(system);
    }

    /**
     * Get stored theme preference
     * @returns {Readonly<Theme>} Stored theme or system theme if not set
     */
    getTheme() {
        try {
            const name = localStorage.getItem(ThemeProvider.StorageKey);
            return this[name] ?? this.system;
        } catch (error) {
            console.warn("Failed to access localStorage:", error);
            return this.system;
        }
    }

    /**
     * Store theme preference
     * @param {Readonly<Theme>} theme - Theme to store
     */
    storeTheme(theme) {
        try {
            localStorage.setItem(ThemeProvider.StorageKey, theme.name);
        } catch (error) {
            console.warn("Failed to store theme preference:", error);
        }
    }

    /**
     * Get theme based on dark mode preference
     * @param {boolean} isDarkMode
     * @returns {Readonly<Theme>}
     */
    getThemeByMode(isDarkMode) {
        return isDarkMode ? this.dark : this.light;
    }

    /**
     * Check if theme is system theme
     * @param {Readonly<Theme>} theme
     * @returns {boolean}
     */
    isSystem(theme) {
        return theme === this.system;
    }
}

class Theme {
    /** @type {Theme | null} */
    nextTheme = null;

    /**
     * Create a new theme
     * @param {string} name - Theme name
     * @param {string} icon - Theme icon
     */
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
    }

    /**
     * Get aria label for theme toggle button
     * @returns {string}
     */
    getAreaLabel() {
        return `Switch to ${this.nextTheme?.name} theme`;
    }

    /**
     * Get tooltip text for theme toggle button
     * @returns {string}
     */
    getTooltip() {
        return `Currently using ${this.name} mode. Click to switch to ${this.nextTheme?.name} mode.`;
    }
}

/**
 * Theme manager class
 */
export class ThemeManager {
    /** @type {HTMLElement | null} */
    #toggleButton;
    /** @type {HTMLElement | null} */
    #toggleIcon;
    /** @type {ThemeProvider} */
    #themeProvider;
    /** @type {Readonly<Theme>} */
    #currentTheme;

    constructor() {
        this.#toggleButton = document.getElementById("theme-toggle");
        this.#toggleIcon = this.#toggleButton?.querySelector(".theme-toggle-icon");
        this.#themeProvider = new ThemeProvider();
        this.#currentTheme = this.#themeProvider.getTheme();

        this.#initTheme();
        this.#setupEventListeners();
    }

    #initTheme() {
        if (this.#themeProvider.isSystem(this.#currentTheme)) {
            this.#applySystemTheme();
        } else {
            this.#applyTheme(this.#currentTheme);
        }

        this.#updateToggleIcon();
    }

    #setupEventListeners() {
        this.#toggleButton?.addEventListener("click", () => {
            if (!this.#currentTheme.nextTheme) return;

            this.#currentTheme = this.#currentTheme.nextTheme;
            this.#themeProvider.storeTheme(this.#currentTheme);
            this.#initTheme();
        });

        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        darkModeQuery.addEventListener("change", (e) => {
            if (this.#themeProvider.isSystem(this.#currentTheme)) {
                this.#applyThemeByMode(e.matches, false);
            }
        });
    }

    #applySystemTheme() {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        this.#applyThemeByMode(isDarkMode, false);
    }

    #applyThemeByMode(isDarkMode, storeAttribute) {
        const theme = this.#themeProvider.getThemeByMode(isDarkMode);
        this.#applyTheme(theme, storeAttribute);
    }

    #applyTheme(theme, storeAttribute = true) {
        if (storeAttribute) {
            document.documentElement.setAttribute("data-theme", theme.name);
        } else {
            // For system preference, we don't set the attribute to allow CSS media query to work
            document.documentElement.removeAttribute("data-theme");
        }
    }

    #updateToggleIcon() {
        if (!this.#toggleIcon || !this.#toggleButton) return;

        this.#toggleIcon.textContent = this.#currentTheme.icon;
        this.#toggleButton.setAttribute("aria-label", this.#currentTheme.getAreaLabel());
        this.#toggleButton.setAttribute("data-tooltip", this.#currentTheme.getTooltip());
    }
}
