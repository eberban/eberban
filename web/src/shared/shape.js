// One-line structural rendering of a parse tree.
//
// Used by the parse corpus (web/src/grammar/corpus/) and the CLI. Only structure survives:
// grouping, chaining, binds, SI/ZI prefixes, enumerations, quotes, compounds. Elision and
// annotation details are dropped; full JSON snapshots cover those.
//
// When a dictionary is given, every chain step is annotated with its place information from
// places.js: "-A" chains through A by sharing, "=A" by equivalence, "(AE)" the places exposed by
// an SI, "(~)" a transparent SI.
//
// Notation (see web/src/grammar/corpus/README.md for the reference table):
//   a: mi-E > etiansa-A > meon-E           sentence starter, then chain steps joined by " > "
//   duna-A[ve: mo-E | fo: mi-E]            explicit binds on a verb, one "vX: chain" per bind
//   ke ka be: chain                        argument list
//   bi (chain)                             wide negation over a chain
//   zi verb, sa verb                       ZI modifiers and SI selection prefix the verb
//   e(tian sa), u(mia entropi), i(alis)    compound, borrowing group, freeform variable
//   pe(chain bu chain), pe bu(item item)   enumeration, separator and prefix modes
//   ci(mian) ce(m i a n) ca{...} co[...]   quotes
//   #(to jo te)                            number
//   ... ^pa verb[vo: mo]                   PA resume attached to the step whose verb follows

import { stepSlots, chainAscii } from "./places.js";
import { prefixedWordKey } from "../visual-parser/compound-key.js";

export function shapeText(text, dictionary) {
    return new Shaper(dictionary).text(text);
}

class Shaper {
    constructor(dictionary) {
        // undefined: no place annotations. Otherwise the dictionary used for MI and PE rules.
        this.dictionary = dictionary;
    }

    text(text) {
        if (text == null) return "?";
        let parts = [];
        if (text.flags?.length) parts.push(text.flags.map(w => w.word).join(" ") + ":");
        if (!text.paragraphs) return parts.concat(["<empty>"]).join(" ");
        parts.push(text.paragraphs.map(p => this.paragraph(p)).join(" || "));
        return parts.join(" ");
    }

    paragraph(p) {
        let sentences = p.sentences.map(s => this.sentence(s)).join(" | ");
        return p.starter ? `${p.starter.word}: ${sentences}` : sentences;
    }

    sentence(s) {
        switch (s.kind) {
            case "A Sentence":
                return `${starter(s.starter)}: ${this.definition(s.definition)}`;
            case "O Sentence":
                return `${starter(s.starter)} ${this.verb(s.defined)}: ${this.definition(s.definition)}`;
            case "NI Sentence":
                return `${starter(s.starter)} ${this.verb(s.pred)}`;
            case "Erased A Sentence":
            case "Erased O Sentence":
            case "Erased NI Sentence": {
                let inner = this.sentence({ ...s, kind: s.kind.replace("Erased ", "") });
                return `${inner} ${s.eraser}`;
            }
            case "Erased Invalid":
                return `~${s.eraser}`;
            default:
                return unknown(s);
        }
    }

    // DefinitionWithArguments: a chain, or { args, chain }.
    definition(d) {
        if (d.args) return `${args(d.args)}: ${this.chain(d.chain)}`;
        return this.chain(d);
    }

    chain(chain) {
        let out = [];
        if (chain.erased) {
            for (let e of chain.erased) out.push(`{${this.chain(e.chain)} ${e.eraser}}`);
        }
        out.push(this.steps(chain));
        return out.join(" ");
    }

    // A step may carry wide_negation (BI before the rest of the chain) at any depth.
    steps(step) {
        if (step.wide_negation) {
            let { wide_negation, erased, ...rest } = step;
            let negations = Array.isArray(wide_negation) ? wide_negation : [wide_negation];
            let inner = this.steps(rest);
            for (const _ of negations) inner = `bi (${inner})`;
            return inner;
        }
        let parts = [this.step(step)];
        if (step.next) parts.push(this.steps(step.next));
        let text = parts.join(" > ");
        if (step.resume) {
            let resumes = Array.isArray(step.resume) ? step.resume : [step.resume];
            for (let r of resumes) {
                text += ` ^pa ${this.step(r.chain)}`;
                if (r.next) text += ` > ${this.steps(r.next)}`;
            }
        }
        return text;
    }

    // ChainVerbAndBinds: { select?, verb, explicit_binds? }
    step(step) {
        let text = "";
        if (step.select) text += step.select.word + " ";
        text += this.verb(step.verb);
        text += this.places(step);
        if (step.explicit_binds) {
            let groups = Array.isArray(step.explicit_binds) ? step.explicit_binds : [step.explicit_binds];
            for (let g of groups) text += this.bindGroup(g);
        }
        return text;
    }

