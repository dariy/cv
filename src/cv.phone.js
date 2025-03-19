/**
 * Phone number encoding/decoding utility.
 * Provides basic obfuscation for phone numbers in public data.
 *
 * Pattern: ABC-DEF-GHIJ becomes BCA-EDF-GHIJ
 * Example: 012-345-6789 becomes 201-534-6879
 */
export const phone = {
    /**
     * Validates phone number format
     * @private
     * @param {string[] | string} phone - Phone number to validate
     * @throws {Error} If phone number format is invalid
     */
    _validateAndReturnArray(phone) {
        const digits = Array.isArray(phone) ? phone : phone.split("");

        if (digits.length !== 10) {
            throw new Error("Phone number must be exactly 10 digits");
        }

        if (!digits.every((digit) => /^\d$/.test(digit))) {
            throw new Error("Phone number must contain only digits");
        }

        return digits;
    },

    /**
     * Decodes the phone number encoded by `encode()`
     * @param {string[] | string} phone - Phone number as array of digits or string
     * @returns {string[]} Decoded phone number as array of digits
     * @throws {Error} If phone number format is invalid
     */
    decode(phone) {
        // Decode pattern: BCA-EDF-GHIJ → ABC-DEF-GHIJ
        const [a, b, c, d, e, f, g, h, i, j] = this._validateAndReturnArray(phone);
        // prettier-ignore
        return [
            c, a, b, // → ABC
            f, e, d, // → DEF
            g, i, h, j, // → GHIJ
        ];
    },

    /**
     * Encodes the phone number
     * @param {string[] | string} phone - Phone number as array of digits or string
     * @returns {string[]} Encoded phone number as array of digits
     * @throws {Error} If phone number format is invalid
     */
    encode(phone) {
        // Encode pattern: ABC-DEF-GHIJ → BCA-EDF-GHIJ
        const [a, b, c, d, e, f, g, h, i, j] = this._validateAndReturnArray(phone);
        // prettier-ignore
        return [
            b, c, a, // → BCA
            f, e, d, // → EDF
            g, i, h, j, // → GHIJ
        ];
    },

    /**
     * Encodes the phone number and returns it as a string for easy copy-pasting into cv.json
     * @param {string} aPhone - Phone number as string
     * @returns {string} Encoded phone number as string
     * @throws {Error} If phone number format is invalid
     */
    encodeString: (aPhone) => `phone: ["${phone.encode(aPhone).join('", "')}"]`,
};
