import {
    any_number_of,
    non_capturing_group,
    optional,
    set,
} from "../regex";

function vowel() {
    return set(...["i", "e", "a", "o", "u"]);
}

export function mahul() {
    return non_capturing_group(
        vowel() +
        any_number_of(non_capturing_group(optional("h") + vowel()))
    );
}

export function sonorant() {
    return set(...["n", "r", "l"]);
}

export function non_sonorant_shyllable() {
    const non_sonorants = [
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
    return non_capturing_group(
        set(...non_sonorants) +
        mahul()
    );
}

export function sonorant_shyllable() {
    return non_capturing_group(
        sonorant() +
        mahul()
    );
}
