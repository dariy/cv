import { contact, dom, links, time } from "./cv.lib.js";
import "./cv.fragment.js";
import { phone } from "./cv.phone.js";
import { CvValidator, CvValidationError } from "./cv.validator.js";

/**
 * Builds and renders CV content from provided data
 */
export class CvBuilder {
    /**
     * @typedef {{
     *   url: string,
     *   title: string
     * }} Link
     *
     * @typedef {{
     *   email: string[],
     *   phone: string[],
     *   cv: string,
     *   location: {url: string, title: string},
     *   links: Link[]
     * }} Contacts
     *
     * @typedef {{
     *   role: string,
     *   company: {name: string, url: string},
     *   location: {name: string, url: string},
     *   startDate: string,
     *   endDate: string,
     *   achievements: string[]
     * }} Experience
     *
     * @typedef {{
     *   title: string,
     *   skills: string[]
     * }} Expertise
     *
     * @typedef {{
     *   title: string,
     *   startDate: string,
     *   endDate: string,
     *   place: string,
     *   additionalInfo: string[]
     * }} Education
     */

    /**
     * Builds the CV from the provided data
     * @param {{
     *   name: string,
     *   contacts: {
     *     email: string[],
     *     phone: string[],
     *     cv: string,
     *     location: {url: string, title: string},
     *     links: Array<{url: string, title: string}>
     *   },
     *   summary: {template: string, since: number},
     *   experience: Array<{
     *     role: string,
     *     company: {name: string, url: string},
     *     location: {name: string, url: string},
     *     startDate: string,
     *     endDate: string,
     *     achievements: string[]
     *   }>,
     *   expertise: Array<{title: string, skills: string[]}>,
     *   education: Array<{title: string, startDate: string, endDate: string, place: string, additionalInfo: string[]}>
     * }} cv - The CV data
     * @throws {Error} If required data is missing
     */
    build(cv) {
        this.validateData(cv);

        try {
            document.title = `CV: ${cv.name}`;
            this.updateAuthors(cv.name);
            this.insertSummary(cv.summary);
            this.insertContacts(cv.name, cv.contacts);
            this.insertExperience(cv.experience);
            this.insertExpertise(cv.expertise);
            this.insertEducation(cv.education);
        } catch (error) {
            console.error("Failed to build CV:", error);
            throw new Error(`CV build failed: ${error.message}`);
        }
    }

    /**
     * Validates required CV data using comprehensive validation
     * @private
     * @throws {CvValidationError} If validation fails
     */
    validateData(cv) {
        try {
            CvValidator.validate(cv);
        } catch (error) {
            if (error instanceof CvValidationError) {
                console.error(`CV Validation Error in ${error.field}:`, error.message, error.value);
                throw error;
            }
            throw new Error(`CV validation failed: ${error.message}`);
        }
    }

    /**
     * Updates all author elements with the given name
     * @private
     * @param {string} name - Author name
     */
    updateAuthors(name) {
        dom.$$(CvBuilder.SELECTORS.AUTHOR).forEach((element) => (element.innerText = name));
    }

    /**
     * Inserts summary section content
     * @private
     */
    insertSummary(data) {
        const { STRONG, EMPHASIS, SPAN } = CvBuilder.TEMPLATES.SUMMARY_PATTERNS;

        const formattedContent = data.template
            .replace(STRONG, '<strong class="$1"></strong>')
            .replace(EMPHASIS, '<em class="$1"></em>')
            .replace(SPAN, '<span class="$1"></span>');

        const summaryElement = dom.create("p");
        summaryElement.setHTML(formattedContent);
        dom.$(CvBuilder.SELECTORS.SUMMARY).appendChild(summaryElement);

        const currentYearElement = dom.$(CvBuilder.SELECTORS.CURRENT_YEAR);
        const professionalYearsElement = dom.$(CvBuilder.SELECTORS.PROFESSIONAL_YEARS);

        if (currentYearElement) {
            currentYearElement.innerText = time.getCurrentYear().toString();
        }

        if (professionalYearsElement) {
            professionalYearsElement.setHTML(time.getTheProfessionalYears(data.since));
        }
    }

