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

window.onload = function () {
};

// eslint-disable-next-line no-unused-vars
function generatePrompt() {
	const characters = [];

	for (const input of document.querySelectorAll(".character")) {
		if (input.value !== "") {
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
	}

	document.querySelector("#output").innerText = output;
}
