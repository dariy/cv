import DOMPurify from "./purify.es.mjs";

export const $ = (name) => document.querySelector(name) || null;
export const $$ = (name) => document.querySelectorAll(name) || null;
export const create = (name) => document.createElement(name);
export const createFragment = () => document.createDocumentFragment();
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
    return purify;
})();

export const getLink = (url, title) => (url ? `<a href="${url}">${title}</a>` : title);

export const getDatesElement = (start, end) => {
    return Object.assign(create("p"), {
        classList: ["dates"],
        innerHTML: `${getRangeDate(start, end)} (${getPeriodText(start, end)})`
    });

    // TODO: extract into a separate service and to cover by tests all corner cases.
    function getRangeDate(start, end) {
        const [startYear, startMonth] = start.split("-");
        const [endYear, endMonth] = end.split("-");
        return `${startYear}-${startMonth}&ndash;${endYear}-${endMonth}`;
    }

    function getPeriodText(start, end = "present") {
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

export const getLinkTitleFromUrl = (url) => {
    const cleanUrl = url.replace(/https?:\/\/(www\.)?/, "");
    const [site, ...paths] = cleanUrl.split("/");
    const user = paths.join("/").replace(/\/$/, "").replaceAll(/-/g, "&#8209;");
    if (user) {
        return `<span class="site">${site}</span><i>/</i><span class="user">${user}</span>`;
    }
    return `<span class="site">${site}</span>`;
};

export const getCurrentYear = () => new Date().getFullYear();

export const getTheProfessionalYears = (sinceYear) => {
    const years = getCurrentYear() - sinceYear;
    return years === 1 ? `${years}&nbsp;year` : `${years}&nbsp;years`;
};

export const emailElementBuild = (aName, anEmail, title = "", emailTitle) =>
    Object.assign(create("a"), {
        innerHTML: purify.sanitize(title || `${anEmail[2]}<i>&#0064</i>${anEmail[1]}.${anEmail[0]}`),
        // prettier-ignore
        "onclick": () => {
            window.open(
                `mailto:"${aName}" <${anEmail[2]}@${anEmail[1]}.${anEmail[0]}>${emailTitle ? `?subject=${emailTitle}` : ""}`,
                "_blank",
                "noopener"
            );
        }
    });

export const phoneElementBuild = (aPhone) =>
    Object.assign(create("a"), {
        href: aPhone.startsWith("+") ? `tel:${aPhone}` : `tel:+1${aPhone}`,
        innerHTML: purify.sanitize(
            `${aPhone.slice(0, 3)}<i>&#0045;</i>${aPhone.slice(3, 6)}<i>&#0045;</i>${aPhone.slice(6)}`
        )
    });

/**
 * Encodes the phone number for the data (helper).
 * @param aPhone
 * @returns {Array|*}
 */
globalThis.phoneEncode = (aPhone) => {
    const p = aPhone instanceof Array ? aPhone : aPhone.split("");
    [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
        // eslint-disable-next-line no-self-assign
        [p[1], p[2], p[0], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
    return p;
};

/**
 * Decodes the phone number from the data.
 * @param aPhone
 * @returns {Array|*}
 */
export const phoneDecode = (aPhone) => {
    const p = aPhone instanceof Array ? aPhone : aPhone.split("");
    [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
        // eslint-disable-next-line no-self-assign
        [p[2], p[0], p[1], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
    return p;
};
