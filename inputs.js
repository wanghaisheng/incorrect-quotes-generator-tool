/* inputs.js
this file deals with the input elements -- getting them, adding their functions, adding, and removing them. */

window.onload = (() => {
	window.addInput();
});

// something something don't repeat yourself. also used in promptGeneration.js
window.getCharacters = (() => {
	const characterInputs = []; // should be an array of objects

	document.querySelectorAll(".character-block").forEach(block => {
		const {children} = block;
		const pronouns = {};
		for (const input of children[1].children) {
			pronouns[input.name] = input.value;
		}

		characterInputs.push({
			name: children[0].children[0].value,
			pronouns
		});
	});

	return characterInputs;
});

// setting up a style element for later use...
const style = document.createElement("style");
document.head.append(style);

// gives inputs their functions
function giveInputFunctions() {
	const inputs = window.getCharacters();

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

function enableDisableInputs() {
	const inputs = window.getCharacters();
	for (let i = 1; i < inputs.length; i++) {
		if (inputs[i - 1].textLength > 0) {
			inputs[i].disabled = false;
		} else {
			inputs[i].disabled = true;
		}
	}
}

window.addInput = function () {
	const inputsDiv = document.querySelector("#character-inputs");
	const inputNumber = window.getCharacters().length + 1;
	// the character block
	const charBlock = document.createElement("div");
	charBlock.className = "character-block";

	const topRow = document.createElement("div");

	// character name input
	const nameInput = document.createElement("input");
	nameInput.className = "character-name char-" + inputNumber;
	nameInput.setAttribute("placeholder", "person " + inputNumber);
	nameInput.setAttribute("type", "text");
	topRow.appendChild(nameInput);
	charBlock.appendChild(topRow);

	// button to toggle display of pronouns.
	const pronounToggle = document.createElement("button");
	topRow.appendChild(pronounToggle);
	pronounToggle.textContent = "pronouns";
	pronounToggle.id = "test";
	pronounToggle.onclick = function () {
		const toggleDiv = this.parentNode.parentNode.lastChild;
		if (toggleDiv.style.display === "none") {
			toggleDiv.style.display = "flex";
		} else {
			toggleDiv.style.display = "none";
		}
	};

	// pronoun inputs
	const pronounTypes = [
		{
			name: "subject pronoun",
			shortName: "subjectPn"
		},
		{
			name: "object pronoun",
			shortName: "objectPn"
		},
		{
			name: "possessive determiner",
			shortName: "possessiveDet"
		},
		{
			name: "possessive pronoun",
			shortName: "possessivePn"
		},
		{
			name: "reflexive pronoun",
			shortName: "reflexivePn"
		}
	];
	const pronounsDiv = document.createElement("div");
	pronounsDiv.className = "pronouns";
	pronounsDiv.style.display = "none";
	charBlock.appendChild(pronounsDiv);

	pronounTypes.forEach(pronounType => {
		const pronounInput = document.createElement("input");
		pronounInput.className = "char-" + inputNumber;
		pronounInput.setAttribute("placeholder", pronounType.name);
		pronounInput.setAttribute("name", pronounType.shortName);
		pronounsDiv.appendChild(pronounInput);
	});

	// creating a new color for the new character...
	const color = window.hsluv.hsluvToHex([
		((inputNumber - 1) * 36) % 360, // hue
		80 - Math.min(50, (inputNumber - 10)), // saturation
		75 // lightness
	]);
	style.sheet.insertRule(`.char-${inputNumber} { background: ${color}C4 }`);

	inputsDiv.append(charBlock);
	giveInputFunctions(inputNumber - 1);
	enableDisableInputs();
};

window.removeInput = function () {
	const nodes = document.querySelectorAll(".character-block");
	if (nodes.length > 1) {
		nodes[nodes.length - 1].remove();
	} else {
		console.log("there's only one...");
	}
};
