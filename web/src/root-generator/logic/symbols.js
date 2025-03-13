import { get_random_item } from "../../scripts/utils";


/*
  Random-selection functions.
  The following have been named as nouns for readability's sake.
*/


const all_initial_pairs = [
    "mn",
    "mr",
    "ml",
    "pr",
    "pl",
    "ps",
    "pc",
    "br",
    "bl",
    "bz",
    "bj",
    "fn",
    "fr",
    "fl",
    "fs",
    "fc",
    "vn",
    "vr",       
    "vl",
    "vz",
    "vj",
    "tr",
    "ts",
    "tc",
    "dr",
    "dz",
    "dj",
    "sn",
    "sr",
    "sl",
    "sm",
    "sp",
    "sf",
    "st",
    "sk",
    "zn",
    "zr",
    "zl",
    "zm",
    "zb",
    "zv",
    "zd",
    "zg",
    "cn",
    "cr",
    "cl",
    "cm",
    "cp",
    "cf",
    "ct",
    "ck",
    "jn",
    "jr",
    "jl",
    "jm",
    "jb",
    "jv",
    "jd",
    "jg",
    "kn",
    "kr",
    "kl",
    "ks",
    "kc",
    "gn",
    "gr",
    "gl",
    "gz",
    "gj",
];

function initial_pair() {
    return get_random_item(all_initial_pairs);
}

const all_medial_pairs = [
    "nr",
    "nl",
    "rn",
    "ln",
    "pm",
    "pf",
    "pt",
    "pk",
    "bm",
    "bv",
    "bd",
    "bg",
    "tm",
    "tp",
    "tf",
    "tk",
    "dm",
    "db",
    "dv",
    "dg",
    "fm",
    "fp",
    "ft",
    "fk",
    "vm",
    "vb",
    "vd",
    "vg",
    "gm",
    "gb",
    "gv",
    "gd",
    "km",
    "kp",
    "kf",
    "kt",
];

function medial_pair() {
    return get_random_item(all_medial_pairs);
}

const all_non_sonorants = [
    "m",
    "p",
    "b",
    "f",
    "v",
    "t",
    "d",
    "s",
    "z",
    "c",
    "j",
    "k",
    "g",
];

function non_sonorant() {
    return get_random_item(all_non_sonorants);
}

function sonorant() {
    return get_random_item(["n", "r", "l"]);
}

function triplet() {
    const eligible_medial_pairs = all_medial_pairs.filter((pair) => {
        return all_non_sonorants.includes(pair[0]);
    });
    const selected_medial_pair = get_random_item(eligible_medial_pairs);

    const eligible_initial_pairs = all_initial_pairs.filter((pair) => {
        return selected_medial_pair[1] === pair[0];
    });
    const selected_initial_pair = get_random_item(eligible_initial_pairs);

    return selected_medial_pair + selected_initial_pair[1];
}


/* Vhowel Generator */


function* generate_vhowels(letter_count) {
    // Vowels only.
    const all_vowels = ["i", "e", "a", "o", "u"];
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
