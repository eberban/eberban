export interface SignaturePlace {
    place: "E" | "A" | "O" | "U";
    type: string;
    predicate: boolean;
}

export function parseSignature(short: unknown): { places: SignaturePlace[]; errors: string[] };
export function lintDictionary(dictionary: Record<string, unknown>, parser: unknown): { rule: string; key: string; message: string }[];
