import {
    any_number_of,
    one_or_more,
    optional
} from "../regex";
import {
    mahul,
    sonorant,
    non_sonorant_shyllable,
    sonorant_shyllable,
} from "./combos";

const particle_representations = [
    non_sonorant_shyllable(),
    mahul() + any_number_of(sonorant_shyllable()) + optional(sonorant()),
    one_or_more(sonorant_shyllable()) + optional(sonorant()),
];
interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(input: string): Lexeme[] {
    if (particle_representations.some((r) => new RegExp("^" + r + "$", "g").test(input))) {
        return [
            {
                type: "Particle",
                value: input,
            }
        ]
    }
    return [];
}
