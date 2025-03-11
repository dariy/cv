import DOMPurify from "./purify.es.mjs";

// DOMPurify
export const purify = (() => {
    const purify = DOMPurify(window);
    purify.setConfig({
        ALLOWED_TAGS: ["strong", "span", "i", "a", "ul", "li", "p", "h1", "h2", "h3"],
        ALLOWED_ATTR: ["class", "href", "target", "rel"]
    });
    // For old browsers: https://owasp.org/www-community/attacks/Reverse_Tabnabbing
    purify.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener");
        }
    });

    Object.assign(Element.prototype, {
        setHTML(content) {
            this.innerHTML = purify.sanitize(content);
            return this;
        }
    });

    return purify;
})();

// DOM manipulation helpers
export const dom = {
    $: (name) => document.querySelector(name) || null,
    $$: (name) => document.querySelectorAll(name) || null,
    create: (name, className = "") => {
        const element = document.createElement(name);
        if (className !== "") {
            element.className = className;
        }
        return element;
    },
    createFragment: () => document.createDocumentFragment()
};

// Link handling
export const links = {
    build: (url, title) => (url ? `<a href="${url}">${title}</a>` : title),
    getLinkTitleFromUrl: (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
};

// Contact info handling
export const contact = {
    emailBuild: (aName, anEmail, title = "", emailTitle) =>
        Object.assign(dom.create("a"), {
            innerHTML: purify.sanitize(title || `${anEmail[2]}<b>&#0064</b>${anEmail[1]}.${anEmail[0]}`),
            // prettier-ignore
            "onclick": () => {
                window.open(
                    `mailto:"${aName}" <${anEmail[2]}@${anEmail[1]}.${anEmail[0]}>${emailTitle ? `?subject=${emailTitle}` : ""}`,
                    "_blank",
                    "noopener"
                );
            }
        }),
    phoneBuild: (aPhone) =>
        Object.assign(dom.create("a"), {
            href: aPhone.startsWith("+") ? `tel:${aPhone}` : `tel:+1${aPhone}`,
            innerHTML: purify.sanitize(
                `${aPhone.slice(0, 3)}<i>&#0045;</i>${aPhone.slice(3, 6)}<i>&#0045;</i>${aPhone.slice(6)}`
            )
        }),
    phone: {
        decode: (aPhone) => {
            const p = aPhone instanceof Array ? aPhone : aPhone.split("");
            [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
                // eslint-disable-next-line no-self-assign
                [p[2], p[0], p[1], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
            return p;
        },
        encode: (aPhone) => {
            const p = aPhone instanceof Array ? aPhone : aPhone.split("");
            [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
                // eslint-disable-next-line no-self-assign
                [p[1], p[2], p[0], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
            return p;
        }
    }
};

// Date and time utilities
export const time = {
    getCurrentYear: () => new Date().getFullYear(),
    getTheProfessionalYears: (sinceYear) => {
        const years = new Date().getFullYear() - sinceYear;
        return years === 1 ? `${years}&nbsp;year` : `${years}&nbsp;years`;
    },

    // TODO: extract into a separate service and to cover by tests all corner cases.
    buildRange: (start, end) => {
        const [startYear, startMonth] = start.split("-");
        const [endYear, endMonth] = end.split("-");
        return `${startYear}-${startMonth}&ndash;${endYear}-${endMonth}`;
    },

    buildText: (start, end = "present") => {
        const startDate = new Date(start);
        let endDate = end === "present" ? new Date() : new Date(end);

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();

        if (years <= 0 && months < 0) {
            console.error(
                "The endDate date is before the startDate date. Start date:",
                startDate,
                "End date:",
                endDate
            );
            return "";
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const yearText = years === 1 ? "year" : "years";
        const monthText = months === 1 ? "month" : "months";

        if (years === 0) {
            return `${months} ${monthText}`;
        }

        if (months === 0) {
            return `${years} ${yearText}`;
        }

        return `${years} ${yearText}, ${months} ${monthText}`;
    }
};