import dictionary from "../../../dictionary/en.yaml";
import { compare_words, compare_words_biased  } from "./compare_words";

const ignored = [ '_spelling', '_cardinal', '_number', 'i', 'e', 'u' ];

const words_sorted = Object.keys(dictionary).filter((word) => !ignored.includes(word)).sort(compare_words_biased);

const tags_style = {
	"transitive": "btn-info",
	"core": "btn-success",
};

words_sorted.forEach((word) => {
	let entry = dictionary[word];
	entry.without_spaces = word.replaceAll(' ', '').toLowerCase();

	if (entry.family == 'C') {
		let split = word.split(' ');
		if (split[1] && split[1].startsWith('u')) {
			entry.tags.unshift("borrow");
		}
	}

	// Detect transitive words.
	let intransitive = false;
	let transitive = false;

	// TODO: Supports compounds transitivity inheritance and override
	if (['R'].includes(entry.family)) {
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

	entry.html_output = html_word_entry(word, entry);
});

const spelling_words_sorted = Object.keys(dictionary["_spelling"]).sort(compare_words);

spelling_words_sorted.forEach((word) => {
	let entry = dictionary["_spelling"][word];

	entry.without_spaces = word.replaceAll(' ', '').toLowerCase();
	entry.family = "S";
	entry.extra_css_class = "entry-spelling";
	
	if (entry.tags == undefined) {
		entry.tags = [];
	}

	if (entry.links == undefined) {
		entry.links = [];
	}

	entry.links.push(["icon-book", "Quotes", "https://eberban.github.io/eberban/books/refgram/book/grammar/quotes.html"]);

	entry.html_output = html_word_entry(word, entry);
});

export function count_word_types() {
	let roots = 0;
	let particles = -10; // remove entries for graphic digits
	let compounds = 0;

	words_sorted.forEach((w) => {
		if (dictionary[w].family == 'C') compounds++;
		else if (dictionary[w].family == 'R') roots++;
		else particles++;
	});

	return { roots, particles, compounds };
}

function html_word_entry(word, entry) {
	let extra_css_class = entry.extra_css_class || "";
	let entry_css_classes = `dictionary-entry ${extra_css_class}`;

	let family_button = `<a href="#@${entry.family}" class="family">${entry.family}</a>`;

	let word_display = word;
	if (entry.family == 'C') {
		word_display = "";
		word.split(' ').forEach((part) => {
			if (ignored.includes(part[0])) {
				word_display += `${part} `;
			} else {
				word_display += `<a href="#${part}">${part}</a> `;
			}
		});
		word_display += " ";
	}

	let short_display = renderParagraphs(entry.short);
	let notes_display = "";
	if (entry.notes) {
		notes_display = `<strong>Notes: </strong>${renderParagraphs(entry.notes)}`
	}

	let links = "";
	if (entry.links) {
		links += '<strong>Links :</strong><ul class="entry-links">';
		for (let i in entry.links) {
			links += "<li>";
			links += `<a href="${entry.links[i][2]}"><i class="${entry.links[i][0]}" aria-hidden="true"></i> ${entry.links[i][1]}</a>`;
			links += "</li>";
		}
		links += "</ul>";
	}

	let tags = "";
	if (entry.tags) {
		tags = "<div><strong>Tags : </strong>";
		entry.tags.forEach((e) => {
			let style = "";
			let tag_style = tags_style[e];
			if (tag_style)
				style = ` ${tag_style}`;

			tags += `<a href="##${e}" class="btn btn-mini${style}">${e}</a> `;
		});
		tags += "</div>";
	}

	let definition = "";
	if (entry.definition) {
		definition += `<details><summary><strong>Definition :</strong></summary><pre>`;
		definition += escapeHTML(entry.definition);
		definition += `</pre></details>`;
	}

	let see_also = "";
	if (entry.see_also) {
		see_also += '<p class="see-also"><strong>See also :</strong> ';
		for (let i in entry.see_also) {
			if (i != 0) {
				see_also += ", "
			}

			see_also += `<a href="#${entry.see_also[i]}">${entry.see_also[i]}</a>`;
		}
		see_also += '.</p>';
	}

	let permalink = `<p data-tooltip="Link with a unique ID that will remain the same even if the Eberban
	word changes">
	<strong>
	<a href=#${entry.id}>Permalink</a>
	</strong>
	</p>`;

	let output = `<details class="${entry_css_classes}">
		<summary>
			<span class="word">${word_display}</span>
			${family_button}
			<span class="short"><i>${entry.gloss}</i>${short_display}</span>
		</summary>
		<div class="dictionary-details">
			${notes_display}
			${see_also}
			${tags}
			${links}
			${definition}
			${permalink}
		</div>
	</details>`;

	return output;
}

function renderParagraphs(text) {
	let paragraphs = text.split(/(\r\n|\r|\n){2,}/);
	let output = "";

	paragraphs.forEach((p) => {
		p = escapeHTML(p);
		p = p.replace(/\\\\/g, '&#92;');
		p = p.replace(/\\\[/g, '&#91;');
		p = p.replace(/\\\]/g, '&#93;');
		p = p.replace(/\\\(/g, '&#40;');
		p = p.replace(/\\\)/g, '&#41;');
		p = p.replace(/(  |\\)(\r\n|\r|\n)/g, '<br />');
		p = p.replace(/(\r\n|\r|\n)/g, ' ');
		p = p.replace(/\[(.*?(:.*?)?)\]/g, (match, p1) => {
			let out = `<span class="label label-info place">`;
			out += `<span class="hidden">[</span>`;
			out = out +  p1.replace(/([a-zA-Z']{2,})/g, (match) => `${addDictionaryLinks(match)}`);
			out += `<span class="hidden">]</span>`;
			out = out + `</span>`
			return out;
		});
		p = p.replace(/\[(@.*?(:.*?)?)\]/g, (match, p1) => {
			let out = `<span class="label place">`;
			out += `<span class="hidden">[</span>`;
			out = out +  p1.replace(/([a-zA-Z']{2,})/g, (match) => `${addDictionaryLinks(match)}`);
			out += `<span class="hidden">]</span>`;
			out = out + `</span>`
			return out;
		});

		// Eberban quotes with links.
		p = p.replace(/\{(.*?)\}/g, (match, p1) => {
			let out = '<span class="ebb-quote">';
			out += addDictionaryLinks(p1);
			out += '</span>';

			return out;
		});

		// __x__
		p = p.replace(/(?<!\\)(?:\\{2})*__((?:[^\\_]|\\.)+)__/g, '<strong>$1</strong>');

		// _x_
		p = p.replace(/(?<!\\)(?:\\{2})*_((?:[^\\_]|\\.)+)_/g, '<em>$1</em>');

		// cursive
		p = p.replace(/\$\((.+?)\)/g, '<span class="cursive">$1</span>');

		

		output += `<p>${p}</p>`;
	});

	return output;
}

function addDictionaryLinks(text) {
	text = text.replaceAll(/&lt;(.+?)&gt;|([A-Za-z_!]+)/g, (match, p1, p2) => {
		const content = p1 || p2;
		if (content.startsWith("!")) {
			return content.slice(1);
		}
		
		return `<a href="#${content}">${content}</a>`
	});

	return text;
}

function escapeHTML(str) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	return p.innerHTML;
}

function may_insert_entry(results, filters, word, entry) {
	let exact_match = false;

	for (var filter in filters) {
		filter = filters[filter].trim().toLowerCase();
		if (filter.startsWith('#')) {
			filter = filter.slice(1);

			if (entry.tags == undefined || !entry.tags.includes(filter)) {
				return;
			}
		} else if (filter.startsWith('@')) {
			if (filter == "@p") {
				// If this filter is used we want to list all particles.
				if (["R", "C2", "C3", "C+"].includes(entry.family)) {
					return;
				}
			} else if (entry.family != filter.slice(1).toUpperCase()) {
				return;
			}
		} else if (filter.startsWith('!')) {
			filter = filter.slice(1);

			if (word == filter) {
				exact_match = true;
			} else if (
				!(
					word.includes(filter) ||
					entry.without_spaces.includes(filter)
				)
			) {
				return;
			}
		} else if (filter.startsWith('?')) {
			filter = filter.slice(1);
			
			if (
				!(
					entry.gloss.toLowerCase().includes(filter) ||
					entry.short.toLowerCase().includes(filter)
				)
			) {
				return;
			}
		} else {
			if (word == filter || entry.id == filter) {
				exact_match = true;
			} else if (
				!(
					word.includes(filter) ||
					entry.without_spaces.includes(filter) ||
					entry.gloss?.toLowerCase().includes(filter) ||
					entry.short?.toLowerCase().includes(filter) ||
					entry.id?.toLowerCase().includes(filter) ||
					entry.notes?.toLowerCase().includes(filter)
				)
			) {
				return;
			}
		}
	}

	if (exact_match) {
		// Exact match => first entry
		// output = entry.html_output + output;
		results.unshift(entry.html_output);
	} else {
		// output += entry.html_output;
		results.push(entry.html_output);
	}
}

export function html_dictionary(filters) {
	var output = '';

	var results = [];

	Object.keys(words_sorted).forEach((index) => {
		var word = words_sorted[index];

		may_insert_entry(results, filters, word, dictionary[word]);
	});

	Object.keys(spelling_words_sorted).forEach((index) => {
		var word = spelling_words_sorted[index];

		may_insert_entry(results, filters, word, dictionary["_spelling"][word]);
	});

	output += `<div id="search-stats">${results.length} results found.</div>`;

	results.forEach((entry) => output += entry);

	return output;
}

