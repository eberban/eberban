// Lowering of a parse tree to the intermediate form of ir.ts, following .ai/notes/02-semantics.md.
//
// One recursive walk: lowerChain(chain, need) returns the predicate a consumer applies, exposing
// `need` places (a count, or "all" for a definition without argument list). Each step yields the
// constrained definition W_n and, when places are hidden or a wide negation applies, the wrapped
// definition W_n^w. Anaphora (ze, zei, KI variables assigned with bo) are resolved after the whole
// text is lowered, since the target instance may sit later in the walk than in the text.

import type { ArgList, Chain, Definition, ParsedText, Sentence, Verb } from "./tree.ts";
import { asArray, hasArgs } from "./tree.ts";
import type { Arg, Def, Formula, Letter, PredRef, Program, Statement, Term, Var, VarType } from "./ir.ts";
import { LETTERS } from "./ir.ts";
import { parseSISlots, stepSlots } from "../shared/places.js";
import { entryPlaces, inferredPlaces, wordKey } from "./places.ts";
import type { Dictionary, Place } from "./places.ts";

export interface LowerOptions {
    // Add the default conjunct of every hidden unbound atom place, set or not (refgram default.md).
    allDefaults?: boolean;
}

export function lowerText(text: ParsedText, dictionary: Dictionary, options: LowerOptions = {}): Program {
    return new Lowerer(dictionary, options).text(text);
}

type Need = number | "all";

interface Lowered {
    def: Def;
    exposed: Var[];
    places: Place[];
    // Key of the head word, for default inheritance by definitions.
    headKey?: string;
    // Chaining place of the head step, inherited by a definition without argument list.
    headChain?: { place: Letter; equiv: boolean } | null;
}

type ExistsNode = Extract<Formula, { kind: "exists" }>;
type NotNode = Extract<Formula, { kind: "not" }>;
type Binder = { kind: "text" } | { kind: "exists"; node: ExistsNode } | { kind: "params"; def: Def };
// A scope that closes the witnesses inside it: a negation, or a predicate handed to a consumer.
type Frame = { kind: "not"; node: NotNode } | { kind: "consumer"; def: Def };
interface Frames {
    // Closing frames from the statement root down to each exists node.
    exists: Map<ExistsNode, Frame[]>;
    // For each anaphor hole: its closing frames, and the exists nodes it sits inside.
    holes: Map<Formula, { stack: Frame[]; inside: ExistsNode[] }>;
}

interface Instance {
    key: string;
    kind: "word" | "ki";
    index: number;
    scope: string;
    vars: Var[];
}

interface Anaphor {
    kind: "ze" | "zei" | "ki";
    key: string;
    index: number;
    scope: string;
    scopeStart: number;
    params: Var[];
    hole: Formula;
    paramDefs: Def[];
    // Context of the step whose hole this anaphor fills.
    ctx: Var;
}

interface Scope {
    parent?: Scope;
    vars: Map<string, Var>;
    // Definition owning the parameters, for inline ba.
    def?: Def;
}

interface DefinedWord {
    def: Def;
    places: Place[];
    // Chaining behaviour inherited from the definition's head, when it has no argument list.
    chain?: { place: Letter; equiv: boolean } | null;
}

type BindMode = "share" | "equiv" | "none";
interface BindSpec {
    letter: Letter | null;
    mode: BindMode;
}

// A resolved verb: what the step's base conjuncts are and which places it has.
interface Base {
    name: string;
    key?: string;
    places: Place[];
    extendable: boolean;
    negated: boolean;
    instance?: "word" | "ki";
    // Chaining place when the word form does not decide it (defined words, brackets with an
    // argument list); undefined means the form rule of places.js applies.
    chain?: { place: Letter; equiv: boolean } | null;
    // `hidden` collects variables closed around the step's body, `inner` definitions printed
    // indented under the step's own definition.
    build: (ctx: Var, vars: Var[], hidden: Var[], inner: Def[]) => Formula[];
    onFinal?: (places: Place[]) => void;
}

const BIND_LETTERS = "eaou";

function letterIndex(letter: Letter): number {
    return LETTERS.indexOf(letter);
}

function placeLetter(p: Place): string {
    const l = p.letter.toLowerCase();
    return p.type.kind === "pred" ? l.toUpperCase() : l;
}

function varType(p: Place): VarType {
    if (p.type.kind === "atom") return { kind: "atom" };
    return { kind: "pred", arity: p.type.arity ?? -1 };
}

function placeOfVar(v: Var, i: number): Place {
    const letter = LETTERS[i] ?? "U";
    if (v.type.kind === "atom") return { letter, type: { kind: "atom" } };
    return { letter, type: { kind: "pred", arity: v.type.arity < 0 ? null : v.type.arity } };
}

// Printed name of a word: dictionary keys of compounds carry spaces.
function defName(key: string): string {
    return key.replace(/\s+/g, "");
}

function and(all: Formula[]): Formula {
    const items = all.filter(f => f.kind !== "top");
    if (items.length === 0) return { kind: "top" };
    if (items.length === 1) return items[0] ?? { kind: "top" };
    return { kind: "and", items };
}

function app(pred: PredRef, ctx: Var, args: Var[]): Formula {
    return { kind: "app", pred, ctx: { kind: "var", v: ctx }, args: args.map(v => (v.type.kind === "pred" ? { kind: "pvar", v } : { kind: "var", v })) };
}

function fill(hole: Formula, f: Formula): void {
    const target = hole as unknown as Record<string, unknown>;
    for (const k of Object.keys(target)) delete target[k];
    Object.assign(target, f);
}

class Lowerer {
    private readonly program: Program = { defs: [], textVars: [], statements: [], timeline: [], unsupported: [] };
    private readonly counters = new Map<string, number>();
    private varId = 0;
    private ctxId = 0;
    // Every context variable, one per definition.
    private readonly contexts = new Set<Var>();
    private readonly indexOf = new WeakMap<object, number>();
    private readonly instances: Instance[] = [];
    private readonly anaphors: Anaphor[] = [];
    private readonly env = new Map<string, DefinedWord>();
    private readonly defaults = new Map<string, Def>();
    private readonly binders = new Map<Var, Binder>();
    private readonly aliases = new Map<Var, Var>();
    private readonly scopeDefs = new Map<string, Def>();
    private scope: Scope = { vars: new Map() };
    private paramDefs: Def[] = [];
    // Argument-list definitions whose chain is being lowered, innermost last.
    private readonly openDefs: Def[] = [];
    private scopeId = "text";
    private scopeStart = 0;
    private defCounter = 0;

