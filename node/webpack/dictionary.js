const { words_en: words } = require('../src/dictionary');

const words_sorted = Object.keys(words).sort();

const ignored = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_cardinal', '_number' ];

function html_word_entry(word, entry) {
	var output = `<div class="entry"><h3>`;

	output += `${word}: `;
	output += `<span class="btn btn-mini btn-inverse dictionary-family">${entry.family}</span> `;

	output += `<small>${entry.short}</small> `;

    
    
	if (entry.sequential) output += `<span class="btn btn-mini disabled">sequential</span> `;

    if (entry.tags != undefined) {
        entry.tags.forEach((e) => {
            output += `<span class="btn btn-mini btn-info dictionary-tag">${e}</span> `;
        })
    }

	output += `</h3>`;

	output += `<pre>${entry.long.replace(/(?:\r\n|\r|\n)/g, '<br/>')}</pre>`;

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

        if (exact_match) {
            // Exact match => first entry
            output = html_word_entry(word, words[word]) + output;
        } else {
            output += html_word_entry(word, words[word]);
        }
	});

	return output;
}
