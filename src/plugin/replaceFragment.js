export default function replaceFragment(string, open, closed, map, max) {
	max = max == null ? true : max;
	let positionOpen;
	let positionClosed;
	while (max && (positionOpen = string.match(open))) {
		let fragmentBefore = string.slice(0, positionOpen.index);
		let fragment = string.slice(positionOpen.index + positionOpen[0].length);
		positionClosed = fragment.match(closed);
		if (!positionClosed) return string;
		string =
			fragmentBefore +
			map(
				fragment.slice(0, positionClosed.index),
				positionOpen,
				positionClosed
			) +
			fragment.slice(positionClosed.index + positionClosed[0].length);
		max--;
	}
	return string;
}
