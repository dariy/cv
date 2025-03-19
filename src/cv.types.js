/**
 * @typedef {Object} Summary
 * @property {string} template - Template string for summary section
 * @property {number} since - Year when professional experience started
 */

/**
 * @typedef {Object} Location
 * @property {string} url - URL to location (e.g., Google Maps)
 * @property {string} title - Display title for location
 */

/**
 * @typedef {Object} Link
 * @property {string} url - URL of the link
 * @property {string} title - Display title for the link
 */

/**
 * @typedef {Object} Contacts
 * @property {string[]} email - Email address parts [domain, subdomain, username]
 * @property {string[]} phone - Encoded phone number digits
 * @property {string} cv - URL to CV
 * @property {Location} location - Current location information
 * @property {Link[]} links - Array of professional/social links
 */

/**
 * @typedef {Object} Company
 * @property {string} name - Company name
 * @property {string} url - Company website URL
 */

/**
 * @typedef {Object} Experience
 * @property {string} role - Job title or role
 * @property {Company} company - Company information
 * @property {Location} location - Job location
 * @property {string} startDate - Start date (YYYY-MM-DD)
 * @property {string} endDate - End date (YYYY-MM-DD)
 * @property {string[]} achievements - List of achievements/responsibilities
 */

/**
 * @typedef {Object} Expertise
 * @property {string} title - Category title
 * @property {string[]} skills - List of skills in this category
 */

/**
 * @typedef {Object} Education
 * @property {string} title - Degree or certification title
 * @property {string} startDate - Start date (YYYY-MM-DD)
 * @property {string} endDate - End date (YYYY-MM-DD)
 * @property {string} place - Institution name
 * @property {string[]} additionalInfo - Additional details about the education
 */

/**
 * @typedef {Object} CvData
 * @property {string} name - Full name
 * @property {Summary} summary - Professional summary
 * @property {Contacts} contacts - Contact information
 * @property {Experience[]} experience - Work experience entries
 * @property {Expertise[]} expertise - Skills and expertise
 * @property {Education[]} education - Educational background
 */

export {};