import js from "@eslint/js";
import globals from "globals";

export default [
    { ignores: ["dist"] },
    {
        // Browser environment configuration
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            sourceType: "module",
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
        },
    },
    {
        // Node.js environment configuration
        files: ["*.js", "scripts/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },
            sourceType: "module",
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
        },
    },
];
