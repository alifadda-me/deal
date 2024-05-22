const eslintPlugin = require("@typescript-eslint/eslint-plugin");
const eslintParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = {
  files: ["**/*.ts", "**/*.tsx"],
  ignores: ["node_modules/**", "dist/**", "build/**"],
  plugins: {
    "@typescript-eslint": eslintPlugin,
    prettier: prettierPlugin,
  },
  languageOptions: {
    parser: eslintParser,
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      jest: "readonly",
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prettier/prettier": [
      "warn",
      {
        singleQuote: true,
        trailingComma: "all",
        printWidth: 120,
      },
    ],
    "no-shadow": 0,
    "no-underscore-dangle": 0,
    "function-paren-newline": 0,
    "import/no-dynamic-require": 0,
    eqeqeq: 0,
    "no-console": 0,
    "no-param-reassign": "warn",
    "no-unused-vars": 0,
    // "@typescript-eslint/no-unused-vars": "warn",
    "no-return-assign": "warn",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-empty-interface": 0,
  },
};
