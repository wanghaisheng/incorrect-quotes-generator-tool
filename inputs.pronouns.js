// inputs.pronouns.js
// handling pronoun inputs, and other pronoun-related stuff.

window.pronounTypes = [
	{
		name: "subject pronoun",
		shortName: "subjectPn",
		defaults: {
			none: "they"
		},
		examples: [
			"This morning, {{input}} went to the park."
		]
	},
	{
		name: "object pronoun",
		shortName: "objectPn",
		defaults: {
			none: "them"
		},
		examples: [
			"I went with {{input}}.",
			"Somebody once told {{input}} the world was going to roll {{objectPn}}."
		]
	},
	{
		name: "possessive determiner",
		shortName: "possessiveDet",
		defaults: {
			none: "their"
		},
		examples: [
			"{{name}} threw {{input}} frisbee."
		]
	},
	{
		name: "possessive pronoun",
		shortName: "possessivePn",
		defaults: {
			none: "theirs",
			singular: "{{possessiveDet}}s",
			plural: "{{possessiveDet}}s"
		},
		examples: [
			"That burger is {{input}}."
		]
	},
	{
		name: "reflexive pronoun",
		shortName: "reflexivePn",
		defaults: {
			none: "themselves",
			singular: "{{objectPn}}self",
			plural: "{{objectPn}}selves"
		},
		examples: [
			"{{name}} can do it by {{input}}."
		]
	}
];

const pronounSets = [
	{subjectPn: "he", objectPn: "him", possessiveDet: "his", possessivePn: "his", reflexivePn: "himself"},
	{subjectPn: "she", objectPn: "her", possessiveDet: "her", possessivePn: "hers", reflexivePn: "herself"},
	{subjectPn: "it", objectPn: "it", possessiveDet: "its", possessivePn: "its", reflexivePn: "itself"},
	{subjectPn: "they", objectPn: "them", possessiveDet: "their", possessivePn: "theirs", reflexivePn: "themself"}
];

window.createPronounsDiv = function (inputNumber) {
	// div containing all the pronouns-related stuff
	const pronounsDiv = document.createElement("div");
	pronounsDiv.className = "pronouns-block";

	// button to toggle display of pronouns.
	const pronounToggle = document.createElement("button");
	pronounsDiv.appendChild(pronounToggle);
	pronounToggle.textContent = "pronouns";
	pronounToggle.id = "test";
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
	window.pronounTypes.forEach(pronounType => {
		const pronounInput = document.createElement("input");
		pronounInput.className = "char-" + inputNumber;
		pronounInput.setAttribute("placeholder", pronounType.defaults.none);
		pronounInput.setAttribute("name", pronounType.shortName);
		pronounInput.addEventListener("input", event => updatePronouns(event));

		// get a random example sentence
		const {examples} = pronounType;
		let example = examples[Math.floor(Math.random() * examples.length)];

		// putting an input between text
		example = example.split("{{input}}");

		// putting it all together with a nice label
		const label = document.createElement("label");
		label.insertAdjacentText("afterbegin", example[0]);
		label.insertAdjacentElement("beforeend", pronounInput);
		label.insertAdjacentText("beforeend", example[1]);

		pronounSentences.appendChild(label);
	});

	// settings
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

	pronounSets.forEach(pronounSet => {
		if (characterInputs[0].value === pronounSet.subjectPn) {
			console.log("matched " + characterInputs[0].value + "! setting placeholder values for remaining inputs…");
			for (const input of characterInputs) {
				input.placeholder = pronounSet[input.name];
			}
		} else {
			// TODO: Implement suffixes.
		}
	});
}
