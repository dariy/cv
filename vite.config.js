import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: resolve(__dirname, "src/cv.html"),
            output: {
                entryFileNames: "assets/[name].[hash].js",
                chunkFileNames: "assets/[name].[hash].js",
                assetFileNames: "assets/[name].[hash][extname]",
            },
        },
        minify: "terser",
        sourcemap: true,
        outDir: "dist",
        emptyOutDir: true,
    },
    plugins: [
        {
            name: "html-transform",
            enforce: "post",
            transformIndexHtml(html) {
                // Fix paths by removing any "../" from asset references
                return html.replace(/\.\.\/assets\//g, "assets/");
            },
            generateBundle(options, bundle) {
                const htmlFile = Object.keys(bundle).find((file) => file.endsWith("src/cv.html"));
                if (htmlFile && bundle[htmlFile]) {
                    bundle[htmlFile].fileName = "index.html";
                    bundle["index.html"] = bundle[htmlFile];
                    delete bundle[htmlFile];
                }
            },
        },
    ],
});
