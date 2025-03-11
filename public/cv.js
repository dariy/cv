import { cv_data } from "./cv.data.js"; // The data file is outside the repo. Its structure is the same as `data` below.
import DOMPurify from "./purify.es.mjs";

let $ = null;
let $$ = null;

const create = (name) => document.createElement(name);
const createFragment = () => document.createDocumentFragment();

const template = {
    name: "John Doe",
    email: ["right", "center", "left"], // stub "protection" from static crawlers.
    phone: ["1", "2", "0", "3", "5", "4", "6", "8", "7", "9"], // stub "protection" from static crawlers.
    since: 2005,
    desiredRole: "The role",
    cv: "https://cv.username.com",
    summary:
        '**theProfessionalYears** <strong class="theProfessionalYears"></strong>' +
        '**theDesiredRole** <strong class="theDesiredRole"></strong>' +
        '[[theLocation]]<span class="theLocation"></span>',
    location: {
        url: "https://www.google.com/maps/place/[[TheLocation]]",
        title: "Montréal",
    },
    links: [
        {
            url: "https://github.com/[[username/cv]]",
            title: "github: [[username/cv]]",
        },
        {
            url: "https://www.linkedin.com/in/[[username]]",
            title: "linkedin: [[username]]",
        },
    ],
    experience: [
        {
            role: "The Role or position",
            company: { name: "The company", url: "https://the.company.url" },
            location: { name: "The location", url: "https://www.google.com/maps/place/[[TheLocation]]/" },
            startDate: "2022-07-01",
            endDate: "2025-02-28",
            achievements: ["Achievement number one", "Achievement number two"],
        },
    ],
    expertise: [
        {
            title: "Main areas",
            skills: ["one", "two", "three"],
        },
    ],
};
const data = cv_data || template;

const purify = DOMPurify(window);

globalThis.window.addEventListener("DOMContentLoaded", () => {
    $ = (name) => document.querySelector(name) || null;
    $$ = (name) => document.querySelectorAll(name) || null;

    document.title = `CV: ${data.name}`;
    $$(".author").forEach((element) => (element.innerText = data.name));
    insertSummary(data.summary);
    insertContacts(data);
    insertExperience(data.experience);
    insertExpertise(data.expertise);
    insertEducation(data.education);
});

const getLink = (url, title) => `<a href="${url}" target="_blank">${title}</a>`;

function insertSummary(summary) {
    const p = create("p");
    p.innerHTML = purify.sanitize(
        summary
            .replace(/\*\*(\w+)\*\*/g, '<strong class="$1"></strong>')
            .replace(/\[\[(\w+)]]/g, '<span class="$1"></span>'),
    );

    $(".summary").appendChild(p);
    $(".theCurrentYear").innerText = getCurrentYear();
    $(".theProfessionalYears").innerHTML = getTheProfessionalYears(data.since);
    $(".theDesiredRole").innerText = data.desiredRole;
    $(".theLocation").outerHTML = getLink(data.location.url, data.location.title);
}

function insertContacts(data) {
    $(".thePhone").appendChild(phoneElementBuild(phoneDecode(data.phone)));
    $(".theEmail").appendChild(emailElementBuild(data.name, data.email));
    $(".theEmailRequest").replaceWith(emailElementBuild(data.name, data.email, "request", "CV Reference Request"));
    $(".theCV").innerHTML = getLinkTitleFromUrl(data.cv);

    insertLinks(data.links);

    function insertLinks(links) {
        const fragment = createFragment();
        links.forEach(({ url, title, prefix }) => {
            const item = create("li");
            // TODO: simplify markup for web and print and use only one element for it.
            item.innerHTML = `
				<span class="web">${prefix || ""}${getLink(url, title || getLinkTitleFromUrl(url))}</span>
				<span class="print">${getLinkTitleFromUrl(url)}</span>`;
            fragment.appendChild(item);
        });
        $(".contacts ul").appendChild(fragment);
    }
}

