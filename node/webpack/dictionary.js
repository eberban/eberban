let { dictionary_en: dictionary, compare_words } = require('../src/dictionary');

const ignored = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_cardinal', '_number', 'a', 'e', 'i', 'o', 'u' ];

const words_sorted = Object.keys(dictionary).filter((word) => !ignored.includes(word)).sort(compare_words);

const tags_style = {
	"transitive": "btn-info",
	"partial": "btn-danger",
	"semantic prime": "btn-success",
};

words_sorted.forEach((word) => {
	let entry = dictionary[word];
	entry.without_spaces = word.replaceAll(' ', '').toLowerCase();

	// Detect transitive words.
	let intransitive = false;
	let transitive = false;

	if (['R', 'C2', 'C3', 'C+'].includes(entry.family)) {
		if (word.match(/^.*(n|r|l)$/g)) {
			intransitive = true;
		} else {
			transitive = true;
		}
	}

	if (entry.family == "MI") {
		if (entry.transitive == true) {
			transitive = true;
		} else {
			intransitive = true;
		}
	}

	if ((intransitive || transitive) && entry.tags == undefined)
		entry.tags = [];
	
	if (intransitive) {
		entry.tags.unshift("intransitive");
	} else if (transitive) {
		entry.tags.unshift("transitive");
	}
});

export function count_word_types() {
	let roots = 0;
	let particles = 0;
	let compounds = 0;

	words_sorted.forEach((w) => {
		if (["C2", "C3", "C+"].includes(dictionary[w].family)) compounds++;
		else if (dictionary[w].family == 'R') roots++;
		else particles++;
	});

	return { roots, particles, compounds };
}

function html_word_entry(word, entry) {
	var output = `<div class="dictionary-entry well well-small"><h3>`;

	if (['C2', 'C3', 'C+'].includes(entry.family)) {
		word.split(' ').forEach((part) => {
			if (ignored.includes(part[0])) {
				output += `${part} `;
			} else {
				output += `<a href="#${part}">${part}</a> `;
			}
		});

		output += ' ';
	} else {
		output += `${word} `;
	}

	output += `<a href="#${word}" class="word-anchor"><i class="icon-search"></i></a>`
	output += `<small>${entry.gloss}</small> `;
	output += `<a href="#@${entry.family}" class="btn btn-mini btn-inverse">${entry.family}</a> `;
	
	// if (intransitive) {
	// 	output += `<span class="btn btn-mini">intransitive</span> `;
	// } else if (transitive) {
	// 	output += `<span class="btn btn-mini btn-info">transitive</span> `;
	// }

	if (entry.tags != undefined) {
		entry.tags.forEach((e) => {
			let style = "";
			let tag_style = tags_style[e];
			if (tag_style)
				style = ` ${tag_style}`;

			output += `<a href="##${e}" class="btn btn-mini${style}">${e}</a> `;
		});
	}

	output += `</h3>`;

	output += renderParagraphs(entry.short);

	if (entry.notes) {
		output += `<details><summary>Notes :</summary>`;
		output += renderParagraphs(entry.notes);
		output += `</details>`;
	}

	if (entry.definition) {
		output += `<details><summary>Definition :</summary><pre>`;
		output += escapeHTML(entry.definition);
		output += `</pre></details>`;
	}

	// if (entry.examples) {
	// 	output += `<details><summary>Examples :</summary>`;

	// 	for (i in entry.examples) {
	// 		output += `<div class="example">`;

	// 		output += `<div class="example-eberban">`;
	// 		let example = entry.examples[i][0];
	// 		console.log(example);
	// 		example = escapeHTML(example);
	// 		example = example.replace(/[A-Za-z]+/g, (match) => {
	// 			return `<a href="#${match}">${match}</a>`
	// 		});
	// 		example = example.replace(/(  |\\)(\r\n|\r|\n)/g, '<br />');
	// 		output += example;			
	// 		output += `</div>`;


	// 		output += `<div class="example-note">`;
	// 		output += renderParagraphs(entry.examples[i][1]);
	// 		output += `</div>`;

	// 		output += `</div>`;
	// 	}
	// 	output += `</details>`;
	// }

	output += `</div>`;
	return output;
}

