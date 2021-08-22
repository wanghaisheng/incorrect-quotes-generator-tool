// inputs.pronouns.js
// handling pronoun inputs, and other pronoun-related stuff.

/** @type {object} */
window.pronounTypes = {
	subjectPn: {
		name: "subject pronoun",
		defaults: {
			none: "they"
		},
		examples: [
			"This morning, {{input}} went to the park."
		]
	},
	objectPn: {
		name: "object pronoun",
		defaults: {
			none: "them"
		},
		examples: [
			"I went with {{input}}."
		]
	},
	possessiveDet: {
		name: "possessive determiner",
		defaults: {
			none: "their"
		},
		examples: [
			"{{name}} threw {{input}} frisbee."
		]
	},
	possessivePn: {
		name: "possessive pronoun",
		defaults: {
			none: "theirs",
			singular: "{{possessiveDet}}s",
			plural: "{{possessiveDet}}s"
		},
		examples: [
			"At least I think it was {{input}}."
		]
	},
	reflexivePn: {
		name: "reflexive pronoun",
		defaults: {
			none: "themself",
			singular: "{{objectPn}}self",
			plural: "{{objectPn}}selves"
		},
		examples: [
			"{{name}} can do it by {{input}}."
		]
	}
};

/** @type {Object[]} */
const pronounSets = [
	{subjectPn: "he", objectPn: "him", possessiveDet: "his", possessivePn: "his", reflexivePn: "himself"},
	{subjectPn: "she", objectPn: "her", possessiveDet: "her", possessivePn: "hers", reflexivePn: "herself"},
	{subjectPn: "it", objectPn: "it", possessiveDet: "its", possessivePn: "its", reflexivePn: "itself"}
];

window.createPronounsDiv = function (charNum) {
	// div containing all the pronouns-related stuff
	const pronounsDiv = document.createElement("div");
	pronounsDiv.className = "pronouns-block";

	// button to toggle display of pronouns.
	const pronounToggle = document.createElement("button");
	pronounsDiv.appendChild(pronounToggle);
	pronounToggle.textContent = "pronouns";
	pronounToggle.onclick = function () {
		const toggleDiv = this.parentNode.lastChild;
		if (toggleDiv.style.display === "none") {
			toggleDiv.style.display = "flex";
		} else {
			toggleDiv.style.display = "none";
		}
	};

	const pronounsInnerDiv = document.createElement("div");
	pronounsInnerDiv.className = "columns";
	pronounsInnerDiv.style.display = "none";
	pronounsDiv.appendChild(pronounsInnerDiv);

	const pronounSentences = document.createElement("div");
	pronounSentences.className = "pronouns";

	// for each pronounType... (see pronouns.js)
	Object.keys(window.pronounTypes).forEach(typeName => {
		const pronounType = window.pronounTypes[typeName];

		const pronounInput = document.createElement("input");
		pronounInput.classList.add("char-" + charNum, "pronoun", typeName);
		pronounInput.setAttribute("placeholder", pronounType.defaults.none);
		pronounInput.setAttribute("name", typeName);
		pronounInput.addEventListener("input", event => updatePronouns(event));

		// get a random example sentence
		const {examples} = pronounType;
		let example = examples[Math.floor(Math.random() * examples.length)];

		// replace some placeholder text
		example = window.replaceText(example, charNum);

		// putting it all together with a nice label
		const label = document.createElement("label");
		label.insertAdjacentHTML("afterbegin", example[0]);
		label.insertAdjacentElement("beforeend", pronounInput);
		label.insertAdjacentHTML("beforeend", example[1]);

		pronounSentences.appendChild(label);
	});

	/* SETTINGS */
	const pronounSettings = document.createElement("div");
	pronounSettings.className = "pronounSettings";

	// treat pronoun as plural?
	const pluralLabel = document.createElement("label");
	const pluralInput = document.createElement("input");
	pluralInput.type = "checkbox";
	pluralInput.className = "plural";
	pluralLabel.appendChild(pluralInput);
	pluralLabel.insertAdjacentText("beforeend", "Treat as plural");

	pronounSettings.append(pluralLabel);

	pronounsInnerDiv.append(pronounSentences, pronounSettings);

	return pronounsDiv;
};

function updatePronouns(event) {
	// get the other pronoun inputs
	const characterInputs = event.target.parentNode.parentNode.querySelectorAll("input");
	const characterNum = event.target.classList[0].slice(5);
	const settings = (() => {
		const inputs = event.target.parentNode.parentNode.parentNode.querySelector(".pronounSettings").querySelectorAll("input");

		const settings = new Map();

		inputs.forEach(input => {
			settings.set(input.className, input.checked);
		});

		return settings;
	})();

	if (!pronounSets.some(pronounSet => {
		if (characterInputs[0].value === pronounSet.subjectPn) {
			console.log("matched " + characterInputs[0].value + "! setting placeholder values for remaining inputs…");
			for (const input of characterInputs) {
				input.placeholder = pronounSet[input.name];
			}

			return true;
		}

		return false;
	})) {
		// if it doesn't fit any of the pronoun sets
		characterInputs.forEach(input => {
			if (settings.get("plural")) {
				input.placeholder =
					window.pronounTypes[input.name].defaults.plural ??
					window.pronounTypes[input.name].defaults.none;
			} else {
				input.placeholder =
					window.pronounTypes[input.name].defaults.singular ??
					window.pronounTypes[input.name].defaults.none;
			}

			let start = input.placeholder.indexOf("{{");
			let end = input.placeholder.indexOf("}}");

			while (start >= 0) {
				const substring = (input.placeholder.substring(start + 2, end));
				input.placeholder = input.placeholder.replace(
					"{{" + substring + "}}",
					window.getCharacterInput(characterNum, substring)
				);

				start = input.placeholder.indexOf("{{");
				end = input.placeholder.indexOf("}}");
			}
		});
	}
}
