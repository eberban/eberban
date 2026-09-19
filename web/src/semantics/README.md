# Semantics: lowering, formula printer

Tools that give a parsed text its logical reading, following `.ai/notes/02-semantics.md` and the
refgram `logic/` chapters. The parser (`../grammar/eberban.peggy`) stays the only parser; these
modules consume its output.

| File | Role |
|---|---|
| `tree.ts` | Shape of the parse tree as the lowering reads it |
| `ir.ts` | Intermediate form: named definitions (`W_1`, `W_1^w`), formulas, statements |
| `places.ts` | Explicit place list of a verb from the dictionary signature or the form rules |
| `lower.ts` | The walker: parse tree to intermediate form, anaphora resolved at the end |
| `print.ts` | The intermediate form in the refgram notation |
| `formulas/*.yaml` | Printer cases, run by `formulas.test.js` |

CLI: `npm run cli -- formula "<text>"` (add `--all-defaults` to print the default conjunct of
every hidden unbound atom place, as `logic/default.md` does).

## Coverage

Supported:

- Chaining on atom and predicate places, the transitivity rule, right grouping; `pe ... pei` with
  one item.
- `zi` and `bi`, repeated.
- Explicit binds `vX`, `viX`, `fX`, the multi-place forms (`vao`, `vaio`) and the relative forms
  (`vehu`, `vahi`, ...); `vi` for a 0-ary conjunct; SI selection (`se`, `sae`, ...).
- Argument lists `vX k.. be` with KI and GI variables and `ba`; `bo` on a KI.
- `ze` and `zei`, following the anaphora rules of `logic/transformations.md`; `za`, `zai`; `zu`
  and `zui` on a variable; `zue` on a word whose A place is a 0-ary predicate.
- `zoiX` defaults, set with `oiX` sentences.
- Sentences `a`, `an`, `on`, `oni`, `onu`, `o`, `nu`, `ni`; erased sentences are skipped.
- Places come from a definition in the text, else from the dictionary signature, else from the
  form rules (E, plus A when the form is transitive). Borrowings are words without an entry, so
  they get the form rules.
- Dictionary `definition` texts lower as any text (`formulas/dictionary.yaml`); they are not
  loaded automatically.

Unsupported, reported as an `unsupported` node, never a guess:

- Transparent SI; `peo` and the other enumeration brackets; `pe` with several items; `bi` on a
  `pe` item.
- Quotes and numbers; namespaced words and `ohi`; `al` and every other sentence starter; `pa`.
- `bai` and the other sentence arguments; `ba` outside an argument list.
- `zeu`, `zeiu`; `boi`; `zu` on a non-variable; SI inside stacked ZI; an argument list on a
  multi-place bind; a bind or chain on a place the word does not have.

`ze` into a predicate handed to a consumer (chaining into a predicate place, `viX`, a definition
body) lowers to `unknown`: the projection of that argument is not defined.

## Formula cases

```yaml
- text: "a mian bjan"                 # required: the input
  source: refgram logic/chaining.md   # optional: where the sentence comes from
  note: arity mismatch resolution     # optional
  all_defaults: true                  # optional: print every default conjunct
  formula: |                          # optional: exact printer output
    bjan_1(c,e,a) := bjan(c,e,a)
    bjan_1^w(c,e) := ∃a. bjan_1(c,e,a)
    mian_1(c,e) := mian(c,e) ∧ bjan_1^w(c,e)
    mian_1^w(c) := ∃e. mian_1(c,e)
    assert mian_1^w(c)
  unsupported: "transparent SI"       # optional: the lowering reports an unsupported construct
                                      # containing this; without it the case must report none
  todo: "reason"                      # optional: registered as a todo, not run
```

Expectations are written from the refgram and the dictionary signatures, never bent to the code.

## Notation

One definition per line, in emission order (inner chain steps first, as the refgram). Instances
of a word are numbered in text order. The parameter list of a definition binds its variables: the
lines derived inside a definition (an argument list, a `zue` helper) are printed indented under it
and may use its parameters, while letters (`e a o u`) are always local to their line and named variables
(`x_ke`, `e_1`) always refer to an enclosing binder.

| Rendering | Meaning |
|---|---|
| `W_1(c,e,a) := W(c,e,a) ∧ ...` | constrained instance: base predicate and its binds |
| `W_1^w(c,e) := ∃a. W_1(c,e,a) ∧ zoia-W_1(c,a)` | wrapped instance: hidden places closed with their defaults, `bi` as `¬` outside |
| `A ≡ mian_1` | predicate place bound by equivalence: the same predicate for every argument and every context |
| `va_1(c,x_ke) := mian_1^w(c) where` | the definitions derived inside a definition (an argument list, a `zue` helper) follow it, indented; with an argument list the listed variables are its parameters |
| `ke_1(c,e) := (e = x_ke)` | KI variable from an argument list |
| `ze-mian_1(c,e) := (e = e_1)` | anaphora to an accessible instance, `e_1` hoisted to the text |
| `text ∃e_1` | first line: variables quantified over the whole text |
| `ze-meon_1(c,e) := ∃a. (e = a) ∧ ...` | anaphora under `bi`: the description reading |
| `unknown`, `⊥` | anaphora into a consumer's predicate; no anchor |
| `zoia-W_1(c,e) := zoia-W(c,e)` | default of place A of `W`, set with `oia W ...` |
| `define W`, `question W`, `define W capturing c` | `on`, `o`, `oni` |
| `axiom W`, `retract W`, `default W.A` | `nu`, `ni`, `oia` |
| `context Q_1(c,c')` | `an`: the next context is `c'` |
| `unsupported(reason)` | construct without settled semantics, never a guess |
