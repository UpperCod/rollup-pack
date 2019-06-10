export let defaultTheme = {
	"theme-contrast-background": "#232329",
	"theme-bg-contrast": "#f1f1f9",
	"theme-bg-soft-contrast": "rgba(241, 241, 249, 0.5)",
	"theme-contrast-color": "white",
	"theme-contrast-color-active": "#c8a4ff",
	"theme-aside-width": "220px",
	"theme-contrast-light": "0px 0px 3px rgba(255, 255, 255, 0.5)",
	"makrdown-background": "white",
	"markdown-color": "#232329",
	"markdown-code-background": "#232329",
	"markdown-code-color": "#c8a4ff",
	"makrdown-link-color": "#4c79e9",
	"markdown-table-row-color": "rgba(241, 241, 249, 0.5)",
	"markdown-table-row-odd-color": "#f1f1f9"
};

export default function template(data) {
	let theme = { ...defaultTheme, ...data.page.theme };
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
				${data.meta.title ? `<title>${data.meta.title}</title>` : ""}
				${
					data.meta.title
						? `<meta name="description" content="${data.meta.title}"> `
						: ""
				}
				<link rel="shortcut icon" href="favicon.png">
				<style>
					@import url("https://fonts.googleapis.com/css?family=Poppins:400,600&display=swap");

					:root {
						${Object.keys(theme)
							.map(key => `--${key}:${theme[key]}`)
							.join(";\n")}
					}

					html,
					body {
						width: 100%;
						height: 100%;
						margin: 0px;
						font-family: "Poppins", sans-serif;
					}

					#AsideCtrl {
						display: none;
					}

					#AsideCtrl:checked ~ .Aside {
						transition: 0.5s ease all 0s;
						transform: translateX(-100%);
					}
					#AsideCtrl:checked ~ .Markdown {
						transition: 0.5s ease all 0.25s;
						padding-left: 10%;
					}

					.Frame {
						width: 100%;
						max-width: 100%;
						padding: 1rem;
						box-sizing: border-box;
						border-radius: 10px;
						background: var(--theme-bg-contrast);
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.MenuBurger div {
						width: 25px;
						height: 2px;
						background: white;
						border-radius: 5px;
					}
					.MenuBurger div + div {
						margin-top: 3px;
					}

					.AsideActions {
						width: 50px;
						left: 100%;
						position: absolute;
						top: 0px;
					}

					.AsideAction {
						width: 50px;
						height: 50px;
						z-index: 3;
						position: relative;
					}

					.AsideAction--center {
						display: flex;
						align-items: center;
						justify-content: center;
					}

					label.AsideAction {
						background: var(--theme-contrast-background);
						border-radius: 0px 0px 10px 0px;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
					}
					label.AsideAction svg {
						width: 10px;
						height: 10px;
						position: absolute;
						top: 100%;
						left: 0px;
					}

					.Aside {
						width: var(--theme-aside-width);
						color: var(--theme-contrast-color);
						background: var(--theme-contrast-background);
						padding: 2rem;
						box-sizing: border-box;
						font-size: 14px;
						position: fixed;
						top: 0px;
						left: 0px;
						height: 100%;
						z-index: 2;
						transition: 0.5s ease all 0.25s;
					}

					.AsideScroll {
						width: 100%;
						height: 100%;
						overflow-x: hidden;
						overflow-y: auto;
					}

					.Aside a {
						text-decoration: none;
						color: unset;
					}

					.AsideFooter {
						position: absolute;
						left: 0px;
						bottom: 0px;
						width: 100%;
						height: 50px;
						font-size: 10px;
						background: rgba(0,0,0,.5);
						display: flex;
						align-items: center;
						justify-content: center;
						opacity: .75;
						text-align: center;
					}

					.AsideFooter a {
						font-weight: bold;
					}

					.MenuParent,
					.MenuChild {
						list-style: none;
					}
					.MenuParent {
						padding: 0.5rem 0px;
					}
					.MenuChild {
						padding: 0px;
						position: relative;
						color: var(--theme-contrast-color-active);
					}
					.MenuChild:before {
						width: 2px;
						height: 100%;
						position: absolute;
						display: block;
						left: 0px;
						top: 0px;
						content: "";
						background: currentColor;
						opacity: 0.5;
						border-radius: 5px;
					}

					.MenuParentLink {
						padding: 0.5rem 0px;
						font-weight: bold;
					}
					.MenuChildLink {
						position: relative;
						padding: 0.25rem 0px 0.25rem 0.5rem;
						opacity: 0.5;
					}
					.MenuChildLink:before {
						width: 2px;
						height: 100%;
						position: absolute;
						top: 0px;
						left: 0px;
						display: block;
						border-radius: 5px;
						content: "";
					}
					.MenuChildLink--active {
						opacity: 1;
					}
					.MenuChildLink--active:before {
						box-shadow: var(--theme-contrast-light);
						background: currentColor;
					}
					/** markdown **/

					.Markdown {
						overflow-x: hidden;
						overflow-y: auto;
						padding: 50px 10% 50px calc(var(--theme-aside-width) + 10%);
						box-sizing: border-box;
						flex: 0%;
						transition: 0.5s ease all 0s;
					}

					.MarkdownMaxCenter {
						max-width: 780px;
						margin: auto;
					}

					.Markdown h1 {
						font-size: 3em;
					}
					.Markdown h2 {
						font-size: 2.6em;
					}
					.Markdown h3 {
						font-size: 2.2em;
					}
					.Markdown h4 {
						font-size: 1.8em;
					}
					.Markdown h5 {
						font-size: 1.4em;
					}
					.Markdown h6 {
						font-size: 1em;
					}

					.Markdown h1,
					.Markdown h2,
					.Markdown h3,
					.Markdown h4,
					.Markdown h5,
					.Markdown h6 {
						margin: 1rem 0px;
					}

					.Markdown pre {
						padding: 1rem;
						background: var(--markdown-code-background);
						color: var(--markdown-code-color);
						border-radius: 5px;
						overflow-x: auto;
					}

					.Markdown table {
						width: 100%;
						text-align: left;
						font-size: 14px;
						border-spacing: 0px;
						margin: 2rem 0px;
					}

					.Markdown table tr,
					.Markdown table td {
						padding: 0px;
					}

					.Markdown table thead th {
						padding: 0.5rem 1rem;
					}
					.Markdown table tbody td {
						padding: 0.5rem 1rem;
						font-size: 0.9em;
						background: var(--markdown-table-row-color);
					}
					.Markdown table tbody tr:nth-child(odd) td {
						background: var(
							--markdown-table-row-odd-color,
							var(--markdown-table-row-color)
						);
					}
					.Markdown table tbody tr:first-child td:first-child {
						border-radius: 5px 0px 0px 0px;
					}
					.Markdown table tbody tr:first-child td:last-child {
						border-radius: 0px 5px 0px 0px;
					}
					.Markdown table tbody tr:last-child td:first-child {
						border-radius: 0px 0px 0px 5px;
					}
					.Markdown table tbody tr:last-child td:last-child {
						border-radius: 0px 0px 5px 0px;
					}

					.Markdown a {
						font-weight: bold;
						color: var(--makrdown-link-color);
					}

					.Markdown blockquote {
						margin: 0px;
						padding: 0rem 0.5rem 0rem 1rem;
						position: relative;
						font-style: italic;
					}

					.Markdown blockquote:before {
						width: 2px;
						height: 100%;
						position: absolute;
						top: 0px;
						left: 0px;
						border-radius: 5px;
						display: block;
						content: "";
						border-radius: 5px;
						background: var(--theme-contrast-background);
					}

					.Markdown img {
						max-width: 100%;
						margin: auto;
						border-radius: 10px;
					}

					.Markdown del {
						opacity: 0.5;
					}
					.Markdown p code {
						background: var(--markdown-code-background);
						color: var(--markdown-code-color);
						padding: 0.15rem 0.5rem;
						border-radius: 2px;
						font-size: 0.9em;
					}

					@media (max-width: 780px) {
						#AsideCtrl ~ .Aside {
							transition: 0.5s ease all 0s;
							transform: translateX(-100%);
						}
						#AsideCtrl ~ .Markdown,
						#AsideCtrl:checked ~ .Markdown {
							padding-left: 10%;
						}
						#AsideCtrl:checked ~ .Aside {
							transition: 0.5s ease all 0s;
							transform: translateX(0%);
						}
					}
				</style>
				${
					data.page.styleSrc
						? `<link rel="stylesheet" href="${data.page.styleSrc}">`
						: ""
				}
			</head>
			<body>
				<input type="checkbox" id="AsideCtrl" />

				<aside class="Aside">
					<div class="AsideActions">
						<label for="AsideCtrl" class="AsideAction">
							<div class="MenuBurger">
								<div></div>
								<div></div>
								<div></div>
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="9.996"
								height="9.798"
								viewBox="0 0 9.996 9.798"
							>
								<path
									d="M-1424-73.2h0V-83h10A10.051,10.051,0,0,0-1424-73.2Z"
									transform="translate(1424 83)"
									style="fill:var(--theme-contrast-background)"
								/>
							</svg>
						</label>
						${
							data.page.github
								? `<a class="AsideAction AsideAction--center" href=${
										data.page.github
								  }>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 438.549 438.549"
							width="50%"
						>
							<path
								style="fill:var(--theme-contrast-background)"
								d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 0 1-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
							/>
						</svg>
					</a>`
								: ""
						}
					</div>
					<div class="AsideScroll">
						${
							data.page.brandingSrc
								? `<img
          class="Branding"
          src="${data.page.brandingSrc}"
          width="100%"
        />`
								: ""
						}
						<ul class="MenuParent">
							${data.menu
								.map(
									([menu, items]) => `
      <li class="MenuParentLink">
          ${menu}
      </li>
      <li class="MenuParentLinks">
        <ul class="MenuChild">
        ${items
					.map(
						({ title, file }) => `<li class="MenuChildLink${
							data.file == file ? " MenuChildLink--active" : ""
						}">
            <a href="${file}">${title}</a>
        </li>`
					)
					.join("")}
        </ul>
      </li>
    `
								)
								.join("")}
						</ul>
					</div>
					${
						data.page.asideFooter
							? `<footer class="AsideFooter">
					<div>${data.page.asideFooter}</div>
					</footer>`
							: ""
					}
				</aside>
				<section class="Markdown">
					<div class="MarkdownMaxCenter">${data.content}</div>
				</section>
			</body>
		</html>
	`;
}
