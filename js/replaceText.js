// textReplacement.js
// does what it says on the tin.

const START_REPLACE = "{{";
const END_REPLACE = "}}";

window.replaceText = function (text, charNum) {
	let start = text.indexOf(START_REPLACE);
	let end = text.indexOf(END_REPLACE);

	let input = "";
	let output = [];

	while (start >= 0) {
		const substring = (text.substring(start + 2, end));

		switch (substring) {
			case "name":
				input = window.createField("name", charNum).outerHTML;
				break;

			case "input": { // only used in pronoun examples
				const split = text.split(START_REPLACE + substring + END_REPLACE);
				output[0] = split[0];
				text = split[1];
				break;
			}

			default:
				break;
		}

		text = text.replace(
			START_REPLACE + substring + END_REPLACE,
			input
		);

		start = text.indexOf(START_REPLACE);
		end = text.indexOf(END_REPLACE);
	}

	if (output) {
		output[1] = text;
	} else {
		output = text;
	}

	return output;
};