    places(step) {
        if (this.dictionary === undefined) return "";
        let slots = stepSlots(step, this.dictionary);
        let exposed = slots.exposed === "*" ? "" : `(${slots.exposed})`;
        return exposed + chainAscii(slots.chain);
    }

    bindGroup(group) {
        let binds = group.binds.map(b => {
            let neg = b.wide_negation ? "bi " : "";
            return `${neg}${b.start.word}: ${this.definition(b.inner)}`;
        });
        return `[${binds.join(" | ")}]`;
    }

    verb(v) {
        if (v == null) return "?";
        let text = this.verbCore(v);
        if (v.modifiers) {
            let mods = Array.isArray(v.modifiers) ? v.modifiers : [v.modifiers];
            let prefix = mods.map(m => m.select ? `${m.modifier.word} ${m.select.word}` : m.modifier.word);
            text = prefix.join(" ") + " " + text;
        }
        if (v.pre?.length) text = v.pre.map(pre).join("") + text;
        if (v.post?.length) text += v.post.map(p => this.post(p)).join("");
        return text;
    }

    post(p) {
        if (p.kind === "Interjection") {
            let sel = p.select ? p.select.word + " " : "";
            return `+${p.tag.word}(${sel}${this.verb(p.verb)})`;
        }
        if (p.kind === "Parenthetical") return `(${p.start.word}: ${this.text(p.content)})`;
        return unknown(p);
    }

    verbCore(v) {
        if (v.namespace) {
            let ns = Array.isArray(v.namespace) ? v.namespace : [v.namespace];
            let { namespace, ...rest } = v;
            return ns.map(n => this.verbCore(n.parent)).join("/") + "/" + this.verbCore(rest);
        }
        if (v.kind) return this.kind(v);
        if (v.start?.family === "PE") return this.enumeration(v);
        switch (v.family) {
            case "Compound":
                return `${v.prefix}(${v.content.map(c => this.verbCore(c)).join(" ")})`;
            case "Borrowing":
                return prefixedWordKey("u", v.content);
            case "FFVariable":
                return `i(${v.content})`;
            case "TI":
                return v.word ?? v.symbol;
            default:
                if (v.word != null) return v.word;
                return unknown(v);
        }
    }

    kind(v) {
        switch (v.kind) {
            case "InlineAssignment":
                return `${v.start.word} ${this.verb(v.verb)}`;
            case "BorrowingGroup":
                return `u(${v.group.map(b => b.content).join(" ")})`;
            case "Number":
                return `#(${this.number(v.value)})`;
            case "GrammaticalQuote":
                return `${v.start.word}{${this.text(v.text)}}`;
            case "SingleWordQuote":
                return `${v.start.word}(${this.verbCore(v.word)})`;
            case "Spelling Quote":
                return `${v.starter.word}(${v.items.join(" ")})`;
            case "ForeignQuote":
                return v.delim ? `${v.start.word}(${v.delim})[${v.content}]` : `${v.start.word}[${v.content}]`;
            case "Foreign Quote":
                return v.particle.word;
            default:
                return unknown(v);
        }
    }

    number(n) {
        let parts = [];
        if (n.base) parts.push(this.verbCore(n.base.value), n.base.sep.word);
        if (n.int) parts.push(...n.int.map(d => this.verbCore(d)));
        if (n.fract) parts.push(n.fract.sep.word, ...n.fract.value.map(d => this.verbCore(d)));
        if (n.repeat) parts.push(n.repeat.sep.word, ...n.repeat.value.map(d => this.verbCore(d)));
        if (n.magn) parts.push(n.magn.sep.word, ...n.magn.value.map(d => this.verbCore(d)));
        if (n.end && !n.end.elided) parts.push(n.end.word);
        return parts.join(" ");
    }

    enumeration(v) {
        let name = v.start.word;
        if (v.sep) {
            // Prefix mode: items are single steps.
            let items = v.items.map(i => (i.wide_negation ? "bi " : "") + this.step(i.chain));
            return `${name} bu(${items.join(" ")})`;
        }
        let list = v.args ? args(v.args) + ": " : "";
        let items = v.items.map(i => this.chain(i.chain));
        return `${name}(${list}${items.join(" bu ")})`;
    }
}

function starter(w) {
    return w.elided ? `(${w.word})` : w.word;
}

function args(list) {
    return list.list.map(w => w.word).concat([list.end.word]).join(" ");
}

function pre(p) {
    if (p.meta) return p.scope ? `${p.scope.word}.${p.meta.word}:` : `${p.meta.word}:`;
    return unknown(p);
}

function unknown(node) {
    return `?${JSON.stringify(node)}`;
}
