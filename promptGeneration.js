/* promptGeneration.js
what it says on the tin. handles prompt generation and settings. */

// defining some variables...
const globalPrompts = {}; // object containing all the prompts. keys are number of characters.
const promptCounter = document.querySelector("#prompt-count");
let promptCount = 0;

// getting prompts - oh no.
fetch("./prompts.json") // contains an array of paths to files.
	.then(response => response.json())
	.then(files => {
		for (const file of files) {
			fetch(file) // fetch each file defined in prompts.json...
				.then(response => response.json())
				.then(data => {
					console.log("loading", data.title);
					const {prompts} = data; // the prompts of the file

					for (let i = 0; i < Object.keys(prompts).length; i++) {
						const key = Object.keys(prompts)[i]; // key = # of characters in prompt

						if (!globalPrompts[key]) {
							globalPrompts[key] = []; // initialize an empty array if needed
						}

						for (const prompt of prompts[key]) {
							globalPrompts[key].push(prompt); // add prompts to array
						}

						// prompt count and stuff
						promptCount += prompts[key].length;
						promptCounter.textContent = promptCount;
					}
				});
		}
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
	const prompt = globalPrompts[promptsIndex][Math.floor(Math.random() * globalPrompts[promptsIndex].length)];

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
