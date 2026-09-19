// Formula printer: the intermediate form in the refgram notation, one definition per line in
// emission order, statements where they occur.
//
//   bjan_1(c,e) := bjan(c,e)
//   mian_1(c,e) := mian(c,e) ∧ bjan_1(c,e)
//   mian_1^w(c) := ∃e. mian_1(c,e)
//   assert mian_1^w(c)
//
// A definition with an argument list ends in `where` and the definitions derived inside it follow,
// indented; its own parameters print by their variable name, in its head and in its body.
//
//   va_1(c,x_ke) := mian_1^w(c) where
//       ke_1(c,e) := (e = x_ke)
//
// Elsewhere a definition's parameters print as their place letters; a variable bound further out
// (a hoisted witness e_1, a bo variable x_ke) prints as its display name.

import type { Arg, Def, Formula, PredRef, Program, Statement, Term, Var } from "./ir.ts";

// Blocks: the definitions of a sentence, then its statements; a blank line separates blocks.
export function printProgram(p: Program): string {
    const shared = sharedVars(p);
    const lines: string[] = [];
    let afterStatement = false;
    if (p.textVars.length > 0) {
        lines.push(`text ${p.textVars.map(v => `∃${v.display}`).join(" ")}`);
        afterStatement = true;
    }
    for (const item of p.timeline) {
        if ("params" in item) {
            if (afterStatement) lines.push("");
            printDef(item, "", lines, shared);
            afterStatement = false;
        } else {
            lines.push(printStatement(item));
            afterStatement = true;
        }
    }
    return lines.join("\n");
}

// Variables mentioned by a definition that neither declares nor quantifies them. Where such a
// variable is quantified, it prints under its shared name so the binder and the uses match.
function sharedVars(p: Program): Set<Var> {
    const shared = new Set<Var>();
    const visit = (d: Def): void => {
        const local = new Set<Var>();
        collectLocal(d.body, local);
        const refs = new Set<Var>();
        collectRefs(d.body, refs);
        for (const v of refs) if (!d.params.includes(v) && !local.has(v)) shared.add(v);
        for (const i of d.inner ?? []) visit(i);
    };
    for (const item of p.timeline) if ("params" in item) visit(item);
    return shared;
}

function collectRefs(f: Formula, out: Set<Var>): void {
    switch (f.kind) {
        case "app":
            if (f.ctx.kind === "var") out.add(f.ctx.v);
            if (f.pred.kind === "pvar") out.add(f.pred.v);
            for (const a of f.args) if (a.kind === "var" || a.kind === "pvar") out.add(a.v);
            break;
        case "and":
            for (const i of f.items) collectRefs(i, out);
            break;
        case "not":
        case "exists":
            collectRefs(f.body, out);
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

function printDef(d: Def, indent: string, out: string[], shared: Set<Var>): void {
    const local = new Set<Var>();
    collectLocal(d.body, local);
    const names: Names = { local, shared };
    const head = `${d.name}(${d.params.map(v => varName(v, d, names)).join(",")})`;
    const inner = d.inner ?? [];
    out.push(`${indent}${head} := ${formula(d.body, d, names, "top")}${inner.length > 0 ? " where" : ""}`);
    for (const i of inner) printDef(i, `${indent}    `, out, shared);
}

// Variables quantified inside a definition's own body (not inside definitions it applies).
function collectLocal(f: Formula, out: Set<Var>): void {
    switch (f.kind) {
        case "and":
            for (const i of f.items) collectLocal(i, out);
            break;
        case "not":
            collectLocal(f.body, out);
            break;
        case "exists":
            for (const v of f.vars) out.add(v);
            collectLocal(f.body, out);
            break;
        default:
            break;
    }
}

function printStatement(s: Statement): string {
    switch (s.kind) {
        case "assert":
            return `assert ${s.def.name}(c)`;
        case "context":
            return `context ${s.def.name}(c,${s.next.display})`;
        case "define":
            return `${s.question ? "question" : "define"} ${word(s.word)}${s.capture ? " capturing c" : ""}`;
        case "axiom":
            return `${s.enabled ? "axiom" : "retract"} ${word(s.word)}`;
        case "default":
            return `default ${word(s.word)}.${s.place}`;
        case "unsupported":
            return `unsupported: ${s.reason}`;
    }
}

interface Names {
    // Quantified inside the definition being printed.
    local: Set<Var>;
    // Mentioned by some definition that does not bind them.
    shared: Set<Var>;
}
type Local = Names;

function word(key: string): string {
    return key.replace(/\s+/g, "");
}

function varName(v: Var, d: Def, names: Names): string {
    const i = d.params.indexOf(v);
    if (i === 0) return "c";
    if (i > 0) return d.namedParams === true || names.shared.has(v) ? v.display : d.letters[i - 1] ?? v.display;
    if (names.local.has(v) && !names.shared.has(v)) return v.letter;
    return v.display;
}

function term(t: Term, d: Def, local: Local): string {
    return t.kind === "atom" ? t.name : varName(t.v, d, local);
}

function predName(p: PredRef, d: Def, local: Local): string {
    switch (p.kind) {
        case "def":
            return p.def.name;
        case "word":
            return word(p.key);
        case "pvar":
            return varName(p.v, d, local);
    }
}

function arg(a: Arg, d: Def, local: Local): string {
    return a.kind === "var" || a.kind === "atom" ? term(a, d, local) : predName(a, d, local);
}

type Context = "top" | "and" | "not";

function formula(f: Formula, d: Def, local: Local, ctx: Context): string {
    switch (f.kind) {
        case "app":
            return `${predName(f.pred, d, local)}(${[term(f.ctx, d, local), ...f.args.map(a => arg(a, d, local))].join(",")})`;
        case "and": {
            const text = f.items.map(i => formula(i, d, local, "and")).join(" ∧ ");
            return ctx === "not" ? `(${text})` : text;
        }
        case "not":
            return `¬${formula(f.body, d, local, "not")}`;
        case "exists": {
            const body = formula(f.body, d, local, "top");
            if (f.vars.length === 0) return ctx === "top" ? body : `(${body})`;
            const text = `${f.vars.map(v => `∃${varName(v, d, local)}`).join(" ")}. ${body}`;
            return ctx === "top" ? text : `(${text})`;
        }
        case "equiv":
            return `${predName(f.left, d, local)} ≡ ${predName(f.right, d, local)}`;
        case "eq":
            return `(${term(f.left, d, local)} = ${term(f.right, d, local)})`;
        case "top":
            return "⊤";
        case "bottom":
            return "⊥";
        case "unknown":
            return "unknown";
        case "unsupported":
            return `unsupported(${f.reason})`;
    }
}
