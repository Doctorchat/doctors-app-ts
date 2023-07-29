module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  settings: { react: { version: "detect" } },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "prettier", "import"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",

    "react/prop-types": "off",

    "prettier/prettier": "warn",

    "import/order": [
      "warn",
      {
        groups: ["type", ["builtin", "external"], "internal", ["parent", "sibling"], "index"],
        pathGroups: [
          {
            pattern: "{react,react-router-dom,react-dom/**}",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "react-router-dom", "react-dom"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
