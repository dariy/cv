import { network } from "./cv.lib.js";
import { CvBuilder } from "./cv.builder.js";

window.addEventListener("DOMContentLoaded", async () => {
    /** @type {import("./cv.types.js").CvData | null} */
    const cv =
        (await network.downloadCV("cv", "/data/")) ||
        (await network.downloadCV("cv.template", "/data/"));
    if (cv) new CvBuilder().build(cv);
});
