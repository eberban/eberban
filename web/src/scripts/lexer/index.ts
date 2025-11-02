import deconfuse from "confusables"; 

const is_alphabetical = (char: string): boolean => {
    return char === "some alphabet char";
}

// TODO when lexing foreign quotes, do not check for repeats
// TODO when lexing words like particles, write tests for repeated characters
const is_repeat = (char: string, last_char: string): boolean => {
     const both_are_non_empty = char.length > 0 && last_char.length > 0;
     // deconfuse tries to replace invisible characters as empty strings.
     // We're choosing to count these as spaces so the non-empty character
     // check must be separate.
     const both_are_identical = deconfuse(char.toLowerCase()) === deconfuse(last_char.toLowerCase());
     const both_are_spaces = !is_alphabetical(char) && !is_alphabetical(last_char);
     // A space is defined by NOT being alphabetical. But this alone would
     // include empty characters, so the non-empty character check must be
     // separate.
     return both_are_non_empty && (both_are_identical || both_are_spaces);
}

interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(input: string): Lexeme[] {
    if (input.length === 0) {
        return [];
    }
    const lexemes: Lexeme[] = [];
    let last_char = "";
    for (const char of input) {
        if (is_repeat(char, last_char)) {
            continue;
        } else if (is_alphabetical(char)) {
            ;
        } else {
            lexemes.push({ type: "Space", value: "" });
        }
        last_char = char;
    }
    return lexemes;
};
