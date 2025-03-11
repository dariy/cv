import {
    $,
    $$,
    create,
    createFragment,
    emailElementBuild,
    getCurrentYear,
    getDatesElement,
    getLink,
    getLinkTitleFromUrl,
    getTheProfessionalYears,
    phoneDecode,
    phoneElementBuild,
    purify,
} from "./cv.lib.js";

export class CvBuilder {
    build(cv) {
        document.title = `CV: ${cv.name}`;
        $$(".author").forEach((element) => (element.innerText = cv.name));
        this.insertSummary(cv.summary);
        this.insertContacts(cv.contacts);
        this.insertExperience(cv.experience);
        this.insertExpertise(cv.expertise);
        this.insertEducation(cv.education);
    }

    insertSummary(summary) {
        const p = create("p");
        p.innerHTML = purify.sanitize(
            summary.template
                .replace(/\*\*(\w+)\*\*/g, '<strong class="$1"></strong>')
                .replace(/\[\[(\w+)]]/g, '<span class="$1"></span>'),
        );

        $(".summary").appendChild(p);
        $(".theCurrentYear").innerText = getCurrentYear();
        $(".theProfessionalYears").innerHTML = getTheProfessionalYears(summary.since);
    }

    insertContacts(data) {
        $(".thePhone").appendChild(phoneElementBuild(phoneDecode(data.phone).join("")));
        $(".theEmail").appendChild(emailElementBuild(data.name, data.email));
        $(".theContactsLocation").innerHTML = data.location.url
            ? getLink(data.location.url, data.location.title)
            : data.location.title;

        $(".theEmailRequest").replaceWith(emailElementBuild(data.name, data.email, "request", "CV Reference Request"));
        $(".theCV").innerHTML = getLink(data.cv, data.cv);

        insertLinks(data.links);

        function insertLinks(links) {
            const fragment = createFragment();
            links.forEach(({ url, title, prefix }) => {
                const item = create("li");
                const link = getLinkTitleFromUrl(url);

                // TODO: simplify markup for web and print and use only one element for it.
                item.innerHTML = purify.sanitize(`
                    <span class="web">${prefix || ""}${getLink(url, title || link)}</span>
                    <span class="print">${link}</span>`);
                fragment.appendChild(item);
            });
            $(".contacts ul").appendChild(fragment);
        }
    }

    insertExperience(experience) {
        const fragment = createFragment();
        experience.forEach((item) => {
            const header = create("h3");
            header.innerHTML = purify.sanitize(`
			${item.role} <i>&#0064;</i>
			${item.company.url ? getLink(item.company.url, item.company.name) : item.company.name}
			(${item.location.url ? getLink(item.location.url, item.location.name) : item.location.name})`);
            fragment.appendChild(header);
            fragment.appendChild(getDatesElement(item.startDate, item.endDate));

            const achievements = create("ul");
            achievements.innerHTML = purify.sanitize(
                item.achievements.map((achievement) => `<li>${achievement}</li>`).join("\n"),
            );
            fragment.appendChild(achievements);
        });
        $("section.experience").appendChild(fragment);
    }

    insertExpertise(expertise) {
        const fragment = createFragment();

        expertise.forEach((area) => {
            const header = create("h3");
            header.textContent = area.title;
            fragment.appendChild(header);

            const ul = create("ul");
            ul.innerHTML = purify.sanitize(area.skills.map((skill) => `<li>${skill}</li>`).join(""));
            fragment.appendChild(ul);
        });

        $("section.skills").appendChild(fragment);
    }

    insertEducation(education) {
        const fragment = createFragment();
        education.forEach((item) => {
            const header = create("h3");
            header.textContent = item.title;
            fragment.appendChild(header);
            fragment.appendChild(getDatesElement(item.startDate, item.endDate));

            const list = create("ul");
            list.innerHTML = purify.sanitize(
                [`<li>${item.place}</li>`, ...item.additionalInfo.map((info) => `<li>${info}</li>`)].join("\n"),
            );
            fragment.appendChild(list);
        });
        $("section.education").appendChild(fragment);
    }
}
