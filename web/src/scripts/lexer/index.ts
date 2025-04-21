interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(input: string): Lexeme[] {
    return [];
}
