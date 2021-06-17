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

// initial disabling of inputs or whatever
const initialInputs = getCharacterInputs();
for (let i = 0; i < initialInputs.length; i++) {
	initialInputs[i].disabled = true; // disable all inputs by default
	initialInputs[i].value = ""; // also clear everything. no persistence.
	giveInputFunctions(i);
}

initialInputs[0].disabled = false; // first input should never be disabled

// setting up a style element for later use...
const style = document.createElement("style");
document.head.append(style);

// gives inputs their functions
function giveInputFunctions() {
	const inputs = getCharacterInputs();

	// clear input on focus
	for (let i = 0; i < inputs.length - 1; i++) {
		inputs[i].onfocus = function () {
			const inputIndex = i;
			inputs[inputIndex].value = "";
			for (let i = inputIndex; i < inputs.length - 1; i++) {
				inputs[i + 1].disabled = true;
			}
		};

		// enable next input (oninput, so you can tab through inputs)
		inputs[i].oninput = function () {
			if (inputs[i].textLength > 0) {
				if (i < inputs.length - 1) {
					inputs[i + 1].disabled = false;
				}
			}
		};

		// re-enable input if input has content (disabled by clearing previous input)
		inputs[i].onchange = function () {
			const inputIndex = i;
			for (let i = inputIndex; i < inputs.length - 1; i++) {
				if (inputs[i + 1].textLength > 0) {
					inputs[i + 1].disabled = false;
				} else {
					break;
				}
			}
		};
	}
}

function enableDisablePrompts() {
	const inputs = getCharacterInputs();
	for (let i = 1; i < inputs.length; i++) {
		if (inputs[i - 1].textLength > 0) {
			inputs[i].disabled = false;
		} else {
			inputs[i].disabled = true;
		}
	}
}

function getCharacterInputs() {
	return document.querySelectorAll(".character");
}

// eslint-disable-next-line no-unused-vars
function generatePrompt() {
	// get characters from <input>s, add to array
	const characters = [];
	for (const input of getCharacterInputs()) {
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
		const char = `<span class="char-${(i + 1)}">${characters[i]}</span>`;

		console.log(i, output);

		output = output.replaceAll(`{${i + 1}}`, char); // standard
		output = output.replaceAll(`{${i + 1}.upper}`, char.toUpperCase()); // uppercase
		output = output.replaceAll(`{${i + 1}.first}`, char.charAt(0)); // first letter
	}

	document.querySelector("#output").innerHTML = output;
}

// eslint-disable-next-line no-unused-vars
function addInput() {
	const inputsDiv = document.querySelector("#character-inputs");
	const inputs = getCharacterInputs();
	const inputNumber = inputs.length + 1;
	// console.log(nodeCount, "nodes");

	const newInput = document.createElement("input");
	newInput.setAttribute("class", "character char-" + inputNumber);
	newInput.setAttribute("placeholder", "person " + inputNumber);
	newInput.setAttribute("type", "text");

	// creating a new color for the new character...
	const color = window.hsluv.hsluvToHex([
		((inputNumber - 1) * 36) % 360, // hue
		80 - Math.min(50, (inputNumber - 10)), // saturation
		75 // lightness
	]);
	style.sheet.insertRule(`.char-${inputNumber} { background: ${color}C4 }`);

	inputsDiv.append(newInput);
	giveInputFunctions(inputNumber - 1);
	enableDisablePrompts();
}

// eslint-disable-next-line no-unused-vars
function removeInput() {
	const nodes = getCharacterInputs();
	nodes[nodes.length - 1].remove();
}
