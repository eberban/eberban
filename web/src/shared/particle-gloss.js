// Dynamic gloss/short generation for infinite particle families (SI, VI, FI, VEI, TI)

const SYM_SHARING  = "\u00b7";  // ·
const SYM_EQUIV    = "\u2261";  // ≡
const SYM_MULTIPLY = "\u00d7";  // ×
const SYM_OVERLINE = "\u0305";  // combining overline
const SUPERSCRIPT  = { '0':'\u2070','1':'\u00b9','2':'\u00b2','3':'\u00b3','4':'\u2074',
                       '5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079','-':'\u207b' };

const PLACE_MAP = { e: "E", a: "A", o: "O", u: "U" };
const VOWELS_ORDER = ["i", "e", "a", "o", "u"];

// ============================================================
// Public API
// ============================================================

export function generateParticleInfo(word) {
    if (!word || word.length < 2) return null;
    let prefix = word[0];
    let rest = word.slice(1);
    // Validate: only vowels and h separators after the prefix consonant
    if (!/^[ieaouh]+$/.test(rest) || !/[ieaou]/.test(rest)) return null;

    // SI uses h for chain override. FI uses h for relative-place forms. VI/TI reject h.
    if (prefix === "v") {
        if (word === "vei") return { family: "VEI", gloss: "]", short: "Ends explicit binding clause." };
        if (rest.includes("h")) return null;
        return generateVI(rest);
    }
    if (prefix === "f") return generateFI(rest);
    if (prefix === "s") return generateSI(rest);
    if (prefix === "t") { if (rest.includes("h")) return null; return generateTI(rest); }
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

// FI accepts h for relative-place forms (XhY pattern: direction + h + mode).
// Also supports multi-vowel (same as VI: each non-final vowel consumes 1 pred).
function generateFI(rest) {
    // Strip h for special-case and multi-vowel checks
    let vowels = rest.replace(/h/g, "");

    if (vowels === "i")   return { family: "FI", gloss: `]&[`, short: "State the following predicate chain, unrelated to any place." };
    if (vowels === "oi")  return { family: "FI", gloss: `]adv${SYM_SHARING}[`, short: "Starts adverbial/sharing-bound prepositional clause." };
    if (vowels === "ioi") return { family: "FI", gloss: `]adv${SYM_EQUIV}[`, short: "Starts adverbial/equivalence-bound prepositional clause." };

    // Relative-place forms: XhY where X=direction (e=same, a=next), Y=mode (u=sharing, i=equiv)
    if (rest === "ehu")  return { family: "FI", gloss: `]same${SYM_SHARING}[`, short: "Continue binding to same place (sharing)." };
    if (rest === "ahu")  return { family: "FI", gloss: `]next${SYM_SHARING}[`, short: "Continue binding to next place (sharing)." };
    if (rest === "ehi")  return { family: "FI", gloss: `]same${SYM_EQUIV}[`, short: "Continue binding to same place (equivalence)." };
    if (rest === "ahi")  return { family: "FI", gloss: `]next${SYM_EQUIV}[`, short: "Continue binding to next place (equivalence)." };

    // Reject any other h usage
    if (rest.includes("h")) return null;

    // Multi-vowel FI: same as VI (each non-final vowel consumes 1 pred, final gets rest)
    let places = parseBindPlaces(vowels);
    if (places.length === 0) return null;

    let gloss = "]" + places.map(fmtPlace).join("") + "[";
    let short = bindShort("Continue binding to", places);
    return { family: "FI", gloss, short };
}

// ============================================================
// SI — slot info
// ============================================================

// SI vowels: e→E, a→A, o→O, u→U select places to expose.
// h before a vowel makes it the chain target WITHOUT exposing it.
// Without h, the last exposed vowel is also the chain place.
// "i" at the END is an equivalence modifier (sharing → equivalence).
// "i" in other positions is invalid (except siV transparent pattern).
// "si" alone is transparent; "si"+single vowel is transparent + chain target.
// Gloss format: <exposed, chain_mode> e.g. <E, E·>, <EA, A·>, <E, A≡>
function generateSI(vowels) {
    if (vowels === "i") return { family: "SI", gloss: ">>", short: "Expose no places and chain to the transitivity place." };

    // Transparent: only "si" + exactly one place vowel (sie, sia, sio, siu).
    let transparent = false;
    let chars = vowels;
    if (chars[0] === "i" && chars.length === 2 && chars[1] in PLACE_MAP) {
        transparent = true;
        chars = chars.slice(1);
    }

    // "i" for equivalence is only valid at the very end of the vowel sequence.
    let equiv = chars.endsWith("i");
    if (equiv) chars = chars.slice(0, -1);
    if (chars.includes("i")) return null;

    // Per refgram: at most one h (separating exposed vowels from chain-override vowel)
    let hCount = (chars.match(/h/g) || []).length;
    if (hCount > 1) return null;

    // Parse vowels: non-h-prefixed → exposed places, h-prefixed → chain override only
    let exposed = [];
    let hOverride = null;
    let hFlag = false;

    for (let c of chars) {
        if (c === "h") { hFlag = true; continue; }
        if (c in PLACE_MAP) {
            if (hFlag) {
                // h-prefixed vowel: chain target only, NOT exposed
                hOverride = PLACE_MAP[c];
                hFlag = false;
            } else {
                exposed.push(PLACE_MAP[c]);
            }
        }
    }

    if (exposed.length === 0 && !hOverride) return null;

    // Chain place: h-overridden vowel, or last exposed vowel by default
    let chainPlace = hOverride || exposed[exposed.length - 1];
    let mode = equiv ? SYM_EQUIV : SYM_SHARING;

    // Gloss: <exposed, chain+mode>; ~ prefix for transparent
    let gloss = "<";
    if (transparent) gloss += "~";
    if (exposed.length > 0) gloss += exposed.join("");
    gloss += ", " + chainPlace + mode;
    gloss += ">";

    let exposeDesc = transparent
        ? `Transparent (re-exposes places of chained predicate)`
        : exposed.length > 0 ? `Expose ${exposed.join(", ")}` : "Expose no places";
    let chainDesc = `chain to ${chainPlace} (${equiv ? "equivalence" : "sharing"})`;
    let short = `${exposeDesc}. ${chainDesc[0].toUpperCase() + chainDesc.slice(1)}.`;

    return { family: "SI", gloss, short };
}

// ============================================================
// TI — digits
// ============================================================

/** Compute digit value from a TI vowel sequence (e.g. "ie" → 5, "ao" → 15).
 *
 *  Eberban digits enumerate all vowel sequences where no two consecutive
 *  vowels are the same (identical vowels merge phonologically).
 *
 *  Level sizes: length 1 = 5 (any vowel), length n = 5 × 4^(n-1)
 *  (first vowel: 5 choices, each subsequent: 4 choices ≠ previous).
 *
 *  Digit value = offset (total sequences shorter than n) + position within level.
 *  Example: "ao" → offset=5 (skip 5 single-vowel entries) + pos=15-5=10 → 15.
 *
 *  Returns -1 for invalid sequences. */
export function tiDigitValue(vowels) {
    let n = vowels.length;
    if (n === 0) return -1;

    // Reject consecutive same vowels (phonologically collapsed in Eberban)
    for (let k = 1; k < n; k++) {
        if (vowels[k] === vowels[k - 1]) return -1;
    }

    // Offset: sum of all shorter levels. Each level k has 5 × 4^(k-1) entries.
    // levelSize tracks the current level's count for later position computation.
    let offset = 0;
    let levelSize = 5;
    for (let k = 1; k < n; k++) { offset += levelSize; levelSize *= 4; }

    // Position within this level using mixed-radix encoding:
    // - First vowel: 5 choices (index 0-4), place value = levelSize / 5
    // - Each subsequent vowel: 4 choices (excluding previous vowel),
    //   adjusted index = vowel_index - 1 if after the skipped previous
    let pos = 0;
    let factor = levelSize / 5; // place value for first vowel position
    let prev = -1;

    for (let k = 0; k < n; k++) {
        let vi = VOWELS_ORDER.indexOf(vowels[k]);
        if (vi < 0) return -1;
        // For k>0: map 5-choice index to 4-choice index by skipping prev
        let idx = (k === 0) ? vi : (vi > prev ? vi - 1 : vi);
        pos += idx * factor;
        prev = vi;
        factor = Math.floor(factor / 4); // next position has 4× fewer entries
    }

    return offset + pos;
}

function generateTI(rest) {
    // TI doesn't use h — consecutive same vowels are invalid anyway
    let digit = tiDigitValue(rest);
    if (digit < 0) return null;

    let gloss = digit <= 15 ? digit.toString(16).toUpperCase() : String(digit);
    let short = `Digit ${digit}`;
    return { family: "TI", gloss, short };
}

// ============================================================
// Helpers
// ============================================================

// For VI/FI, "i" appears BEFORE the place vowel it modifies:
// "ia" → A with equiv, "aio" → A sharing + O equiv.
export function parseBindPlaces(vowels) {
    let places = [];
    let nextEquiv = false;
    for (let ch of vowels) {
        if (ch in PLACE_MAP) {
            places.push({ place: PLACE_MAP[ch], equiv: nextEquiv });
            nextEquiv = false;
        } else if (ch === "i") {
            nextEquiv = true;
        }
    }
    return places;
}

// ============================================================
// Number display computation
// ============================================================

function asArray(val) { return Array.isArray(val) ? val : [val]; }

/** Get numeric value of a TI digit node ({ word: "ta" } or { symbol: "5" }). */
export function digitValue(d) {
    if (d.symbol) return parseInt(d.symbol, 16) || 0;
    if (d.word) { let v = tiDigitValue(d.word.slice(1).replace(/h/g, "")); return v >= 0 ? v : 0; }
    return 0;
}

function toSuperscript(s) {
    return String(s).split("").map(c => SUPERSCRIPT[c] || c).join("");
}

function rawDigits(digits) {
    return asArray(digits).map(d => {
        let v = digitValue(d);
        return v < 10 ? v.toString() : String.fromCharCode(55 + v);
    }).join("");
}

/** Interpret a digit array as a positional number: d[0]×base^(n-1) + ... + d[n-1]×base^0. */
function digitsToValue(digits, base) {
    let val = 0;
    for (let d of asArray(digits)) val = val * base + digitValue(d);
    return val;
}

/** Expand a digit array into a human-readable breakdown string.
 *  E.g. [4,2] in base 10 → { val: 42, breakdown: "4×10¹ + 2×10⁰ = 42" }.
 *  Zero digits are skipped unless the number is a single zero. */
function digitsBreakdown(digits, base) {
    let arr = asArray(digits);
    let n = arr.length;
    let val = 0;
    let parts = [];
    for (let i = 0; i < n; i++) {
        let d = digitValue(arr[i]);
        let exp = n - 1 - i;
        val += d * Math.pow(base, exp);
        if (d !== 0 || n === 1) parts.push(`${d}${SYM_MULTIPLY}${base}${toSuperscript(String(exp))}`);
    }
    return { val, breakdown: parts.length > 0 ? parts.join(" + ") + ` = ${val}` : "" };
}

/** Compute display string and tooltip for a Number AST value node.
 *
 *  Eberban number syntax: [base JU] [int] [JO fract] [JA repeat] [JE magn] [JI]
 *  - base: TI digit(s) specifying highest digit; actual base = digit_value + 1
 *  - int: sequence of TI digits for the integer part
 *  - fract: fractional digits after JO (JOI = negative); each digit × base^(-pos)
 *  - repeat: repeating decimal digits after JA
 *  - magn: exponent digits after JE (JEI = negative); result × base^magn
 *  - JI: usage suffix (cardinal, ordinal, number value, etc.)
 *
 *  Returns { display, tooltip } where display is the gloss and tooltip is
 *  a multiline breakdown of the calculation. */
export function computeNumberInfo(value) {
    // Resolve base: TI digit represents highest digit, so base = value + 1.
    // Default base is 10 (tei = digit 9, 9+1 = 10).
    let base = 10;
    let baseExplicit = false;
    if (value.base) {
        let baseDigits = asArray(value.base.value);
        base = digitsToValue(baseDigits, 10) + 1;
        baseExplicit = true;
    }

    let tooltipLines = [];
    if (!baseExplicit) tooltipLines.push(`Assuming default base 10 (tei ju).`);
    else tooltipLines.push(`Base: ${base}`);

    // Integer part: sum of digit[i] × base^(n-1-i)
    let intValue = 0;
    if (value.int && value.int.length > 0) {
        let { val, breakdown } = digitsBreakdown(value.int, base);
        intValue = val;
        if (breakdown) tooltipLines.push(`Integer: ${breakdown}`);
    }

    // Fractional part: sum of digit[i] × base^(-(i+1))
    // JO separator; JOI (contains "i") makes the number negative
    let fracValue = 0;
    let negFrac = value.fract?.sep?.word?.includes("i");
    if (value.fract?.value?.length > 0) {
        let digits = value.fract.value;
        let parts = [];
        for (let i = 0; i < digits.length; i++) {
            let d = digitValue(digits[i]);
            fracValue += d / Math.pow(base, i + 1);
            if (d !== 0 || digits.length === 1) parts.push(`${d}${SYM_MULTIPLY}${base}${toSuperscript("-" + (i + 1))}`);
        }
        let label = negFrac ? "Fractional (negative)" : "Fractional";
        if (parts.length > 0) {
            let fracFormatted = fracValue.toPrecision(10).replace(/0+$/, "").replace(/\.$/, "").replace(/^0/, "");
            tooltipLines.push(`${label}: ${parts.join(" + ")} = ${fracFormatted}`);
        }
    }
    if (negFrac) fracValue = -fracValue;

    // Repeated part: digits that repeat infinitely (approximate for display)
    let repeatStr = "";
    if (value.repeat?.value?.length > 0) {
        let rDigits = value.repeat.value.map(d => digitValue(d));
        repeatStr = "(" + rDigits.join("") + ")" + SYM_OVERLINE;
        tooltipLines.push(`Repeating: ${repeatStr}`);
    }

    // Magnitude: result × base^magn. JE separator; JEI = negative exponent
    let magValue = 0;
    let negMag = value.magn?.sep?.word?.includes("i");
    if (value.magn?.value?.length > 0) {
        magValue = digitsToValue(value.magn.value, base);
        if (negMag) magValue = -magValue;
        tooltipLines.push(`Magnitude: ${SYM_MULTIPLY}${base}${toSuperscript(String(magValue))}`);
    }

    // JI suffix: determines how the number is used (cardinal, ordinal, etc.)
    let jiSuffix = "";
    if (value.end) {
        let jiMap = {
            ji: "cardinal set", jia: "cardinal set (raw)", jiu: "ordinal",
            jio: "unique cardinal set", jioa: "unique cardinal set (raw)",
            jie: "number value"
        };
        jiSuffix = jiMap[value.end.word] || "";
        if (jiSuffix) tooltipLines.push(`Usage: ${jiSuffix}`);
    }

    // Compute total decimal value
    let total = intValue + fracValue;
    if (value.magn) total *= Math.pow(base, magValue);
    // Per refgram: if only magnitude is present, integer part defaults to 1
    if (!value.int && value.magn) total = Math.pow(base, magValue);

    let display = "";
    let needsExplicitResult = baseExplicit || !!value.magn;

    if (baseExplicit) display += `(base ${base}) `;
    if (needsExplicitResult) {
        if (value.int) display += rawDigits(value.int);
        else if (!value.magn) display += "0";
        if (value.fract) display += "." + rawDigits(value.fract.value);
        if (repeatStr) display += repeatStr;
        if (value.magn) {
            if (!value.int && !value.fract) display += "1";
            display += ` ${SYM_MULTIPLY} ${base}${toSuperscript(String(magValue))}`;
        }
        if (Number.isFinite(total) && !repeatStr) {
            let formatted = Number.isInteger(total) ? total.toString() : total.toPrecision(10).replace(/\.?0+$/, "");
            display += ` = ${formatted}`;
        }
    } else {
        // Default base, no magnitude: just show the computed value directly
        if (Number.isFinite(total) && !repeatStr) {
            let formatted = Number.isInteger(total) ? total.toString() : total.toPrecision(10).replace(/\.?0+$/, "");
            display += formatted;
        } else {
            if (value.int) display += rawDigits(value.int);
            else display += "0";
            if (value.fract) display += "." + rawDigits(value.fract.value);
            if (repeatStr) display += repeatStr;
        }
    }
    if (jiSuffix) display += ` (${jiSuffix})`;

    return { display, tooltip: tooltipLines.join("\n") };
}

// ============================================================
// Gloss helpers
// ============================================================

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
