// Dictionary lint: consistency rules over dictionary/en.yaml, checked with the parser.
//
// Pure functions over the loaded dictionary object and the parser module. Each rule returns
// findings { rule, key, message }; lintDictionary runs them all.

import { rootTransitivity, verbTransitivity } from "./places.js";
import { compoundDictKey, prefixedWordKey } from "../visual-parser/compound-key.js";
import { generateParticleInfo } from "./particle-gloss.js";

// Particle families whose members are generated from their form rather than listed.
const OPEN_FAMILIES = new Set(["GI", "KI", "TI", "SI", "VI", "FI"]);

const PLACES = "EAOU";

// A predicate place is written in parentheses, or as a generic type letter carrying the
// parentheses on its first mention (`p(...)`); later places typed with the bare letter share
// that predicate signature. A bare letter never introduced that way is a generic non-predicate
// type.
function isPredicateType(type, predicateLetters) {
    if (type.startsWith("(")) return true;
    const letter = /^([a-z])\(/.exec(type);
    if (letter) return true;
    return /^[a-z]$/.test(type) && predicateLetters.has(type);
}

/** Places of a `short` signature, in order of first mention.
 *  Returns { places: [{ place, type, predicate }], errors: [string] }. A bare `[E]` after a typed
 *  `[E:...]` is a reference and is not repeated in `places`. */
export function parseSignature(short) {
    const text = String(short ?? "").replace(/\s+/g, " ");
    const places = [];
    const errors = [];
    const seen = new Map();
    // Letters whose first mention as a place type is `l(...)`; a bare mention before it is an error.
    const predicateLetters = new Set();
    const bareLetters = new Set();
    for (const m of text.matchAll(/\[[EAOU]:([^\]]*)\]/g)) {
        const t = m[1].trim();
        const withArgs = /^([a-z])\(/.exec(t);
        if (withArgs) {
            if (bareLetters.has(withArgs[1])) errors.push(`type ${withArgs[1]}(...) must carry its parentheses on its first mention`);
            predicateLetters.add(withArgs[1]);
        } else if (/^[a-z]$/.test(t)) {
            bareLetters.add(t);
        }
    }
    for (const m of text.matchAll(/\[([^\]]*)\]/g)) {
        const body = m[1];
        const sig = /^([EAOU])(?::(.*))?$/.exec(body);
        if (!sig) {
            // [FAMILY] references and prose brackets are not places.
            if (/^[A-Z]+$/.test(body) || /^[a-z]/.test(body)) continue;
            errors.push(`bracket "[${body}]" is not a place`);
            continue;
        }
        const place = sig[1];
        const type = sig[2];
        const known = seen.get(place);
        if (known === undefined) {
            if (type === undefined) errors.push(`[${place}] is used before being typed`);
            const t = (type ?? "").trim();
            const entry = { place, type: t, predicate: isPredicateType(t, predicateLetters), typed: type !== undefined };
            seen.set(place, entry);
            places.push(entry);
        } else if (type !== undefined) {
            if (known.typed) errors.push(`[${place}] is typed twice`);
            known.type = type.trim();
            known.predicate = isPredicateType(known.type, predicateLetters);
            known.typed = true;
        }
    }
    // Places are E A O U without gaps. A predicate first place may be written as A instead of E
    // so that the word chains through it.
    const set = PLACES.split("").filter(p => seen.has(p)).join("");
    const startsAtA = set.startsWith("A") && seen.get("A").predicate && PLACES.slice(1).startsWith(set);
    if (set.length > 0 && !PLACES.startsWith(set) && !startsAtA) errors.push(`places ${set} are not a prefix of ${PLACES}`);
    return { places: places.map(({ place, type, predicate }) => ({ place, type, predicate })), errors };
}

function isEntry(key, entry) {
    return !String(key).startsWith("_") && typeof entry === "object" && entry !== null;
}

function entries(dictionary) {
    return Object.entries(dictionary).filter(([key, entry]) => isEntry(key, entry)).map(([key, entry]) => [String(key), entry]);
}

/** Parse `a <text>` and return the single verb of the single sentence, or null. */
function singleVerb(parser, text) {
    let result;
    try {
        result = parser.parse(`a ${text}`);
    } catch {
        return null;
    }
    const sentences = result.paragraphs?.[0]?.sentences ?? [];
    if (result.paragraphs?.length !== 1 || sentences.length !== 1) return null;
    const sentence = sentences[0];
    if (sentence.kind !== "A Sentence") return null;
    const definition = sentence.definition;
    if (definition.next !== undefined || definition.args !== undefined || definition.erased !== undefined) return null;
    if (definition.explicit_binds !== undefined || definition.select !== undefined) return null;
    return definition.verb;
}

