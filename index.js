'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inputHTML = _interopDefault(require('@atomico/rollup-plugin-input-html'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var sizes = _interopDefault(require('@atomico/rollup-plugin-sizes'));
var rollupPluginTerser = require('rollup-plugin-terser');

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

function pack(input = "*.html", options) {
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
				...(options.minifyDemo ? [rollupPluginTerser.terser()] : []),
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
				...(options.minifyDist ? [rollupPluginTerser.terser()] : []),
				...(options.showSizes ? [sizes()] : [])
			]
		}
	];
}

module.exports = pack;
