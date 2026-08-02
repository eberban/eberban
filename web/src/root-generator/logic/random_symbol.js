import { get_random_item } from "../../shared/utils.js";
import {
    all_initial_pairs,
    all_medial_pairs,
    all_non_sonorants,
    all_sonorants,
    all_vowels,
} from "../../shared/eberban_symbols.js";

/*
  Random-selection functions.
  The following have been named as nouns for readability's sake.
*/


function initial_pair() {
    return get_random_item(all_initial_pairs);
}

function medial_pair() {
    return get_random_item(all_medial_pairs);
}

function non_sonorant() {
    return get_random_item(all_non_sonorants);
}

function sonorant() {
    return get_random_item(all_sonorants);
}

function triplet() {
    const liquids = ["r", "l"];
    const medial_xys = all_medial_pairs.filter((p) => all_non_sonorants.includes(p[0]));

    const triplets = [];

    // Shape 1: Medial+Initial (XY medial, YZ initial)
    for (const xy of medial_xys) {
        for (const yz of all_initial_pairs) {
            if (yz[0] === xy[1]) triplets.push(xy + yz[1]);
        }
    }

    // Shape 2: Onset+Liquid (XY medial or initial, Y not m nor sonorant, Z liquid)
    const xy_pool = [...medial_xys, ...all_initial_pairs];
    for (const xy of xy_pool) {
        if (xy[1] === "m" || !all_non_sonorants.includes(xy[1])) continue;
        for (const z of liquids) {
            if (all_medial_pairs.includes(xy[1] + z)) triplets.push(xy + z);
        }
    }

    return get_random_item(triplets);
}


/* Vhowel Generator */


function* generate_vhowels(letter_count) {
    // Vowels only.
    const first = get_random_item(all_vowels);
    yield first;
    if (letter_count === 1) {
        return;
    }
    if (letter_count === 2) {
        yield get_random_item(all_vowels.filter((v) => v !== first));
        return;
    }

    // Introduce "h", since we're generating more than 2 vhowels.
    const all_vhowels = all_vowels.concat("h");
    let vhowel_pool = all_vhowels.filter((v) => v !== first);
    const remaining_count = letter_count - 1;
    for (let i = remaining_count; i > 0; i--) {
        if (i === 1) {
            vhowel_pool = vhowel_pool.filter((v) => v !== "h");
        }
        const latest = get_random_item(vhowel_pool);
        yield latest;
        vhowel_pool = all_vhowels.filter((v) => v !== latest);
    }
}


/* Symbols */


export const SYMBOLS = {
    PAIR_i: "pair_i",
    PAIR_m: "pair_m",
    NON_SONORANT: "non_sonorant",
    SONORANT: "sonorant",
    TRIPLET: "triplet",
    VHOWEL: "vhowel",
};

export function convert_sequence_to_root(sequence) {
    return sequence.map((symbol) => {
        if (!isNaN(symbol)) {
            let vhowel_series = "";
            for (const vhowel of generate_vhowels(parseInt(symbol))) {
                vhowel_series += vhowel;
            }
            return vhowel_series;
        }
        return {
            "pair_i": initial_pair(),
            "pair_m": medial_pair(),
            "non_sonorant": non_sonorant(),
            "sonorant": sonorant(),
            "triplet": triplet(),
        }[symbol];
    }).join("");
}
