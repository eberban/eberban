import type { Verb } from "../semantics/tree.ts";

export function compoundDictKey(verb: Verb): string;
export function prefixedWordKey(prefix: string, content: string): string;
