// Parse corpus: every YAML file under corpus/ is a list of cases run against the PEG parser.
// See corpus/README.md for the case format.

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import * as parser from "./eberban.peggy.js";
import { shapeText } from "../shared/shape.js";

const here = dirname(fileURLToPath(import.meta.url));
const corpusDir = join(here, "corpus");
const dictionary = yaml.load(readFileSync(join(here, "..", "..", "..", "dictionary", "en.yaml"), "utf8"));
if (typeof dictionary !== "object" || dictionary === null) throw new Error(`dictionary: expected a map: ${JSON.stringify(dictionary)}`);

function loadCases(file) {
    const raw = yaml.load(readFileSync(join(corpusDir, file), "utf8"));
    if (!Array.isArray(raw)) throw new Error(`${file}: expected a list of cases, got ${JSON.stringify(raw)}`);
    return raw.map((c, i) => {
        if (typeof c !== "object" || c === null || typeof c.text !== "string") {
            throw new Error(`${file}[${i}]: case needs a string "text": ${JSON.stringify(c)}`);
        }
        return c;
    });
}

function errorMessage(text) {
    try {
        parser.parse(text);
    } catch (e) {
        if (e instanceof Error) return e.message;
        throw e;
    }
    return null;
}

for (const file of readdirSync(corpusDir).filter(f => f.endsWith(".yaml")).sort()) {
    describe(file, () => {
        for (const c of loadCases(file)) {
            // A case whose expectation is right per the sources but not yet met by the code or
            // the grammar. Kept visible as todo until the underlying decision is made.
            if (c.todo !== undefined) {
                it.todo(`${c.text} (${c.todo})`);
                continue;
            }
            it(c.text, () => {
                if (c.error !== undefined) {
                    const message = errorMessage(c.text);
                    expect(message, "expected a parse error").not.toBeNull();
                    expect(message).toContain(c.error);
                    return;
                }
                const result = parser.parse(c.text);
                if (c.shape !== undefined) expect(shapeText(result, dictionary)).toBe(c.shape);
                if (c.warning !== undefined) {
                    const messages = (result.warnings ?? []).map(w => w.message);
                    expect(messages.some(m => m.includes(c.warning)), `warning containing "${c.warning}" in ${JSON.stringify(messages)}`).toBe(true);
                }
                if (c.no_warning === true) expect(result.warnings).toBeUndefined();
                if (c.snapshot === true) {
                    const name = c.text.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
                    expect(JSON.stringify(result, null, 1)).toMatchFileSnapshot(join(corpusDir, "__snapshots__", `${file.replace(".yaml", "")}.${name}.json`));
                }
            });
        }
    });
}
