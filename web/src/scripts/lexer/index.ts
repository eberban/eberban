interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(_: string): Lexeme[] {
    return [];
}
