// Properties the grammar must satisfy over the whole dictionary, with no hand-written expectation.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import * as parser from "./eberban.peggy.js";
import { compoundDictKey } from "../visual-parser/compound-key.js";

const dictionaryPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "dictionary", "en.yaml");
const dictionary = yaml.load(readFileSync(dictionaryPath, "utf8"));
if (typeof dictionary !== "object" || dictionary === null) throw new Error(`dictionary: expected a map: ${JSON.stringify(dictionary)}`);

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
const compounds = entriesOfFamily("C");

describe("every dictionary root parses as a single Root verb", () => {
    for (const root of roots) {
        it(root, () => {
            const step = singleStep(root);
            expect(step.next).toBeUndefined();
            expect(step.verb.family).toBe("Root");
            expect(step.verb.word).toBe(root);
        });
    }
});

describe("every dictionary compound parses as a single Compound verb with the same key", () => {
    for (const key of compounds) {
        it(key, () => {
            const step = singleStep(key);
            expect(step.next).toBeUndefined();
            expect(step.verb.family).toBe("Compound");
            expect(compoundDictKey(step.verb)).toBe(key);
        });
    }
});

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
