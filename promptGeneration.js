// getting prompts - they're in a separate .json file.
let prompts;
fetch("./prompts/scatterpatter.json")
	.then(response => response.json())
	.then(data => {
		prompts = data.prompts;

		// and then calculating number of prompts...
		let promptCount = 0;
		for (let i = 1; i < Object.keys(prompts).length + 1; i++) {
			promptCount += prompts[i].length;
		}

		document.querySelector("#prompt-count").textContent = promptCount;
	});

window.generatePrompt = function () {
	// get characters from <input>s, add to array
	const characters = [];
	// eslint-disable-next-line no-undef
	for (const input of getCharacterInputs()) { // defined in inputs.js
		if (input.value === "") {
			break;
		} else {
			characters.push(input.value);
		}
	}

	const order = document.querySelector("#randomize").checked ?
		randomIndexOrder(characters) : [null];

	// number of characters determines what set of prompts to use.
	const promptsIndex = characters.length;

	// getting a random prompt
	const prompt = prompts[promptsIndex][Math.floor(Math.random() * prompts[promptsIndex].length)];

	let output = prompt;

	// replacing placeholders with characters
	for (let i = 0; i < characters.length; i++) {
		const charNum = order[i] ?? i;
		const char = `<span class="char-${(charNum + 1)}">${characters[charNum]}</span>`;

		// console.log(i, output);

		output = output.replaceAll(`{${i + 1}}`, char); // standard
		output = output.replaceAll(`{${i + 1}.upper}`, char.toUpperCase()); // uppercase
		output = output.replaceAll(`{${i + 1}.first}`, char.charAt(0)); // first letter
	}

	document.querySelector("#output").innerHTML = output;
};

// returns an array containing a random order of array indices.
function randomIndexOrder(array) {
	const range = []; // range of array indices
	for (let i = 0; i < array.length; i++) {
		range.push(i);
	}

	// fisher-yates shuffle, taken from https://javascript.info/task/shuffle. <3
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[range[i], range[j]] = [range[j], range[i]];
	}

	return range;
}
