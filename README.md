# rollup-pack

This is a bundle prefiguration for [Rollup](https://rollupjs.org) that allows to generate code for the browser in MJS format and to know its cost in size.

The process is simple and is done thanks to [@atomico/rollup-plugin-input-html](https://github.com/atomicojs/rollup-plugin-input-html)

1. the existing html files in the root are analyzed.
2. it extracts the local script of the modules type, from the html files.
3. Bundles are generated for each one based on the name of the HTML file. eg: `ui-button.html` will be `ui-button.js`.

through the process 2 bundle directories are generated:

1. `./demo`: copy the html and all its dependencies thanks to [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) and [@atomico/rollup-plugin-input-html](https://github.com/atomicojs/rollup-plugin-input-html).
2. `./dist` : copy only the js.

In both formats the cost of each bundle is taught thanks to [@atomico/rollup-plugin-sizes](https://github.com/atomicojs/rollup-plugin-sizes).

## Use

```js
import pack from "@atomico/rollup-pack";

export default pack("*.html" /**,optionalConfig **/);
```

## default configuration

```js
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
```

## By default the configuration works thanks to the plugins.

1. [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)
2. [rollup-plugin-terser](https://github.com/TrySound/rollup-plugin-terser)
3. [@atomico/rollup-plugin-input-html](https://github.com/atomicojs/rollup-plugin-input-html)
4. [@atomico/rollup-plugin-sizes](https://github.com/atomicojs/rollup-plugin-sizes)
