// inputs.js
// this file deals with inputs, more specifically:
// - getting the contents of inputs
// - adding and removing inputs

window.onload = (() => {
	window.addInput();
});

// something something don't repeat yourself. also used in promptGeneration.js
window.getCharacters = (() => {
	const characterInputs = []; // should be an array of objects

	document.querySelectorAll(".character-block").forEach(block => {
		const {children} = block;
		const pronouns = {};
		for (const label of children[1].querySelector(".pronouns").querySelectorAll("input")) {
			const input = label;
			pronouns[input.name] = input.value || input.placeholder;
		}

		characterInputs.push({
			name: children[0].value,
			pronouns
		});
	});

	return characterInputs;
});

// setting up a style element for later use...
const style = document.createElement("style");
document.head.append(style);

// this is the part where characters are added. this is where things get messy.
window.addInput = function () {
	const inputsDiv = document.querySelector("#character-blocks");
	const inputNumber = window.getCharacters().length + 1;

	// the character block, <div>
	const charBlock = document.createElement("div");
	charBlock.className = "character-block";

	// character name input (child of topRow)
	const nameInput = document.createElement("input");
	nameInput.className = "character-name char-" + inputNumber;
	nameInput.setAttribute("placeholder", "character " + inputNumber);
	nameInput.setAttribute("type", "text");
	charBlock.appendChild(nameInput);

	charBlock.appendChild(window.createPronounsDiv(inputNumber));

	// creating a new color for the new character...
	const color = window.hsluv.hsluvToHex([
		((inputNumber - 1) * 36) % 360, 70, 75
	]);
	style.sheet.insertRule(`.char-${inputNumber} { background: ${color}C4 }`);

	inputsDiv.append(charBlock);
};

window.removeInput = function () {
	const nodes = document.querySelectorAll(".character-block");
	if (nodes.length > 1) {
		nodes[nodes.length - 1].remove();
	} else {
		console.log("there's only one...");
	}
};
