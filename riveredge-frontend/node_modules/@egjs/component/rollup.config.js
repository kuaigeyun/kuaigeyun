/* eslint-disable */
const buildHelper = require("@egjs/build-helper");

const name = "Component";

export default buildHelper([
  {
    name,
    input: "./src/index.umd.ts",
    output: "./dist/component.js",
    format: "umd",
  },
  {
    name,
    input: "./src/index.umd.ts",
    output: "./dist/component.min.js",
    format: "umd",
    uglify: true,
  },
  {
    input: "./src/index.ts",
    output: "./dist/component.esm.js",
    format: "esm",
    exports: "named",
  },
  {
    input: "./src/index.cjs.ts",
    output: "./dist/component.cjs.js",
    format: "cjs",
    exports: "named",
  },
]);