    /**
     * Inserts contact information
     * @private
     * @param {string} name - Author name
     * @param {Contacts} data - Contact data
     */
    insertContacts(name, data) {
        const phoneNumber = phone.decode(data.phone).join("");

        // Phone
        dom.$(CvBuilder.SELECTORS.PHONE).appendChild(contact.phoneBuild(phoneNumber));

        // Email
        dom.$(CvBuilder.SELECTORS.EMAIL).appendChild(contact.emailBuild(name, data.email));

        // Location
        dom.$(CvBuilder.SELECTORS.LOCATION).setHTML(
            links.build(data.location.url, data.location.title),
        );

        // Email Request
        const emailRequest = contact.emailBuild(
            name,
            data.email,
            "request",
            "CV Reference Request",
        );
        dom.$(CvBuilder.SELECTORS.EMAIL_REQUEST).replaceWith(emailRequest);

        // CV Link
        dom.$(CvBuilder.SELECTORS.CV_LINK).setHTML(links.build(data.cv, data.cv));

        // Social Links
        const socialLinks = dom.createFragment().addLinks(data.links);
        dom.$(CvBuilder.SELECTORS.CONTACTS_LIST).appendChild(socialLinks);
    }

    /**
     * Inserts professional experience
     * @private
     * @param {Experience[]} data - Experience data
     */
    insertExperience(data) {
        const fragment = dom.createFragment();

        data.forEach((item) => {
            const companyLink = links.build(item.company.url, item.company.name);
            const locationLink = links.build(
                item.location.url,
                item.location.name || item.location.title,
            );
            const title = CvBuilder.TEMPLATES.EXPERIENCE_TITLE(
                item.role,
                companyLink,
                locationLink,
            );

            fragment
                .addHeader(title)
                .addPeriod(item.startDate, item.endDate)
                .addList(item.achievements);
        });

        dom.$(CvBuilder.SELECTORS.EXPERIENCE_SECTION).appendChild(fragment);
    }

    /**
     * Inserts expertise and skills
     * @private
     * @param {Expertise[]} data - Expertise data
     */
    insertExpertise(data) {
        const fragment = dom.createFragment();

        data.forEach((area) => {
            fragment.addHeader(area.title).addList(area.skills);
        });

        dom.$(CvBuilder.SELECTORS.SKILLS_SECTION).appendChild(fragment);
    }

    /**
     * Inserts education information
     * @private
     * @param {Education[]} data - Education data
     */
    insertEducation(data) {
        const fragment = dom.createFragment();

        data.forEach((item) => {
            fragment
                .addHeader(item.title)
                .addPeriod(item.startDate, item.endDate)
                .addList(item.additionalInfo, item.place);
        });

        dom.$(CvBuilder.SELECTORS.EDUCATION_SECTION).appendChild(fragment);
    }
}

/**
 * @private
 * @readonly
 */
CvBuilder.SELECTORS = Object.freeze({
    AUTHOR: ".author",
    SUMMARY: ".summary",
    CURRENT_YEAR: ".theCurrentYear",
    PROFESSIONAL_YEARS: ".theProfessionalYears",
    PHONE: ".thePhone",
    EMAIL: ".theEmail",
    LOCATION: ".theContactsLocation",
    EMAIL_REQUEST: ".theEmailRequest",
    CV_LINK: ".theCV",
    CONTACTS_LIST: ".contacts ul",
    EXPERIENCE_SECTION: "section.experience",
    SKILLS_SECTION: "section.skills",
    EDUCATION_SECTION: "section.education",
});

/**
 * @private
 * @readonly
 */
CvBuilder.TEMPLATES = Object.freeze({
    EXPERIENCE_TITLE: (role, company, location) =>
        `${role} <i>&#0064;</i> ${company} (${location})`,
    SUMMARY_PATTERNS: Object.freeze({
        STRONG: /\*\*(\w+)\*\*/g,
        EMPHASIS: /__(\w+)__/g,
        SPAN: /\[\[(\w+)]]/g,
    }),
});
