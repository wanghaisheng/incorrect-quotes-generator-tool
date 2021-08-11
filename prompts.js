/* prompt.js
what it says on the tin. handles prompts stuff and settings. */

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

	const order = document.querySelector("#randomize").checked ?
		randomIndexOrder(characters) : [null];

	// number of characters determines what set of prompts to use.
	const promptsIndex = characters.length;

	// getting a random prompt
	const prompt = globalPrompts[promptsIndex][Math.floor(Math.random() * globalPrompts[promptsIndex].length)];

	let output = prompt.text;

	// replacing placeholders with characters
	for (let i = 0; i < characters.length; i++) {
		const charNum = order[i] ?? i;
		const characterName = characters[charNum].name;
		const characterPronouns = characters[charNum].pronouns;

		// name tomfoolery
		output = output.replaceAll(`{${i + 1}}`, // standard
			window.wrapSpan(charNum, characterName, "name"));
		output = output.replaceAll(`{${i + 1}.upper}`, // uppercase
			window.wrapSpan(charNum, characterName.toUpperCase(), "name", "upper"));
		output = output.replaceAll(`{${i + 1}.first}`, // first letter
			window.wrapSpan(charNum, characterName.charAt(0), "name", "first"));

		// pronouns!
		window.pronounTypes.forEach(pronounType => {
			const {shortName} = pronounType;
			let pronoun = characterPronouns[shortName];

			if (!pronoun) {
				pronoun = pronounType.default;
			}

			output = output.replaceAll(`{${i + 1}.${shortName}}`, window.wrapSpan(charNum, pronoun, shortName));
		});
	}

	document.querySelector("#output").innerHTML = output;
};

// wraps some text in a <span> tag with a specific character's class. just because.
window.wrapSpan = (charNum, text, ...moreClasses) => {
	const span = document.createElement("span");
	span.classList.add("char-" + (charNum + 1));

	moreClasses.forEach(className => {
		span.classList.add(className);
	});

	span.textContent = text;

	return span.outerHTML;
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