    private readonly dictionary: Dictionary;
    private readonly options: LowerOptions;

    constructor(dictionary: Dictionary, options: LowerOptions) {
        this.dictionary = dictionary;
        this.options = options;
    }

    text(tree: ParsedText): Program {
        let n = 0;
        for (const p of tree.paragraphs ?? []) for (const s of p.sentences) n = this.indexSentence(s, n);
        for (const p of tree.paragraphs ?? []) for (const s of p.sentences) this.sentence(s);
        this.resolveAnaphors();
        return this.program;
    }

    // ---- text-order numbering of verb nodes ----

    private indexSentence(s: Sentence, n: number): number {
        if (s.kind.startsWith("Erased")) return n;
        if (s.defined !== undefined) this.indexOf.set(s.defined, n++);
        if (s.definition !== undefined) n = this.indexDefinition(s.definition, n);
        return n;
    }

    private indexDefinition(d: Definition, n: number): number {
        return this.indexChain(hasArgs(d) ? d.chain : d, n);
    }

    private indexChain(chain: Chain, n: number): number {
        n = this.indexVerb(chain.verb, n);
        for (const group of asArray(chain.explicit_binds)) {
            for (const bind of group.binds) n = this.indexDefinition(bind.inner, n);
        }
        if (chain.next !== undefined) n = this.indexChain(chain.next, n);
        return n;
    }

    private indexVerb(v: Verb, n: number): number {
        this.indexOf.set(v, n++);
        if (v.start?.family === "PE") {
            for (const item of v.items ?? []) n = this.indexChain(item.chain, n);
        }
        return n;
    }

    // ---- helpers ----

    private newVar(type: VarType, letter: string, display?: string): Var {
        return { id: this.varId++, type, letter, display: display ?? letter };
    }

    // The context parameter of one definition, bound by whoever applies that definition.
    private newContext(): Var {
        const c = this.newVar({ kind: "atom" }, "c", `c_${++this.ctxId}`);
        this.contexts.add(c);
        return c;
    }

    private nextIndex(name: string): number {
        const n = (this.counters.get(name) ?? 0) + 1;
        this.counters.set(name, n);
        return n;
    }

    // Definitions derived while an argument-list definition is open belong to its scope; `into`
    // names another owner instead.
    private emit(def: Def, into?: Def[]): void {
        this.program.defs.push(def);
        if (into !== undefined) {
            into.push(def);
            return;
        }
        const open = this.openDefs[this.openDefs.length - 1];
        if (open === undefined) {
            this.program.timeline.push(def);
            return;
        }
        (open.inner ??= []).push(def);
    }

    private statement(s: Statement): void {
        if (s.kind === "unsupported") this.program.unsupported.push(s.reason);
        this.program.statements.push(s);
        this.program.timeline.push(s);
    }

    private unsupported(reason: string): Formula {
        this.program.unsupported.push(reason);
        return { kind: "unsupported", reason };
    }

    // Application of a definition. The argument passed for each parameter is recorded so that
    // anaphora can follow an instance's place back to the variable its consumer quantifies.
    private apply(def: Def, ctx: Var, args: Var[]): Formula {
        const own = def.params[0];
        if (own !== undefined && own !== ctx) this.aliases.set(own, ctx);
        def.params.slice(1).forEach((p, i) => {
            const a = args[i];
            if (a !== undefined && a !== p) this.aliases.set(p, a);
        });
        return app({ kind: "def", def }, ctx, args);
    }

    private resolveVar(v: Var): Var {
        for (let guard = 0; guard < 10000; guard++) {
            const a = this.aliases.get(v);
            if (a === undefined) return v;
            v = a;
        }
        return v;
    }

    private exists(vars: Var[], body: Formula): ExistsNode {
        const node: ExistsNode = { kind: "exists", vars, body };
        for (const v of vars) this.binders.set(v, { kind: "exists", node });
        return node;
    }

    // The exists node directly under a formula holder, created when missing.
    private existsUnder(holder: { body: Formula }): ExistsNode {
        if (holder.body.kind === "exists") return holder.body;
        const node = this.exists([], holder.body);
        holder.body = node;
        return node;
    }

    private bindParams(def: Def): void {
        for (const v of def.params.slice(1)) this.binders.set(v, { kind: "params", def });
    }

    private lookup(word: string): Var | undefined {
        for (let s: Scope | undefined = this.scope; s !== undefined; s = s.parent) {
            const v = s.vars.get(word);
            if (v !== undefined) return v;
        }
        return undefined;
    }

    // ---- sentences ----

    private sentence(s: Sentence): void {
        if (s.kind.startsWith("Erased")) return;
        const starter = s.starter?.word ?? "a";
        if (s.kind === "A Sentence" && s.definition !== undefined) {
            if (starter === "a") {
                const def = this.closeAll(this.lowerDefinition(s.definition, 0, "a"));
                this.statement({ kind: "assert", def });
            } else if (starter === "an") {
                const L = this.lowerDefinition(s.definition, 1, "an");
                const next = L.exposed[0];
                if (next === undefined) {
                    this.statement({ kind: "unsupported", reason: "an: context predicate exposes no place" });
                    return;
                }
                next.display = "c'";
                this.statement({ kind: "context", def: L.def, next });
            } else {
                this.statement({ kind: "unsupported", reason: `${starter} sentence` });
            }
            return;
        }
        if (s.kind === "O Sentence" && s.definition !== undefined && s.defined !== undefined) {
            const key = s.defined.namespace === undefined ? wordKey(s.defined) : undefined;
            if (key === undefined) {
                this.statement({ kind: "unsupported", reason: `${starter}: defined word is not a plain word` });
                return;
            }
            if (starter === "on" || starter === "oni" || starter === "onu" || starter === "o") {
                this.definitionSentence(key, s.defined, s.definition, starter);
            } else if (/^oi[eaou]$/.test(starter)) {
                const letter = starter[2]?.toUpperCase() as Letter;
                const L = this.lowerDefinition(s.definition, 1, starter);
                const e = L.exposed[0];
                if (e === undefined) {
                    this.statement({ kind: "unsupported", reason: `${starter}: default predicate exposes no place` });
                    return;
                }
                const word = `zoi${letter.toLowerCase()}-${key}`;
                const ctx = this.newContext();
                const def: Def = { name: defName(word), params: [ctx, e], letters: ["e"], body: this.apply(L.def, ctx, [e]) };
                this.emit(def);
                this.setDefault(key, letter, def, word);
            } else {
                this.statement({ kind: "unsupported", reason: `${starter} sentence` });
            }
            return;
        }
        if (s.kind === "NI Sentence" && s.pred !== undefined) {
            const key = s.pred.namespace === undefined ? wordKey(s.pred) : undefined;
            if (key === undefined || (starter !== "nu" && starter !== "ni")) {
                this.statement({ kind: "unsupported", reason: `${starter} sentence` });
                return;
            }
            this.statement({ kind: "axiom", word: key, enabled: starter === "nu" });
            return;
        }
        this.statement({ kind: "unsupported", reason: `sentence kind ${s.kind}` });
    }

