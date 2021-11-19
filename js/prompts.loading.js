// prompts.loading.js
// deals with loading prompts.

window.prompts = {}; // object containing all the selected prompts. keys are number of characters
const promptSetList = {}; // list of selectable promptSets.
window.fetchedPromptSets = {}; // list of fetched promptSets.
const promptCounter = document.querySelector("#prompt-count");

/* FETCHING PROMPTS */

// get the list of prompt sets.
fetch("./promptSetList.json")
	.then(response => response.json())
	.then(set => {
		Object.keys(set).forEach(key => {
			promptSetList[key] = set[key];
		});
	})
	.then(() => {
		Object.keys(promptSetList).forEach(key => {
			addPromptSetToSelector(key);
		});
		document.querySelector("#prompt-sets-loading").hidden = true;
	});

const promptSetSelector = document.querySelector("#prompt-set-selector");

function addPromptSetToSelector(key) {
	const set = promptSetList[key];
	const input = document.createElement("input");
	input.type = "checkbox";
	input.id = key;
	input.className = "prompt-set";

	input.addEventListener("input", async event => {
		const {target} = event;
		const key = target.id;

		if (target.checked) {
			if (window.fetchedPromptSets[key]) {
				console.log(`${promptSetList[key].title} already fetched...`);
			} else {
				await fetch(promptSetList[key].path)
					.then(response => response.json())
					.then(set => {
						// giving each prompt a "set" key
						Object.keys(set.prompts).forEach(charNum => {
							set.prompts[charNum].forEach(a => {
								a.set = key;
							});
						});
						window.fetchedPromptSets[key] = set;
						console.log(`fetched ${promptSetList[key].title}!`);
					});
			}

			window.prompts[key] = window.fetchedPromptSets[key].prompts;
		} else {
			delete window.prompts[key];
		}

		updatePromptCounter();
	});

	// the label...
	const label = document.createElement("label");
	label.appendChild(input);

	// title of the prompt set
	const title = document.createElement("strong");
	title.textContent = set.title;
	label.appendChild(title);

	label.append(" " + set.description + " ");

	const sourceLink = document.createElement("a");
	sourceLink.textContent = "Source";
	sourceLink.href = set.url;
	label.append(sourceLink);

	promptSetSelector.appendChild(label);
}

const updatePromptCounter = () => {
	let count = 0;
	Object.keys(window.prompts).forEach(set => {
		Object.keys(window.prompts[set]).forEach(key => {
			count += window.prompts[set][key].length;
		});
	});

	promptCounter.textContent = `${count > 0 ? count : "no"} prompt${count === 1 ? "" : "s"}`;
};
