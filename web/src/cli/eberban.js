#!/usr/bin/env node
// Command-line access to the Eberban parser.
//
//   node src/cli/eberban.js parse "<text>"        shape line, then glosses of the words used
//   node src/cli/eberban.js parse --json "<text>"  full parse tree as JSON
//   node src/cli/eberban.js word <word>            class and segmentation of one word
//
// Run from the web/ directory.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import * as parser from "../grammar/eberban.peggy.js";
import { shapeText } from "../shared/shape.js";
import { compoundDictKey, prefixedWordKey } from "../visual-parser/compound-key.js";
import { generateParticleInfo } from "../shared/particle-gloss.js";

const here = dirname(fileURLToPath(import.meta.url));

function loadDictionary() {
    const raw = yaml.load(readFileSync(join(here, "..", "..", "..", "dictionary", "en.yaml"), "utf8"));
    if (typeof raw !== "object" || raw === null) throw new Error(`dictionary: expected a map: ${JSON.stringify(raw)}`);
    return raw;
}

function usage() {
    console.error("usage: eberban parse [--json] <text> | eberban word <word>");
    process.exit(2);
}

// Collect every word-like node of a parse tree, in text order.
function collectWords(node, out) {
    if (Array.isArray(node)) {
        for (const n of node) collectWords(n, out);
        return;
    }
    if (typeof node !== "object" || node === null) return;
    if (node.family === "Compound") {
        out.push({ key: compoundDictKey(node), family: "Compound" });
        return;
    }
    if (node.family === "Borrowing") {
        out.push({ key: prefixedWordKey("u", node.content), family: "Borrowing" });
        return;
    }
    if (typeof node.family === "string" && typeof node.word === "string" && node.elided !== true) {
        out.push({ key: node.word, family: node.family });
    }
    for (const [k, v] of Object.entries(node)) {
        if (k === "location") continue;
        collectWords(v, out);
    }
}

function gloss(dictionary, w) {
    const entry = dictionary[w.key];
    if (entry && typeof entry === "object") {
        const short = typeof entry.short === "string" ? entry.short.replace(/\s+/g, " ").trim() : "";
        return `${w.key}\t${entry.family ?? w.family}\t${entry.gloss ?? ""}\t${short}`;
    }
    const generated = generateParticleInfo(w.key);
    if (generated) return `${w.key}\t${generated.family}\t${generated.gloss}\t${generated.short}`;
    return `${w.key}\t${w.family}\t???`;
}

function commandParse(args) {
    const json = args[0] === "--json";
    const text = (json ? args.slice(1) : args).join(" ");
    if (text.length === 0) usage();
    let result;
    try {
        result = parser.parse(text);
    } catch (e) {
        if (!(e instanceof Error)) throw e;
        console.error(`error: ${e.message}`);
        process.exit(1);
    }
    if (json) {
        console.log(JSON.stringify(result, null, 2));
        return;
    }
    const dictionary = loadDictionary();
    console.log(shapeText(result, dictionary));
    for (const w of result.warnings ?? []) console.log(`warning: ${w.message.split("\n")[0]}`);
    const words = [];
    collectWords(result.paragraphs ?? [], words);
    const seen = new Set();
    for (const w of words) {
        if (seen.has(w.key)) continue;
        seen.add(w.key);
        console.log(gloss(dictionary, w));
    }
}

function commandWord(args) {
    const word = args.join(" ");
    if (word.length === 0) usage();
    let result;
    try {
        result = parser.parse(`a ${word}`);
    } catch (e) {
        if (!(e instanceof Error)) throw e;
        console.log(`invalid: ${e.message.split("\n")[0]}`);
        process.exit(1);
    }
    const words = [];
    collectWords(result.paragraphs ?? [], words);
    const parts = words.filter(w => w.key !== "a" || w.family !== "A");
    console.log(`segments: ${parts.map(w => `${w.key} (${w.family})`).join(" ")}`);
    for (const w of result.warnings ?? []) console.log(`warning: ${w.message.split("\n")[0]}`);
}

const [command, ...rest] = process.argv.slice(2);
if (command === "parse") commandParse(rest);
else if (command === "word") commandWord(rest);
else usage();
