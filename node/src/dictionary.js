module.exports.dictionary_en = require('../../dictionary/en.yaml');

const order = 'hnrlmpbfvtdszcjkgieaou0123456789';

let symbol_indices = {};

for (i = 0; i < order.length; i++) {
    symbol_indices[order[i]] = i;
}

function compare_words_biased(x, y) {
    // Give priority to A/O particles so that they don't appear at the end
    if ('ao'.includes(x[0]) && !'ao'.includes(y[0])) {
        return -1;
    }

    if (!'ao'.includes(x[0]) && 'ao'.includes(y[0])) {
        return 1;
    }

    return compare_words(x, y);
}

function compare_words(x, y) {
    for(i = 0; i < x.length; i++) {
        if (i >= y.length) {
            return 1; // y is shorter
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

module.exports.compare_words_biased = compare_words_biased;
module.exports.compare_words = compare_words;