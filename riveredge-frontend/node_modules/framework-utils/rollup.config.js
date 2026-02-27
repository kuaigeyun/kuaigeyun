
import builder from "@daybrush/builder";

export default builder([
    {
        input: "src/index.ts",
        output: "./dist/utils.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/utils.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
