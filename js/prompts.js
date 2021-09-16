// prompts.js
//  handles prompts stuff and settings.

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
					console.log("loading prompt collection:", data.title);
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
	const characters = window.getCharacters();

	// randomize character order?
	if (document.querySelector("#randomize").checked) {
		// fisher-yates shuffle - thanks https://javascript.info/task/shuffle
		for (let i = characters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[characters[i], characters[j]] = [characters[j], characters[i]];
		}
	}

	// what set of prompts to use...?
	const charsInPrompt = window.settings.get("character-range-toggle") ?
		randomPromptSetNumberFromRange(window.settings.get("prompt-characters-min"), window.settings.get("prompt-characters-max")) : // range enabled
		window.settings.get("prompt-characters-min"); // range disabled

	// getting a random prompt
	const prompt = globalPrompts[charsInPrompt][Math.floor(Math.random() * globalPrompts[charsInPrompt].length)];

	let output = prompt.text; // declare output...

	const START_REPLACE = "{{";
	const END_REPLACE = "}}";

	let start = output.indexOf(START_REPLACE);
	let end = output.indexOf(END_REPLACE);

	// replacing the text as long as there's "{{"
	while (start >= 0) {
		const substring = (output.substring(start + 2, end));

		// parse the substring...
		const modifiers = substring.split(" ");
		const value = modifiers[0].split(".");

		const character = characters[value[0] - 1];
		let replaceValue = character[value[1]];

		if (typeof (replaceValue) === "object") {
			replaceValue = replaceValue[value[2]];
		}

		// possible modifiers that modify the output.
		modifiers.forEach(modifier => {
			switch (modifier) {
				case "upper": // uppercase
					replaceValue = replaceValue.toUpperCase();
					break;

				case "first": // first character
					replaceValue = replaceValue[0];
					break;

				default:
					break;
			}
		});

		output = output.replace(
			START_REPLACE + substring + END_REPLACE,
			window.createField(value[2] || value[1], character.charNum, replaceValue).outerHTML
		);

		start = output.indexOf(START_REPLACE);
		end = output.indexOf(END_REPLACE);
	}

	document.querySelector("#output").innerHTML = output;
	window.fields[0] = document.querySelectorAll("#output .field");
};

// returns a random set of prompts, weighted by amount of contents
const randomPromptSetNumberFromRange = function (min, max) {
	const weight = {};
	let total = 0;

	for (let i = min; i < max + 1; i++) {
		const setLength = globalPrompts[i].length;
		total += setLength;
		weight[i] = setLength;
	}

	const keys = Object.keys(weight);

	keys.forEach(key => {
		weight[key] /= total;
	});

	const r = Math.random();
	let sum = 0;
	let output;

	keys.some(key => {
		sum += weight[key];
		if (r <= sum) {
			output = key;
			return true;
		}

		return false;
	});

	console.log(output);
	return output;
};
