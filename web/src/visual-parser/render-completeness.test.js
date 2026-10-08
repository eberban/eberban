// Every word of the parse tree must be rendered by the box renderer: nothing dropped.
// Runs over every successful case of the parse corpus (../grammar/corpus).

import { describe, it, expect, vi } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import * as parser from "../grammar/eberban.peggy.js";
import { prefixedWordKey } from "./compound-key.js";
import { renderBoxes } from "./visual.js";

// visual.js imports the dictionary through the Vite YAML plugin, absent under plain Vitest.
vi.mock("../../../dictionary/en.yaml", async () => {
    const { loadDictionary } = await import("../grammar/dictionary-file.js");
    return { default: loadDictionary() };
});

const corpusDir = join(dirname(fileURLToPath(import.meta.url)), "..", "grammar", "corpus");

function loadCases(file) {
    const raw = yaml.load(readFileSync(join(corpusDir, file), "utf8"));
    if (!Array.isArray(raw)) throw new Error(`${file}: expected a list of cases, got ${JSON.stringify(raw)}`);
    return raw;
}

function spanStart(node) {
    const span = node.span;
    if (!Array.isArray(span) || typeof span[0] !== "number") throw new Error(`word without span: ${JSON.stringify(node)}`);
    return span[0];
}

// Non-elided words of the tree as { key, start, annotation }, where key is the rendered text and
// annotation tells whether the word sits under a DI/DE/DA annotation (rendered in a popover).
function treeWords(node, out, annotation) {
    if (Array.isArray(node)) {
        for (const n of node) treeWords(n, out, annotation);
        return out;
    }
    if (typeof node !== "object" || node === null) return out;
    if (node.family === "Borrowing" || node.family === "FFVariable") {
        out.push({ key: prefixedWordKey(node.prefix, node.content), start: spanStart(node), annotation });
        return out;
    }
    if (typeof node.family === "string" && node.elided !== true) {
        const key = typeof node.word === "string" ? node.word : node.symbol;
        if (typeof key === "string") out.push({ key, start: spanStart(node), annotation });
    }
    for (const [k, v] of Object.entries(node)) {
        if (k === "location" || k === "span") continue;
        treeWords(v, out, annotation || k === "pre" || k === "post");
    }
    return out;
}

function unescape(text) {
    return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
}

function tokens(text) {
    return unescape(text).replace(/[()]/g, " ").split(/\s+/).filter(t => t.length > 0);
}

// Words shown in boxes, in document order, and every word of the annotation popovers (whose rows
// are free-form).
function renderedWords(result) {
    const { html, annotations } = renderBoxes(result);
    const boxes = [];
    for (const m of html.matchAll(/class="vbox-(?:word-text|compound-part-word)">([^<]*)</g)) {
        boxes.push(...tokens(m[1] ?? ""));
    }
    const popovers = [];
    for (const popover of Object.values(annotations)) {
        popovers.push(...tokens(String(popover).replace(/<[^>]*>/g, " ")));
    }
    return { boxes, popovers };
}

function counts(words) {
    const map = new Map();
    for (const w of words) map.set(w, (map.get(w) ?? 0) + 1);
    return map;
}

function missingWords(words, rendered) {
    const shownCounts = counts([...rendered.boxes, ...rendered.popovers]);
    const missing = [];
    for (const [word, n] of counts(words.map(w => w.key))) {
        const shown = shownCounts.get(word) ?? 0;
        if (shown < n) missing.push(`${word} (${shown}/${n})`);
    }
    return missing;
}

// Non-annotation words in text order must appear in the boxes as a subsequence. Returns the first
// word not found after its predecessor, with its text offset, or null.
function firstOutOfOrder(words, rendered) {
    const ordered = words.filter(w => !w.annotation).sort((a, b) => a.start - b.start);
    let cursor = 0;
    for (const w of ordered) {
        const found = rendered.boxes.indexOf(w.key, cursor);
        if (found === -1) return `${w.key}@${w.start} after box ${cursor} of ${JSON.stringify(rendered.boxes)}`;
        cursor = found + 1;
    }
    return null;
}

for (const file of readdirSync(corpusDir).filter(f => f.endsWith(".yaml")).sort()) {
    describe(file, () => {
        for (const c of loadCases(file)) {
            if (c.error !== undefined || c.todo !== undefined) continue;
            it(c.text, () => {
                const result = parser.parse(c.text);
                const words = treeWords(result.paragraphs ?? [], [], false);
                const rendered = renderedWords(result);
                expect(missingWords(words, rendered), "words missing from the rendering").toEqual([]);
                expect(firstOutOfOrder(words, rendered), "word rendered out of text order").toBeNull();
            });
        }
    });
}
