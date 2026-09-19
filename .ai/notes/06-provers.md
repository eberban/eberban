# Connecting Eberban to provers and evaluators

mia: "Would be interesting also to see how it can be connected or 'translated' to provers like
Prolog or Lean?"

Analysis throughout. Nothing here is decided.

## What has to be translated

From [02-semantics.md](02-semantics.md), a lowered sentence is a formula in:

- higher-order logic: predicates are passed as arguments and compared by `≡` over all their
  arguments;
- `∃` from wrapping, `∀` from `mao` and from equivalence, `∧` from chaining and binds, `¬` from
  `zi`/`bi`;
- three truth values, with undefined words unknown;
- a hidden extra argument threaded everywhere, locally replaced by `mua`;
- an environment of definitions (possibly recursive), toggled axioms, and per-word defaults;
- reified sets: `tcuhi` gives one atom per property, with membership by evaluation.

Everything a target lacks must either be encoded or be declared out of scope for that target.

## Prolog (SWI, XSB) and Datalog

| Eberban | Prolog | Fit |
|---|---|---|
| chaining, binds | conjunction of goals sharing variables | direct |
| `∃` from wrapping | free logic variables | direct |
| `on` definitions, recursion (`kidvo`, folds) | clauses | direct; termination needs tabling |
| predicate arguments | `call/N`, or terms naming predicates | workable |
| `≡` between predicates | no native form | encode as equal extension over a finite domain, or as a named equivalence fact |
| `∀` (`mao`) | `forall/2` over a finite domain, or negation of a counterexample | finite only |
| `¬` | negation as failure: closed world | conflicts with unknown-by-default |
| unknown | XSB well-founded semantics has a third value (undefined); SWI does not | XSB is the candidate (verify current support) |
| context `c` | one extra argument on every predicate | direct, verbose |
| `tcuhi` sets | a term `set(Pred)` plus `member(X, set(P)) :- call(P, X)` | direct on finite domains |
| defaults | wrapper clauses adding the default goal when the argument is unbound | encodable, but "unbound" is syntactic, must be decided at lowering |
| axioms `nu`/`ni` | `assert`/`retract` of facts | direct |

Verdict: a good execution backend for finite worlds. The natural use is the fixture tests in
[07-tooling-plan.md](07-tooling-plan.md): lower the sentence, emit a program with the world as
facts, ask the query. Answer-set programming (clingo) is the stronger option for the same job:
it supports classical negation, choice, and "for all" over finite domains without tabling
concerns, and it enumerates the worlds satisfying a definition, which answers "is this definition
consistent / what does it admit". Neither gives proofs about infinite domains.

## Lean 4

| Eberban | Lean | Fit |
|---|---|---|
| predicates | `Ctx → Atom → ... → Tri` where `Tri` is a three-valued type, or `Prop` when unknown is out of scope | direct |
| `≡` between predicates | `∀ x, P x ↔ Q x` (bivalent) or a `Tri`-valued equivalence | direct |
| `∃`, `∀`, `¬`, `∧` | native for `Prop`; hand-defined for `Tri` (strong Kleene) | direct |
| `on` | `def` | direct; recursion needs a termination proof or `partial` |
| axioms | hypotheses or `axiom` | direct |
| context | an explicit `Ctx` argument, or a reader-monad style | direct |
| sets | `Set Atom` or a structure carrying the property | direct; uniqueness of the set atom becomes a lemma |
| evaluation | `decide` over finite types, `simp` | limited |

Verdict: the right place for the **kernel specification** and for proofs about it: that wrapping
commutes with something, that `vzu` defined through `vze` has the intended truth table, that two
definitions are equivalent. Not an execution engine; proofs are manual beyond finite `decide`.
The three-valued layer is where the work is, and it is also where Eberban's semantics is
currently unspecified (02, "unknown"), so a Lean formalization would force that decision early.

## SMT (Z3) and bounded model finding (Alloy)

Finite-sorted encoding of a lowered formula, quantifiers over bounded sorts. Answers "does a world
of size n exist that makes this sentence true / false", which is a consistency check for
definitions and a way to generate counterexamples for the ergonomics test set. Cheap to target
once the lowering exists; no proofs.

## Recommended shape (proposal)

```
PEG parse tree
   → lowering (own intermediate form: typed formula with c, Tri, defs, axioms)
      → evaluator on world fixtures                 (fast loop, first target; design open, 07 item 4)
      → Prolog / ASP export of the same fixtures    (cross-check, second opinion)
      → Lean export of the kernel rules             (specification, hand proofs)
      → SMT export                                  (consistency, counterexamples)
```

The intermediate form is the contract. Every backend consumes it; the grammar and the PEG output
stay untouched.
