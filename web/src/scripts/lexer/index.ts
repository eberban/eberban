const is_alphabetical = (char: string): boolean => {
    return char === "some alphabet char";
}

const is_repeat = (char: string, last_char: string): boolean => {
    const both_are_identical = char === last_char;
    const both_are_spaces = [
        char !== "" && last_char !== "",
        !is_alphabetical(char) && !is_alphabetical(last_char),
    ].every((bool) => bool);
    return both_are_identical || both_are_spaces;
}

interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(input: string): Lexeme[] {
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
