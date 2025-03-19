/**
 * @typedef {import("dompurify")} DOMPurify
 * @typedef {import("@types/dompurify").Config} DOMPurifyConfig
 */

import DOMPurify from "dompurify";

/**
 * Allowed HTML tags for sanitization
 * @type {string[]}
 */
const ALLOWED_TAGS = ["strong", "span", "i", "a", "ul", "li", "p", "h1", "h2", "h3"];

/**
 * Allowed HTML attributes for sanitization
 * @type {string[]}
 */
const ALLOWED_ATTR = ["class", "href", "target", "rel"];

/**
 * Configured DOMPurify instance for HTML sanitization
 * @type {DOMPurify}
 */
export const purify = (() => {
    /** @type {DOMPurify} */
    const purifyInstance = DOMPurify(globalThis);

    /** @type {DOMPurifyConfig} */
    const config = {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: true,
    };

    // Configure sanitization rules
    purifyInstance.setConfig(config);

    // Protect against Reverse Tab-nabbing attacks
    // @see https://owasp.org/www-community/attacks/Reverse_Tabnabbing
    purifyInstance.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName === "A") {
            // Ensure external links open safely
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });

    /**
     * Safely sets HTML content of an element
     * @param {string} content - HTML content to sanitize and set
     * @returns {Element} The element instance for chaining
     * @throws {TypeError} If content is not a string
     */
    Element.prototype.setHTML = function (content) {
        if (typeof content !== "string") {
            throw new TypeError("Content must be a string");
        }
        this.innerHTML = purifyInstance.sanitize(content);
        return this;
    };

    return purifyInstance;
})();

/**
 * DOM manipulation utilities
 */
export const dom = Object.freeze({
    /**
     * Queries a single element
     * @param {string} selector - CSS selector
     * @returns {Element|null} First matching element or null
     */
    $: (selector) => document.querySelector(selector),

    /**
     * Queries multiple elements
     * @param {string} selector - CSS selector
     * @returns {NodeList} List of matching elements
     */
    $$: (selector) => document.querySelectorAll(selector),

    /**
     * Creates an element with optional class name
     * @param {string} tagName - HTML tag name
     * @param {string} [className=""] - CSS class name
     * @returns {HTMLElement} Created element
     */
    create: (tagName, className = "") => {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        return element;
    },

    /**
     * Creates a document fragment
     * @returns {DocumentFragment}
     */
    createFragment: () => document.createDocumentFragment(),
});

/**
 * Link handling utilities
 */
export const links = Object.freeze({
    /**
     * Creates an HTML link string
     * @param {string|null} url - URL for the link
     * @param {string} title - Link text
     * @returns {string} HTML link or plain text
     */
    build: (url, title) => (url ? `<a href="${encodeURI(url)}">${title}</a>` : title),

    /**
     * Extracts domain from URL
     * @param {string} url - Full URL
     * @returns {string} Cleaned domain name
     */
    getLinkTitleFromUrl: (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
});

/**
 * Contact information handling utilities
 */
export const contact = Object.freeze({
    /**
     * Creates an email link element
     * @param {string} name - Recipient name
     * @param {[string, string, string]} email - Email parts [domain, subdomain, username]
     * @param {string} [title=""] - Custom link text
     * @param {string} [emailTitle=""] - Email subject
     */
    emailBuild: (name, email, title = "", emailTitle = "") => {
        const [domain, subdomain, username] = email;
        const emailAddress = `${username}@${subdomain}.${domain}`;

        return Object.assign(dom.create("a"), {
            innerHTML: purify.sanitize(title || `${username}<b>&#0064;</b>${subdomain}.${domain}`),
            "onclick": (event) => {
                event.preventDefault();
                const mailtoUrl = new URL(`mailto:${name} <${emailAddress}>`);
                if (emailTitle) mailtoUrl.searchParams.set("subject", emailTitle);
                window.open(mailtoUrl.toString(), "_blank", "noopener");
            },
        });
    },

    /**
     * Creates a phone link element
     * @param {string} phone - Phone number
     */
    phoneBuild: (phone) => {
        const formattedNumber = phone.startsWith("+") ? phone : `+1${phone}`;
        const [part1, part2, part3] = [phone.slice(0, 3), phone.slice(3, 6), phone.slice(6)];

        return Object.assign(dom.create("a"), {
            href: `tel:${formattedNumber}`,
            innerHTML: purify.sanitize(`${part1}<i>&#0045;</i>${part2}<i>&#0045;</i>${part3}`),
        });
    },
});

/**
 * Date and time utilities
 */
export const time = Object.freeze({
    getCurrentYear: () => new Date().getFullYear(),

    /**
     * Calculates years of professional experience
     * @param {number} sinceYear - Starting year
     * @returns {string} Formatted duration
     */
    getTheProfessionalYears: (sinceYear) => {
        const years = new Date().getFullYear() - sinceYear;
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" })
            .format(-years, "year")
            .replace("ago", "")
            .trim();
    },

    /**
     * Formats date range
     * @param {string} start - Start date (YYYY-MM)
     * @param {string} end - End date (YYYY-MM)
     * @returns {string} Formatted date range
     */
    buildRange: (start, end) => {
        const formatter = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "short",
            timeZone: "UTC",
        });

        const formatDate = (date) => formatter.format(new Date(`${date}-01`));
        return `${formatDate(start)}&ndash;${formatDate(end)}`;
    },

    /**
     * Calculates and formats duration between dates
     * @param {string} start - Start date (YYYY-MM)
     * @param {string} [end="present"] - End date (YYYY-MM)
     * @returns {string} Formatted duration
     */
    buildText: (start, end = "present") => {
        const parseDate = (date) => {
            const [year, month] = date.split("-").map(Number);
            return new Date(Date.UTC(year, month - 1));
        };

        const startDate = parseDate(start);
        const endDate = end === "present" ? new Date() : parseDate(end);

        const totalMonths =
            (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
            (endDate.getUTCMonth() - startDate.getUTCMonth()) +
            1;

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        const format = (value, unit) => (value ? `${value} ${unit}${value !== 1 ? "s" : ""}` : "");

        const parts = [format(years, "year"), format(months, "month")].filter(Boolean);

        return parts.join(", ") || "0 months";
    },
});

/**
 * Network utilities
 */
export const network = Object.freeze({
    /**
     * Fetches and parses JSON data
     * @param {string} filename - File name without extension
     * @param {string} [path="data"] - Base path
     * @returns {Promise<object|Error>} Parsed JSON or Error
     */
    async downloadJson(filename, path = "data") {
        try {
            const url = new URL(`${path}/${filename}.json`, window.location.href);
            const response = await fetch(url);

            if (!response.ok) {
                return new Error(`Failed to load ${filename}: HTTP status: ${response.status}`);
            }

            const data = await response.json();
            if (!data) {
                return new Error(`Failed to load ${filename}: "Empty JSON data"`);
            }

            return data;
        } catch (error) {
            return new Error(`Failed to load ${filename}: ${error.message}`);
        }
    },

    /**
     * Downloads CV data
     * @param {string} filename - File name without extension
     * @param {string} [path="data"] - Base path
     * @returns {Promise<object|null>} CV data or null
     */
    async downloadCV(filename, path = "data") {
        const result = await this.downloadJson(filename, path);
        if (result instanceof Error) {
            console.error(result.message);
            return null;
        }
        return result;
    },
});
