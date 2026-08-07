// Build the canonical dictionary lookup key for a Compound parse node.
//
// Nested fixed-arity compounds (2-compound "e", 3-compound "en") whose first word is itself
// a fixed-arity compound collapse their prefixes into a single letter chain. Each appended
// unit is a vowel plus the inner's arity marker ("" for 2-compound, "n" for 3-compound).
// The vowel is 'i' only when the previous emitted letter is 'e' (avoids an 'ee' collision);
// otherwise it stays 'e'. Examples:
//   e ber ban            -> "e ber ban"
//   e (e ber ban) ban    -> "ei ber ban ban"
//   e (e (e A B) C) D    -> "eie A B C D"
//   e (en A B C) D       -> "ein A B C D"      (previous 'e' -> vowel flips to 'i')
//   en (e A B) C D       -> "ene A B C D"      (previous 'n' -> vowel stays 'e')
//   en (en A B C) D E    -> "enen A B C D E"
//   e A (e B C)          -> "e A e B C"        (inner not first, no collapse)
//   e A (e (e B C) D)    -> "e A ei B C D"     (only the sub-chain collapses)
//
// N-compounds ("er...e") do not participate in the collapse; their postfix makes the
// flattening ambiguous with sibling content, so they stay in the spaced form.
// Shorthand "i"-prefix variants (i / in / ir) recorded by the parser are normalized back
// to their e-form before assembling the key.
export function compoundDictKey(verb) {
    let normalizedPrefix = verb.prefix.startsWith("i") ? "e" + verb.prefix.slice(1) : verb.prefix;
    let postfix = verb.postfix ? " " + verb.postfix : "";

    let letters = normalizedPrefix;
    let content = verb.content;
    let outerIsFixed = normalizedPrefix === "e" || normalizedPrefix === "en";
    if (outerIsFixed) {
        while (content.length >= 1 && content[0].family === "Compound") {
            let inner = content[0];
            let innerNorm = inner.prefix.startsWith("i") ? "e" + inner.prefix.slice(1) : inner.prefix;
            if (innerNorm !== "e" && innerNorm !== "en") break;
            let lastChar = letters[letters.length - 1];
            let vowel = lastChar === "e" ? "i" : "e";
            let marker = innerNorm.slice(1);
            letters += vowel + marker;
            content = [...inner.content, ...content.slice(1)];
        }
    }

    let words = content.map(compoundWordKey).join(" ");
    return letters + " " + words + postfix;
}

function compoundWordKey(c) {
    if (c.family === "Compound") return compoundDictKey(c);
    if (c.family === "Borrowing") return "u" + c.content;
    if (c.family === "FFVariable") return "i" + c.content;
    return c.word;
}