    private setDefault(word: string, place: Letter, def: Def, defaultWord?: string): void {
        this.defaults.set(`${word}.${place}`, def);
        this.env.set(defaultWord ?? `zoi${place.toLowerCase()}-${word}`, { def, places: [{ letter: "E", type: { kind: "atom" } }] });
        this.statement({ kind: "default", word, place, def });
    }

    private definitionSentence(key: string, defined: Verb, d: Definition, starter: string): void {
        const saved = { scope: this.scope, scopeId: this.scopeId, scopeStart: this.scopeStart, paramDefs: this.paramDefs };
        this.scopeId = `def:${++this.defCounter}`;
        this.scopeStart = this.indexOf.get(defined) ?? 0;
        let def: Def;
        let places: Place[];
        let headKey: string | undefined;
        let chain: DefinedWord["chain"];
        const ctx = this.newContext();
        if (hasArgs(d)) {
            const params = this.argParams(d.args);
            def = { name: key, params: [ctx, ...params.vars], letters: params.letters, body: { kind: "top" }, namedParams: true };
            this.bindParams(def);
            this.scope = { parent: this.scope, vars: params.scope, def };
            this.paramDefs = [...this.paramDefs, def];
            this.scopeDefs.set(this.scopeId, def);
            this.openDefs.push(def);
            const L = this.lowerChain(d.chain, 0);
            this.openDefs.pop();
            def.body = this.apply(L.def, ctx, []);
            places = params.vars.map(placeOfVar);
        } else {
            def = { name: key, params: [ctx], letters: [], body: { kind: "top" } };
            this.scopeDefs.set(this.scopeId, def);
            const L = this.lowerChain(d, "all");
            def.params = [ctx, ...L.exposed];
            def.letters = L.places.map(placeLetter);
            def.body = this.apply(L.def, ctx, L.exposed);
            places = L.places;
            headKey = L.headKey;
            chain = L.headChain;
        }
        this.emit(def);
        this.env.set(key, { def, places, chain });
        this.statement({ kind: "define", word: key, def, capture: starter === "oni", question: starter === "o" });
        if (starter === "onu") this.statement({ kind: "axiom", word: key, enabled: true });
        // A definition re-exporting places inherits their defaults (refgram default.md).
        for (const p of places) {
            const inherited = headKey === undefined ? undefined : this.defaults.get(`${headKey}.${p.letter}`);
            if (inherited !== undefined) this.setDefault(key, p.letter, inherited);
        }
        this.scope = saved.scope;
        this.scopeId = saved.scopeId;
        this.scopeStart = saved.scopeStart;
        this.paramDefs = saved.paramDefs;
    }

    // A sentence-level predicate with exposed places (argument list on an `a` sentence) is closed
    // existentially.
    private closeAll(L: Lowered): Def {
        if (L.exposed.length === 0) return L.def;
        const ctx = this.newContext();
        const def: Def = { name: `${L.def.name}!`, params: [ctx], letters: [], body: this.exists(L.exposed, this.apply(L.def, ctx, L.exposed)) };
        this.emit(def);
        return def;
    }

    // ---- argument lists ----

    private argParams(args: ArgList): { vars: Var[]; letters: string[]; scope: Map<string, Var> } {
        const vars: Var[] = [];
        const letters: string[] = [];
        const scope = new Map<string, Var>();
        for (const w of args.list) {
            const letter = BIND_LETTERS[vars.length] ?? "u";
            let v: Var;
            if (w.family === "GI") {
                v = this.newVar({ kind: "pred", arity: -1 }, letter.toUpperCase(), w.word);
                letters.push(letter.toUpperCase());
                scope.set(w.word, v);
            } else if (w.family === "KI") {
                v = this.newVar({ kind: "atom" }, letter, `x_${w.word}`);
                letters.push(letter);
                scope.set(w.word, v);
            } else {
                v = this.newVar({ kind: "atom" }, letter, `x_${w.word}`);
                letters.push(letter);
            }
            vars.push(v);
        }
        return { vars, letters, scope };
    }

    // ---- chains ----

    private lowerDefinition(d: Definition, need: Need, name: string): Lowered {
        if (!hasArgs(d)) return this.lowerChain(d, need);
        const params = this.argParams(d.args);
        const ctx = this.newContext();
        const def: Def = { name: `${name}_${this.nextIndex(name)}`, params: [ctx, ...params.vars], letters: params.letters, body: { kind: "top" }, namedParams: true };
        this.bindParams(def);
        const saved = { scope: this.scope, paramDefs: this.paramDefs };
        this.scope = { parent: this.scope, vars: params.scope, def };
        this.paramDefs = [...this.paramDefs, def];
        this.openDefs.push(def);
        const L = this.lowerChain(d.chain, 0);
        this.openDefs.pop();
        this.scope = saved.scope;
        this.paramDefs = saved.paramDefs;
        def.body = this.apply(L.def, ctx, []);
        this.emit(def);
        const places: Place[] = def.params.slice(1).map(placeOfVar);
        const all: Lowered = { def, exposed: def.params.slice(1), places };
        if (need === "all" || need === all.exposed.length) return all;
        if (need > all.exposed.length) {
            this.unsupported(`${name}: argument list has ${all.exposed.length} places, consumer expects ${need}`);
            return all;
        }
        const exposed = all.exposed.slice(0, need);
        const hidden = all.exposed.slice(need);
        const wctx = this.newContext();
        const wrap: Def = { name: `${def.name}^w`, params: [wctx, ...exposed], letters: def.letters.slice(0, need), body: this.exists(hidden, this.apply(def, wctx, all.exposed)) };
        this.emit(wrap);
        return { def: wrap, exposed, places: places.slice(0, need) };
    }

