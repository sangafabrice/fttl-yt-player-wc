import "./build.template.mjs";
import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";
import app from "./package.json" with { type: "json" };

const outputNoExt = `dist/${app.name}`; 
const format = "es";

export default {
	input: app.main,
	output: [
		{
			file: `${outputNoExt}.js`,
			format
		},
		{
			file: `${outputNoExt}.min.js`,
			format,
			plugins: [terser()]
		}
	],
	plugins: [string({ include: "src/**/assets/**/*.*" })]
};