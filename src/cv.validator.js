/**
 * CV data validation utilities
 */

/**
 * Validation error class for CV data
 */
export class CvValidationError extends Error {
    constructor(message, field, value) {
        super(message);
        this.name = "CvValidationError";
        this.field = field;
        this.value = value;
    }
}

/**
 * CV data validator with detailed error reporting
 */
export class CvValidator {
    /**
     * Validates CV data structure and content
     * @param {any} data - Data to validate
     * @throws {CvValidationError} If validation fails
     * @returns {boolean} True if valid
     */
    static validate(data) {
        if (!data || typeof data !== "object") {
            throw new CvValidationError("CV data must be an object", "root", data);
        }

        // Required fields validation
        this.validateRequiredFields(data);
        this.validateName(data.name);
        this.validateSummary(data.summary);
        this.validateContacts(data.contacts);
        this.validateExperience(data.experience);
        this.validateExpertise(data.expertise);
        this.validateEducation(data.education);

        return true;
    }

    /**
     * Validates required top-level fields
     * @private
     */
    static validateRequiredFields(data) {
        const required = ["name", "summary", "contacts", "experience", "expertise", "education"];
        const missing = required.filter(field => !(field in data));
        
        if (missing.length > 0) {
            throw new CvValidationError(
                `Missing required fields: ${missing.join(", ")}`,
                "requiredFields",
                missing
            );
        }
    }

