import { dom, links, time } from "./cv.lib.js";

// Extend DocumentFragment prototype
Object.assign(DocumentFragment.prototype, {
    addHeader(title) {
        const header = dom.create("h3").setHTML(title);
        this.appendChild(header);
        return this;
    },

    addDates(start, end) {
        const paragraph = dom
            .create("p", "dates")
            .setHTML(`${time.buildRange(start, end)} (${time.buildText(start, end)})`);
        this.appendChild(paragraph);
        return this;
    },

    addList(items, prefix) {
        const listItems = prefix
            ? [`<li>${prefix}</li>`, ...items.map(item => `<li>${item}</li>`)]
            : items.map(item => `<li>${item}</li>`);

        const list = dom.create("ul").setHTML(listItems.join("\n"));
        this.appendChild(list);
        return this;
    },

    addLinks(linkItems) {
        linkItems.forEach(({ url, title, prefix }) => {
            const linkTitle = links.getLinkTitleFromUrl(url);
            const item = dom.create("li")
                .setHTML(`
                    <span class="web">${prefix || ""}${links.build(url, title || linkTitle)}</span>
                    <span class="print">${linkTitle}</span>
                `);
            this.appendChild(item);
        });
        return this;
    }
});