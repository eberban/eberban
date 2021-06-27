const { words_en: words } = require('../src/dictionary');

const words_sorted = Object.keys(words).sort();

const ignored = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_cardinal', '_number'
]

function html_word_entry(word, entry) {
    var output = `<div class="entry"><h3>`;

    output += `${word}: `;
    output += `<span class="label label-inverse">${entry.family}</span> `;

    if (entry.sequential) output += `<span class="label label-info">Sequential</span> `;

    output += `<small>${entry.short}</small> `
    

    output += `</h3>`;

    output += `<pre>${entry.long.replace(/(?:\r\n|\r|\n)/g, '<br/>')}</pre>`

    output += `</div>`;
    return output;
}

export function html_dictionary() {
    var output = '';

    Object.keys(words_sorted).forEach(index => {        
        var word = words_sorted[index];
        if (ignored.includes(word)) return;
        output += html_word_entry(word, words[word]);
    })

    return output;
}