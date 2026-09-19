// Intermediate form shared by the formula printer and the evaluator: named predicate definitions
// in the refgram style (W_1, W_1^w) and the statements of the text.
//
// Variables are objects shared between the definitions that mention them: a place shared by
// chaining is one Var, a parameter of the consumer and of the instance alike. Each Var is
// quantified at exactly one site (an exists node, a definition's parameters, or the text).
// Definitions may mention variables that are not their parameters; those are bound by an
// enclosing definition or by the text when they are evaluated.

export type Value = "true" | "false" | "unknown";
export type Letter = "E" | "A" | "O" | "U";
export const LETTERS: Letter[] = ["E", "A", "O", "U"];

export type VarType = { kind: "atom" } | { kind: "pred"; arity: number };

export interface Var {
    id: number;
    type: VarType;
    // Place letter (e a o u, uppercase for predicates), printed where the variable is quantified.
    letter: string;
    // Printed name where the variable is free: a hoisted witness (e_1), a bo variable (x_ke).
    display: string;
}

export type Term = { kind: "var"; v: Var } | { kind: "atom"; name: string };

export type PredRef =
    | { kind: "def"; def: Def }
    | { kind: "word"; key: string }
    | { kind: "pvar"; v: Var };

export type Arg = Term | PredRef;

export type Formula =
    | { kind: "app"; pred: PredRef; ctx: Term; args: Arg[] }
    | { kind: "and"; items: Formula[] }
    | { kind: "not"; body: Formula }
    | { kind: "exists"; vars: Var[]; body: Formula }
    | { kind: "equiv"; left: PredRef; right: PredRef; arity: number }
    | { kind: "eq"; left: Term; right: Term }
    | { kind: "top" }
    | { kind: "bottom" }
    | { kind: "unknown" }
    | { kind: "unsupported"; reason: string };

export interface Def {
    // Printed name: mian_1, mian_1^w, ze-mian_1, zoia-dona_1, va_1, ...
    name: string;
    // Context parameter first, then the explicit places.
    params: Var[];
    // Printed letters of the explicit parameters, in order (e a o u, uppercase for predicates).
    letters: string[];
    body: Formula;
    // Definitions derived inside this one, when it opens a scope with an argument list.
    inner?: Def[];
    // Print the explicit parameters by their variable name instead of their place letter.
    namedParams?: true;
}

export type Statement =
    | { kind: "assert"; def: Def }
    | { kind: "context"; def: Def; next: Var }
    | { kind: "define"; word: string; def: Def; capture: boolean; question: boolean }
    | { kind: "axiom"; word: string; enabled: boolean }
    | { kind: "default"; word: string; place: Letter; def: Def }
    | { kind: "unsupported"; reason: string };

export interface Program {
    defs: Def[];
    // Variables quantified over the whole text (hoisted witnesses, bo variables).
    textVars: Var[];
    statements: Statement[];
    // Definitions and statements in emission order, for printing.
    timeline: (Def | Statement)[];
    // Every unsupported construct met, for tests and the CLI.
    unsupported: string[];
}

export function isArg(a: Arg): a is Term {
    return a.kind === "var" || a.kind === "atom";
}