function renderParagraphs(text) {
	let paragraphs = text.split(/(\r\n|\r|\n){2,}/);
	let output = "";

	paragraphs.forEach((p) => {
		p = escapeHTML(p);
		p = p.replace(/(  |\\)(\r\n|\r|\n)/g, '<br />');
		p = p.replace(/\[(.*?(:.*?)?)\]/g, (match, p1) => {
			let out = `<span class="label label-info place">`;
			out += `<span class="hidden">[</span>`;
			out = out +  p1.replace(/([a-zA-Z']{2,})/g, (match) => `{${match}}`);
			out += `<span class="hidden">]</span>`;
			out = out + `</span>`
			return out;
		});
		p = p.replace(/\[(@.*?(:.*?)?)\]/g, (match, p1) => {
			let out = `<span class="label place">`;
			out += `<span class="hidden">[</span>`;
			out = out +  p1.replace(/([a-zA-Z']{2,})/g, (match) => `{${match}}`);
			out += `<span class="hidden">]</span>`;
			out = out + `</span>`
			return out;
		});

		// __x__
		p = p.replace(/(?<!\\)(?:\\{2})*__((?:[^\\_]|\\.)+)__/g, '<strong>$1</strong>');

		// _x_
		p = p.replace(/(?<!\\)(?:\\{2})*_((?:[^\\_]|\\.)+)_/g, '<em>$1</em>');

		// cursive
		p = p.replace(/\$\((.+?)\)/g, '<span class="cursive">$1</span>');
		
		p = p.replace(/\{([a-zA-Z'. ]+)\}/g, (match, p1) => {
			let out = '<em>';
			let list = p1.split(' ');

			out += list.map((word) => `<a href="#${word}">${word}</a>`).join(' ');	

			out += '</em>';

			return out;
		});

		output += `<p>${p}</p>`;
	});

	return output;
}

function escapeHTML(str) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	return p.innerHTML;
}

export function html_dictionary(filters) {
	var output = '';

	var results = [];

	Object.keys(words_sorted).forEach((index) => {
		var word = words_sorted[index];

		let exact_match = false;

		for (var filter in filters) {
			filter = filters[filter].trim().toLowerCase();
			if (filter.startsWith('#')) {
				filter = filter.slice(1);

				if (dictionary[word].tags == undefined || !dictionary[word].tags.includes(filter)) {
					return;
				}
			} else if (filter.startsWith('@')) {
				if (filter == "@p") {
					// If this filter is used we want to list all particles.
					if (["R", "C2", "C3", "C+"].includes(dictionary[word].family)) {
						return;
					}
				} else if (dictionary[word].family != filter.slice(1).toUpperCase()) {
					return;
				}
			} else if (filter.startsWith('!')) {
				filter = filter.slice(1);

				if (word == filter) {
					exact_match = true;
				} else if (
					!(
						word.includes(filter) ||
						dictionary[word].without_spaces.includes(filter)
					)
				) {
					return;
				}
			} else if (filter.startsWith('?')) {
				filter = filter.slice(1);
				
				if (
					!(
						dictionary[word].gloss.toLowerCase().includes(filter) ||
						dictionary[word].short.toLowerCase().includes(filter)
					)
				) {
					return;
				}
			} else {
				if (word == filter) {
					exact_match = true;
				} else if (
					!(
						word.includes(filter) ||
						dictionary[word].without_spaces.includes(filter) ||
						dictionary[word].gloss.toLowerCase().includes(filter) ||
						dictionary[word].short.toLowerCase().includes(filter)
					)
				) {
					return;
				}
			}
		}

		// Cache html output.
		if (dictionary[word].html_output == undefined) {
			dictionary[word].html_output = html_word_entry(word, dictionary[word]);
		}

		if (exact_match) {
			// Exact match => first entry
			// output = dictionary[word].html_output + output;
			results.unshift(dictionary[word].html_output);
		} else {
			// output += dictionary[word].html_output;
			results.push(dictionary[word].html_output);
		}
	});

	output += `<div id="search-stats">${results.length} results found.</div>`;

	results.forEach((entry) => output += entry);

	return output;
}
