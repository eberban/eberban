const { dictionary_en: dictionary } = require('../src/dictionary');
const { repeat, generators } = require('../src/root_generator');
export default dictionary;

function generate_words(amount, type) {
    var list = [];

    repeat(amount, () => {
        while (true) {
            let word = generators[type]();
            if (dictionary[word] == undefined) {
                list.push(word);
                return;
            }
        }
    });

    return list;
}

function html_1_column(list, title) {
    let output = `<div class="span3"><h3>${title}</h3>`;

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
    var long2 = generate_words(20, 'D');

    let output = `<div class="row">`

    output += html_1_column(short, "Short");
    output += html_1_column(medium, "Medium");
    output += html_1_column(long, "Long");
    output += html_1_column(long2, "Long 2");

    output += `</div>`

    return output;
}