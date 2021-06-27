const fs = require('fs');
const yaml = require('yaml');
const { repeat, generators } = require('../src/root_generator');

var words = fs.readFileSync('../dictionary/en.yaml', 'utf8');
words = yaml.parse(words);

if (process.argv.length != 4 || !['A','B','C'].includes(process.argv[3])) {
    console.log('usage : word_generator <amount> {A/B/C} ');
    return;
}

repeat(process.argv[2], () => {
    while (true) {
        let word = generators[process.argv[3]]();
        if (words[word] == undefined) {
            console.log(word);
            return;
        }
    }
});