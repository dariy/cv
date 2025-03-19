import { dom, network } from "./cv.lib.js";
import { CvBuilder } from "./cv.builder.js";

/** @type {Readonly<{DATA_PATH: string, MAINTENANCE_MESSAGE: string}>} */
const CONFIG = Object.freeze({
    DATA_PATH: "/data",
    MAINTENANCE_MESSAGE: "<h1>Site is on maintenance. Please try again later.</h1>",
});

/**
 * Attempts to load CV data from primary or fallback source
 * @returns {Promise<import("./cv.types.js").CvData | null>}
 */
async function loadCvData() {
    const cv = await network.downloadCV("cv", CONFIG.DATA_PATH);
    if (cv) return cv;

    console.warn("No cv found, falling back to template...");
    const template = await network.downloadCV("cv.template", CONFIG.DATA_PATH);
    if (!template) {
        console.error("Failed to load template as well.");
    }
    return template;
}

/**
 * Displays maintenance message when CV data is unavailable
 */
const showMaintenancePage = () => (dom.$("body").innerHTML = CONFIG.MAINTENANCE_MESSAGE);

/**
 * Initializes the CV application
 */
async function initializeCV() {
    try {
        const cvData = await loadCvData();
        if (!cvData) {
            showMaintenancePage();
            return;
        }
        new CvBuilder().build(cvData);
    } catch (error) {
        console.error("Failed to initialize CV:", error);
        showMaintenancePage();
    }
}

window.addEventListener("DOMContentLoaded", initializeCV);
