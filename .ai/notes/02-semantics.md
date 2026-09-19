# Semantics as one calculus

The refgram gives the logical transcription by worked examples spread over six chapters, with two
notations: `W_1` for a word constrained by its neighbours, `W_1^w` for the same word wrapped to a
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
  and the wrapped predicate `W_1^w` with only the exposed places.
- Truth values: true, false, unknown. `mui` is unknown. Any undefined word is unknown for all
  arguments.
- Every definition line takes its own `c`: a parameter bound by whoever applies the line, which
  may or may not be the same context as the neighbouring lines. An undefined word with a
  predicate place may evaluate that place in a context of its own choosing, so nothing inside an
  equivalence-bound predicate can name the caller's context (mia, 2026-09-17: "every line taking
  c as parameter, it is its own c (shadow), that may or may not correspond to the same c as other
  lines (depending who evaluates it)").

### Step 1: grouping

`A B C D` is `A (B (C D))`. Transcribe from the innermost (rightmost) verb outward. `pe ... pei`
groups explicitly and has priority over chaining.

### Step 2: constraining a verb

`W_1(c, x_1..x_n) = W'(c, x_1..x_n) ∧ B_1 ∧ ... ∧ B_k`

where `W'` is `W` or `¬W` when prefixed by `zi`, and each `B_j` is one bind:

- **chaining, atom place p**: `B = R^w(c, x_p)`, the right chain wrapped to 1-ary on its E.
- **chaining, predicate place p of arity m**: `B = (x_p ≡ R^w)`, the right chain wrapped to arity m.
  Equivalence is over all arguments and any context: the right chain is a definition the left word
  may instantiate any number of times, with any context.
- **`vX chain vei`** (X atom place): `B = chain^w(c, x_X)`.
- **`viX chain vei`** (X predicate place): `B = (x_X ≡ chain^w)`.
- **`vX k_1 .. k_j be chain`**: the place is bound to the listed variables, and `chain^w` is a
  0-ary conjunct in which the same variables occur. Refgram form: `va_1(c,e) = ke_1(c,e) ∧ mian_1^w(c)`
  with `ke_1(c,e) = [e is variable x]`.
- **`fX`**: same as `vX` on the same verb as the last open VI.
- **`vi chain`**: `B = chain^w(c)`, 0-ary, nothing shared but `c`.
- **`voi X`**: `W` is passed as the A proposition of `X`; the result exposes X's places; W's own
  binds and chaining still attach to W's places, evaluated outside X.
- Binds are additive: two binds on one place are both conjoined. Two equivalence binds on one
  predicate place state the two definitions equivalent to each other.

### Step 3: wrapping

`W_1^w(c, exposed) = ∃ hidden. W_1(c, all) ∧ ⋀_{p unbound hidden atom} zoiX-W_1(c, x_p)`

- Which places are exposed: with no SI, the first places in signature order (E, then A, ...), as
  many as the consumer expects (1 for an atom place, m for an m-ary predicate place, 0 at sentence
  level, all of them for a definition without argument list). The chaining rule (E for
  intransitive, A for transitive) picks the place bound to the right neighbour, not the exposed
  ones. With SI, the listed vowels in the listed order.
- Every hidden place is existentially closed. A hidden place that received no bind gets its
  default constraint (`logic/default.md`); a default is `mai` unless set with `oiX`.
- `bi W ...` negates the wrapped result: `¬ ∃ hidden. ...`. `zi` stays inside. Repeated `zi` or
  `bi` nest, so a pair cancels out.
- Transparent `siX`: the wrapped result re-exposes the right predicate's places instead of W's.
- Written as one line, `W_1^w(c, exposed) = ¬∃hidden. W_1(c, all) ∧ defaults`, negation and
  defaults only when they apply; omitted when identical to `W_1` (`logic/chaining.md`, Wrapping).

### Step 4: sentences

- `a P`: assert `P^w(c_now)`, 0-ary. Per the dictionary note on `e a sai`, `a P` is sugar for
  defining `P` as a word and asserting, as an axiom, that the speaker asserts it.
- `an Q`: `Q` is 1-ary over the next context: the context given to following sentences is some
  `c'` with `Q(c_now, c')`... precisely, `Q` is evaluated with `c_now` and its E is `c'`.
- `on W args be chain`: `W(c, args) ≡ chain` for the caller's `c`. Without `be`, `W` re-exports the
  chain's exposed places. `oni`: same but `c` is fixed to the current global context. `onu W ...`:
  `on` then `nu W`.
- `nu W`: `W^w(c_global)` is held true. `ni W` retracts. Redefining `W` does not change an enabled
  axiom until `nu` is said again.
- `o W chain`: introduces `W` for the answer; the listener replies with a sentence using `W`.
- Sentences in a text are conjoined; existentials introduced in one stay available to `ze` in the
  next (`transformations.md`, anaphora example).

### Anaphora (`ze`, `zei`, `bo`; `logic/transformations.md`)

- Anchors are the instances of predicate words in the speaker's own text. `bo K` anchors the
  variable `K` to the E witness of its step. Instances inside a definition body are anchors only
  inside that body, per instantiation: using a word exposes no internal anchor.
- Accessible anchor (path from the text root made of `∧` and `∃` only: chaining, sharing binds,
  `vi`, `pe`, successive `a` sentences): same witness, hoisted to text level,
  `ze-W(c,e) = (e = e_1)`.
