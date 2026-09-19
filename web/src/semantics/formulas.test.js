// Formula cases: every YAML file under formulas/ is a list of cases lowered and printed.
// See README.md for the case format.

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import * as parser from "../grammar/eberban.peggy.js";
import { loadDictionary } from "../grammar/dictionary-file.js";
import { lowerText } from "./lower.ts";
import { printProgram } from "./print.ts";

const here = dirname(fileURLToPath(import.meta.url));
const casesDir = join(here, "formulas");
const dictionary = loadDictionary();

function loadCases(file) {
    const raw = yaml.load(readFileSync(join(casesDir, file), "utf8"));
    if (!Array.isArray(raw)) throw new Error(`${file}: expected a list of cases, got ${JSON.stringify(raw)}`);
    return raw.map((c, i) => {
        if (typeof c !== "object" || c === null || typeof c.text !== "string") {
            throw new Error(`${file}[${i}]: case needs a string "text": ${JSON.stringify(c)}`);
        }
        return c;
    });
}

for (const file of readdirSync(casesDir).filter(f => f.endsWith(".yaml")).sort()) {
    describe(file, () => {
        for (const c of loadCases(file)) {
            if (c.todo !== undefined) {
                it.todo(`${c.text} (${c.todo})`);
                continue;
            }
            it(c.text, () => {
                const program = lowerText(parser.parse(c.text), dictionary, { allDefaults: c.all_defaults === true });
                if (c.formula !== undefined) expect(printProgram(program)).toBe(c.formula.trimEnd());
                if (c.unsupported !== undefined) {
                    expect(program.unsupported.some(r => r.includes(c.unsupported)), `unsupported containing "${c.unsupported}" in ${JSON.stringify(program.unsupported)}`).toBe(true);
                } else {
                    expect(program.unsupported).toEqual([]);
                }
            });
        }
    });
}
