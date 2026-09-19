// Shape of the parse tree produced by eberban.peggy.js, as far as the lowering reads it.
// Fields are optional because the grammar emits different keys per construct; readers narrow.

export interface Word {
    family: string;
    word: string;
    elided?: boolean;
}

export interface ParsedText {
    paragraphs?: Paragraph[];
    warnings?: { message: string }[];
    flags?: Word[];
}

export interface Paragraph {
    starter?: Word;
    sentences: Sentence[];
}

export interface Sentence {
    kind: string;
    starter?: Word;
    definition?: Definition;
    defined?: Verb;
    pred?: Verb;
    eraser?: string;
}

export interface ArgList {
    list: Word[];
    end: Word;
}

export type Definition = Chain | { args: ArgList; chain: Chain };

export function hasArgs(d: Definition): d is { args: ArgList; chain: Chain } {
    return "args" in d && d.args !== undefined && "chain" in d;
}

export interface Chain {
    select?: Word;
    verb: Verb;
    explicit_binds?: BindGroup | BindGroup[];
    next?: Chain;
    wide_negation?: Word | Word[];
    erased?: unknown[];
    resume?: unknown;
}

export interface BindGroup {
    binds: Bind[];
    end: Word;
}

export interface Bind {
    start: Word;
    inner: Definition;
    wide_negation?: Word;
}

export interface Modifier {
    modifier: Word;
    select?: Word;
}

export interface PEItem {
    sep?: unknown;
    chain: Chain;
    wide_negation?: Word;
}

export interface Verb {
    family?: string;
    word?: string;
    kind?: string;
    prefix?: string;
    postfix?: string;
    content?: Verb[] | string;
    start?: Word;
    verb?: Verb;
    group?: Verb[];
    args?: ArgList;
    items?: PEItem[];
    sep?: unknown;
    end?: Word;
    modifiers?: Modifier | Modifier[];
    pre?: unknown[];
    post?: unknown[];
    namespace?: unknown;
    value?: unknown;
    elided?: boolean;
}

export function asArray<T>(v: T | T[] | undefined): T[] {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
}
