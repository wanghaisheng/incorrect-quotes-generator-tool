# incorrect-quotes-generator

![GitHub last commit](https://img.shields.io/github/last-commit/AndyThePie/incorrect-quotes-generator?style=flat-square)
![XO code style](https://flat.badgen.net/badge/code%20style/XO/cyan)
![Badge count](https://img.shields.io/badge/badges-half%20life%203%20confirmed-informational?style=flat-square)

**a little web thing that inserts character names into prompts. because comedy.**

 ~~rips off~~ heavily inspired by [scatterpatter's incorrect quotes generator](https://incorrect-quotes-generator.neocities.org/). in fact, all of the prompts are stolen from his generator.

colors are from (or are based on) holllo's color theme, [love](https://love.holllo.cc/). (it's quite pretty!) love is under the [MIT License](https://git.holllo.cc/Holllo/love/src/branch/main/LICENSE).

character colors (past character 6) are generated using [HSLuv](https://www.hsluv.org/). the javascript implementation and a copy of its license (the [MIT License](https://github.com/hsluv/hsluv/blob/master/LICENSE)) can be found in the [`./hsluv`](./hsluv) folder.

## structure of stuff
[inputs.js](./inputs.js) handles the `<input>` elements on the page -- adding and removing them, adding functions, etc.
[promptGeneration.js](./promptGeneration.js) deals with generating the prompts.

### prompts
[prompts.json](./prompts.json) simply contains an array with paths to each prompts file. a prompts file is json, and is structured like...
```jsonc
{
	"title": "a title for this fine collection of prompts",
	"description": "an equally fine description",
	"url": "creator's url or something. attribution.",
	"prompts": {
		"1": [ // prompts grouped by how many characters are in them
			{ // text: String; notes: String; tags: [String]
				"text": "{1}: boy do i like beans!",
				"notes": "from user <a href='https://example.com'>sampletext</a>", //innerHTML. whoops.
				"tags": ["shipping", "nsfw"]
			}
		],
		"3": [ // character count doesn't necessarily have to be in order...
			{ // and fields can be ommitted.
				"text": "{1}: yo do you like waffles<br>{2}: yeah i like waffles<br>{3}: this is blasphemy pancakes are better<br>{1}: no u<br>{3}: excuse me<br>{1}: you heard me",
				"tags": ["shipping"]
			}
		]
	}
}
```
