// inputs.settings.js
// stuff dealing with settings.

// setting up a Map and adding functions.
window.settings = new Map();

document.querySelectorAll("#settings input").forEach(input => {
	input.addEventListener("input", event => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		window.settings.set(event.target.id, value);
		console.log("updated setting " + event.target.id + " to value " + value);
	});

	const value = input.type === "checkbox" ? input.checked : input.value;
	window.settings.set(input.id, value);
	console.log("initialized setting " + input.id + " to value " + value);
});

// relating to characters in prompts settings
document.querySelector("#prompt-characters-min").addEventListener("input", event => {
	const maxInput = document.querySelector("#prompt-characters-max");
	maxInput.min = event.target.value;
	maxInput.value = maxInput.value > event.target.value ? maxInput.value : event.target.value;
});

document.querySelectorAll("#settings input[type=number]").forEach(input => {
	input.addEventListener("input", event => {
		if (event.target.value === "1") {
			event.target.nextSibling.nodeValue = " character";
		} else {
			event.target.nextSibling.nodeValue = " characters";
		}
	});
});

document.querySelector("#character-range-toggle").addEventListener("input", event => {
	const charRangeInputs = document.querySelectorAll("#settings input[type=number]");
	if (event.target.checked) {
		charRangeInputs[0].previousSibling.nodeValue = "Use prompts with at least ";
		charRangeInputs[1].disabled = false;
		charRangeInputs[1].parentElement.hidden = false;
	} else {
		charRangeInputs[0].previousSibling.nodeValue = "Use prompts with ";
		charRangeInputs[1].disabled = true;
		charRangeInputs[1].parentElement.hidden = true;
	}
});

window.updateCharacterRange = function (charCount) {
	document.querySelectorAll("#settings input[type=number]").forEach(i => {
		i.max = charCount; // set a maximum
		// reduce value if it exceeds maximum
		i.value = i.value > charCount ? charCount : i.value;
	});
};
