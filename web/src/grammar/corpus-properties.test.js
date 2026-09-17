// Properties the grammar must satisfy over the whole dictionary, with no hand-written expectation.

import { describe, it, expect } from "vitest";
import * as parser from "./eberban.peggy.js";
import { loadDictionary } from "./dictionary-file.js";

const dictionary = loadDictionary();

function entriesOfFamily(family) {
    return Object.entries(dictionary)
        .filter(([key, entry]) => typeof key === "string" && !key.startsWith("_") && entry?.family === family)
        .map(([key]) => key);
}

// Parse "a <text>" and return the single chain step of the single sentence.
function singleStep(text) {
    const result = parser.parse(`a ${text}`);
    const paragraphs = result.paragraphs ?? [];
    expect(paragraphs.length, "one paragraph").toBe(1);
    const sentences = paragraphs[0]?.sentences ?? [];
    expect(sentences.length, "one sentence").toBe(1);
    const sentence = sentences[0];
    if (sentence === undefined || sentence.kind !== "A Sentence") throw new Error(`not an A sentence: ${JSON.stringify(sentence)}`);
    return sentence.definition;
}

const roots = entriesOfFamily("R");

// Every key parsing as its declared family is the "family" rule of dictionary-lint.test.js.

// Self-segregating morphology: two roots written without a space segment back into the same
// two roots. Roots never start with a sonorant, so no space is required between them.
describe("two concatenated roots re-segment (self-segregating morphology)", () => {
    // Deterministic sample: pair each root with a few others chosen by a fixed stride.
    const strides = [1, 7, 61, 311];
    const pairs = [];
    for (let i = 0; i < roots.length; i++) {
        for (const s of strides) {
            const j = (i * s + s) % roots.length;
            if (j !== i) pairs.push([roots[i], roots[j]]);
        }
    }
    for (const [left, right] of pairs) {
        it(`${left}${right}`, () => {
            const step = singleStep(`${left}${right}`);
            expect(step.verb.word).toBe(left);
            expect(step.next?.verb?.word).toBe(right);
            expect(step.next?.next).toBeUndefined();
        });
    }
});
