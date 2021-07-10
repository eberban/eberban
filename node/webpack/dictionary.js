const { words_en: words } = require('../src/dictionary');

const words_sorted = Object.keys(words).sort();

const ignored = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_cardinal', '_number', 'a', 'e', 'i', 'o', 'u' ];

function html_word_entry(word, entry) {
	var output = `<div class="dictionary-entry well well-small"><h3>`;

	output += `${word}: `;

	output += `<small>${entry.short}</small> `;

	output += `<span class="btn btn-mini btn-inverse dictionary-family">${entry.family}</span> `;

	if (entry.sequential) {
		output += `<span class="btn btn-mini btn-danger dictionary-seq">sequential</span> `;
	}

	if (entry.tags != undefined) {
		entry.tags.forEach((e) => {
			output += `<span class="btn btn-mini btn-info dictionary-tag">${e}</span> `;
		});
	}

	output += `</h3>`;

	let paragraphs = entry.long.split(/(\r\n|\r|\n){2,}/);

	paragraphs.forEach((p) => {
		p = p.replace(/\(((A|E|I|O)\d?)\)/g,'<span class="label label-success">$1</span>')
		p = p.replace(/\[((A|E|I|O)\d?)\]/g,'<span class="label label-important">$1</span>')
		p = p.replace(/\{([a-zA-Z'. ]+)\}/g, (match, p1) => {
			let out = '<em>';
			let list = p1.split(' ');

			list.forEach((word) => {
				out += `<a href="#" class="dictionary-word-link">${word}</a> `
			})

			out += '</em>';

			return out;
		});

		output += `<p>${p}</p>`
	})

	output += `</div>`;
	return output;
}

export function html_dictionary(filters) {
	var output = '';

	Object.keys(words_sorted).forEach((index) => {
		var word = words_sorted[index];
		if (ignored.includes(word)) return;

		let exact_match = false;

		for (var filter in filters) {
			filter = filters[filter].toLowerCase();
			if (filter.startsWith('#')) {
				filter = filter.slice(1);

				if (words[word].tags == undefined || !words[word].tags.includes(filter)) {
					return;
				}
			} else if (filter.startsWith('@')) {
				if (words[word].family != filter.slice(1).toUpperCase()) {
					return;
				}
			} else {
				if (word == filter) {
					exact_match = true;
				}

				if (
					!(
						word.includes(filter) ||
						words[word].short.toLowerCase().includes(filter) ||
						words[word].long.toLowerCase().includes(filter)
					)
				) {
					return;
				}
			}
		}

		// Cache html output.
		if (words[word].html_output == undefined) {
			words[word].html_output = html_word_entry(word, words[word]);
		}

		if (exact_match) {
			// Exact match => first entry
			output = words[word].html_output + output;
		} else {
			output += words[word].html_output;
		}
	});

	return output;
}
