import inputHTML from "@atomico/rollup-plugin-input-html";
import resolve from "rollup-plugin-node-resolve";
import sizes from "@atomico/rollup-plugin-sizes";
import { terser } from "rollup-plugin-terser";

let ignoreLog = ["CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT"];

let defaultOptions = {
	dirDist: "./dist",
	dirLib: "./lib",
	minifyDist: true,
	minifyLib: true,
	showSizes: true,
	plugins: [],
	pluginsDist: [],
	pluginsLib: [],
	onwarn(message) {
		if (ignoreLog.indexOf(message.code) > -1) return;
		console.error(message);
	}
};

export default function pack(input = "*.html", options) {
	options = { ...defaultOptions, ...options };

	let bundles = [];

	if (options.dirDist) {
		bundles.push({
			input,
			output: {
				dir: options.dirDist,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML(),
				resolve(),
				...options.pluginsDist,
				...options.plugins,
				...(options.minifyDist ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	if (options.dirLib) {
		bundles.push({
			input,
			output: {
				dir: options.dirLib,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				inputHTML({
					createHTML: false
				}),
				options.plugins,
				...options.pluginsLib,
				...(options.minifyLib ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	return bundles;
}
