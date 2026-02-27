
const buildHelper = require("@egjs/build-helper");
const defaultOptions = {
  name: "eg.ChildrenDiffer",
  input: "./src/index.umd.ts",
  sourcemap: true,
}

const external = {
  "@egjs/list-differ": "eg.ListDiffer",
};

export default buildHelper([
  {
    ...defaultOptions,
    external,
    input: "./src/index.ts",
    output: "./dist/children-differ.esm.js",
    format: "es",
    exports: "named",
  },
  {
    ...defaultOptions,
    external,
    output: "./dist/children-differ.js",
  },
  {
    ...defaultOptions,
    external,
    output: "./dist/children-differ.min.js",
    uglify: true,
  },
  {
    ...defaultOptions,
    output: "./dist/children-differ.pkgd.js",
    resolve: true,
  },
  {
    ...defaultOptions,
    output: "./dist/children-differ.pkgd.min.js",
    resolve: true,
    uglify: true,
  }
]);

