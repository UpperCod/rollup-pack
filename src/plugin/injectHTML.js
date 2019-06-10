let closedBody = /(<\/body>)/;
export default function injectHTML(body, inject, regExp = closedBody) {
	return regExp.test(body)
		? body.replace(/(<\/body>)/, `${inject}$1`)
		: body + inject;
}
