const tseslint = require("typescript-eslint");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  },
  ...tseslint.configs.recommended,
];