    /**
     * Validates name field
     * @private
     */
    static validateName(name) {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new CvValidationError("Name must be a non-empty string", "name", name);
        }
        if (name.length > 100) {
            throw new CvValidationError("Name must be less than 100 characters", "name", name);
        }
    }

    /**
     * Validates summary section
     * @private
     */
    static validateSummary(summary) {
        if (!summary || typeof summary !== "object") {
            throw new CvValidationError("Summary must be an object", "summary", summary);
        }
        
        if (typeof summary.template !== "string" || summary.template.trim().length === 0) {
            throw new CvValidationError("Summary template must be a non-empty string", "summary.template", summary.template);
        }
        
        if (!Number.isInteger(summary.since) || summary.since < 1900 || summary.since > new Date().getFullYear()) {
            throw new CvValidationError("Summary since must be a valid year", "summary.since", summary.since);
        }
    }

    /**
     * Validates contacts section
     * @private
     */
    static validateContacts(contacts) {
        if (!contacts || typeof contacts !== "object") {
            throw new CvValidationError("Contacts must be an object", "contacts", contacts);
        }

        // Email validation
        if (!Array.isArray(contacts.email) || contacts.email.length !== 3) {
            throw new CvValidationError("Email must be an array of 3 strings [domain, subdomain, username]", "contacts.email", contacts.email);
        }
        
        if (!contacts.email.every(part => typeof part === "string" && part.length > 0)) {
            throw new CvValidationError("All email parts must be non-empty strings", "contacts.email", contacts.email);
        }

        // Phone validation
        if (!Array.isArray(contacts.phone) || contacts.phone.length !== 10) {
            throw new CvValidationError("Phone must be an array of 10 digit strings", "contacts.phone", contacts.phone);
        }
        
        if (!contacts.phone.every(digit => typeof digit === "string" && /^\d$/.test(digit))) {
            throw new CvValidationError("All phone parts must be single digit strings", "contacts.phone", contacts.phone);
        }

        // CV URL validation
        if (typeof contacts.cv !== "string" || !this.isValidUrl(contacts.cv)) {
            throw new CvValidationError("CV must be a valid URL", "contacts.cv", contacts.cv);
        }

        // Location validation
        if (!contacts.location || typeof contacts.location !== "object") {
            throw new CvValidationError("Location must be an object", "contacts.location", contacts.location);
        }
        
        if (typeof contacts.location.title !== "string" || contacts.location.title.trim().length === 0) {
            throw new CvValidationError("Location title must be a non-empty string", "contacts.location.title", contacts.location.title);
        }

        // Links validation
        if (!Array.isArray(contacts.links)) {
            throw new CvValidationError("Links must be an array", "contacts.links", contacts.links);
        }
        
        contacts.links.forEach((link, index) => {
            if (!link || typeof link !== "object") {
                throw new CvValidationError(`Link at index ${index} must be an object`, `contacts.links[${index}]`, link);
            }
            if (typeof link.url !== "string" || !this.isValidUrl(link.url)) {
                throw new CvValidationError(`Link URL at index ${index} must be valid`, `contacts.links[${index}].url`, link.url);
            }
            if (typeof link.title !== "string" || link.title.trim().length === 0) {
                throw new CvValidationError(`Link title at index ${index} must be non-empty`, `contacts.links[${index}].title`, link.title);
            }
        });
    }

    /**
     * Validates experience array
     * @private
     */
    static validateExperience(experience) {
        if (!Array.isArray(experience)) {
            throw new CvValidationError("Experience must be an array", "experience", experience);
        }

        experience.forEach((exp, index) => {
            this.validateExperienceItem(exp, index);
        });
    }

    /**
     * Validates single experience item
     * @private
     */
    static validateExperienceItem(exp, index) {
        if (!exp || typeof exp !== "object") {
            throw new CvValidationError(`Experience item at index ${index} must be an object`, `experience[${index}]`, exp);
        }

        const required = ["role", "company", "location", "startDate", "endDate", "achievements"];
        const missing = required.filter(field => !(field in exp));
        
        if (missing.length > 0) {
            throw new CvValidationError(
                `Experience item ${index} missing fields: ${missing.join(", ")}`,
                `experience[${index}]`,
                missing
            );
        }

        // Role validation
        if (typeof exp.role !== "string" || exp.role.trim().length === 0) {
            throw new CvValidationError(`Role at index ${index} must be non-empty string`, `experience[${index}].role`, exp.role);
        }

        // Company validation
        if (!exp.company || typeof exp.company !== "object") {
            throw new CvValidationError(`Company at index ${index} must be an object`, `experience[${index}].company`, exp.company);
        }
        if (typeof exp.company.name !== "string" || exp.company.name.trim().length === 0) {
            throw new CvValidationError(`Company name at index ${index} must be non-empty`, `experience[${index}].company.name`, exp.company.name);
        }

        // Date validation
        if (!this.isValidDate(exp.startDate)) {
            throw new CvValidationError(`Start date at index ${index} must be YYYY-MM format`, `experience[${index}].startDate`, exp.startDate);
        }
        if (!this.isValidDate(exp.endDate)) {
            throw new CvValidationError(`End date at index ${index} must be YYYY-MM format`, `experience[${index}].endDate`, exp.endDate);
        }

        // Achievements validation
        if (!Array.isArray(exp.achievements)) {
            throw new CvValidationError(`Achievements at index ${index} must be an array`, `experience[${index}].achievements`, exp.achievements);
        }
        if (!exp.achievements.every(achievement => typeof achievement === "string" && achievement.trim().length > 0)) {
            throw new CvValidationError(`All achievements at index ${index} must be non-empty strings`, `experience[${index}].achievements`, exp.achievements);
        }
    }

    /**
     * Validates expertise array
     * @private
     */
    static validateExpertise(expertise) {
        if (!Array.isArray(expertise)) {
            throw new CvValidationError("Expertise must be an array", "expertise", expertise);
        }

        expertise.forEach((area, index) => {
            if (!area || typeof area !== "object") {
                throw new CvValidationError(`Expertise area at index ${index} must be an object`, `expertise[${index}]`, area);
            }
            if (typeof area.title !== "string" || area.title.trim().length === 0) {
                throw new CvValidationError(`Expertise title at index ${index} must be non-empty`, `expertise[${index}].title`, area.title);
            }
            if (!Array.isArray(area.skills) || area.skills.length === 0) {
                throw new CvValidationError(`Skills at index ${index} must be non-empty array`, `expertise[${index}].skills`, area.skills);
            }
            if (!area.skills.every(skill => typeof skill === "string" && skill.trim().length > 0)) {
                throw new CvValidationError(`All skills at index ${index} must be non-empty strings`, `expertise[${index}].skills`, area.skills);
            }
        });
    }

    /**
     * Validates education array
     * @private
     */
    static validateEducation(education) {
        if (!Array.isArray(education)) {
            throw new CvValidationError("Education must be an array", "education", education);
        }

        education.forEach((edu, index) => {
            if (!edu || typeof edu !== "object") {
                throw new CvValidationError(`Education item at index ${index} must be an object`, `education[${index}]`, edu);
            }
            if (typeof edu.title !== "string" || edu.title.trim().length === 0) {
                throw new CvValidationError(`Education title at index ${index} must be non-empty`, `education[${index}].title`, edu.title);
            }
            if (!this.isValidDate(edu.startDate)) {
                throw new CvValidationError(`Education start date at index ${index} must be YYYY-MM format`, `education[${index}].startDate`, edu.startDate);
            }
            if (!this.isValidDate(edu.endDate)) {
                throw new CvValidationError(`Education end date at index ${index} must be YYYY-MM format`, `education[${index}].endDate`, edu.endDate);
            }
            if (typeof edu.place !== "string" || edu.place.trim().length === 0) {
                throw new CvValidationError(`Education place at index ${index} must be non-empty`, `education[${index}].place`, edu.place);
            }
            if (!Array.isArray(edu.additionalInfo)) {
                throw new CvValidationError(`Additional info at index ${index} must be an array`, `education[${index}].additionalInfo`, edu.additionalInfo);
            }
        });
    }

    /**
     * Validates URL format
     * @private
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validates date format (YYYY-MM)
     * @private
     */
    static isValidDate(date) {
        if (typeof date !== "string") return false;
        const datePattern = /^\d{4}-\d{2}$/;
        if (!datePattern.test(date)) return false;
        
        const [year, month] = date.split("-").map(Number);
        return year >= 1900 && year <= new Date().getFullYear() + 10 &&
               month >= 1 && month <= 12;
    }
}