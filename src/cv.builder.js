import { contact, dom, links, time } from "./cv.lib.js";
import "./cv.fragment.js";

export class CvBuilder {
    build(cv) {
        document.title = `CV: ${cv.name}`;
        dom.$$(".author").forEach((element) => (element.innerText = cv.name));
        this.insertSummary(cv.summary);
        this.insertContacts(cv.contacts);
        this.insertExperience(cv.experience);
        this.insertExpertise(cv.expertise);
        this.insertEducation(cv.education);
    }

    insertSummary(data) {
        const p = dom.create("p").setHTML(
            data.template
                .replace(/\*\*(\w+)\*\*/g, `<strong class="$1"></strong>`)
                .replace(/__(\w+)__/g, `<em class="$1"></em>`)
                .replace(/\[\[(\w+)]]/g, `<span class="$1"></span>`));

        dom.$(".summary").appendChild(p);
        dom.$(".theCurrentYear").innerText = time.getCurrentYear();
        dom.$(".theProfessionalYears").setHTML(time.getTheProfessionalYears(data.since));
    }

    insertContacts(data) {
        dom.$(".thePhone").appendChild(contact.phoneBuild(contact.phone.decode(data.phone).join("")));
        dom.$(".theEmail").appendChild(contact.emailBuild(data.name, data.email));
        dom.$(".theContactsLocation").setHTML(links.build(data.location.url, data.location.title));
        dom.$(".theEmailRequest").replaceWith(contact.emailBuild(data.name, data.email, "request", "CV Reference Request"));
        dom.$(".theCV").setHTML(links.build(data.cv, data.cv));

        const fragment = dom.createFragment().addLinks(data.links);
        dom.$(".contacts ul").appendChild(fragment);
    }

    insertExperience(data) {
        const fragment = dom.createFragment();
        data.forEach((item) => {
            const title = `
                ${item.role} <i>&#0064;</i>
                ${links.build(item.company.url, item.company.name)}
                (${links.build(item.location.url, item.location.name)})`;
            fragment.addHeader(title);
            fragment.addDates(item.startDate, item.endDate);
            fragment.addList(item.achievements);
        });
        dom.$("section.experience").appendChild(fragment);
    }

    insertExpertise(data) {
        const fragment = dom.createFragment();
        data.forEach((area) => {
            fragment.addHeader(area.title);
            fragment.addList(area.skills);
        });

        dom.$("section.skills").appendChild(fragment);
    }

    insertEducation(data) {
        const fragment = dom.createFragment();
        data.forEach((item) => {
            fragment.addHeader(item.title);
            fragment.addDates(item.startDate, item.endDate);
            fragment.addList(item.additionalInfo, item.place);
        });
        dom.$("section.education").appendChild(fragment);
    }
}
