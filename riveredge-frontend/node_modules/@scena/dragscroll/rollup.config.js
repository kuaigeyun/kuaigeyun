
import builder from "@daybrush/builder";

export default builder([
    {
        name: "DragScroll",
        input: "src/index.umd.ts",
        output: "./dist/dragscroll.js",
        resolve: true,
    },
    {
        name: "DragScroll",
        input: "src/index.umd.ts",
        output: "./dist/dragscroll.min.js",
        resolve: true,
        uglify: true,

    },
    {
        input: "src/index.ts",
        output: "./dist/dragscroll.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.umd.ts",
        output: "./dist/dragscroll.cjs.js",
        exports: "default",
        format: "cjs",
    },
]);
