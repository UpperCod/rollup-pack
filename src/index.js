import inputHTML from "@atomico/rollup-plugin-input-html";
import resolve from "rollup-plugin-node-resolve";
import sizes from "@atomico/rollup-plugin-sizes";
import { terser } from "rollup-plugin-terser";

let ignoreLog = ["CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT"];

let defaultOptions = {
	dirDist: "./dist",
	dirDemo: "./demo",
	minifyDist: false,
	minifyDemo: true,
	showSizes: true,
	plugins: [],
	pluginsDist: [],
	pluginsDemo: [],
	onwarn(message) {
		if (ignoreLog.indexOf(message.code) > -1) return;
		console.error(message);
	}
};

export default function pack(input = "*.html", options) {
	options = { ...defaultOptions, ...options };
	return [
		{
			input,
			output: {
				dir: options.dirDemo,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML(),
				resolve(),
				...options.pluginsDemo,
				...options.plugins,
				...(options.minifyDemo ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		},
		{
			input,
			output: {
				dir: options.dirDist,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML({
					html: false
				}),
				options.plugins,
				...options.pluginsDist,
				...(options.minifyDist ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		}
	];
}
