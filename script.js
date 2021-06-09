const prompts = [
	"{1}: hello i'm saying a thing",
	"{1}: do you like waffles yeah we ilke waffles",
	"{1}: hrrgnh colonel im trying to sneak around but im dummy thicc and the clap from my ass cheeks keeps alerting the guards",
	"{1}: how many shrimps do you have to eat before you commit arson",
	"{1}: what if {1} was to use {1}'s name and talk in the third person?"
];

window.onload = function () {
	document.querySelector("#prompt-count").textContent = prompts.length;
};

// eslint-disable-next-line no-unused-vars
function generatePrompt() {
	const values = [];
	for (const input of document.querySelectorAll("input")) {
		values.push(input.value);
	}

	const prompt = prompts[Math.floor(Math.random() * prompts.length)];
	const output = prompt.replaceAll("{1}", values[0]);
	document.querySelector("#output").textContent = output;
}
