module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-undef": "warn",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "no-debugger": "warn",
    "no-prototype-builtins": "warn",
    "no-empty": "warn",
    "no-useless-escape": "warn",
  },
};
