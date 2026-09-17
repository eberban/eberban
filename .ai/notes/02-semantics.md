# Semantics as one calculus

The refgram gives the logical transcription by worked examples spread over six chapters, with two
notations: `W_1` for a word constrained by its neighbours, `W^w_1` for the same word wrapped to a
smaller arity. This file states the rules those examples follow, in one place, then lists where
the chapters disagree.

Everything under **Rules** is a restatement of `logic/chaining.md`, `logic/explicit_binding.md`,
`logic/transformations.md`, `logic/default.md`, `logic/sentences.md`, `logic/primitives.md`.
Everything under **Analysis** is derived and can be wrong.

## Rules

### Objects

- A predicate `W` has places `(c, x_1 .. x_n)`. `c` is the context. Each `x_i` is typed atom or
  predicate (with an arity).
- A chain step produces two things: the constrained predicate `W_1` with the same places as `W`,
  and the wrapped predicate `W^w_1` with only the exposed places.
- Truth values: true, false, unknown. `mui` is unknown. Any undefined word is unknown for all
  arguments.

### Step 1: grouping

`A B C D` is `A (B (C D))`. Transcribe from the innermost (rightmost) verb outward. `pe ... pei`
groups explicitly and has priority over chaining.

### Step 2: constraining a verb

`W_1(c, x_1..x_n) = W'(c, x_1..x_n) ∧ B_1 ∧ ... ∧ B_k`

where `W'` is `W` or `¬W` when prefixed by `zi`, and each `B_j` is one bind:

- **chaining, atom place p**: `B = R^w(c, x_p)`, the right chain wrapped to 1-ary on its E.
- **chaining, predicate place p of arity m**: `B = (x_p ⇔ R^w)`, the right chain wrapped to arity m.
  Equivalence is over all arguments and any context: the right chain is a definition the left word
  may instantiate any number of times, with any context.
- **`vX chain vei`** (X atom place): `B = chain^w(c, x_X)`.
- **`viX chain vei`** (X predicate place): `B = (x_X ⇔ chain^w)`.
- **`vX k_1 .. k_j be chain`**: the place is bound to the listed variables, and `chain^w` is a
  0-ary conjunct in which the same variables occur. Refgram form: `va_1(c,e) = ke_1(c,e) ∧ mian^w_1(c)`
  with `ke_1(c,e) = [e is variable x]`.
- **`fX`**: same as `vX` on the same verb as the last open VI.
- **`vi chain`**: `B = chain^w(c)`, 0-ary, nothing shared but `c`.
- **`voi X`**: `W` is passed as the A proposition of `X`; the result exposes X's places; W's own
  binds and chaining still attach to W's places, evaluated outside X.
- Binds are additive: two binds on one place are both conjoined. Two equivalence binds on one
  predicate place state the two definitions equivalent to each other.

### Step 3: wrapping

`W^w_1(c, exposed) = ∃ hidden. W_1(c, all) ∧ ⋀_{p unbound hidden atom} zoiX-W_1(c, x_p)`

- Which places are exposed: with no SI, the chaining rule decides (E for intransitive, A for
  transitive) and the place count expected by the consumer (1 for an atom place, m for an m-ary
  predicate place, 0 at sentence level). With SI, the listed vowels in the listed order.
- Every hidden place is existentially closed. A hidden place that received no bind gets its
  default constraint (`logic/default.md`); a default is `mai` unless set with `oiX`.
- `bi W ...` negates the wrapped result: `¬ ∃ hidden. ...`. `zi` stays inside. Repeated `zi` or
  `bi` nest, so a pair cancels out.
- Transparent `siX`: the wrapped result re-exposes the right predicate's places instead of W's.

### Step 4: sentences

- `a P`: assert `P^w(c_now)`, 0-ary. Per the dictionary note on `e a sai`, `a P` is sugar for
  defining `P` as a word and asserting, as an axiom, that the speaker asserts it.
- `an Q`: `Q` is 1-ary over the next context: the context given to following sentences is some
  `c'` with `Q(c_now, c')`... precisely, `Q` is evaluated with `c_now` and its E is `c'`.
- `on W args be chain`: `W(c, args) ⇔ chain` for the caller's `c`. Without `be`, `W` re-exports the
  chain's exposed places. `oni`: same but `c` is fixed to the current global context. `onu W ...`:
  `on` then `nu W`.
- `nu W`: `W^w(c_global)` is held true. `ni W` retracts. Redefining `W` does not change an enabled
  axiom until `nu` is said again.
- `o W chain`: introduces `W` for the answer; the listener replies with a sentence using `W`.
- Sentences in a text are conjoined; existentials introduced in one stay available to `ze` in the
  next (`transformations.md`, anaphora example).

### Primitives (`logic/primitives.md`, dictionary)

