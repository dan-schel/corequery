import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import custom from "./scripts/eslint/index.js";

const customRules = [
  {
    plugins: {
      custom,
    },
    rules: {
      // Ignore unused variables if they start with underscores.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Require === and !==, except when comparing to null.
      "eqeqeq": ["warn", "always", { null: "ignore" }],

      // Warn about prettier violations.
      "prettier/prettier": "warn",

      // Warn about non-null assertions.
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Require imports to use the @ alias instead of relative paths.
      "custom/enforce-import-alias": "warn",

      // Warn about relying on truthy/falsy values.
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],

      // These errors are often just symptoms of another error, and obscure the
      // actual error, so downngrade them to warnings.
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
    },
  },
  {
    files: [
      "server/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}",
      "shared/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}",
      "tests/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}",
    ],
    rules: {
      // Prevent use of console.log, etc. in /server, /shared, and /tests.
      "no-console": "warn",
    },
  },
  {
    files: ["web/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    rules: {
      // In /web, only allow console.warn.
      "no-console": ["warn", { allow: ["warn"] }],
    },
  },
];

const reactConfig = [
  {
    files: ["web/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...react,
    languageOptions: {
      ...react.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Warn if <Thing></Thing> can be changed to <Thing />.
      "react/self-closing-comp": "warn",
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "local",
      "server/dist",
      "web/dist",
      "demo-app",
      "scripts/generate-pwa-assets/dist",
      "scripts/eslint",
      "coverage",
      "eslint.config.js",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactConfig,
  prettier,
  customRules,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
);
