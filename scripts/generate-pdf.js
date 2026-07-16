/**
 * Generates dist/cv.pdf from the built site.
 *
 * Serves dist/ with Vite's preview server, renders the page in headless
 * Chrome and prints it to PDF using the print stylesheet (cv.print.css),
 * so the downloadable file is identical to the ATS-friendly printed CV.
 *
 * Run after `npm run build` (and, in CI, after dist/data/cv.json is created):
 *   npm run pdf
 */
import { preview } from "vite";
import puppeteer from "puppeteer";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const pdfPath = resolve(distDir, "cv.pdf");

/** Milliseconds to wait for the CV to finish rendering before giving up */
const RENDER_TIMEOUT = 30000;

function ensureCvData() {
    const target = resolve(distDir, "data/cv.json");
    if (existsSync(target)) return;

    const candidates = [resolve(root, "data/cv.json"), resolve(root, "data/cv.template.json")];
    const source = candidates.find(existsSync);
    if (!source) {
        throw new Error(
            "No CV data found (dist/data/cv.json, data/cv.json or data/cv.template.json)",
        );
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    console.log(`Copied ${source} -> ${target}`);
}

async function main() {
    if (!existsSync(resolve(distDir, "index.html"))) {
        throw new Error("dist/index.html not found — run `npm run build` first");
    }
    ensureCvData();

    const server = await preview({ root, preview: { port: 0, open: false } });
    const url = server.resolvedUrls.local[0];
    console.log(`Previewing ${url}`);

    const browser = await puppeteer.launch({
        // GitHub Actions runners require disabling the Chrome sandbox
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0", timeout: RENDER_TIMEOUT });

        // The CV is built client-side after the JSON loads; the author name is
        // the last thing we can cheaply assert to know rendering succeeded.
        await page
            .waitForFunction(`document.querySelector(".author")?.textContent.trim()`, {
                timeout: RENDER_TIMEOUT,
            })
            .catch(() => {
                throw new Error("CV did not render (maintenance page or invalid data?)");
            });

        await page.pdf({
            path: pdfPath,
            preferCSSPageSize: true, // respect @page from cv.print.css
            printBackground: false,
        });
        console.log(`PDF written to ${pdfPath}`);
    } finally {
        await browser.close();
        await server.close();
    }
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