    private lowerChain(chain: Chain, need: Need): Lowered {
        const negations = asArray(chain.wide_negation).length;
        return this.lowerStep(chain, need, negations);
    }

    private lowerStep(step: Chain, need: Need, negations: number): Lowered {
        if (step.resume !== undefined) this.unsupported("pa resume");
        const base = this.resolveVerb(step.verb);
        const index = this.indexOf.get(step.verb) ?? 0;
        const n = this.nextIndex(base.name);
        const places = base.places.map(p => ({ ...p }));

        // Pass 1: which places binds and chaining need.
        const slots = step.select === undefined && base.chain !== undefined ? { exposed: "*", chain: base.chain } : stepSlots(step, this.dictionary);
        const bindPlan = this.planBinds(step);
        let needed = -1;
        for (const spec of bindPlan.flatMap(g => g.specs)) if (spec.letter !== null) needed = Math.max(needed, letterIndex(spec.letter));
        if (step.next !== undefined && slots.chain !== null) needed = Math.max(needed, letterIndex(slots.chain.place));
        let exposedLetters: Letter[] | null = null;
        if (step.select !== undefined) {
            const si = parseSISlots(step.select.word);
            if (si.exposed === "~") this.unsupported(`${step.select.word}: transparent SI`);
            else exposedLetters = si.exposed.split("") as Letter[];
            for (const l of exposedLetters ?? []) needed = Math.max(needed, letterIndex(l));
        } else if (need !== "all") {
            needed = Math.max(needed, need - 1);
        }
        this.extendPlaces(places, needed, base);

        const vars = places.map(p => this.newVar(varType(p), placeLetter(p), `${placeLetter(p)}_${n}`));
        const ctx = this.newContext();
        const bound = new Set<number>();
        const extraHidden: Var[] = [];
        const extraInner: Def[] = [];
        this.currentIndex = index;
        const conjuncts = base.build(ctx, vars, extraHidden, extraInner);

        // Explicit binds.
        for (const group of bindPlan) {
            for (const bind of group.binds) {
                const parts = this.splitInner(bind.inner, bind.specs.length);
                const conj: Formula[] = [];
                bind.specs.forEach((spec, i) => {
                    const part = parts?.[i];
                    if (part === undefined) return;
                    conj.push(this.bindConjunct(ctx, spec, part, places, vars, bound, bind.word));
                });
                conjuncts.push(bind.negated ? { kind: "not", body: and(conj) } : and(conj));
            }
        }

        // Chaining.
        if (step.next !== undefined) {
            if (slots.chain === null) {
                conjuncts.push(this.unsupported(`${base.name}: no place to chain through`));
            } else {
                const i = letterIndex(slots.chain.place);
                const place = places[i];
                const v = vars[i];
                if (place === undefined || v === undefined) {
                    conjuncts.push(this.unsupported(`${base.name}: chains through ${slots.chain.place} which it does not have`));
                } else {
                    bound.add(i);
                    conjuncts.push(this.linkChain(ctx, place, v, slots.chain.equiv, step.next));
                }
            }
        }

        // Wrap.
        let exposedIdx: number[];
        if (exposedLetters !== null) {
            exposedIdx = exposedLetters.map(letterIndex).filter(i => i < places.length);
            if (need !== "all" && exposedIdx.length < need) {
                this.unsupported(`${step.select?.word ?? "SI"} exposes ${exposedIdx.length} places, consumer expects ${need}`);
            }
            // The consumer takes the first places listed; the others are closed with the hidden ones.
            if (need !== "all") exposedIdx = exposedIdx.slice(0, need);
        } else if (need === "all" || step.select !== undefined) {
            exposedIdx = places.map((_, i) => i);
        } else {
            exposedIdx = places.slice(0, need).map((_, i) => i);
        }
        const hiddenIdx = places.map((_, i) => i).filter(i => !exposedIdx.includes(i));

        base.onFinal?.(places);
        const body = extraHidden.length > 0 ? this.exists(extraHidden, and(conjuncts)) : and(conjuncts);
        const def: Def = { name: `${base.name}_${n}`, params: [ctx, ...vars], letters: places.map(placeLetter), body };
        if (extraInner.length > 0) {
            def.inner = extraInner;
            def.namedParams = true;
        }
        this.emit(def);
        if (base.instance !== undefined && base.key !== undefined) {
            this.instances.push({ key: base.key, kind: base.instance, index, scope: this.scopeId, vars });
        }

        // Defaults of hidden places that received no bind (refgram default.md).
        const wctx = this.newContext();
        const wrapConjuncts: Formula[] = [];
        for (const i of hiddenIdx) {
            const place = places[i];
            const v = vars[i];
            if (place === undefined || v === undefined || bound.has(i) || place.type.kind !== "atom" || base.key === undefined) continue;
            const word = `zoi${place.letter.toLowerCase()}-${base.key}`;
            if (!this.defaults.has(`${base.key}.${place.letter}`) && this.options.allDefaults !== true) continue;
            const m = this.nextIndex(word);
            const e = this.newVar({ kind: "atom" }, "e", `e_${m}`);
            const dctx = this.newContext();
            const ddef: Def = { name: `${defName(word)}_${m}`, params: [dctx, e], letters: ["e"], body: app({ kind: "word", key: word }, dctx, [e]) };
            this.emit(ddef);
            wrapConjuncts.push(this.apply(ddef, wctx, [v]));
        }

        const identity = exposedIdx.every((v, i) => v === i) && hiddenIdx.length === 0;
        if (identity && negations === 0 && wrapConjuncts.length === 0) {
            return { def, exposed: vars, places, headKey: base.key, headChain: slots.chain };
        }
        const exposedVars = exposedIdx.map(i => vars[i]).filter((v): v is Var => v !== undefined);
        const hiddenVars = hiddenIdx.map(i => vars[i]).filter((v): v is Var => v !== undefined);
        let wbody: Formula = and([this.apply(def, wctx, vars), ...wrapConjuncts]);
        if (hiddenVars.length > 0) wbody = this.exists(hiddenVars, wbody);
        for (let k = 0; k < negations; k++) wbody = { kind: "not", body: wbody };
        const wrap: Def = { name: `${base.name}_${n}^w`, params: [wctx, ...exposedVars], letters: exposedIdx.map(i => placeLetter(places[i] ?? { letter: "E", type: { kind: "atom" } })), body: wbody };
        this.emit(wrap);
        return { def: wrap, exposed: exposedVars, places: exposedIdx.map(i => places[i]).filter((p): p is Place => p !== undefined), headKey: base.key, headChain: slots.chain };
    }

