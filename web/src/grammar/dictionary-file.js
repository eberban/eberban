// Load dictionary/en.yaml from the repository. Node only (tests and CLI).

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export const dictionaryPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "dictionary", "en.yaml");

export function loadDictionary() {
    const raw = yaml.load(readFileSync(dictionaryPath, "utf8"));
    if (typeof raw !== "object" || raw === null) throw new Error(`dictionary: expected a map: ${JSON.stringify(raw)}`);
    return raw;
}
