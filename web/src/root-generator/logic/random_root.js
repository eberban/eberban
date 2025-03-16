import { get_random_item }  from "../../scripts/utils";
import { convert_sequence_to_root, SYMBOLS as S } from "./symbols";


/* ENTRY */


function get_random_root_from_meta_sequence(meta_sequence) {
    let sequence = get_random_item(meta_sequence);
    let index = 0;
    let vhowel_count = 0;
    const root_sequence = [];
    while (true) {
        if (index === sequence.length) {
            if (vhowel_count > 0) {
                root_sequence.push(vhowel_count);
                vhowel_count = 0;
            }
            break;
        }

        // The first element of any sequence is NOT an array,
        // so we can safely set index back to zero.
        if (Array.isArray(sequence[index])) {
            sequence = get_random_item(sequence[index]);
            index = 0;
        }

        if (sequence[index] === S.VHOWEL) {
            vhowel_count++;
        } else {
            if (vhowel_count > 0) {
                root_sequence.push(vhowel_count);
                vhowel_count = 0;
            }
            root_sequence.push(sequence[index]);
        }

        index++;;
    }

    return convert_sequence_to_root(root_sequence);
}


/* 3-letter Roots */


export function get_random_three_letter_intransitive_root() {
    const meta_sequence = [[S.NON_SONORANT, S.VHOWEL, S.SONORANT]];
    return get_random_root_from_meta_sequence(meta_sequence);
}

export function get_random_three_letter_transitive_root() {
    const meta_sequence = [[S.PAIR_i, S.VHOWEL]];
    return get_random_root_from_meta_sequence(meta_sequence);
}


/* 4-letter Roots */


export function get_random_four_letter_intransitive_root() {
    const meta_sequence = [
        [S.PAIR_i, S.VHOWEL, S.SONORANT],
        [S.NON_SONORANT, S.VHOWEL, S.VHOWEL, S.SONORANT],
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}

export function get_random_four_letter_transitive_root() {
    const meta_sequence = [
        [S.PAIR_i, S.VHOWEL, S.VHOWEL],
        [S.NON_SONORANT, S.VHOWEL, S.SONORANT, S.VHOWEL],
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}


/* 5-letter Roots */


export function get_random_five_letter_intransitive_root() {
    const meta_sequence = [
        [S.PAIR_i, S.VHOWEL, S.VHOWEL, S.SONORANT],
        [
            S.NON_SONORANT,
            S.VHOWEL,
            [
                [S.SONORANT, S.VHOWEL, S.SONORANT],
                [S.VHOWEL, S.VHOWEL, S.SONORANT],
            ],
        ],
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}

export function get_random_five_letter_transitive_root() {
    const meta_sequence = [
        [
            S.PAIR_i,
            S.VHOWEL,
            [
                [S.VHOWEL, S.VHOWEL],
                [S.SONORANT, S.VHOWEL],
            ],
        ],
        [
            S.NON_SONORANT,
            S.VHOWEL,
            [
                [S.PAIR_m, S.VHOWEL],
                [S.SONORANT, S.VHOWEL, S.VHOWEL],
                [S.VHOWEL, S.SONORANT, S.VHOWEL],
            ],
        ],
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}


/* 6-letter Roots */


export function get_random_six_letter_intransitive_root() {
    const meta_sequence = [
        [
            S.PAIR_i,
            S.VHOWEL,
            [
                [S.SONORANT, S.VHOWEL, S.SONORANT],
                [S.VHOWEL, S.VHOWEL, S.SONORANT],
            ],
        ],
        [
            S.NON_SONORANT,
            S.VHOWEL,
            [

                [S.SONORANT, S.VHOWEL, S.VHOWEL, S.SONORANT],
                [S.VHOWEL, S.SONORANT, S.VHOWEL, S.SONORANT]
            ],
        ],        
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}

export function get_random_six_letter_transitive_root() {
    const meta_sequence = [
        [
            S.PAIR_i,
            S.VHOWEL,
            [
                [S.PAIR_m, S.VHOWEL],
                [S.SONORANT, S.VHOWEL, S.VHOWEL],
                [
                    S.VHOWEL,
                    [
                        [S.SONORANT, S.VHOWEL],
                        [S.VHOWEL, S.VHOWEL],
                    ],
                ],
            ],
        ],
        [
            S.NON_SONORANT,
            S.VHOWEL,
            [
                [S.TRIPLET, S.VHOWEL],
                [S.PAIR_m, S.VHOWEL, S.VHOWEL],
                [
                    S.SONORANT,
                    S.VHOWEL,
                    [
                        [S.SONORANT, S.VHOWEL],
                        [S.VHOWEL, S.VHOWEL],
                    ],
                ],
                [
                    S.VHOWEL,
                    [
                        [S.PAIR_m, S.VHOWEL],
                        [S.SONORANT, S.VHOWEL, S.VHOWEL],
                        [S.VHOWEL, S.SONORANT, S.VHOWEL],
                    ],
                ],
            ],
        ],        
    ];
    return get_random_root_from_meta_sequence(meta_sequence);
}

