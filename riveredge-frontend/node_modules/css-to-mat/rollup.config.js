const builder = require("@daybrush/builder");

module.exports = builder([
    {
        name: "CssToMatrix",
        input: "src/index.umd.ts",
        output: "./dist/css-to-mat.js",
        exports: "default",
        resolve: true,
    },
    {
        name: "CssToMatrix",
        input: "src/index.umd.ts",
        output: "./dist/css-to-mat.min.js",
        exports: "default",
        resolve: true,
        uglify: true,

    },
    {
        input: "src/index.esm.ts",
        output: "./dist/css-to-mat.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.esm.ts",
        output: "./dist/css-to-mat.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