    private extendPlaces(places: Place[], needed: number, base: Base): void {
        if (needed < places.length) return;
        if (!base.extendable) {
            this.unsupported(`${base.name}: place ${LETTERS[needed] ?? "?"} used, it has ${places.length} places`);
        }
        while (places.length <= needed && places.length < LETTERS.length) {
            places.push({ letter: LETTERS[places.length] ?? "U", type: { kind: "atom" } });
        }
    }

    private linkChain(ctx: Var, place: Place, v: Var, equivFlag: boolean, next: Chain): Formula {
        if (place.type.kind === "pred" && equivFlag) {
            const R = this.lowerChain(next, place.type.arity ?? "all");
            v.type = { kind: "pred", arity: R.exposed.length };
            place.type = { kind: "pred", arity: R.exposed.length };
            return { kind: "equiv", left: { kind: "pvar", v }, right: { kind: "def", def: R.def }, arity: R.exposed.length };
        }
        const R = this.lowerChain(next, 1);
        return this.apply(R.def, ctx, [v]);
    }

    // ---- binds ----

    private planBinds(step: Chain): { binds: { word: string; specs: BindSpec[]; inner: Definition; negated: boolean }[]; specs: BindSpec[] }[] {
        const groups: { binds: { word: string; specs: BindSpec[]; inner: Definition; negated: boolean }[]; specs: BindSpec[] }[] = [];
        for (const group of asArray(step.explicit_binds)) {
            const binds: { word: string; specs: BindSpec[]; inner: Definition; negated: boolean }[] = [];
            let last: Letter | null = null;
            for (const bind of group.binds) {
                const specs = parseBindWord(bind.start.word, last);
                if (specs === undefined) {
                    this.unsupported(`${bind.start.word}: bind particle`);
                    continue;
                }
                const lastSpec = specs[specs.length - 1];
                if (lastSpec !== undefined && lastSpec.letter !== null) last = lastSpec.letter;
                binds.push({ word: bind.start.word, specs, inner: bind.inner, negated: bind.wide_negation !== undefined });
            }
            groups.push({ binds, specs: binds.flatMap(b => b.specs) });
        }
        return groups;
    }

    private splitInner(inner: Definition, count: number): Definition[] | undefined {
        if (count === 1) return [inner];
        if (hasArgs(inner)) {
            this.unsupported("argument list on a multi-place bind");
            return undefined;
        }
        const parts: Definition[] = [];
        let s: Chain | undefined = inner;
        for (let k = 0; k < count - 1; k++) {
            if (s === undefined) break;
            const { next: _next, ...single } = s;
            parts.push(single);
            s = s.next;
        }
        if (s === undefined) {
            this.unsupported(`multi-place bind needs ${count} predicates`);
            return undefined;
        }
        parts.push(s);
        return parts;
    }

    private bindConjunct(ctx: Var, spec: BindSpec, part: Definition, places: Place[], vars: Var[], bound: Set<number>, word: string): Formula {
        if (spec.letter === null) {
            const L = this.lowerDefinition(part, 0, word);
            return this.apply(L.def, ctx, []);
        }
        const i = letterIndex(spec.letter);
        const place = places[i];
        const v = vars[i];
        if (place === undefined || v === undefined) return this.unsupported(`${word}: place ${spec.letter} missing`);
        bound.add(i);
        if (spec.mode === "equiv") {
            const arity = place.type.kind === "pred" ? place.type.arity : null;
            const L = this.lowerDefinition(part, arity ?? "all", word);
            v.type = { kind: "pred", arity: L.exposed.length };
            place.type = { kind: "pred", arity: L.exposed.length };
            return { kind: "equiv", left: { kind: "pvar", v }, right: { kind: "def", def: L.def }, arity: L.exposed.length };
        }
        const L = this.lowerDefinition(part, 1, word);
        return this.apply(L.def, ctx, [v]);
    }

    // ---- verbs ----

    private resolveVerb(verb: Verb): Base {
        const mods = asArray(verb.modifiers);
        const { modifiers: _m, ...core } = verb;
        let base = this.resolveCore(core);
        for (let i = mods.length - 1; i >= 0; i--) {
            const mod = mods[i];
            if (mod === undefined) continue;
            if (mod.select !== undefined && i > 0) this.unsupported(`${mod.select.word}: SI inside stacked ZI`);
            base = this.applyModifier(mod.modifier.word, base, core);
        }
        return base;
    }

