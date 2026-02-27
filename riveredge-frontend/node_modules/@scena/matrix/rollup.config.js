
import builder from "@daybrush/builder";

export default builder([
    {
        name: "Matrix",
        input: "src/index.ts",
        output: "./dist/matrix.js",
        exports: "named",
        resolve: true,
    },
    {
        name: "Matrix",
        input: "src/index.ts",
        output: "./dist/matrix.min.js",
        exports: "named",
        resolve: true,
        uglify: true,

    },
    {
        input: "src/index.ts",
        output: "./dist/matrix.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/matrix.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
