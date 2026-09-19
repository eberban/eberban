import type { ParsedText } from "../semantics/tree.ts";

export function parse(text: string, options?: { startRule?: string }): ParsedText;
