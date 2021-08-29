let { dictionary_en: dictionary, compare_words } = require('../src/dictionary');

const ignored = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_cardinal', '_number', 'a', 'e', 'i', 'o', 'u' ];

const words_sorted = Object.keys(dictionary).filter((word) => !ignored.includes(word)).sort(compare_words);

words_sorted.forEach((word) => (dictionary[word].without_spaces = word.replaceAll(' ', '').toLowerCase()));

export function count_word_types() {
	let roots = 0;
	let particles = 0;
	let compounds = 0;

	words_sorted.forEach((w) => {
		if (dictionary[w].family.startsWith('C')) compounds++;
		else if (dictionary[w].family == 'R') roots++;
		else particles++;
	});

	return { roots, particles, compounds };
}

function html_word_entry(word, entry) {
	var output = `<div class="dictionary-entry well well-small"><h3>`;

	if (entry.family.startsWith('C')) {
		word.split(' ').forEach((part) => {
			if (ignored.includes(part[0])) {
				output += `${part} `;
			} else {
				output += `<a href="#" class="dictionary-word-link">${part}</a> `;
			}
		});

		output += ': ';
	} else {
		output += `${word}: `;
	}

	output += `<small>${entry.short}</small> `;

	output += `<span class="btn btn-mini btn-inverse dictionary-family">${entry.family}</span> `;


	if (['R', 'C2', 'C3'].includes(entry.family)) {
		if (entry.long.match(/\[((A)(\d|c|d|n|s(\d|_)?)?)\]/g)) {
			output += `<span class="btn btn-mini btn-danger dictionary-ea">sea</span> `;
		} else {
			output += `<span class="btn btn-mini btn-success dictionary-e">se</span> `;
		}
	}	

	if (entry.tags != undefined) {
		entry.tags.forEach((e) => {
			output += `<span class="btn btn-mini btn-info dictionary-tag">${e}</span> `;
		});
	}

	output += `</h3>`;

	let paragraphs = entry.long.split(/(\r\n|\r|\n){2,}/);

	paragraphs.forEach((p) => {
		p = escapeHTML(p);
		p = p.replace(/  (\r\n|\r|\n)/g, '<br />');
		p = p.replace(/\(((E|A|O|U)(\d|c|d|n|s(\d|_)?)?)\)/g, '<span class="label label-success place">$&</span>');
		p = p.replace(/\[((E|A|O|U)(\d|c|d|n|s(\d|_)?)?)\]/g, '<span class="label label-important place">$&</span>');
		p = p.replace(/\{([a-zA-Z'. ]+)\}/g, (match, p1) => {
			let out = '<em>';
			let list = p1.split(' ');

			out += list.map((word) => `<a href="#" class="dictionary-word-link">${word}</a>`).join(' ');
			

			out += '</em>';

			return out;
		});

		output += `<p>${p}</p>`;
	});

	output += `</div>`;
	return output;
}

function escapeHTML(str) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	return p.innerHTML;
}

export function html_dictionary(filters) {
	var output = '';

	Object.keys(words_sorted).forEach((index) => {
		var word = words_sorted[index];

		let exact_match = false;

		for (var filter in filters) {
			filter = filters[filter].toLowerCase();
			if (filter.startsWith('#')) {
				filter = filter.slice(1);

				if (dictionary[word].tags == undefined || !dictionary[word].tags.includes(filter)) {
					return;
				}
			} else if (filter.startsWith('@')) {
				if (dictionary[word].family != filter.slice(1).toUpperCase()) {
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
						dictionary[word].short.toLowerCase().includes(filter) ||
						dictionary[word].long.toLowerCase().includes(filter)
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
						dictionary[word].short.toLowerCase().includes(filter) ||
						dictionary[word].long.toLowerCase().includes(filter)
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
			output = dictionary[word].html_output + output;
		} else {
			output += dictionary[word].html_output;
		}
	});

	return output;
}