- Anchor under `bi` only: description reading, the negated body with the variable freed,
  `ze-meon(c,x) = bure(c,e_1,x) ∧ meon(c,x)`; false when nothing fits.
- Anchor inside a predicate handed to a consumer (chaining into a predicate place, `viX`, an `on`
  body seen from outside): needs the consumer's projection, not defined. `ze-W` is unknown.
- No anchor, or a KI never assigned: false.
- Inside a definition body: anchors of the body first, then those of the text before the
  definition; resolved when the definition is made, the body captures the hoisted witness.
- `bo K` inside a definition body or a bound predicate: assignment scoped to that predicate, per
  instantiation. This is what `kidvo`'s `fia bo ki ...` needs.

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
ze-W(c,args)   = (args = args of the latest instance of W), see Anaphora above
za P(c,e,a)    = [e is named with property P by a]
zue W          = W with [A:()] turned into [A:(p)] applied to E
```

## Analysis

### The whole thing is one recursive function

`transcribe(chain, c, exposed) → formula` where exposed is the list of places the consumer needs.
Every construct above is a case of it. The only non-local pieces are: `ze` (needs the trace of
previous instances), defaults (need the definition environment), `an` (threads `c` across
sentences), `nu` (a global set of held propositions). This is small enough to implement directly,
which is what `web/src/semantics/lower.ts` does ([07-tooling-plan.md](07-tooling-plan.md)).

### Two environments, one named

The context `c` is per sentence, passed inward, never mutated by a sentence. Definitions (`on`),
axioms (`nu`), namespaces (`ohi`) and defaults (`oiX`) live somewhere else that the refgram does
not name and that every interlocutor shares ("the root namespace", `logic/sentences.md`). These
notes call it the **environment**. It is mutated by O and NI sentences in text order. The
distinction matters for evaluation and for the module story: `c` is a value, the environment is a
store.

### Unknown, KI scope, recursion, `an` (as written, decided 2026-09-17)

- Connectives and quantifiers on unknown: strong Kleene (`logic/intro.md`). Unknown means "not
  determined"; a false conjunct or a true witness decides, otherwise unknown propagates.
- KI scope (`logic/explicit_binding.md`): `bo ke` holds for the rest of the text until reassigned;
  a KI in a definition's argument list is local to that definition and shadows. `bo` inside a
  definition body or a bound predicate is scoped to that predicate, per instantiation; `ze` into a
  consumer's predicate is unknown until projection is defined (Anaphora above).
- Recursive definitions (`logic/sentences.md`): a definition may use its own word; it denotes what
  its body derives in finitely many steps, unknown otherwise (the three-valued least fixed point).
  `kidvo` on an infinite chain is unknown, not false. An evaluator may special-case known concepts
  (transitive closure, graph reachability) to refine unknown into true or false, never the reverse.
- `an Q` (`logic/sentences.md`): nondeterministic; following sentences are true when true in every
  context satisfying `Q`, false when false in every one, unknown otherwise. The lowering emits
  `context Q_1(c,c')` and leaves the choice of `c'` to whoever evaluates the program.
- Anaphora (`logic/transformations.md`, rules above). mia: "using a word is a blackbox and doesn't
  expose its internals for anaphora"; on `ze` with no anchor: "don't exist, false"; on an anchor
  inside a consumer's predicate without projection: "it should return unknown (undecided/unproven)",
  because a disconnected description "can refer to a cat that has nothing to do with the original
  sentence". The refgram passage where `ze mian` reached the `mian` inside `gia`'s definition was
  removed accordingly.

### Projection (not implemented)

mia: the projection "not being included must really be marked as a current limitation that should
be lifted in the future". Strategy to assess, not yet checked to "really work like we want":

- For a consumer `W` and one of its predicate places `P`, the projection `Proj_W,P` relates the
  argument tuple and the context `W` applies `P` to, to `W`'s own places. It is what a listener
  knows about `W` without knowing its definition, like its transitivity.
- Derived from `W`'s Eberban definition by collecting the constraints on the path from the body
  root to the point where the parameter is applied or bound, composed through nested consumers.
  Declared for primitives: `mua` (context = E), `tcuhi` (argument is a member of E), `tca`
  (argument = E), `mao` and `mae` (none). `tcu` bottoms out in `tcuhi` and `tca`, both undefined
  today, so its projection needs those declarations.
- A place is transparent when its projection is a single positive application in a determined
  context; the same-witness rule then applies through it (tense words built on `mua`).
- With projection, `ze mian` in `a mi dona tcu mian a ze mian za uneko` builds a new predicate
  `ze-mian_1(c,x) = tcihe(c,x,a_1) ∧ mian_1(c,x)` with `a_1` the hoisted set: "one of the cats in
  the set I like is named Neko". Sentence 1 is untouched. mia asked whether it refers to one cat or
  a subset: one cat with the projection (`tcu` iterates over singletons), any group of cats under
  the plain description, which mia rejected as unintuitive.
- To assess: composition through undefined base words, set versus individual under the `tce*`
  convention and distributivity, contexts under tense words, whether primitive projections live in
  the dictionary or in code.

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
4. **Time-model duplication.** `vocabulary/event_tenses.md` and `from_scratch/core_to_complete/time.md`
   describe two different models with different vocabulary. Detailed in [04-time-layer.md](04-time-layer.md).
