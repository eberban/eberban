import {
    Alphabet_char,
    is_alphabetical,
    is_repeat,
} from "./types_and_preds";
import build_combo from "./combo";
import { any_number_of, begin, end, non_capturing_group, one_or_more, optional } from "../regex";

interface Lexeme {
    readonly type: string,
    readonly value: string,
};

const SPACE: Lexeme = { type: "Space", value: "" };


/* ENTRY */
export default function lex(input: string): Lexeme[] {
    const lexemes: Lexeme[] = [];
    let possible_word: Alphabet_char[] = [];
    let last_char = "";
    for (const char of input) {
        if (is_repeat(char, last_char)) {
            continue;
        } else if (is_alphabetical(char)) {
            possible_word.push(char);
        } else {
            lexemes.push(SPACE);
            lexemes.push(...lex_possible_word(possible_word))
            possible_word = [];
        }
        last_char = char;
    }
    if (possible_word.length > 0) {
        lexemes.push(...lex_possible_word(possible_word))
    }
    return lexemes;
};


function lex_possible_word(possible_word: Alphabet_char[]): Lexeme[] {
    const lexemes: Lexeme[] = [];
    // A word is lexed into a lexeme if it matches one of its combos.
    const particle_combos = [
        "non-sonorant-shyllable",
        (
            "mahul" +
            any_number_of(non_capturing_group("sonorant-shyllable")) +
            optional(non_capturing_group("sonorant"))
        ),
        (
            one_or_more(non_capturing_group("sonorant-shyllable")) +
            optional(non_capturing_group("sonorant"))
        ),
    ]
    const possible_word_combo = build_combo(possible_word);
    const combo_string = possible_word_combo.map((c) => c.type).join("");
    for (const regex_string of particle_combos) {
        const regex = new RegExp(begin + regex_string + end);
        if (regex.test(combo_string)) {
            lexemes.push({ 
                type: "Particle",
                value: possible_word_combo.map((c) => c.get_content()).join(""),
            });
        }
    }
    return lexemes;
}
