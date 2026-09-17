// Dictionary consistency: every rule of dict-lint.js must report nothing.

import { describe, it, expect } from "vitest";
import * as parser from "./eberban.peggy.js";
import { loadDictionary } from "./dictionary-file.js";
import { RULES, parseSignature } from "../shared/dict-lint.js";

const dictionary = loadDictionary();

describe("signature parser", () => {
    it("reads typed places and references", () => {
        const { places, errors } = parseSignature("[E:tce* pan] eats [A:tce* den] with [E] happy about [O:()].");
        expect(errors).toEqual([]);
        expect(places).toEqual([
            { place: "E", type: "tce* pan", predicate: false },
            { place: "A", type: "tce* den", predicate: false },
            { place: "O", type: "()", predicate: true },
        ]);
    });
    it("reports gaps, untyped first use and double typing", () => {
        expect(parseSignature("[E] then [E:ma]").errors).toEqual(["[E] is used before being typed"]);
        expect(parseSignature("[E:ma] and [E:mai]").errors).toEqual(["[E] is typed twice"]);
    });
    it("ignores family references and prose brackets", () => {
        expect(parseSignature("See [FI] and [number] things").errors).toEqual([]);
    });
    it("accepts a predicate first place written as A, and generic type letters", () => {
        expect(parseSignature("It is possible that [A:()] occurs.").errors).toEqual([]);
        expect(parseSignature("[A:ma] alone").errors).toEqual(["places A are not a prefix of EAOU"]);
        expect(parseSignature("[E:p] is a member of set [A:tcuhi p].").places.map(p => p.predicate)).toEqual([false, false]);
    });
    it("reads a generic predicate type introduced as p(...)", () => {
        const { places, errors } = parseSignature("[E:p(...)] is equivalent to [A:p].");
        expect(errors).toEqual([]);
        expect(places.map(p => p.predicate)).toEqual([true, true]);
        expect(parseSignature("[E:p] then [A:p(...)]").errors).toEqual(["type p(...) must carry its parentheses on its first mention"]);
    });
});

describe("dictionary lint", () => {
    for (const [name, rule] of Object.entries(RULES)) {
        it(name, () => {
            const findings = rule(dictionary, parser).map(f => `${f.key}: ${f.message}`);
            expect(findings).toEqual([]);
        });
    }
});
