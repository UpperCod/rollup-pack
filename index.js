'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inputHTML = _interopDefault(require('@atomico/rollup-plugin-input-html'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var sizes = _interopDefault(require('@atomico/rollup-plugin-sizes'));
var rollupPluginTerser = require('rollup-plugin-terser');
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));

function getPkg() {
	try {
		let pkg = fs.readFileSync(
			path.resolve(process.cwd(), "package.json"),
			"utf8"
		);
		return JSON.parse(pkg);
	} catch (e) {
		throw new Error("does not locate the package.json");
	}
}

let ignoreLog = ["CIRCULAR_DEPENDENCY", "UNRESOLVED_IMPORT"];

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

function pack(input = "*.html", options) {
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
				inputHTML(),
				resolve(),
				...options.pluginsDist,
				...options.plugins,
				...(options.minifyDist ? [rollupPluginTerser.terser()] : []),
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
				inputHTML({
					createHTML: false
				}),
				resolve(),
				...options.pluginsLib,
				...options.plugins,
				...(options.minifyLib ? [rollupPluginTerser.terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		});
	}

	return bundles;
}

module.exports = pack;
