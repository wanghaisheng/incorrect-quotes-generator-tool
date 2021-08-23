// inputs.js
// this file deals with inputs, more specifically:
// - getting the contents of inputs
// - adding and removing inputs

const charBlocks = document.querySelector("#character-blocks");

window.charInputs = {};

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

/**
 * Returns the value of an input belonging to a character.
 * @param {number} character - character number.
 * @param {...string} classes - classes to look for.
 * @returns {string}
 */
window.getCharacterInput = (character, ...classes) => {
	const characterDiv = charBlocks.children[character - 1];
	if (!characterDiv) {
		return;
	}

	classes = "." + classes.join(".");
	const input = characterDiv.querySelector("input" + classes);

	return input.value || input.placeholder;
};

// setting up a style element for later use...
const style = document.createElement("style");
document.head.append(style);

// this is the part where characters are added. this is where things get messy.
window.addInput = function () {
	const inputNumber = window.getCharacters().length + 1;

	// the character block, <div>
	const charBlock = document.createElement("div");
	charBlock.className = "character-block";

	// character name input (child of topRow)
	const nameInput = document.createElement("input");
	nameInput.classList.add("name", "char-" + inputNumber);
	nameInput.setAttribute("placeholder", "character " + inputNumber);
	nameInput.setAttribute("type", "text");
	charBlock.appendChild(nameInput);

	charBlock.appendChild(window.createPronounsDiv(inputNumber));

	// creating a new color for the new character...
	const color = window.hsluv.hsluvToHex([
		((inputNumber - 1) * 36) % 360, 70, 75
	]);
	style.sheet.insertRule(`.char-${inputNumber} { background: ${color}C4 }`);

	charBlocks.append(charBlock);

	window.charInputs[inputNumber] = {
		name: document.querySelector("input.name.char-" + inputNumber),
		pronouns: document.querySelectorAll("input.pronoun.char-" + inputNumber),
		settings: document.querySelectorAll("input.pronoun-setting.char-" + inputNumber)
	};
};

window.removeInput = function () {
	const nodes = document.querySelectorAll(".character-block");
	if (nodes.length > 1) {
		nodes[nodes.length - 1].remove();
	} else {
		console.log("there's only one...");
	}
};
