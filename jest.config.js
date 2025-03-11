export default {
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "json"],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
        // Handle CSS imports
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        // Handle static assets
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
        // Handle Vite's @/ aliases
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testMatch: [
        "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
        "<rootDir>/public/**/*.{spec,test}.{js,jsx}",
        "<rootDir>/tests/**/*.{spec,test}.{js,jsx}",
    ],
    transformIgnorePatterns: ["/node_modules/(?!(@vitejs/plugin-react)/)"],
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
};
