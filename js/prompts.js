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

	// number of characters determines what set of prompts to use.
	const promptsIndex = characters.length;

	// getting a random prompt
	const prompt = globalPrompts[promptsIndex][Math.floor(Math.random() * globalPrompts[promptsIndex].length)];

	let output = prompt.text; // declare output...

	const START_REPLACE = "{{";
	const END_REPLACE = "}}";

	let start = output.indexOf(START_REPLACE);
	let end = output.indexOf(END_REPLACE);

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

		modifiers.forEach(modifier => {
			switch (modifier) {
				case "upper":
					replaceValue = replaceValue.toUpperCase();
					break;

				case "first":
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
	window.fields[0] = document.querySelector("#output.fields");
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
