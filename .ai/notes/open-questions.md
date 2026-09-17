# Open questions

Decisions only mia can make. Each names where it blocks. Answering one here should be followed by
editing the refgram or the dictionary, not only this file.

## Semantics

1. Truth tables of `∧ ¬ ∃ ∀ ⇔` when an operand is unknown. Blocks the evaluator. Candidate: strong
   Kleene.
2. Scope of KI variables: sentence, paragraph, text. Blocks lowering of any sentence with KI.
3. Recursive definitions: equation, least fixed point, or greatest. Blocks provers; the finite
   evaluator can iterate.
4. `an Q` with a non-functional `Q`: nondeterministic next context, or the unique `c'` satisfying
   `Q`, or an error.
5. Where defaults live: environment (shared, per word) or context. `default.md` reads as
   environment.
6. `ze` "non-wrapped instance": confirm the reading "an instance evaluated once with concrete
   variables". The donkey case stays open by the refgram's own TODO.
7. `mao` prose versus formula (02, inconsistency 1): which is right.
8. `bahi`/`bahe` glosses versus the GI rule (02, inconsistency 2): which parenthesis is wrong.

## Context

9. Initial context of a text: empty map, official defaults, or unspecified.
10. Mechanism for automatic per-sentence updates (the present advancing): kernel rule, or a word
    to register a transformation, replacing the draft's `pahi`.
11. Context keys: names of words (`zai word`) or dedicated atoms.
12. Whether the context is an Eberban map atom (`kagvin`) or a kernel record exposed through
    `kagvehe`-like words only.

## Time

13. Relations: keep possibility only (current `sp-`), or reintroduce the possible/necessary pairs
    of the draft. Interaction with `smi`/`smu`.
14. Metric between instants across branches: needed by `spe`/`spu` durations, `sma`, vague
    durations. Per-timeline seconds, or none.
15. Calendar data: axiomatized in Eberban, or provided by the kernel as facts.
16. Which of the human dictionary plumbing words move into the base namespace: `kin`, `kagvin`,
    `kagvil`, `kagve`, `kagvehe`, `kagvi`, `kagvihi`, `bjur`, `bju`, `bjea`, `tcuhi`, `tcehi`,
    `tcohi`, `tcihe`.
17. The ergonomics test set in [04-time-layer.md](04-time-layer.md): amend and confirm.

## Modules

18. Hygiene of imported texts (see 05, question 1).
19. Import evaluated once at `ohi`.
20. Context and axioms at import time.
21. Shadowing and collision rules for `on` and `noi`.
22. Defaults set on namespaced words from outside.
23. Referencing a base text by name rather than inlining a quote.
24. Cycles between base texts.
25. Name and count of base namespaces (data, context, time, numbers).

## Tooling

26. `zoni` ("but:") outside the `vz-` connective pattern of `vze`/`vzu`: intended?
