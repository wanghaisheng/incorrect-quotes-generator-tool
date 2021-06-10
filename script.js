// getting prompts - they're in a separate .json file.
let prompts;
fetch("./prompts.json")
	.then(response => response.json())
	.then(data => {
		prompts = data;

		// and then calculating number of prompts...
		let promptCount = 0;
		for (let i = 1; i < Object.keys(prompts).length + 1; i++) {
			promptCount += prompts[i].length;
		}

		document.querySelector("#prompt-count").textContent = promptCount;
	});

const test = document.querySelectorAll(".character");

for (let i = 0; i < test.length; i++) {
	test[i].disabled = true; // disable all inputs by default
	test[i].value = ""; // also clear everything. no persistence.

	// clear input on focus
	test[i].onfocus = function () {
		const inputIndex = i;
		test[inputIndex].value = "";
		console.log("index", inputIndex);
		for (let i = inputIndex; i < test.length - 1; i++) {
			test[i + 1].disabled = true;
		}
	};

	// enable next input (oninput, so you can tab through inputs)
	test[i].oninput = function () {
		if (test[i].textLength > 0) {
			if (i < test.length - 1) {
				test[i + 1].disabled = false;
			}
		}
	};

	// re-enable input if input has content (disabled by clearing previous input)
	test[i].onchange = function () {
		const inputIndex = i;
		for (let i = inputIndex; i < test.length - 1; i++) {
			if (test[i + 1].textLength > 0) {
				test[i + 1].disabled = false;
			} else {
				break;
			}
		}
	};
}

test[0].disabled = false; // first input should never be disabled

// eslint-disable-next-line no-unused-vars
function generatePrompt() {
	// get characters from <input>s, add to array
	const characters = [];
	for (const input of document.querySelectorAll(".character")) {
		if (input.value === "") {
			break;
		} else {
			characters.push(input.value);
		}
	}

	// number of characters determines what set of prompts to use.
	const promptsIndex = characters.length;

	// getting a random prompt
	const prompt = prompts[promptsIndex][Math.floor(Math.random() * prompts[promptsIndex].length)];

	let output = prompt;

	// replacing placeholders with characters
	for (let i = 0; i < characters.length; i++) {
		const char = characters[i];

		console.log(i, output);

		output = output.replaceAll(`{${i + 1}}`, char); // standard
		output = output.replaceAll(`{${i + 1}.upper}`, char.toUpperCase()); // uppercase
	}

	document.querySelector("#output").innerText = output;
}
