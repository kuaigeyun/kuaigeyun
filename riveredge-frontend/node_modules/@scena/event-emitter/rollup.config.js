
import builder from "@daybrush/builder";

export default builder([
    {
        name: "EventEmitter",
        input: "src/index.umd.ts",
        output: "./dist/event-emitter.js",
        resolve: true,
    },
    {
        name: "EventEmitter",
        input: "src/index.umd.ts",
        output: "./dist/event-emitter.min.js",
        resolve: true,
        uglify: true,

    },
    {
        input: "src/index.ts",
        output: "./dist/event-emitter.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.umd.ts",
        output: "./dist/event-emitter.cjs.js",
        exports: "default",
        format: "cjs",
    },
]);
