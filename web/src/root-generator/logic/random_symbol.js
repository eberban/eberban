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
    const cs_medial_pairs = all_medial_pairs.filter((pair) => {
        return all_non_sonorants.includes(pair[0]) && all_sonorants.includes(pair[1]);
    });
    const eligible_yz_pairs = [...all_initial_pairs, ...cs_medial_pairs];
    const yz_heads = new Set(eligible_yz_pairs.map((pair) => pair[0]));

    const eligible_medial_pairs = all_medial_pairs.filter((pair) => {
        return all_non_sonorants.includes(pair[0]) && yz_heads.has(pair[1]);
    });
    const selected_medial_pair = get_random_item(eligible_medial_pairs);

    const eligible_yz = eligible_yz_pairs.filter((pair) => {
        return selected_medial_pair[1] === pair[0];
    });
    const selected_yz = get_random_item(eligible_yz);

    return selected_medial_pair + selected_yz[1];
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
