const { words_en: words } = require('../src/dictionary');
const { repeat, generators } = require('../src/root_generator');

function generate_words(amount, type) {
    var list = [];

    repeat(amount, () => {
        while (true) {
            let word = generators[type]();
            if (words[word] == undefined) {
                list.push(word);
                return;
            }
        }
    });

    return list;
}

function html_1_column(list, title) {
    let output = `<div class="span4"><h3>${title}</h3>`;

    list.forEach(element => {
        output += `${element}<br/>`;
    });

    output += `</div>`;

    return output;
}

export function html_3_columns() {
    var short = generate_words(20, 'A');
    var medium = generate_words(20, 'B');
    var long = generate_words(20, 'C');

    let output = `<div class="row">`

    output += html_1_column(short, "Short");
    output += html_1_column(medium, "Medium");
    output += html_1_column(long, "Long");

    output += `</div>`

    return output;
}

module.exports.words = words;