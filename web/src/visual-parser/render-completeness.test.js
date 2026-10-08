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

// Non-elided words of the tree, as rendered text keys.
function treeWords(node, out) {
    if (Array.isArray(node)) {
        for (const n of node) treeWords(n, out);
        return out;
    }
    if (typeof node !== "object" || node === null) return out;
    if (node.family === "Borrowing") {
        out.push(prefixedWordKey("u", node.content));
        return out;
    }
    if (node.family === "FFVariable") {
        out.push(prefixedWordKey("i", node.content));
        return out;
    }
    if (typeof node.family === "string" && typeof node.word === "string" && node.elided !== true) {
        out.push(node.word);
    }
    for (const [k, v] of Object.entries(node)) {
        if (k === "location") continue;
        treeWords(v, out);
    }
    return out;
}

function unescape(text) {
    return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
}

function tokens(text) {
    return unescape(text).replace(/[()]/g, " ").split(/\s+/).filter(t => t.length > 0);
}

// Words shown in boxes, plus every word of the annotation popovers (whose rows are free-form).
function renderedWords(result) {
    const { html, annotations } = renderBoxes(result);
    const out = [];
    for (const m of html.matchAll(/class="vbox-(?:word-text|compound-part-word)">([^<]*)</g)) {
        out.push(...tokens(m[1] ?? ""));
    }
    for (const popover of Object.values(annotations)) {
        out.push(...tokens(String(popover).replace(/<[^>]*>/g, " ")));
    }
    return out;
}

function counts(words) {
    const map = new Map();
    for (const w of words) map.set(w, (map.get(w) ?? 0) + 1);
    return map;
}

function missingWords(result) {
    const rendered = counts(renderedWords(result));
    const missing = [];
    for (const [word, n] of counts(treeWords(result.paragraphs ?? [], []))) {
        const shown = rendered.get(word) ?? 0;
        if (shown < n) missing.push(`${word} (${shown}/${n})`);
    }
    return missing;
}

for (const file of readdirSync(corpusDir).filter(f => f.endsWith(".yaml")).sort()) {
    describe(file, () => {
        for (const c of loadCases(file)) {
            if (c.error !== undefined || c.todo !== undefined) continue;
            it(c.text, () => {
                expect(missingWords(parser.parse(c.text)), "words missing from the rendering").toEqual([]);
            });
        }
    });
}
