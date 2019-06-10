import resolve from "rollup-plugin-node-resolve";
import sizes from "@atomico/rollup-plugin-sizes";
import { terser } from "rollup-plugin-terser";

import getPkg from "./getPkg.js";
import plugin from "./plugin/index.js";

let ignoreLog = ["EMPTY_BUNDLE", "CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT"];

let isDev = process.env.ROLLUP_WATCH;

let defaultOptions = {
	dirDist: "./dist",
	dirLib: "./lib",
	minifyDist: !isDev,
	minifyLib: !isDev,
	showSizes: !isDev,
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

	let { dependencies } = getPkg();
	let external = Object.keys(dependencies);

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
				plugin(),
				resolve(),
				...options.pluginsDist,
				...options.plugins,
				...(options.minifyDist ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	if (!isDev && options.dirLib) {
		bundles.push({
			external,
			input,
			output: {
				dir: options.dirLib,
				sourcemap: true,
				format: "esm"
			},
			onwarn: options.onwarn,
			plugins: [
				plugin({
					createHTML: false
				}),
				resolve(),
				...options.pluginsLib,
				...options.plugins,
				...(options.minifyLib ? [terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	return bundles;
}
