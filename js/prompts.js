// prompts.js
//  handles prompts stuff and settings.

// defining some variables...
const globalPrompts = {}; // object containing all the prompts. keys are number of characters.
const promptCounter = document.querySelector("#prompt-count");
let promptCount = 0;

const promptCharacterCounts = document.querySelector("#character-counts");
promptCounter.parentElement.addEventListener("click", () => {
	const {hidden} = promptCharacterCounts;

	if (hidden) {
		for (const key of Object.keys(globalPrompts)) {
			const li = document.createElement("li");
			const count = globalPrompts[key].length;
			li.innerText = count + " " +
				(count === 1 ? "prompt" : "prompts") + " with " +
				key + " " +
				(key === "1" ? "character" : "characters");
			promptCharacterCounts.appendChild(li);
		}

		promptCounter.nextSibling.nodeValue = " prompts loaded! ▲";
	} else {
		while (promptCharacterCounts.hasChildNodes()) {
			promptCharacterCounts.removeChild(promptCharacterCounts.lastChild);
		}

		promptCounter.nextSibling.nodeValue = " prompts loaded! ▼";
	}

	promptCharacterCounts.hidden = !hidden;
});

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
							prompt.packName = data.title;
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
		let replaceValue; // thing to replace text with

		const substring = (output.substring(start + 2, end));
		/*
		format of these things (substrings):
			{{charNum.value % modifiers}}
		and if comparing boolean...
			{{charNum.boolean ? true : false % modifiers}}
		modifiers are separated by spaces.
		*/

		// parse the substring...
		let [charObject, modifiers] = substring.split("%", 2); // split values + modifiers

		charObject = charObject.split("?", 2);
		charObject[0] = charObject[0].split("."); // [charNum, value]

		// charNum.value
		const character = characters[charObject[0].shift() - 1]; // returns character object, see window.getCharacters()

		let property = charObject[0].shift().trim();
		replaceValue = character[property];

		// character.object.value
		while (typeof (replaceValue) === "object") {
			property = charObject[0].shift().trim();
			replaceValue = replaceValue[property];
		}

		let altValue = "";
		if (typeof (replaceValue) === "boolean") {
			const a = charObject[1].split(":");
			replaceValue = charObject[0] ? a[1] : a[0];

			altValue = charObject[0] ? a[0] : a[1];
			altValue = altValue.trim();
			altValue = applyModifiers(altValue, modifiers);
		}

		replaceValue = replaceValue.trim();
		replaceValue = applyModifiers(replaceValue, modifiers);

		console.log("replacing \"" + substring + "\" with \"" + replaceValue + "\"");

		const field = window.createField(property, character.charNum, replaceValue);

		if (altValue) {
			field.dataset.alt = altValue;
		}

		// do the replacement
		output = output.replace(
			START_REPLACE + substring + END_REPLACE,
			field.outerHTML
		);

		// get new indices and repeat if {{ and }} still exist
		start = output.indexOf(START_REPLACE);
		end = output.indexOf(END_REPLACE);
	}

	document.querySelector("#output").innerHTML = output;
	window.fields[0] = document.querySelectorAll("#output .field");

	const about = document.querySelector("#output-about");
	about.innerText = "from ";
	const em = document.createElement("em");
	em.innerText = prompt.packName;
	about.appendChild(em);
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

const applyModifiers = function (text = "", modifiers = "") {
	if (modifiers) {
		modifiers = modifiers.split(" "); // % modifiers
		modifiers.forEach(modifier => {
			switch (modifier) {
				case "upper": // uppercase
					text = text.toUpperCase();
					break;

				case "first": // first character
					text = text[0];
					break;

				default:
					break;
			}
		});
	}

	return text;
};