```
ma(c,e)        = is-atom(e)
mai(c,e)       = ⊤
mae(c,E,A,o)   = ∀x... E(c,x...) ⇔ A(c,o,x...)          partial application
mao(c,e,A,O)   = ∀x... O(c,x...) ⇒ A(c,x...)             O default mai: universal closure of A
mui(c)         = unknown
mue(c,e)       = (c = e)
mua(c,e,A)     = A(e)                                     A evaluated with e as its context
ki(c,e)        = (e = x_ki)                               one fixed variable per KI form
ze-W(c,args)   = (args = args of the latest non-wrapped instance of W)
za P(c,e,a)    = [e is named with property P by a]
zue W          = W with [A:()] turned into [A:(p)] applied to E
```

## Analysis

### The whole thing is one recursive function

`transcribe(chain, c, exposed) → formula` where exposed is the list of places the consumer needs.
Every construct above is a case of it. The only non-local pieces are: `ze` (needs the trace of
previous instances), defaults (need the definition environment), `an` (threads `c` across
sentences), `nu` (a global set of held propositions). This is small enough to implement directly,
which is the basis of the evaluator in [07-tooling-plan.md](07-tooling-plan.md).

### Two environments, one named

The context `c` is per sentence, passed inward, never mutated by a sentence. Definitions (`on`),
axioms (`nu`), namespaces (`ohi`) and defaults (`oiX`) live somewhere else that the refgram does
not name and that every interlocutor shares ("the root namespace", `logic/sentences.md`). These
notes call it the **environment**. It is mutated by O and NI sentences in text order. The
distinction matters for the evaluator and for the module story: `c` is a value, the environment
is a store.

### Quantifier and connective behaviour on `unknown` is unspecified

Nothing in the refgram says what `∧`, `¬`, `∃`, `∀`, `⇔` do when an operand is unknown. The
worked examples never involve it. An evaluator must pick a table. Strong Kleene is the obvious
candidate (unknown ∧ false = false, unknown ∧ true = unknown, ¬unknown = unknown, ∃ = unknown when
no witness is true and some case is unknown). This is a language decision, not a tooling one. See
[open-questions.md](open-questions.md).

### KI scope is unspecified

`ki(c,e) = [e is variable x]` gives a name, not a binder. Where `x` is quantified (sentence,
paragraph, text) is not stated. `bo ke` starts a fresh `x`. Practice in the dictionary and the
draft chapters uses KI as sentence-local names inside definitions and as text-long pronouns in
speech; both readings are consistent with the refgram, which is the problem.

### Definitions are the only recursion

`kidvo`, the folds `bla`/`blai`, and the list predicates are recursive `on` definitions. The
refgram never says whether a recursive definition is a least fixed point, a greatest one, or
simply an equation. For `kidvo` over an infinite chain the chapter says it "can even handle a
countable infinity", which reads as the equation view. For an evaluator over a finite world this is
harmless (iterate to a fixed point); for a prover it must be decided.

### `an` constrains, it does not compute

`an Q` says the next context satisfies `Q`. If `Q` is not functional there are many next contexts.
The vocabulary designed for `an` (`kagvi`-style transformation lists, `en an skun sai`) is
functional in practice. The rule as written allows nondeterminism; the intended reading is
probably "the next context is the unique `c'` such that `Q`", which should be said.

## Inconsistencies found in the sources

1. **`mao` prose contradicts its formula.** `logic/primitives.md` formula: `O ⇒ A`, so `O ⊆ A`. Its
   prose: "A is a subset of O, in the sense that any list of arguments that satisfy A also satisfy
   O". The dictionary follows the formula ("All arguments satisfy [A] if they satisfy [O]").
2. **`bahi`/`bahe` glosses are swapped relative to the GI rule.** `logic/explicit_binding.md`:
   "bahi a transitive predicate argument (like a gi-initial GI), bahe an intransitive predicate
   argument (like a non gi-initial GI)". Same chapter, earlier: gi-initial GI are intransitive,
   the others transitive. One of the two parentheses is wrong.
3. **`from_scratch/` uses a superseded particle allocation.** `po` for define (now `on`), `pou` for
   define-and-enable (now `onu`), `pae`/`pahe` for context set/update (now `an`), `pahi` for a
   sentence wrapper (no current word), `pu` for axiom toggle (now `nu`/`ni`; `PU` has no member),
   `poie..` for defaults (now `oie..`). `pa` is now the echo-resumptive particle.
4. **`ze` "non-wrapped instance"** (`logic/transformations.md`) is not defined. Every chain step
   wraps. The example shows it means "an instance evaluated once with concrete variables, as
   opposed to one inside a definition body that is instantiated many times". The chapter's own
   TODO on donkey anaphora is this gap.
5. **Time-model duplication.** `vocabulary/event_tenses.md` and `from_scratch/core_to_complete/time.md`
   describe two different models with different vocabulary. Detailed in [04-time-layer.md](04-time-layer.md).