    private applyModifier(word: string, base: Base, core: Verb): Base {
        switch (word) {
            case "zi":
                return { ...base, negated: !base.negated, build: (ctx, vars, hidden, inner) => {
                    const [first, ...rest] = base.build(ctx, vars, hidden, inner);
                    return first === undefined ? rest : [{ kind: "not", body: first }, ...rest];
                } };
            case "ze":
            case "zei":
                return this.anaphorBase(word, base);
            case "za":
            case "zai": {
                const key = `${word}-${base.key ?? base.name}`;
                const places: Place[] = word === "za" ? [{ letter: "E", type: { kind: "atom" } }, { letter: "A", type: { kind: "atom" } }] : [{ letter: "E", type: { kind: "atom" } }];
                return this.wordBase(key, key, places, false);
            }
            case "zu":
            case "zui": {
                const v = core.word === undefined ? undefined : this.lookup(core.word);
                if (v === undefined) {
                    return this.unsupportedBase(`${word} on ${base.name}: not a variable`);
                }
                const places: Place[] = word === "zu" ? [{ letter: "E", type: { kind: "atom" } }, { letter: "A", type: { kind: "atom" } }] : [{ letter: "E", type: { kind: "atom" } }];
                return {
                    name: `${word}-${base.name}`, places, extendable: true, negated: false,
                    build: (ctx, vars) => [app({ kind: "pvar", v }, ctx, vars)],
                    onFinal: p => { v.type = { kind: "pred", arity: p.length }; },
                };
            }
            case "zue": {
                const a = base.places[1];
                if (a === undefined || a.type.kind !== "pred" || a.type.arity !== 0) {
                    return this.unsupportedBase(`zue on ${base.name}: A is not a 0-ary predicate place`);
                }
                const places: Place[] = base.places.map((p, i) => (i === 1 ? { letter: "A", type: { kind: "pred", arity: 1 } } : { ...p }));
                return {
                    ...base, name: `zue-${base.name}`, places, instance: undefined,
                    build: (ctx, vars, hidden, inner) => {
                        const e = vars[0];
                        const a1 = vars[1];
                        if (e === undefined || a1 === undefined) return [this.unsupported("zue: missing places")];
                        const a0 = this.newVar({ kind: "pred", arity: 0 }, "P");
                        hidden.push(a0);
                        const ictx = this.newContext();
                        const helper: Def = { name: `zue-${base.name}-A_${this.nextIndex(`zue-${base.name}-A`)}`, params: [ictx], letters: [], body: app({ kind: "pvar", v: a1 }, ictx, [e]) };
                        this.emit(helper, inner);
                        const inherited = base.build(ctx, [e, a0, ...vars.slice(2)], hidden, inner);
                        return [...inherited, { kind: "equiv", left: { kind: "pvar", v: a0 }, right: { kind: "def", def: helper }, arity: 0 }];
                    },
                };
            }
            default: {
                const m = /^zoi([eaou])$/.exec(word);
                if (m !== null) {
                    const key = `${word}-${base.key ?? base.name}`;
                    return this.wordBase(key, key, [{ letter: "E", type: { kind: "atom" } }], false);
                }
                return this.unsupportedBase(`${word} on ${base.name}`);
            }
        }
    }

    private anaphorBase(kind: "ze" | "zei", base: Base): Base {
        const key = base.key ?? base.name;
        const name = `${kind}-${base.name}`;
        return {
            name, key: undefined, places: base.places.map(p => ({ ...p })), extendable: base.extendable, negated: false,
            build: (ctx, vars) => {
                const hole: Formula = { kind: "unknown" };
                this.anaphors.push({ kind, key, index: this.currentIndex, scope: this.scopeId, scopeStart: this.scopeStart, params: vars, hole, paramDefs: this.paramDefs, ctx });
                return [hole];
            },
        };
    }

    private currentIndex = 0;

    private unsupportedBase(reason: string): Base {
        return { name: "unsupported", places: [{ letter: "E", type: { kind: "atom" } }], extendable: true, negated: false, build: () => [this.unsupported(reason)] };
    }

    private wordBase(name: string, key: string, places: Place[], extendable: boolean, chain?: DefinedWord["chain"]): Base {
        return { name: defName(name), key, places, extendable, negated: false, instance: "word", chain, build: (ctx, vars) => [app({ kind: "word", key }, ctx, vars)] };
    }

    private resolveCore(verb: Verb): Base {
        if (verb.namespace !== undefined) return this.unsupportedBase("namespaced word");
        if (verb.kind === "InlineAssignment") {
            const inner = verb.verb;
            if (inner?.family === "KI" && inner.word !== undefined) {
                const key = inner.word;
                return { name: key, key, places: [{ letter: "E", type: { kind: "atom" } }], extendable: false, negated: false, instance: "ki", build: () => [{ kind: "top" }] };
            }
            return this.unsupportedBase(`${verb.start?.word ?? "bo"} on ${inner?.word ?? inner?.family ?? "?"}`);
        }
        if (verb.start?.family === "PE") return this.bracketBase(verb);
        if (verb.kind !== undefined && verb.kind !== "BorrowingGroup") return this.unsupportedBase(`${verb.kind}`);
        const key = wordKey(verb);
        if (key === undefined) return this.unsupportedBase(`verb ${JSON.stringify(verb)}`);
        if (verb.family === "KI") {
            const v = this.lookup(key);
            if (v !== undefined) {
                return { name: key, places: [{ letter: "E", type: { kind: "atom" } }], extendable: false, negated: false, build: (_ctx, vars) => {
                    const e = vars[0];
                    return e === undefined ? [] : [{ kind: "eq", left: { kind: "var", v: e }, right: { kind: "var", v } }];
                } };
            }
            return {
                name: key, places: [{ letter: "E", type: { kind: "atom" } }], extendable: false, negated: false,
                build: (ctx, vars) => {
                    const hole: Formula = { kind: "unknown" };
                    this.anaphors.push({ kind: "ki", key, index: this.currentIndex, scope: this.scopeId, scopeStart: this.scopeStart, params: vars, hole, paramDefs: this.paramDefs, ctx });
                    return [hole];
                },
            };
        }
        if (verb.family === "GI") {
            const v = this.lookup(key);
            if (v !== undefined) {
                // Arity and types come from the first use: the consumer's need, binds and chaining.
                const arity = v.type.kind === "pred" ? v.type.arity : -1;
                const places: Place[] = LETTERS.slice(0, Math.max(arity, 0)).map(letter => ({ letter, type: { kind: "atom" } }));
                return {
                    name: key, places, extendable: arity < 0, negated: false,
                    build: (ctx, vars) => [app({ kind: "pvar", v }, ctx, vars)],
                    onFinal: p => { if (arity < 0) v.type = { kind: "pred", arity: p.length }; },
                };
            }
        }
        if (verb.family === "BA") {
            if (key !== "ba") return this.unsupportedBase(`${key}: sentence argument`);
            let s: Scope | undefined = this.scope;
            while (s !== undefined && s.def === undefined) s = s.parent;
            const def = s?.def;
            if (def === undefined) return this.unsupportedBase("ba outside an argument list");
            const v = this.newVar({ kind: "atom" }, BIND_LETTERS[def.params.length - 1] ?? "u", "x_ba");
            def.params.push(v);
            def.letters.push(BIND_LETTERS[def.params.length - 2] ?? "u");
            this.binders.set(v, { kind: "params", def });
            return { name: key, places: [{ letter: "E", type: { kind: "atom" } }], extendable: false, negated: false, build: (_ctx, vars) => {
                const e = vars[0];
                return e === undefined ? [] : [{ kind: "eq", left: { kind: "var", v: e }, right: { kind: "var", v } }];
            } };
        }
        const defined = this.env.get(key);
        if (defined !== undefined) return this.wordBase(key, key, defined.places.map(p => ({ ...p })), false, defined.chain);
        const entry = entryPlaces(this.dictionary[key]);
        if (entry !== undefined) return this.wordBase(key, key, entry, false);
        return this.wordBase(key, key, inferredPlaces(verb, this.dictionary), true);
    }

