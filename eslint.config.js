import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

const customRules = {
  rules: {
    // Ignore unused variables if they start with underscores.
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // Require === and !==, except when comparing to null.
    eqeqeq: ["warn", "always", { null: "ignore" }],

    // Warn about prettier violations.
    "prettier/prettier": "warn",

    // Warn about non-null assertions.
    "@typescript-eslint/no-non-null-assertion": "warn",
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
  ...tseslint.configs.recommended,
  prettier,
  customRules,
);
