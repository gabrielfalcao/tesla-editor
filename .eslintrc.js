module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: [
    // ...
    "react-hooks",
    "prettier",
  ],
  rules: {
    // ...
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: ["*.test.js", "**/__tests__/**/*.js"],
      rules: {
        "global-require": "off",
        "no-console": "off",
        "react/no-multi-comp": "off",
        "react/prop-types": "off",
        "no-await-in-loop": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      files: ["src/main/**"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  env: { browser: true },
  settings: {
    react: {
      version: "17.0.2", // React version. "detect" automatically picks the version you have installed.
    },
  },
};
