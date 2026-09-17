# Open questions

Decisions only mia can make. Each names where it blocks. Answering one here should be followed by
editing the refgram or the dictionary, not only this file.

## Semantics

1. Where defaults live: environment (shared, per word) or context. `default.md` reads as
   environment.
2. `ze` "non-wrapped instance": confirm the reading "an instance evaluated once with concrete
   variables". The donkey case stays open by the refgram's own TODO, as does `bo` inside an
   equivalence-bound predicate.
3. `mao` prose versus formula (02, inconsistency 1): which is right.
4. `bahi`/`bahe` glosses versus the GI rule (02, inconsistency 2): which parenthesis is wrong.

## Context

5. Initial context of a text: empty map, official defaults, or unspecified.
6. Mechanism for automatic per-sentence updates (the present advancing): kernel rule, or a word
   to register a transformation, replacing the draft's `pahi`.
7. Context keys: names of words (`zai word`) or dedicated atoms.
8. Whether the context is an Eberban map atom (`kagvin`) or a kernel record exposed through
   `kagvehe`-like words only.

## Time

9. Relations: keep possibility only (current `sp-`), or reintroduce the possible/necessary pairs
   of the draft. Interaction with `smi`/`smu`.
10. Metric between instants across branches: needed by `spe`/`spu` durations, `sma`, vague
    durations. Per-timeline seconds, or none.
11. Calendar data: axiomatized in Eberban, or provided by the kernel as facts.
12. Which of the human dictionary plumbing words move into the base namespace: `kin`, `kagvin`,
    `kagvil`, `kagve`, `kagvehe`, `kagva`, `kagvihi`, `bjur`, `bju`, `bjea`, `tcuhi`, `tcehi`,
    `tcohi`, `tcihe`.
13. The ergonomics test set in [04-time-layer.md](04-time-layer.md): amend and confirm.

## Modules

14. Hygiene of imported texts (see 05, question 1).
15. Import evaluated once at `ohi`.
16. Context and axioms at import time.
17. Shadowing and collision rules for `on` and `noi`.
18. Defaults set on namespaced words from outside.
19. Referencing a base text by name rather than inlining a quote.
20. Cycles between base texts.
21. Name and count of base namespaces (data, context, time, numbers).

## Tooling

22. `zoni` ("but:") outside the `vz-` connective pattern of `vze`/`vzu`: intended?
