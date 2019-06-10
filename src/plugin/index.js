import path from "path";
import { createFilter } from "rollup-pluginutils";
import fastGlob from "fast-glob";
import markdown from "marked";
import yaml from "js-yaml";

import replaceFragment from "./replaceFragment.js";
import getSources from "./getSources.js";
import injectHTML from "./injectHTML.js";
import template from "./template.js";

export let defaultOptions = {
	include: ["**/*.html", "**/*.md"],
	exclude: ["node_modules/**"],
	createHTML: true,
	template,
	page: {
		asideFooter: `Doc created with<br/><a href="https://github.com/atomicojs/rollup-pack">@atomico/rollup-pack</a>`,
		brandingSrc: "", //eg: ./img/logo.svg
		homepage: "https://github.com/atomicojs/atomico",
		github: "https://github.com/atomicojs/atomico.git",
		styleSrc: "" // eg: ./css/style.css
	}
};

export default function inputHTML(options) {
	options = { ...defaultOptions, ...options };
	let filter = createFilter(options.include, options.exclude);
	let html = {};
	return {
		name: "rollup-plugin-input-html",
		options(opts) {
			let inputs = [].concat(opts.input);
			let [local, globs] = inputs.reduce(
				(group, input) => {
					group[/\*/.test(input) ? 1 : 0].push(input);
					return group;
				},
				[[], []]
			);
			if (globs.length) {
				return {
					...opts,
					input: fastGlob.sync(globs).concat(local)
				};
			}
		},
		transform(code, id) {
			if (!filter(id)) return;

			html[id] = html[id] || {};

			if (html[id].input !== code) {
				let memoFragment = {};
				let meta = {};
				let isMd;
				if (/\.md/.test(id)) {
					let id = 0;

					code = replaceFragment(
						code,
						/---/,
						/---/,
						content => {
							meta = yaml.safeLoad(content, "utf8");
							return "";
						},
						1
					);

					let nextCode = [
						[/```/, /```/, "```"] // eg: ```code any ```
						//[/`[^\s]+/, /[^\s]+`/, "`"] // eg: `code any`
					].reduce((code, [start, closed, type]) => {
						return replaceFragment(code, start, closed, content => {
							let index = `<!--fr:${id++}-->`;
							memoFragment[index] = { type, content };
							return index;
						});
					}, code);

					nextCode = replaceFragment(
						nextCode,
						/<frame(\s+[^\>]+)>/,
						/<\/frame>/,
						(content, [tag, attrs = ""]) => {
							let style = "";
							let className = "Frame";
							let addClassName = "";
							attrs
								.replace(
									/\s+([\w-]+)=(?:"([^"]+)"|'([^']+)')/g,
									(all, index, value) => {
										style += `${index}:${value.trim()};`;
										return "";
									}
								)
								.replace(/\s+([^\s]+)/, (all, index) => {
									addClassName += ` ${className}--${index}`;
								});

							return `<section class="${className + addClassName}"${
								style ? `style="${style}"` : ""
							}>${content}</section>`;
						}
					);

					code = markdown(nextCode);
					isMd = true;
				}

				let data = getSources(code);

				for (let key in memoFragment) {
					data.output = data.output.replace(
						key,
						markdown(
							memoFragment[key].type +
								memoFragment[key].content +
								memoFragment[key].type
						)
					);
				}

				data.type = isMd ? "md" : "html";
				data.meta = meta;
				data.fileName = path.parse(id).base.replace(/\.(md|html)$/, "");

				meta.import = meta.import
					? [].concat(meta.import).map(src => ({ src }))
					: [];

				data.code = data.sources
					.filter(({ tagName }) => tagName == "script")
					.concat(meta.import)
					.map(script => `export * from ${JSON.stringify(script.src)};`)
					.join(";\n");
				html[id] = data;
			}
			return {
				code: html[id].code
			};
		},
		generateBundle(opts, bundle) {
			if (!options.createHTML) return;
			// regulates the bundle by type of resource
			for (let key in bundle) {
				let type = (key.match(/\.(js|json|css)(\.map){0,1}$/) || [])[1];

				type = /js|json/.test(type) ? "js" : type;

				let fileName = path.join(type, key);
				bundle[fileName] = {
					...bundle[key],
					fileName
				};
				delete bundle[key];
			}

			let globMenu = new Map();

			for (let key in html) {
				let { meta, fileName, type } = html[key];
				if (type != "md") continue;
				let { menu = "Components", title = fileName } = meta;
				let item = globMenu.get(menu) || [];
				item.push({
					file: fileName + ".html",
					title
				});
				globMenu.set(menu, item);
			}

			globMenu = Array.from(globMenu)
				.sort(([a], [b]) => (a > b ? 1 : -1))
				.map(([title, children]) => [
					title,
					children.sort((a, b) => (a.title > b.title ? 1 : -1))
				]);

			for (let key in html) {
				let data = html[key];
				if (!data.create || data.type == "md") {
					let { output, fileName, meta } = data;
					let file = fileName + ".html";
					if (data.type == "md") {
						output = options.template({
							content: output,
							menu: globMenu,
							meta,
							file,
							page: options.page
						});
					}

					bundle[file] = {
						fileName: file,
						isAsset: true,
						source: injectHTML(
							output,
							`<script type="module" src="./js/${fileName}.js"></script>`
						)
					};

					data.create = true;
				}
			}
		}
	};
}
