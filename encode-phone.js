#!/usr/bin/env node

/**
 * Console utility for phone number encoding.
 * Converts a phone number into an encoded format for CV data.
 *
 * @example
 * # Encode phone number +1 012-345-6789:
 * node encode-phone.js 0123456789
 */

import { phone } from "./src/cv.phone.js";

const PHONE_LENGTH = 10;

const USAGE = `
Phone Number Encoder
-------------------
Usage  : node encode-phone.js <phone>
Example: node encode-phone.js 0123456789 (for +1 012-345-6789)

Notes:
- Input should be digits only (0-9)
- Do not include country code
- Do not include special characters
`;

/**
 * Validates phone number input
 * @param {string} input - The phone number to validate
 * @throws {Error} If validation fails
 */
function validateInput(input) {
    if (!input) {
        throw new Error("Phone number is required");
    }

    if (!/^\d+$/.test(input)) {
        throw new Error("Phone number must contain only digits (0-9)");
    }

    if (input.length !== PHONE_LENGTH) {
        throw new Error(`Phone number must be exactly ${PHONE_LENGTH} digits`);
    }
}

/**
 * Main execution function
 * @returns {void}
 */
function main() {
    const input = process.argv[2];

    if (input === "-h" || input === "--help") {
        console.log(USAGE);
        process.exit(0);
    }

    try {
        validateInput(input);
        const encodedPhone = phone.encodeString(input);
        console.log(encodedPhone);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log("\n" + USAGE);
        process.exit(1);
    }
}

// Execute the script
main();
