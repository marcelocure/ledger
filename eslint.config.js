const tseslint = require("typescript-eslint");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
