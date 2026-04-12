// Dynamic gloss/short generation for infinite particle families (SI, VI, FI, VEI, TI)

const SYM_SHARING = "\u00b7";  // ·
const SYM_EQUIV   = "\u2261";  // ≡

const PLACE_MAP = { e: "E", a: "A", o: "O", u: "U" };
const VOWELS_ORDER = ["i", "e", "a", "o", "u"];

// ============================================================
// Public API
// ============================================================

export function generateParticleInfo(word) {
    if (!word || word.length < 2) return null;
    let prefix = word[0];
    let rest = word.slice(1);
    // Strip h separators for analysis
    let vowels = rest.replace(/h/g, "");
    if (!/^[ieaou]+$/.test(vowels)) return null;

    if (prefix === "v") {
        if (word === "vei") return { family: "VEI", gloss: "]", short: "Ends explicit binding clause." };
        return generateVI(vowels);
    }
    if (prefix === "f") return generateFI(vowels);
    if (prefix === "s") return generateSI(vowels);
    if (prefix === "t") return generateTI(vowels);
    return null;
}

// ============================================================
// VI — explicit bind open
// ============================================================

function generateVI(vowels) {
    // Special: i alone = unrelated, oi = adverb, ioi = adverb equiv
    if (vowels === "i")   return { family: "VI", gloss: "&[", short: "State the following 0-ary predicate chain, unrelated to any place." };
    if (vowels === "oi")  return { family: "VI", gloss: `adv${SYM_SHARING}[`, short: "Starts adverbial/sharing-bound prepositional clause." };
    if (vowels === "ioi") return { family: "VI", gloss: `adv${SYM_EQUIV}[`, short: "Starts adverbial/equivalence-bound prepositional clause." };

    let places = parseBindPlaces(vowels);
    if (places.length === 0) return null;

    let gloss = places.map(fmtPlace).join("") + "[";
    let short = bindShort("Bind to", places);
    return { family: "VI", gloss, short };
}

// ============================================================
// FI — explicit bind continue
// ============================================================

function generateFI(vowels) {
    if (vowels === "i")   return { family: "FI", gloss: `]&[`, short: "State the following predicate chain, unrelated to any place." };
    if (vowels === "oi")  return { family: "FI", gloss: `]adv${SYM_SHARING}[`, short: "Starts adverbial/sharing-bound prepositional clause." };
    if (vowels === "ioi") return { family: "FI", gloss: `]adv${SYM_EQUIV}[`, short: "Starts adverbial/equivalence-bound prepositional clause." };
    if (vowels === "eu")  return { family: "FI", gloss: `]same${SYM_SHARING}[`, short: "Continue binding to same place (sharing)." };
    if (vowels === "au")  return { family: "FI", gloss: `]next${SYM_SHARING}[`, short: "Continue binding to next place (sharing)." };
    if (vowels === "ei")  return { family: "FI", gloss: `]same${SYM_EQUIV}[`, short: "Continue binding to same place (equivalence)." };
    if (vowels === "ai")  return { family: "FI", gloss: `]next${SYM_EQUIV}[`, short: "Continue binding to next place (equivalence)." };

    let places = parseBindPlaces(vowels);
    if (places.length === 0) return null;

    let gloss = "]" + places.map(fmtPlace).join("") + "[";
    let short = bindShort("Continue binding to", places);
    return { family: "FI", gloss, short };
}

// ============================================================
// SI — slot info
// ============================================================

function generateSI(vowels) {
    // si alone = transparent, chain to transitivity place
    if (vowels === "i") return { family: "SI", gloss: "I>>", short: "Expose no places and chain to the transitivity place." };

    // si + single vowel = transparent (sie, sia, sio, siu)
    let transparent = false;
    let chars = vowels;
    if (chars[0] === "i" && chars.length === 2 && chars[1] in PLACE_MAP) {
        transparent = true;
        chars = chars.slice(1);
    }

    let places = [];
    let equiv = false;
    let hOverride = null;
    let hFlag = false;

    for (let c of chars) {
        if (c === "h") { hFlag = true; continue; }
        if (c in PLACE_MAP) {
            places.push(PLACE_MAP[c]);
            if (hFlag) { hOverride = PLACE_MAP[c]; hFlag = false; }
        } else if (c === "i") {
            equiv = true;
        }
    }

    if (places.length === 0) return null;

    let chainPlace = hOverride || places[places.length - 1];
    let mode = equiv ? SYM_EQUIV : SYM_SHARING;

    // Gloss: <places> with mode on chain place; ~ prefix for transparent
    let gloss = "<";
    if (transparent) gloss += "~";
    for (let p of places) {
        gloss += p;
        if (p === chainPlace) gloss += mode;
    }
    gloss += ">";

    // Short
    let exposeDesc = transparent
        ? `Transparent (re-exposes places of chained predicate)`
        : `Expose ${places.join(", ")}`;
    let chainDesc = `chain to ${chainPlace} (${equiv ? "equivalence" : "sharing"})`;
    let short = `${exposeDesc}. ${chainDesc[0].toUpperCase() + chainDesc.slice(1)}.`;

    return { family: "SI", gloss, short };
}

// ============================================================
// TI — digits
// ============================================================

/** Compute digit value from a TI vowel sequence (e.g. "ie" → 5, "ao" → 15).
 *  Vowels are enumerated with no consecutive repeats: 5 × 4^(n-1) per length.
 *  Returns -1 for invalid sequences. */
export function tiDigitValue(vowels) {
    let n = vowels.length;
    if (n === 0) return -1;

    for (let k = 1; k < n; k++) {
        if (vowels[k] === vowels[k - 1]) return -1;
    }

    let offset = 0;
    let levelSize = 5;
    for (let k = 1; k < n; k++) { offset += levelSize; levelSize *= 4; }

    let pos = 0;
    let factor = levelSize / 5;
    let prev = -1;

    for (let k = 0; k < n; k++) {
        let vi = VOWELS_ORDER.indexOf(vowels[k]);
        if (vi < 0) return -1;
        let idx = (k === 0) ? vi : (vi > prev ? vi - 1 : vi);
        pos += idx * factor;
        prev = vi;
        factor = Math.floor(factor / 4);
    }

    return offset + pos;
}

function generateTI(vowels) {
    let digit = tiDigitValue(vowels);
    if (digit < 0) return null;

    let gloss = digit <= 15 ? digit.toString(16).toUpperCase() : String(digit);
    let short = `Digit ${digit}`;
    return { family: "TI", gloss, short };
}

// ============================================================
// Helpers
// ============================================================

export function parseBindPlaces(vowels) {
    let places = [];
    for (let ch of vowels) {
        if (ch in PLACE_MAP) {
            places.push({ place: PLACE_MAP[ch], equiv: false });
        } else if (ch === "i" && places.length > 0) {
            places[places.length - 1].equiv = true;
        }
    }
    return places;
}

function fmtPlace(p) {
    return p.place + (p.equiv ? SYM_EQUIV : SYM_SHARING);
}

function bindShort(prefix, places) {
    let descs = places.map(p => `place ${p.place} (${p.equiv ? "equivalence" : "sharing"})`);
    if (places.length === 1) return `${prefix} ${descs[0]}.`;
    let parts = descs.slice(0, -1).map(d => d + " (1 unit)");
    parts.push(descs[descs.length - 1] + " (remaining chain)");
    return `${prefix} ${parts.join(", then ")}.`;
}
