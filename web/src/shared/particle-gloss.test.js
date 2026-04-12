import { describe, it, expect } from "vitest";
import { tiDigitValue } from "./particle-gloss.js";

describe("tiDigitValue", () => {
    // Generate first 105 digits by enumerating vowel sequences
    // (5 single + 20 double + 80 triple = 105)
    function generateSequences() {
        const V = ["i", "e", "a", "o", "u"];
        let seqs = [];

        // Length 1: 5
        for (let a of V) seqs.push(a);

        // Length 2: 5×4 = 20
        for (let a of V)
            for (let b of V)
                if (b !== a) seqs.push(a + b);

        // Length 3: 5×4×4 = 80
        for (let a of V)
            for (let b of V)
                if (b !== a)
                    for (let c of V)
                        if (c !== b) seqs.push(a + b + c);

        return seqs;
    }

    it("maps single vowels to 0-4", () => {
        expect(tiDigitValue("i")).toBe(0);
        expect(tiDigitValue("e")).toBe(1);
        expect(tiDigitValue("a")).toBe(2);
        expect(tiDigitValue("o")).toBe(3);
        expect(tiDigitValue("u")).toBe(4);
    });

    it("maps known hex digits from refgram table", () => {
        // ti-: ie=5, ia=6, io=7, iu=8
        expect(tiDigitValue("ie")).toBe(5);
        expect(tiDigitValue("ia")).toBe(6);
        expect(tiDigitValue("io")).toBe(7);
        expect(tiDigitValue("iu")).toBe(8);
        // te-: ei=9, ea=A, eo=B, eu=C
        expect(tiDigitValue("ei")).toBe(9);
        expect(tiDigitValue("ea")).toBe(10);
        expect(tiDigitValue("eo")).toBe(11);
        expect(tiDigitValue("eu")).toBe(12);
        // ta-: ai=D, ae=E, ao=F
        expect(tiDigitValue("ai")).toBe(13);
        expect(tiDigitValue("ae")).toBe(14);
        expect(tiDigitValue("ao")).toBe(15);
    });

    it("maps first and last 3-vowel entries per refgram", () => {
        // tiei = first 3-vowel = 25
        expect(tiDigitValue("iei")).toBe(25);
        // tuou = last 3-vowel = 104
        expect(tiDigitValue("uou")).toBe(104);
    });

    it("first 105 digits are sequential with no gaps", () => {
        let seqs = generateSequences();
        expect(seqs.length).toBe(105);
        for (let i = 0; i < seqs.length; i++) {
            expect(tiDigitValue(seqs[i])).toBe(i);
        }
    });

    it("rejects consecutive same vowels", () => {
        expect(tiDigitValue("ii")).toBe(-1);
        expect(tiDigitValue("aa")).toBe(-1);
        expect(tiDigitValue("iee")).toBe(-1);
    });

    it("allows non-consecutive repeats", () => {
        // aoa = valid 3-vowel sequence
        expect(tiDigitValue("aoa")).toBeGreaterThan(24);
        expect(tiDigitValue("aoa")).toBeLessThan(105);
    });

    it("rejects empty and invalid input", () => {
        expect(tiDigitValue("")).toBe(-1);
        expect(tiDigitValue("x")).toBe(-1);
    });
});
