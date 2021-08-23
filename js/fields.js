// fields.js
// updating fields on input changes.

/** @type {HTMLSpanElement[]} */
window.fields = [];

/**
 * Creates a new "field" that updates or whatever.
 * @param {string} property - What type of field (name, pronoun, etc).
 * @param {number} charNum - Character number.
 * @param {string} [title] - Title of field, defaults to property name.
 * @param {string} [content] - Content of field, if needed.
 * @returns HTMLSpanElement
 */
window.createField = (property, charNum, title, content) => {
	const field = document.createElement("span");
	field.classList.add("field", "char-" + charNum, property);
	field.title = title ?? property;

	if (!content) {
		content = window.getCharacterInput(charNum, property);
		if (!content) {
			switch (property) {
				case "name":
					content = "Character";
					break;

				default:
					content = window.pronounTypes[property].defaults.none;
					break;
			}
		}
	}

	field.textContent = content;

	return field;
};

window.updateFields = () => {
	// TODO: Implement dynamically changing fields.
};
