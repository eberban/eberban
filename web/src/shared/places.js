// Place rules: which places a verb exposes and through which place it chains.
//
// Pure functions over parse-tree nodes, usable from Node and the browser. The visual parser
// formats the results for display; the shape serializer and the CLI print them as ASCII.
//
// Result shape: { exposed, chain } where
//   exposed: "*" all places, "~" transparent SI, "" none, or the exposed vowels as "EA", "AEO", ...
//   chain:   null, or { place: "E" | "A" | "O" | "U", equiv: boolean }

export const VOWELS = "ieaou";
export const CONSONANTS = "npbfvtdszcjkglrm";

// ZI chaining overrides: null = keep the verb's own slots.
export const ZI_SLOTS = {
    za: { trans: false, equiv: false },
    zai: { trans: false, equiv: false },
    zu: { trans: true, equiv: false },
    zui: { trans: false, equiv: false },
    zue: null, ze: null,
    zoie: { trans: false, equiv: false },
    zoia: { trans: false, equiv: false },
    zoio: { trans: false, equiv: false },
    zoiu: { trans: false, equiv: false },
};

function chainOf(trans, equiv) {
    return { place: trans ? "A" : "E", equiv };
}

/** Slots of a chain step: its SI when present, otherwise the verb's own slots. */
export function stepSlots(step, dictionary) {
    if (step.select) return parseSISlots(step.select.word);
    return verbSlots(step.verb, dictionary);
}

/** Slots of a verb node. Checks ZI modifiers first (outermost decides), then transitivity. */
export function verbSlots(verb, dictionary) {
    if (!verb) return { exposed: "*", chain: chainOf(false, false) };

    if (verb.modifiers) {
        let mods = Array.isArray(verb.modifiers) ? verb.modifiers : [verb.modifiers];
        let outerZI = mods[0]?.modifier?.word;
        // The ZI's own SI overrides.
        if (mods[0]?.select) return parseSISlots(mods[0].select.word);
        if (outerZI && outerZI in ZI_SLOTS) {
            let override = ZI_SLOTS[outerZI];
            if (override !== null) return { exposed: "*", chain: chainOf(override.trans, override.equiv) };
        }
    }

    let { trans, equiv } = verbTransitivity(verb, dictionary);
    return { exposed: "*", chain: chainOf(trans, equiv) };
}

/** Transitivity + equivalence of a verb node.
 *  Roots: last char vowel = trans, CCV (3 chars) / -i = equiv. Compounds: last component.
 *  MI and numbers: dictionary entry. GI / BA / PE / KI: family-specific rules.
 *  Borrowings: same as roots. */
export function verbTransitivity(verb, dictionary) {
    if (!verb) return { trans: false, equiv: false };

    // Compound: last component decides, se / sa / sai override.
    if (verb.family === "Compound") {
        let last = verb.content[verb.content.length - 1];
        let lastWord = last?.word;
        if (lastWord === "se") return { trans: false, equiv: false };
        if (lastWord === "sa") return { trans: true, equiv: false };
        if (lastWord === "sai") return { trans: true, equiv: true };
        return verbTransitivity(last, dictionary);
    }

    // Root / Particle: from the word form.
    if (verb.family === "Root" || verb.family === "Particle") {
        return rootTransitivity(verb.word);
    }

    // MI: dictionary entry.
    if (verb.family === "MI") return entryTransitivity(dictionary?.[verb.word]);

    // Number: the JI terminator's dictionary entry (jie when elided).
    if (verb.kind === "Number") return entryTransitivity(dictionary?.[verb.value.end?.word ?? "jie"]);

    // GI: gi- intrans, others trans. -i after the first vowel = equiv.
    if (verb.family === "GI") {
        let w = verb.word;
        let intrans = w?.startsWith("gi") && (w.length === 2 || !VOWELS.includes(w[2]));
        let trans = !intrans;
        let equiv = trans && w?.endsWith("i");
        return { trans, equiv };
    }

    // BA: always sharing. With h: after h, i = trans, e = intrans. Without h: atom, intrans.
    if (verb.family === "BA") {
        let w = verb.word;
        let hIdx = w?.indexOf("h");
        if (hIdx >= 0 && hIdx + 1 < w.length) {
            return { trans: w[hIdx + 1] === "i", equiv: false };
        }
        return { trans: false, equiv: false };
    }

    // BorrowingGroup: last item, same rule as roots.
    if (verb.kind === "BorrowingGroup") {
        let last = verb.group[verb.group.length - 1];
        return rootTransitivity(last.word || last.content);
    }

    // PE: pe shares the places of its items, so it chains like its first item. The other
    // members build a set or a list, a 1-ary result.
    if (verb.start?.family === "PE") {
        if (verb.start.word !== "pe") return { trans: false, equiv: false };
        let first = verb.items[0]?.chain;
        if (!first) return { trans: false, equiv: false };
        let slots = stepSlots(first, dictionary);
        if (!slots.chain) return { trans: false, equiv: false };
        return { trans: slots.chain.place === "A", equiv: slots.chain.equiv };
    }

    // KI, quotes: intrans sharing.
    return { trans: false, equiv: false };
}

// Transitivity of a dictionary entry: the `transitive` field, and a predicate A place either
// declared with `sharing: false` or visible in the signature as "[A:(".
function entryTransitivity(entry) {
    if (!entry) return { trans: false, equiv: false };
    let trans = entry.transitive === true;
    let equiv = trans && (entry.sharing === false || /\[A:\(/.test(entry.short ?? ""));
    return { trans, equiv };
}

export function rootTransitivity(word) {
    if (!word) return { trans: false, equiv: false };
    let last = word[word.length - 1];
    let trans = VOWELS.includes(last);
    let equiv = false;
    if (trans) {
        // -i final = equiv.
        if (last === "i") equiv = true;
        // CCV with a single vowel (exactly 3 chars: CC+V) = equiv.
        else if (word.length === 3 && CONSONANTS.includes(word[0]) && CONSONANTS.includes(word[1])) {
            equiv = true;
        }
    }
    return { trans, equiv };
}

/** Parse an SI word: place vowels (e a o u), transparency (si + vowel), h-override of the chain
 *  place, final -i for equivalence. */
export function parseSISlots(word) {
    let chars = word.slice(1); // strip 's'

    // Transparent: si + vowel(s), the chain place comes from the remaining vowels.
    let transparent = false;
    if (chars[0] === "i" && chars.length > 1) {
        transparent = true;
        chars = chars.slice(1);
    }

    let places = [], hOverride = null, hFlag = false, equiv = false;

    for (let c of chars) {
        if (c === "h") {
            hFlag = true;
        } else if (VOWELS.includes(c) && c !== "i") {
            if (hFlag) {
                // h-prefixed vowel: chain target only, not exposed.
                hOverride = c.toUpperCase();
                hFlag = false;
            } else {
                places.push(c.toUpperCase());
            }
        } else if (c === "i") {
            equiv = true;
        }
    }

    if (places.length === 0 && !hOverride) return { exposed: transparent ? "~" : "", chain: null };

    let place = hOverride || places[places.length - 1];
    return {
        exposed: transparent ? "~" : places.join(""),
        chain: { place, equiv },
    };
}

/** ASCII rendering of a chain place: "-A" sharing, "=A" equivalence, "" none. */
export function chainAscii(chain) {
    if (!chain) return "";
    return (chain.equiv ? "=" : "-") + chain.place;
}
