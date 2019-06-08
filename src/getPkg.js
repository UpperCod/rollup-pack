import fs from "fs";
import path from "path";

export default function getPkg() {
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
