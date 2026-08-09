import { describe, it, expect } from "vitest";
import { compoundDictKey } from "./compound-key.js";

// Shorthands to build parse-tree fragments matching what eberban.peggy emits.
const w = (word) => ({ family: "Root", word });
const borrow = (content) => ({ family: "Borrowing", prefix: "u", content });
const c2 = (prefix, a, b) => ({ family: "Compound", prefix, content: [a, b] });
const c3 = (prefix, a, b, c) => ({ family: "Compound", prefix, content: [a, b, c] });
const cN = (prefix, ...items) => ({ family: "Compound", prefix, content: items, postfix: "e" });

describe("compoundDictKey", () => {
    it("returns the plain form for a flat 2-compound", () => {
        expect(compoundDictKey(c2("e", w("ber"), w("ban")))).toBe("e ber ban");
    });

    it("collapses a nested 2-compound at position 0 into 'ei'", () => {
        // e (e ber ban) ban
        let tree = c2("e", c2("e", w("ber"), w("ban")), w("ban"));
        expect(compoundDictKey(tree)).toBe("ei ber ban ban");
    });

    it("collapses two nested levels into 'eie'", () => {
        // e (e (e A B) C) D
        let tree = c2("e", c2("e", c2("e", w("A"), w("B")), w("C")), w("D"));
        expect(compoundDictKey(tree)).toBe("eie A B C D");
    });

    it("collapses three nested levels into 'eiei'", () => {
        // e (e (e (e A B) C) D) E
        let tree = c2("e",
            c2("e",
                c2("e",
                    c2("e", w("A"), w("B")),
                    w("C")),
                w("D")),
            w("E"));
        expect(compoundDictKey(tree)).toBe("eiei A B C D E");
    });

    it("normalizes the shorthand i-prefix to e for lookup", () => {
        // Grammar-recorded shorthand: outer e, inner records prefix "i".
        // Should collapse the same as if the inner recorded "e".
        let tree = c2("e", c2("i", w("ber"), w("ban")), w("ban"));
        expect(compoundDictKey(tree)).toBe("ei ber ban ban");
    });

    it("does not collapse when the nested compound is not the first word", () => {
        // e A (e B C)
        let tree = c2("e", w("A"), c2("e", w("B"), w("C")));
        expect(compoundDictKey(tree)).toBe("e A e B C");
    });

    it("only collapses the sub-chain that actually starts with a nested compound", () => {
        // e A (e (e B C) D). Inner-inner collapses to 'ei'; outer stays 'e' because A breaks the chain.
        let tree = c2("e", w("A"), c2("e", c2("e", w("B"), w("C")), w("D")));
        expect(compoundDictKey(tree)).toBe("e A ei B C D");
    });

    it("collapses 'e' outer + 'en' inner into 'ein' (previous letter 'e' flips vowel to 'i')", () => {
        // e (en A B C) D
        let tree = c2("e", c3("en", w("A"), w("B"), w("C")), w("D"));
        expect(compoundDictKey(tree)).toBe("ein A B C D");
    });

    it("collapses 'en' outer + 'e' inner into 'ene' (previous letter 'n' keeps vowel as 'e')", () => {
        // en (e A B) C D
        let tree = c3("en", c2("e", w("A"), w("B")), w("C"), w("D"));
        expect(compoundDictKey(tree)).toBe("ene A B C D");
    });

    it("collapses two 3-compounds into 'enen'", () => {
        // en (en A B C) D E
        let tree = c3("en", c3("en", w("A"), w("B"), w("C")), w("D"), w("E"));
        expect(compoundDictKey(tree)).toBe("enen A B C D E");
    });

    it("collapses a mixed 2/3/2 chain into 'eine'", () => {
        // e (en (e A B) C D) E
        let tree = c2("e",
            c3("en",
                c2("e", w("A"), w("B")),
                w("C"),
                w("D")),
            w("E"));
        expect(compoundDictKey(tree)).toBe("eine A B C D E");
    });

    it("collapses a 2/2/3 chain into 'eien' (previous letter 'i' keeps vowel as 'e')", () => {
        // e (e (en A B C) D) E
        let tree = c2("e",
            c2("e",
                c3("en", w("A"), w("B"), w("C")),
                w("D")),
            w("E"));
        expect(compoundDictKey(tree)).toBe("eien A B C D E");
    });

    it("keys borrowings inside a compound with their u-prefix", () => {
        // e uaotearoa stan (a real dictionary entry)
        let tree = c2("e", borrow("aotearoa"), w("stan"));
        expect(compoundDictKey(tree)).toBe("e uaotearoa stan");
    });

    it("keeps the postfix (variable-N compound ends with 'e')", () => {
        // er A B C D e
        let tree = cN("er", w("A"), w("B"), w("C"), w("D"));
        expect(compoundDictKey(tree)).toBe("er A B C D e");
    });

    it("recurses into non-first nested compounds so they also collapse", () => {
        // e A (e (e B C) D) (e (e E F) G).
        // Word A at position 0 blocks outer collapse; both siblings collapse independently.
        let tree = {
            family: "Compound", prefix: "e", content: [
                w("A"),
                c2("e", c2("e", w("B"), w("C")), w("D")),
                c2("e", c2("e", w("E"), w("F")), w("G")),
            ]
        };
        expect(compoundDictKey(tree)).toBe("e A ei B C D ei E F G");
    });
});
