import { render } from "preact";

import dictionary from "../../../dictionary/en.yaml";
import { compare_words, compare_words_biased  } from "./compare_words";
import Entry from "./entry";

const ignored = [ '_spelling', '_cardinal', '_number', 'i', 'e', 'u' ];

const words_sorted = Object.keys(dictionary).filter((word) => !ignored.includes(word)).sort(compare_words_biased);

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

	entry.vars = html_word_entry(word, entry);
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

	entry.vars = html_word_entry(word, entry);
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
	return {
		extra_css_class: entry.extra_css_class,
		word,
		family: entry.family,
		gloss: entry.gloss,
		short: entry.short,
		notes: entry.notes,
		see_also: entry.see_also,
		tags: entry.tags,
		links: entry.links,
		definition: entry.definition,
		id: entry.id,
	}
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
		// output = entry.vars + output;
		results.unshift(entry.vars);
	} else {
		// output += entry.vars
		results.push(entry.vars);
	}
}

export function html_dictionary(filters) {
	var results = [];

	Object.keys(words_sorted).forEach((index) => {
		var word = words_sorted[index];

		may_insert_entry(results, filters, word, dictionary[word]);
	});

	Object.keys(spelling_words_sorted).forEach((index) => {
		var word = spelling_words_sorted[index];

		may_insert_entry(results, filters, word, dictionary["_spelling"][word]);
	});

	render(
		<EntryList list={results} />,
		document.getElementById("dictionary"),
	);
}

function EntryList({ list }) {
    return (
        <>
            <div id="search-stats">
                {list.length} results found.
            </div>
            {list.map((e) => <Entry {...e} />)}
        </>
    );
}
