import { dom, links, time } from "./cv.lib.js";

/**
 * @typedef {Object} LinkItem
 * @property {string} url - The URL of the link
 * @property {string} [title] - Optional title for the link
 * @property {string} [prefix] - Optional prefix text before the link
 */

/**
 * Extends DocumentFragment with chainable methods for building CV sections
 * @returns {void}
 */
const extendDocumentFragment = () => {
    /**
     * @type {Record<string, Function>}
     */
    const fragmentExtensions = {
        /**
         * Adds a header element to the fragment
         * @param {string} title - Header content
         * @param {string} [name="h3"] - Header tag name
         * @returns {DocumentFragment} For method chaining
         */
        addHeader(title, name = "h3") {
            const header = dom.create(name).setHTML(title);
            this.appendChild(header);
            return this;
        },

        /**
         * Adds a period/date range element to the fragment
         * @param {string} start - Start date
         * @param {string} end - End date
         * @returns {DocumentFragment} For method chaining
         */
        addPeriod(start, end) {
            const dateRange = time.buildRange(start, end);
            const dateText = time.buildText(start, end);
            const paragraph = dom.create("p", "dates").setHTML(`${dateRange} (${dateText})`);

            this.appendChild(paragraph);
            return this;
        },

        /**
         * Adds an unordered list to the fragment
         * @param {string[]} items - List items
         * @param {string} [prefix] - Optional prefix for the first item
         * @returns {DocumentFragment} For method chaining
         */
        addList(items, prefix) {
            if (!Array.isArray(items)) {
                throw new TypeError("Items must be an array");
            }

            const createListItem = (content) => `<li>${content}</li>`;
            const listItems = prefix
                ? [createListItem(prefix), ...items.map(createListItem)]
                : items.map(createListItem);

            const list = dom.create("ul").setHTML(listItems.join("\n"));
            this.appendChild(list);
            return this;
        },

        /**
         * Adds a list of links to the fragment
         * @param {LinkItem[]} linkItems - Array of link items
         * @returns {DocumentFragment} For method chaining
         */
        addLinks(linkItems) {
            if (!Array.isArray(linkItems)) {
                throw new TypeError("LinkItems must be an array");
            }

            linkItems.forEach(({ url, title, prefix = "" }) => {
                if (typeof url !== "string") {
                    throw new TypeError("URL must be a string");
                }

                const linkTitle = links.getLinkTitleFromUrl(url);
                const item = dom.create("li").setHTML(`
                    <span class="web">${prefix}${links.build(url, title || linkTitle)}</span>
                    <span class="print">${linkTitle}</span>
                `);
                this.appendChild(item);
            });
            return this;
        },
    };

    Object.assign(DocumentFragment.prototype, fragmentExtensions);
};

// Initialize the DocumentFragment extensions
extendDocumentFragment();

// Prevent further modifications to DocumentFragment.prototype
Object.freeze(DocumentFragment.prototype);