    private bracketBase(verb: Verb): Base {
        const word = verb.start?.word ?? "pe";
        if (word !== "pe") return this.unsupportedBase(`${word} enumeration`);
        const items = verb.items ?? [];
        const item = items[0];
        if (items.length !== 1 || item === undefined) return this.unsupportedBase("pe with several items");
        if (item.wide_negation !== undefined) this.unsupported("bi on a pe item");
        const inner: Definition = verb.args !== undefined ? { args: verb.args, chain: item.chain } : item.chain;
        const L = this.lowerDefinition(inner, "all", "pe-args");
        // With an argument list the bracket chains through its first parameter by sharing; the
        // refgram leaves this unspecified.
        const chain = verb.args !== undefined ? { place: "E" as Letter, equiv: false } : undefined;
        return { name: "pe", places: L.places.map(p => ({ ...p })), extendable: false, negated: false, chain, build: (ctx, vars) => [this.apply(L.def, ctx, vars)], key: L.headKey };
    }

    // ---- anaphora ----

    private resolveAnaphors(): void {
        const frames = this.computeFrames();
        for (const a of [...this.anaphors].sort((x, y) => x.index - y.index)) {
            const target = this.latestInstance(a);
            if (target === undefined) {
                fill(a.hole, { kind: "bottom" });
                continue;
            }
            fill(a.hole, this.reference(a, target, frames));
        }
    }

    private latestInstance(a: Anaphor): Instance | undefined {
        let best: Instance | undefined;
        for (const inst of this.instances) {
            if (!this.matches(a, inst)) continue;
            const visible = (inst.scope === a.scope && inst.index < a.index) || (a.scope !== "text" && inst.scope === "text" && inst.index < a.scopeStart);
            if (!visible) continue;
            if (best === undefined || inst.index > best.index) best = inst;
        }
        return best;
    }

    private matches(a: Anaphor, inst: Instance): boolean {
        if (a.kind === "ki") return inst.kind === "ki" && inst.key === a.key;
        if (inst.kind !== "word") return false;
        if (a.kind === "ze") return inst.key === a.key;
        return inst.key.split(" ").includes(a.key);
    }

    // How a variable relates to the anaphor: shared witness (no hoist needed, or hoisted to the
    // innermost frame both sit under), closed by one negation, or out of reach.
    private access(v: Var, a: Anaphor, inst: Instance, frames: Frames): { kind: "eq" } | { kind: "not"; node: NotNode } | { kind: "unknown" } {
        const b = this.binders.get(v);
        if (b === undefined) return { kind: "unknown" };
        if (b.kind === "text") return { kind: "eq" };
        if (b.kind === "params") return a.paramDefs.includes(b.def) ? { kind: "eq" } : { kind: "unknown" };
        const site = frames.holes.get(a.hole) ?? { stack: [], inside: [] };
        if (site.inside.includes(b.node)) return { kind: "eq" };
        const stack = frames.exists.get(b.node) ?? [];
        let common = 0;
        while (common < stack.length && stack[common] === site.stack[common]) common++;
        const extra = stack.slice(common);
        if (extra.length === 0) {
            const last = stack[stack.length - 1];
            this.hoist(v, last === undefined ? this.hoistTarget(inst.scope) : this.existsUnder(last.kind === "not" ? last.node : last.def));
            return { kind: "eq" };
        }
        const first = extra[0];
        if (extra.length === 1 && first !== undefined && first.kind === "not") return { kind: "not", node: first.node };
        return { kind: "unknown" };
    }

    private reference(a: Anaphor, inst: Instance, frames: Frames): Formula {
        const eqs: Formula[] = [];
        const closed: { v: Var; param: Var; node: NotNode }[] = [];
        for (let i = 0; i < a.params.length && i < inst.vars.length; i++) {
            const own = inst.vars[i];
            const param = a.params[i];
            if (own === undefined || param === undefined) continue;
            const v = this.resolveVar(own);
            const eq: Formula = { kind: "eq", left: { kind: "var", v: param }, right: { kind: "var", v } };
            const r = this.access(v, a, inst, frames);
            if (r.kind === "unknown") return { kind: "unknown" };
            if (r.kind === "eq") eqs.push(eq);
            else closed.push({ v, param, node: r.node });
        }
        if (closed.length === 0) return and(eqs);
        const node = closed[0]?.node;
        if (node === undefined || closed.some(c => c.node !== node)) return { kind: "unknown" };
        const inner = this.existsUnder(node);
        for (const c of closed) this.hoist(c.v, inner);
        // The other variables the negated body mentions must be accessible witnesses.
        const free = new Set<Var>();
        collectVars(inner.body, free);
        for (const raw of free) {
            const v = this.resolveVar(raw);
            if (this.contexts.has(v) || inner.vars.includes(v)) continue;
            if (this.access(v, a, inst, frames).kind !== "eq") return { kind: "unknown" };
        }
        // The description is read in the anaphor's own definition, so it takes that definition's
        // context, each closed variable becomes the anaphor's own place, and the other variables
        // resolve to the witnesses they alias (the copied body no longer sits under its own
        // definition's parameters).
        const closedMap = new Map(closed.map(c => [c.v, c.param]));
        const resolved = substituteVars(inner.body, raw => {
            const v = this.resolveVar(raw);
            return closedMap.get(v) ?? v;
        });
        const body = substituteContext(resolved, this.contexts, a.ctx);
        const rest = inner.vars.filter(v => !closedMap.has(v));
        const description: Formula = rest.length === 0 ? body : { kind: "exists", vars: rest, body };
        return and([...eqs, description]);
    }

    private hoistTarget(scope: string): "text" | ExistsNode {
        if (scope === "text") return "text";
        const def = this.scopeDefs.get(scope);
        if (def === undefined) return "text";
        return this.existsUnder(def);
    }