function verbKey(verb) {
    if (verb.family === "Compound") return compoundDictKey(verb);
    if (verb.kind === "BorrowingGroup") return prefixedWordKey("u", verb.group[0].content);
    if (verb.family === "FFVariable") return prefixedWordKey("i", verb.content);
    return verb.word;
}

/** Whether a word (dictionary key, generated particle, attached compound, borrowing) exists. */
export function wordExists(dictionary, parser, word) {
    if (word in dictionary) return true;
    if (generateParticleInfo(word)) return true;
    const verb = singleVerb(parser, word);
    if (!verb) return false;
    if (verb.modifiers !== undefined || verb.post !== undefined) return false;
    if (verb.kind === "BorrowingGroup" || verb.family === "FFVariable") return true;
    if (OPEN_FAMILIES.has(verb.family)) return true;
    const key = verbKey(verb);
    return typeof key === "string" && (key in dictionary || generateParticleInfo(key) !== null);
}

function parseError(parser, text, options) {
    try {
        parser.parse(text, options);
        return null;
    } catch (e) {
        return e instanceof Error ? e.message.split("\n")[0] : String(e);
    }
}

// Rule: every key parses as a single word of the family the entry declares.
function ruleFamily(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        const family = entry.family;
        if (typeof family !== "string") {
            out.push({ rule: "family", key, message: "missing family" });
            continue;
        }
        if (family === "TI" && /^[0-9]$/.test(key)) continue;
        if (family === "R" || family === "C") {
            const verb = singleVerb(parser, key);
            const want = family === "R" ? "Root" : "Compound";
            if (!verb || verb.family !== want) {
                out.push({ rule: "family", key, message: `declared ${family}, parses as ${verb?.family ?? verb?.kind ?? "not a single verb"}` });
                continue;
            }
            if (family === "C" && compoundDictKey(verb) !== key) {
                out.push({ rule: "family", key, message: `compound key should be "${compoundDictKey(verb)}"` });
            }
            continue;
        }
        // Grammar rules are named after the family codes, except hesitation (rule "n").
        const startRule = family === "N" ? "n" : family;
        const error = parseError(parser, key, { startRule });
        if (error !== null) out.push({ rule: "family", key, message: `does not parse as ${family}: ${error}` });
    }
    return out;
}

// Rule: the family code is documented in the _family block.
function ruleFamilyCode(dictionary) {
    const codes = dictionary._family ?? {};
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (typeof entry.family === "string" && !(entry.family in codes)) {
            out.push({ rule: "family-code", key, message: `family "${entry.family}" is not in _family` });
        }
    }
    return out;
}

// Families whose `short` is the word's own place signature. Other particles describe the
// places of the words they modify.
const SIGNATURE_FAMILIES = new Set(["R", "C", "MI"]);

// Rule: signature syntax.
function ruleSignature(dictionary) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (!SIGNATURE_FAMILIES.has(entry.family)) continue;
        const { errors } = parseSignature(entry.short);
        for (const message of errors) out.push({ rule: "signature", key, message });
    }
    return out;
}

function placesOf(entry) {
    const { places } = parseSignature(entry.short);
    const byPlace = new Map(places.map(p => [p.place, p]));
    return byPlace;
}

// Rule: root form transitivity agrees with the signature.
function ruleTransitivity(dictionary) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (entry.family !== "R") continue;
        const places = placesOf(entry);
        const { trans } = rootTransitivity(key);
        if (trans && !places.has("A")) {
            out.push({ rule: "transitivity", key, message: "vowel-final root (transitive) without an A place" });
        }
        if (!trans && places.get("E")?.predicate) {
            out.push({ rule: "transitivity", key, message: "consonant-final root (intransitive) with a predicate E place" });
        }
    }
    return out;
}

// Rule: CCV / final -i iff the A place is a predicate place.
function ruleCcvI(dictionary) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (entry.family !== "R") continue;
        const places = placesOf(entry);
        const { trans, equiv } = rootTransitivity(key);
        if (!trans) continue;
        const predicateA = places.get("A")?.predicate === true;
        if (equiv && !predicateA) {
            out.push({ rule: "ccv-i", key, message: `form implies a predicate A place, signature has [A:${places.get("A")?.type ?? ""}]` });
        }
        if (!equiv && predicateA) {
            out.push({ rule: "ccv-i", key, message: "predicate A place, but the form is neither CCV nor -i final" });
        }
    }
    return out;
}

// Rule: gloss ends with ":" iff the chaining place is a predicate place.
function ruleGlossColon(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (entry.family !== "R" && entry.family !== "C" && entry.family !== "MI") continue;
        const verb = singleVerb(parser, key);
        if (!verb) continue;
        const { trans } = verbTransitivity(verb, dictionary);
        const places = placesOf(entry);
        const chainPlace = trans ? "A" : "E";
        const predicate = places.get(chainPlace)?.predicate === true;
        const colon = String(entry.gloss ?? "").endsWith(":");
        if (predicate && !colon) out.push({ rule: "gloss-colon", key, message: `chains to predicate place ${chainPlace}, gloss "${entry.gloss}" should end with ":"` });
        if (!predicate && colon) out.push({ rule: "gloss-colon", key, message: `chains to atom place ${chainPlace}, gloss "${entry.gloss}" should not end with ":"` });
    }
    return out;
}

