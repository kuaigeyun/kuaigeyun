import typescript from 'rollup-plugin-typescript';
import PrototypeMinify from "rollup-plugin-prototype-minify";
import { uglify } from "rollup-plugin-uglify";
import es3 from "rollup-plugin-es3";


const merge = require("./config/merge");
const banner = require("./config/banner");
const plugin = typescript({
  "module": "es2015",
  "target": "es3",
  "lib": ["es2015", "dom"],
  "exclude": "node_modules/**",
  "sourceMap": true,
});
const uglifyCode = uglify({
  sourcemap: true,
  output: {
    comments: function (node, comment) {
      var text = comment.value;
      var type = comment.type;
      if (type === "comment2") {
        // multiline comment
        return /@name\:\s@daybrush/.test(text);
      }
    },
  },
});
const defaultConfig = {
  plugins: [
    plugin, PrototypeMinify({sourcemap: true}),
  ],
  output: {
    banner,
    format: "es",
    freeze: false,
    exports: "named",
    interop: false,
    sourcemap: true,
  },
};

export default [
  {
    input: 'src/index.ts',
    output: {
      file: `./dist/utils.esm.js`,
    },
  },
  {
    input: 'src/index.ts',
    output: {
      exports: "named",
      format: "cjs",
      file: `./dist/utils.cjs.js`,
    },
  },
  {
    input: 'src/index.umd.ts',
    plugins: [es3({sourcemap: true})],
    output: {
      exports: "default",
      format: "umd",
      name: "utils",
      file: `./dist/utils.js`,
    },
  },
  {
    input: 'src/index.umd.ts',
    plugins: [es3({sourcemap: true}), uglifyCode],
    output: {
      exports: "default",
      format: "umd",
      name: "utils",
      file: `./dist/utils.min.js`,
    },
  },
].map(entry => merge(defaultConfig, entry, {
  plugins: "append",
  output: "append",
}));
