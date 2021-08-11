// inputs.pronouns.js
// handling pronoun inputs.

window.pronounTypes = [
	{
		name: "subject pronoun",
		shortName: "subjectPn",
		default: "they",
		examples: [
			"This morning, {{input}} went to the park."
		]
	},
	{
		name: "object pronoun",
		shortName: "objectPn",
		default: "them",
		examples: [
			"I went with {{input}}.",
			"Somebody once told {{input}} the world was going to roll {{objectPn}}."
		]
	},
	{
		name: "possessive determiner",
		shortName: "possessiveDet",
		default: "their",
		examples: [
			"{{name}} threw {{input}} frisbee."
		]
	},
	{
		name: "possessive pronoun",
		shortName: "possessivePn",
		default: "theirs",
		examples: [
			"That burger is {{input}}."
		]
	},
	{
		name: "reflexive pronoun",
		shortName: "reflexivePn",
		default: "themselves",
		examples: [
			"{{name}} can do it by {{input}}."
		]
	}
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
	pronounsInnerDiv.className = "pronouns";
	pronounsInnerDiv.style.display = "none";
	pronounsDiv.appendChild(pronounsInnerDiv);

	// for each pronounType... (see pronouns.js)
	window.pronounTypes.forEach(pronounType => {
		const {examples} = pronounType;
		const label = document.createElement("label");

		const pronounInput = document.createElement("input");
		pronounInput.className = "char-" + inputNumber;
		pronounInput.setAttribute("placeholder", pronounType.default);
		pronounInput.setAttribute("name", pronounType.shortName);

		let example = examples[Math.floor(Math.random() * examples.length)];

		example = example.replace("{{input}}", pronounInput.outerHTML);

		label.innerHTML = example;

		pronounsInnerDiv.appendChild(label);
	});

	return pronounsDiv;
};
