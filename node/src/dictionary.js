module.exports.dictionary_en = require('../../dictionary/en.yaml');

const alphabet = 'hnlrmpbfvtdszcjkgieaou';

let symbol_indices = {};

for (i = 0; i < alphabet.length; i++) {
    symbol_indices[alphabet[i]] = i;
}

console.log({symbol_indices});

function compare_words(x, y) {
    if (x == y) {
        return 0;
    }

    for(i = 0; i < x.length; i++) {
        if (i >= y.length) {
            return 1; // y is shorter and 
        }

        let sx = symbol_indices[x[i]];
        let sy = symbol_indices[y[i]];

        // earlier in the alphabet => first to appear
        if (sx < sy) {
            return -1;
        } else if (sx > sy) {
            return 1;
        }
    }
}

module.exports.compare_words = compare_words;