    private hoist(v: Var, target: "text" | ExistsNode): void {
        const b = this.binders.get(v);
        if (b?.kind === "exists") b.node.vars = b.node.vars.filter(x => x !== v);
        if (target === "text") {
            this.program.textVars.push(v);
            this.binders.set(v, { kind: "text" });
        } else {
            target.vars.push(v);
            this.binders.set(v, { kind: "exists", node: target });
        }
    }

    // Closing frames of every exists node and anaphor site, from their statement's root.
    private computeFrames(): Frames {
        const frames: Frames = { exists: new Map(), holes: new Map() };
        const holes = new Set(this.anaphors.map(a => a.hole));
        const seen = new Set<Def>();
        const visitDef = (def: Def, stack: Frame[], inside: ExistsNode[]): void => {
            if (seen.has(def)) return;
            seen.add(def);
            visit(def.body, stack, inside);
        };
        const consumer = (def: Def, stack: Frame[], inside: ExistsNode[]): void => visitDef(def, [...stack, { kind: "consumer", def }], inside);
        const visit = (f: Formula, stack: Frame[], inside: ExistsNode[]): void => {
            switch (f.kind) {
                case "app":
                    if (f.pred.kind === "def") visitDef(f.pred.def, stack, inside);
                    for (const arg of f.args) if (arg.kind === "def") consumer(arg.def, stack, inside);
                    break;
                case "and":
                    for (const item of f.items) visit(item, stack, inside);
                    break;
                case "not":
                    visit(f.body, [...stack, { kind: "not", node: f }], inside);
                    break;
                case "exists":
                    frames.exists.set(f, stack);
                    visit(f.body, stack, [...inside, f]);
                    break;
                case "equiv":
                    if (f.left.kind === "def") consumer(f.left.def, stack, inside);
                    if (f.right.kind === "def") consumer(f.right.def, stack, inside);
                    break;
                case "unknown":
                    if (holes.has(f)) frames.holes.set(f, { stack, inside });
                    break;
                default:
                    break;
            }
        };
        for (const s of this.program.statements) {
            if (s.kind === "assert" || s.kind === "context" || s.kind === "define" || s.kind === "default") visitDef(s.def, [], []);
        }
        return frames;
    }
}

// Variables a formula mentions directly (not through the definitions it applies), each replaced by
// what `to` maps it to. Nodes that change are copied, the others are shared with the original.
function substituteVars(f: Formula, to: (v: Var) => Var): Formula {
    switch (f.kind) {
        case "app": {
            const ctx = substituteTerm(f.ctx, to);
            const pred = substitutePred(f.pred, to);
            const args = f.args.map(a => substituteArg(a, to));
            const same = ctx === f.ctx && pred === f.pred && args.every((a, k) => a === f.args[k]);
            return same ? f : { kind: "app", pred, ctx, args };
        }
        case "and": {
            const items = f.items.map(i => substituteVars(i, to));
            return items.every((i, k) => i === f.items[k]) ? f : { kind: "and", items };
        }
        case "not": {
            const body = substituteVars(f.body, to);
            return body === f.body ? f : { kind: "not", body };
        }
        case "exists": {
            const body = substituteVars(f.body, to);
            return body === f.body ? f : { kind: "exists", vars: [...f.vars], body };
        }
        case "equiv": {
            const left = substitutePred(f.left, to);
            const right = substitutePred(f.right, to);
            return left === f.left && right === f.right ? f : { kind: "equiv", left, right, arity: f.arity };
        }
        case "eq": {
            const left = substituteTerm(f.left, to);
            const right = substituteTerm(f.right, to);
            return left === f.left && right === f.right ? f : { kind: "eq", left, right };
        }
        default:
            return f;
    }
}

function substituteTerm(t: Term, to: (v: Var) => Var): Term {
    if (t.kind !== "var") return t;
    const v = to(t.v);
    return v === t.v ? t : { kind: "var", v };
}

function substitutePred(p: PredRef, to: (v: Var) => Var): PredRef {
    if (p.kind !== "pvar") return p;
    const v = to(p.v);
    return v === p.v ? p : { kind: "pvar", v };
}

function substituteArg(a: Arg, to: (v: Var) => Var): Arg {
    return a.kind === "var" || a.kind === "atom" ? substituteTerm(a, to) : substitutePred(a, to);
}

// Context variables replaced by the context of the definition the rewritten copy is read in.
function substituteContext(f: Formula, contexts: Set<Var>, to: Var): Formula {
    return substituteVars(f, v => (contexts.has(v) ? to : v));
}

// Variables a formula mentions directly (not through the definitions it applies).
function collectVars(f: Formula, out: Set<Var>): void {
    switch (f.kind) {
        case "app":
            if (f.ctx.kind === "var") out.add(f.ctx.v);
            if (f.pred.kind === "pvar") out.add(f.pred.v);
            for (const a of f.args) if (a.kind === "var" || a.kind === "pvar") out.add(a.v);
            break;
        case "and":
            for (const i of f.items) collectVars(i, out);
            break;
        case "not":
            collectVars(f.body, out);
            break;
        case "exists":
            collectVars(f.body, out);
            break;
        case "equiv":
            if (f.left.kind === "pvar") out.add(f.left.v);
            if (f.right.kind === "pvar") out.add(f.right.v);
            break;
        case "eq":
            if (f.left.kind === "var") out.add(f.left.v);
            if (f.right.kind === "var") out.add(f.right.v);
            break;
        default:
            break;
    }
}

function parseBindWord(word: string, last: Letter | null): BindSpec[] | undefined {
    const rest = word.slice(1);
    if (rest === "i") return [{ letter: null, mode: "none" }];
    const relative = /^([ea])h([ui])$/.exec(rest);
    if (relative !== null) {
        if (last === null) return undefined;
        const letter = relative[1] === "e" ? last : LETTERS[letterIndex(last) + 1];
        if (letter === undefined) return undefined;
        return [{ letter, mode: relative[2] === "u" ? "share" : "equiv" }];
    }
    const specs: BindSpec[] = [];
    for (let i = 0; i < rest.length; i++) {
        let mode: BindMode = "share";
        if (rest[i] === "i") {
            mode = "equiv";
            i++;
        }
        const ch = rest[i];
        if (ch === undefined || !BIND_LETTERS.includes(ch)) return undefined;
        specs.push({ letter: ch.toUpperCase() as Letter, mode });
    }
    return specs.length > 0 ? specs : undefined;
}
