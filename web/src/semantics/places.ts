// Explicit place list of a verb: letters and types (atom, or predicate with an arity).
//
// Dictionary words take it from the `short` signature through the lint's parseSignature; the
// arity of a predicate place is read from its parentheses (`()` 0, `(p)` 1, `(p,p)` 2,
// `p(...)` any). Words without an entry get the chaining rule: E, plus A when transitive, A a
// predicate place when the form says so (CCV, final -i).

import type { Letter } from "./ir.ts";
import { LETTERS } from "./ir.ts";
import type { Verb } from "./tree.ts";
import { parseSignature } from "../shared/dict-lint.js";
import { verbTransitivity } from "../shared/places.js";
import { compoundDictKey, prefixedWordKey } from "../visual-parser/compound-key.js";

// arity null: variadic (`p(...)`), fixed by the bind that fills the place.
export type PlaceType = { kind: "atom" } | { kind: "pred"; arity: number | null };

export interface Place {
    letter: Letter;
    type: PlaceType;
}

export type Dictionary = Record<string, unknown>;

/** Dictionary key of a plain verb node (no modifiers), undefined for quotes, numbers, PE. */
export function wordKey(verb: Verb): string | undefined {
    if (verb.kind === "BorrowingGroup") {
        return (verb.group ?? []).map(g => prefixedWordKey("u", typeof g.content === "string" ? g.content : g.word ?? "")).join(" ");
    }
    if (verb.kind !== undefined) return undefined;
    if (verb.start?.family === "PE") return undefined;
    switch (verb.family) {
        case "Compound":
            return compoundDictKey(verb);
        case "Borrowing":
            return prefixedWordKey("u", typeof verb.content === "string" ? verb.content : "");
        case "FFVariable":
            return prefixedWordKey("i", typeof verb.content === "string" ? verb.content : "");
        default:
            return verb.word;
    }
}

/** Places declared by a dictionary entry's signature, undefined when the entry has none. */
export function entryPlaces(entry: unknown): Place[] | undefined {
    if (typeof entry !== "object" || entry === null) return undefined;
    const short = (entry as { short?: unknown }).short;
    if (typeof short !== "string") return undefined;
    const { places } = parseSignature(short);
    if (places.length === 0) return undefined;
    const byLetter = new Map(places.map(p => [p.place, p]));
    const out: Place[] = [];
    for (const letter of LETTERS) {
        const p = byLetter.get(letter);
        if (p === undefined) continue;
        if (!p.predicate) {
            out.push({ letter, type: { kind: "atom" } });
            continue;
        }
        let type = p.type;
        // A bare letter refers to the place that introduced it with parentheses.
        if (/^[a-z]$/.test(type)) {
            const intro = places.find(q => q.type.startsWith(type + "("));
            type = intro === undefined ? "(...)" : intro.type.slice(1);
        }
        out.push({ letter, type: { kind: "pred", arity: arityOf(type) } });
    }
    return out;
}

function arityOf(type: string): number | null {
    const open = type.indexOf("(");
    const close = type.lastIndexOf(")");
    if (open < 0 || close < open) return null;
    const inner = type.slice(open + 1, close).trim();
    if (inner === "") return 0;
    if (inner.includes("...")) return null;
    return inner.split(",").length;
}

/** Places of a word with no signature: the chaining rule from its form. */
export function inferredPlaces(verb: Verb, dictionary: Dictionary | undefined): Place[] {
    const { trans, equiv } = verbTransitivity(verb, dictionary);
    const places: Place[] = [{ letter: "E", type: { kind: "atom" } }];
    if (trans) places.push({ letter: "A", type: equiv ? { kind: "pred", arity: null } : { kind: "atom" } });
    return places;
}