// Rule: compound components exist.
function ruleComponents(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (entry.family !== "C") continue;
        const tokens = key.split(" ");
        const prefix = tokens[0];
        let components = tokens.slice(1);
        if (prefix.startsWith("er") && components[components.length - 1] === "e") components = components.slice(0, -1);
        for (const c of components) {
            if (c.startsWith("u") || c.startsWith("i")) continue;
            if (!wordExists(dictionary, parser, c)) out.push({ rule: "components", key, message: `component "${c}" is not in the dictionary` });
        }
    }
    return out;
}

// Rule: see_also targets exist.
function ruleSeeAlso(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        const targets = Array.isArray(entry.see_also) ? entry.see_also : [];
        for (const target of targets) {
            if (!wordExists(dictionary, parser, String(target))) out.push({ rule: "see-also", key, message: `see_also "${target}" is not in the dictionary` });
        }
    }
    return out;
}

// Rule: {...} in short and notes: a word reference exists, a longer example parses.
function ruleExample(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        const text = `${entry.short ?? ""}\n${entry.notes ?? ""}`;
        for (const m of text.matchAll(/\{([^}]+)\}/g)) {
            const example = m[1].trim();
            if (/[A-Z<>!/]/.test(example) || example.includes("...")) continue;
            if (!/\s/.test(example)) {
                if (!wordExists(dictionary, parser, example)) out.push({ rule: "example", key, message: `{${example}} is not in the dictionary` });
                continue;
            }
            const error = parseError(parser, example);
            if (error !== null) out.push({ rule: "example", key, message: `{${example}}: ${error}` });
        }
    }
    return out;
}

// Rule: Eberban definitions parse and define the entry.
function ruleDefinition(dictionary, parser) {
    const out = [];
    for (const [key, entry] of entries(dictionary)) {
        if (typeof entry.definition !== "string" || entry.definition.includes("𝜆")) continue;
        const text = entry.definition.replace(/\s+/g, " ").trim();
        let result;
        try {
            result = parser.parse(text);
        } catch (e) {
            out.push({ rule: "definition", key, message: e instanceof Error ? e.message.split("\n")[0] : String(e) });
            continue;
        }
        const defined = [];
        for (const paragraph of result.paragraphs ?? []) {
            for (const sentence of paragraph.sentences ?? []) {
                if (sentence.kind === "O Sentence") defined.push(verbKey(sentence.defined));
            }
        }
        if (!defined.includes(key)) out.push({ rule: "definition", key, message: `defines ${defined.length ? defined.join(", ") : "nothing"}, not ${key}` });
    }
    return out;
}

// Rule: every _spelling unit parses as one item of a spelling quote.
function ruleSpelling(dictionary, parser) {
    const out = [];
    const units = dictionary._spelling ?? {};
    for (const key of Object.keys(units)) {
        const unit = String(key);
        const error = parseError(parser, `ce ${unit} cei`);
        if (error !== null) {
            out.push({ rule: "spelling", key: unit, message: `does not parse as a spelling unit: ${error}` });
            continue;
        }
        const verb = singleVerb(parser, `ce ${unit} cei`);
        const items = verb?.kind === "Spelling Quote" ? verb.items : null;
        if (!items || items.length !== 1 || items[0] !== unit) {
            out.push({ rule: "spelling", key: unit, message: `spells as ${JSON.stringify(items)} instead of one unit` });
        }
        const targets = Array.isArray(units[key]?.see_also) ? units[key].see_also : [];
        for (const target of targets) {
            const t = String(target);
            if (!(t in units) && !wordExists(dictionary, parser, t)) out.push({ rule: "spelling", key: unit, message: `see_also "${t}" is neither a spelling unit nor a word` });
        }
    }
    return out;
}

export const RULES = {
    "spelling": ruleSpelling,
    "family": ruleFamily,
    "family-code": ruleFamilyCode,
    "signature": ruleSignature,
    "transitivity": ruleTransitivity,
    "ccv-i": ruleCcvI,
    "gloss-colon": ruleGlossColon,
    "components": ruleComponents,
    "see-also": ruleSeeAlso,
    "example": ruleExample,
    "definition": ruleDefinition,
};

/** All findings, in rule order then dictionary order. */
export function lintDictionary(dictionary, parser) {
    const out = [];
    for (const rule of Object.values(RULES)) out.push(...rule(dictionary, parser));
    return out;
}
