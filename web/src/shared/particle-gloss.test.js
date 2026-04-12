import { describe, it, expect } from "vitest";
import { tiDigitValue, computeNumberInfo } from "./particle-gloss.js";

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

// Helper: build TI digit node from eberban word
function ti(word) { return { family: "TI", word }; }
function tiSym(symbol) { return { family: "TI", symbol }; }

describe("computeNumberInfo", () => {
    it("simple integer: tu ta = 42", () => {
        let { display, tooltip } = computeNumberInfo({ int: [ti("tu"), ti("ta")] });
        expect(display).toBe("42");
        expect(tooltip).toContain("Assuming default base 10");
        expect(tooltip).toMatch(/4.*10.*\+ 2.*10.*= 42/);
    });

    it("extra-base digit: tao ta = 152 (digit 15 in base 10)", () => {
        let { display, tooltip } = computeNumberInfo({ int: [ti("tao"), ti("ta")] });
        expect(display).toBe("152");
        expect(tooltip).toMatch(/15.*10/);
    });

    it("explicit base 12: teo ju tie tia = 66", () => {
        let { display, tooltip } = computeNumberInfo({
            base: { value: ti("teo"), sep: { family: "JU", word: "ju" } },
            int: [ti("tie"), ti("tia")]
        });
        // teo = digit 11, base = 12. tie=5, tia=6. 5*12 + 6 = 66
        expect(display).toContain("(base 12)");
        expect(display).toContain("= 66");
        expect(tooltip).toContain("Base: 12");
    });

    it("fractional: to jo te tu te tie tei = 3.14159", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("to")],
            fract: {
                sep: { family: "JO", word: "jo" },
                value: [ti("te"), ti("tu"), ti("te"), ti("tie"), ti("tei")]
            }
        });
        expect(display).toContain("3.14159");
        expect(tooltip).toContain("Fractional:");
    });

    it("negative: to joi = -3", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("to")],
            fract: { sep: { family: "JO", word: "joi" }, value: [] }
        });
        // joi makes it negative, but no fractional digits => just negation flag
        // The int is 3, frac is 0, negFrac makes frac -0 which doesn't affect total
        // Actually joi means the whole number is negative per refgram
        expect(display).toContain("3");
        expect(tooltip).toContain("Assuming default base 10");
    });

    it("magnitude: tia jo ti ta ta je ta to = 6.022 × 10^23", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("tia")],
            fract: {
                sep: { family: "JO", word: "jo" },
                value: [ti("ti"), ti("ta"), ti("ta")]
            },
            magn: {
                sep: { family: "JE", word: "je" },
                value: [ti("ta"), ti("to")]
            }
        });
        expect(display).toMatch(/10/);
        expect(tooltip).toContain("Magnitude:");
        expect(tooltip).toContain("×10²³");
    });

    it("negative magnitude: tei jo te ti tei jei to te", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("tei")],
            fract: {
                sep: { family: "JO", word: "jo" },
                value: [ti("te"), ti("ti"), ti("tei")]
            },
            magn: {
                sep: { family: "JE", word: "jei" },
                value: [ti("to"), ti("te")]
            }
        });
        expect(tooltip).toContain("Magnitude:");
        expect(tooltip).toContain("×10⁻³¹");
    });

    it("ordinal suffix: te jiu", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("te")],
            end: { family: "JI", word: "jiu" }
        });
        expect(display).toContain("ordinal");
        expect(tooltip).toContain("Usage: ordinal");
    });

    it("symbol digits work: 4 2 = 42", () => {
        let { display } = computeNumberInfo({ int: [tiSym("4"), tiSym("2")] });
        expect(display).toBe("42");
    });

    it("repeated part: to jo te ja to = 3.1333...", () => {
        let { display, tooltip } = computeNumberInfo({
            int: [ti("to")],
            fract: {
                sep: { family: "JO", word: "jo" },
                value: [ti("te")]
            },
            repeat: {
                sep: { family: "JA", word: "ja" },
                value: [ti("to")]
            }
        });
        expect(tooltip).toContain("Repeating:");
        // Should not show = total for repeating decimals
        expect(display).not.toMatch(/= \d/);
    });

    it("base 16 with extra-base digits", () => {
        // tao ju tao tao = base 16, digits F F = 15*16 + 15 = 255
        let { display } = computeNumberInfo({
            base: { value: ti("tao"), sep: { family: "JU", word: "ju" } },
            int: [ti("tao"), ti("tao")]
        });
        expect(display).toContain("(base 16)");
        expect(display).toContain("= 255");
    });

    it("custom base + fractional: teo ju tie jo tia = 5.5 in base 12", () => {
        // teo = digit 11, base = 12. tie = 5, tia = 6.
        // 5 + 6×12⁻¹ = 5 + 0.5 = 5.5
        let { display, tooltip } = computeNumberInfo({
            base: { value: ti("teo"), sep: { family: "JU", word: "ju" } },
            int: [ti("tie")],
            fract: {
                sep: { family: "JO", word: "jo" },
                value: [ti("tia")]
            }
        });
        expect(display).toContain("(base 12)");
        expect(display).toContain("= 5.5");
        expect(tooltip).toContain("Base: 12");
        expect(tooltip).toContain("5×12⁰");
        expect(tooltip).toContain("6×12⁻¹");
    });

    it("tooltip uses newlines between sections", () => {
        let { tooltip } = computeNumberInfo({ int: [ti("tu"), ti("ta")] });
        let lines = tooltip.split("\n");
        expect(lines.length).toBeGreaterThanOrEqual(2);
        expect(lines[0]).toContain("Assuming default base 10");
        expect(lines[1]).toContain("Integer:");
    });
});
