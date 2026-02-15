import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import custom from "./scripts/eslint/index.js";

const customRules = {
  plugins: {
    custom,
  },
  rules: {
    // Ignore unused variables if they start with underscores.
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // Require === and !==, except when comparing to null.
    eqeqeq: ["warn", "always", { null: "ignore" }],

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
    // TODO: Re-enable these as warnings.
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
};

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "local",
      "server/dist",
      "web/dist",
      "demo-app",
      "scripts/generate-pwa-assets/dist",
      "coverage",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
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
