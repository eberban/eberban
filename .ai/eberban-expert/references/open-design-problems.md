# Eberban Open Design Problems

## Anaphora (ze) through equivalence boundaries

### Problem statement
When ze targets a word inside an equiv-bound predicate place (e.g., etiansa inside `tcu etiansa meon`), the word's variables are not concrete — they're quantified over by the enclosing word's evaluation. ze must link to concrete values or it's no different from using the word again.

### Example
```
a mi dona tcu etiansa meon    -- "I like the set of all apple-eaters"
a ze etiansa ...              -- how to access the specific apples (A of etiansa)?
```

- ze on atom-position (`se ze tcu`) gives the set — but can't access the apples.
- ze on pred-position (ze etiansa) MUST link to concrete values or it's useless.

### Reverse context mechanism (partially designed)
- A second "reverse" context propagates right-to-left through sentences.
- ze deposits a request; the request walks back to the original word.
- When it hits a word with equivalence-bound pred places, it ENTERS the bound (not bypasses it) — detecting the equivalence, preparing the reverse context, then passing it into the opaque bound.
- Inside the bound, propagation continues right-to-left, looking for equivalence binds recursively.

### Design constraints
1. Must not collapse/restrict the original sentence's meaning (read-only)
2. Must be general (no per-word anaphora definitions — speakers define words without thinking about this)
3. Must link to concrete values from the original evaluation (or ze is useless)
4. Must handle multiple instantiation (donkey anaphora)
5. The ∀ from equivalence (∀x. A(c,x) ⟺ P(c,x)) is inherent but normal chaining at ze site wraps in ∃, so the universal doesn't surface directly

### Open question
How does the reverse context "prepare" when entering an equivalence boundary such that ze gives the predicate restricted to instances from the original evaluation, without requiring word-specific knowledge? One candidate: the reverse context carries the enclosing atom variable (the set/entity) and ze's result is the predicate constrained to that atom's scope. But the mapping from equiv-bound pred place to associated atom place may not be generally derivable.

---

## Time system ergonomics

### Problem statement
The time system's core ideas are sound (graph of instants, common timespan, context propagation), but expressing many common temporal statements involves too much friction. The vocabulary and mechanics are expected to be reworked.

### Known friction points
- Common phrases (yesterday, tomorrow, next week) require verbose constructions
- Calendar expressions need multiple chained predicates for simple dates
- Interaction between time anchor, common timespan, and narrative tense is not always intuitive

### Status
Active design problem. Core concepts likely stable; surface vocabulary and sugar likely to change.

---

### Cross-sentence anaphora
Model by ANDing sentences — existentials stay in scope. This reduces the problem to intra-sentence anaphora and may solve some presupposition issues.

---

## Unknown answers to 0-ary questions

### Problem statement
When a question is 0-ary (yes/no), there's no elegant way for the answerer to express "unknown." For questions with GI variables, `a bi gi` = "nobody" works, but for `o [proposition]` (is this true?), there's no standard particle to answer "I don't know" / "the answer is unknown."

### Status
TODO in refgram (sentences.md): "Add an easy way to state the answer to the question is unknown / gi equivalent to mui."

---

## Context transformation on speaker change

### Problem statement
When the speaker changes in a conversation, the context (mi/mo/mio) must transform — the previous listener becomes the new speaker, etc. This transformation is described conceptually but no standard particles have been allocated to handle it.

### Status
TODO in refgram (sentences.md): "create word for it and define how it works." The concept exists but the mechanism is unimplemented.
