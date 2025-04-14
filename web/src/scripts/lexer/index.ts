interface Lexeme {
    readonly type: string,
    readonly value: string,
};

export default function lex(input: string): Lexeme[] {
    return [
        { type: "InvalidType", value: "InvalidValue" },
    ];
}