function insertExperience(experience) {
    const fragment = createFragment();
    experience.forEach((item) => {
        const header = create("h3");
        header.innerHTML = purify.sanitize(`
			${item.role} <i>&#0064;</i>
			${item.company.url ? getLink(item.company.url, item.company.name) : item.company.name}
			(${item.location.url ? getLink(item.location.url, item.location.name) : item.location.name})`);
        fragment.appendChild(header);

        const dates = create("p");
        dates.classList.add("dates");
        dates.innerHTML = `${getRangeDate(item.startDate, item.endDate)} &mdash; ${getPeriodText(item.startDate, item.endDate)}`;
        fragment.appendChild(dates);

        const achievements = create("ul");
        achievements.innerHTML = purify.sanitize(
            item.achievements.map((achievement) => `<li>${achievement}</li>`).join("\n"),
        );
        fragment.appendChild(achievements);
    });
    $("section.experience").appendChild(fragment);
}

function insertExpertise(expertise) {
    const fragment = createFragment();

    expertise.forEach((area) => {
        const h3 = create("h3");
        h3.textContent = area.title;
        fragment.appendChild(h3);

        const ul = create("ul");
        ul.innerHTML = purify.sanitize(area.skills.map((skill) => `<li>${skill}</li>`).join(""));
        fragment.appendChild(ul);
    });

    $("section.skills").appendChild(fragment);
}

function insertEducation(education) {
    const fragment = createFragment();
    education.forEach((item) => {
        const header = create("h3");
        header.innerHTML = purify.sanitize(item.title);
        fragment.appendChild(header);

        const dates = create("p");
        dates.classList.add("dates");
        dates.innerHTML = getRangeDate(item.startDate, item.endDate);
        fragment.appendChild(dates);

        const list = create("ul");
        list.innerHTML = purify.sanitize(
            [`<li>${item.place}</li>`, ...item.additionalInfo.map((info) => `<li>${info}</li>`)].join("\n"),
        );
        fragment.appendChild(list);
    });
    $("section.education").appendChild(fragment);
}

// TODO: extract into a separate service and to cover by tests all corner cases.
function getRangeDate(start, end) {
    const [startYear, startMonth] = start.split("-");
    const [endYear, endMonth] = end.split("-");
    return `${startMonth}/${startYear}&ndash;${endMonth}/${endYear}`;
}

// TODO: extract into a separate service and to cover by tests all corner cases.
function getPeriodText(start, end = "present") {
    const startDate = new Date(start);
    const endDate = end === "present" ? new Date() : new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (years <= 0 && months < 0) {
        console.error("The endDate date is before the startDate date. Start date:", startDate, "End date:", endDate);
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

function getLinkTitleFromUrl(url) {
    const cleanUrl = url.replace(/https?:\/\/(www\.)?/, "");
    const [site, ...paths] = cleanUrl.split("/");
    const user = paths.join("/").replace(/\/$/, "").replaceAll(/-/g, "&#8209;");

    return `<span class="site">${site}</span>` + (user ? `<i>/</i><span class="user">${user}</span>` : "");
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export function getTheProfessionalYears(sinceYear) {
    const years = getCurrentYear() - sinceYear;
    return years === 1 ? `${years}&nbsp;year` : `${years}&nbsp;years`;
}

export function emailElementBuild(aName, anEmail, title = "", emailTitle) {
    // noinspection JSUnusedGlobalSymbols
    return Object.assign(create("a"), {
        innerHTML: purify.sanitize(title || `${anEmail[2]}<i>&#0064</i>${anEmail[1]}.${anEmail[0]}`),
        onclick: () => {
            window.open(
                `mailto:"${aName}" <${anEmail[2]}@${anEmail[1]}.${anEmail[0]}>${emailTitle ? `?subject=${emailTitle}` : ""}`,
                "_blank",
            );
        },
    });
}

export function phoneElementBuild(aPhone) {
    return Object.assign(create("a"), {
        href: `tel:+1${aPhone}`,
        innerHTML: purify.sanitize(
            `${aPhone.slice(0, 3)}<i>&#0045;</i>${aPhone.slice(3, 6)}<i>&#0045;</i>${aPhone.slice(6)}`,
        ),
    });
}

export function phoneEncode(aPhone) {
    const p = aPhone instanceof Array ? aPhone : aPhone.split("");
    [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
        // eslint-disable-next-line no-self-assign
        [p[1], p[2], p[0], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
    return p.join("");
}

export function phoneDecode(aPhone) {
    const p = aPhone instanceof Array ? aPhone : aPhone.split("");
    [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]] =
        // eslint-disable-next-line no-self-assign
        [p[2], p[0], p[1], p[5], p[4], p[3], p[6], p[8], p[7], p[9]];
    return p.join("");
}
