
import builder from "@daybrush/builder";

const defaultConfig = {
    name: "styled",
    input: "src/styled.ts",
    exports: "default",
    commonjs: true,
}
export default builder([
    {
        ...defaultConfig,
        output: "./dist/styled.js",
        resolve: true,
    },
    {
        ...defaultConfig,
        output: "./dist/styled.min.js",
        resolve: true,
        uglify: true,
    },
    {
        ...defaultConfig,
        output: "./dist/styled.esm.js",
        format: "es",
        resolve: true,
        external: {
            "@daybrush/utils": "@daybrush/utils",
        },
    },
    {
        ...defaultConfig,
        input: "src/index.cjs.ts",
        output: "./dist/styled.cjs.js",
        format: "cjs",
        exports: "named",
        resolve: true,
        external: {
            "@daybrush/utils": "@daybrush/utils",
        },
    },
]);
