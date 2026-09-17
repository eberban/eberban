# Tooling plan

What was agreed with mia in the session of 2026-09-16/17, with the words that agreed it. Items 1
and 3 are implemented; the rest is not.

## Constraints

- mia: "i'd like to avoid breaking up stuff outside of the PEG grammar, or replacing it. PEG
  grammar required a lot of work and it is non trivial to make changes to it". The grammar stays
  the only parser; tools consume `eberban.peggy.js` output.
- mia, on `.ai/`: "i prefered to use that to not be opinionated on which AI to use". No
  vendor-specific directories in the repository.
- New tooling in TypeScript inside `web/` so it imports the parser directly (assumption stated to
  mia, not contested).

## Agreed items, in order

1. **Parse corpus and CLI** (implemented). mia: "why not, but Eberban grammar is not very
   complex. at least it would easily catch regression if we ever update the PEG grammar."
   - `web/src/grammar/corpus/*.yaml`, one file per grammar area, format and shape notation in
     the corpus `README.md`. Cases carry `shape` (one-line structure), `error` (message
     substring), `warning`, `snapshot`, or `todo` for expectations pending a decision.
   - `web/src/grammar/corpus-properties.test.js`: every dictionary root and compound parses as
     itself, concatenated roots re-segment.
   - CLI in `web/`: `npm run cli -- parse "<text>"` prints the shape line and glosses,
     `npm run cli -- word <w>` reports class, transitivity, segmentation.
   - Expectations are written from the refgram, never bent to the parser. A mismatch is a
     finding for mia or a code fix after mia decides.
2. **Lowering and evaluator.** mia: "that would be incredible" (lowering); "we'll really need to
   have tools to interpret those sentences and write tests to ensure they are correct"
   (evaluator).
   - One walker over the parse tree implementing [02-semantics.md](02-semantics.md), two
     backends: formula printer in the refgram notation, finite-model evaluator.
   - Constructs without settled semantics produce an explicit unsupported node, never a guess:
     `ze` across definitions, cross-sentence context updates beyond `an`, speaker change.
   - mia, on `an`: "non deterministic is what matches the most the idea. but as a first step we
     could only support unique, with a note stating the intent". The evaluator reports an error
     when `an Q` admits zero or several contexts.
   - mia, on recursion: the evaluator "could add extra shortcuts/special handling of some concepts
     to shortcircuit the problematic infinite" cases; shortcuts refine unknown only.
   - Test format: world fixture (atoms, fact tables per undefined root, context fields) plus
     cases `text` → `true | false | unknown`.
3. **Dictionary lint** (implemented). mia: "why not". `web/src/shared/dict-lint.js`, run by
   `npm run cli -- lint` and by `web/src/grammar/dictionary-lint.test.js`, which fails on any
   finding (no allowlist). Rules: every key parses as its `family` (particles through the
   grammar rule of the same name), `family` codes exist in `_family`, signature syntax (first
   mention typed, places a prefix of EAOU, a predicate-only first place may be written as A,
   generic predicate type `p(...)` on first mention), root transitivity versus signature, CCV
   and final `-i` iff predicate A place, gloss colon convention, compound components and
   `see_also` targets exist, `{...}` references and examples parse, Eberban `definition` fields
   parse and define their key. A `definition_draft` field is ignored by the lint. No stats
   command: "there is already counts displayed on the dictionary page".
4. **Base layer in Eberban** with fixtures, following [05-layering-and-modules.md](05-layering-and-modules.md).
   Then tenses as the first human-vocabulary exercise, measured on the ergonomics test set of
   [04-time-layer.md](04-time-layer.md) once mia has amended it.
5. **Vocabulary tooling.** mia: "why not". `propose-root` (generator + collision check + prefix
   family and vowel-scale patterns + nearest existing forms), `dict add` writing the entry and
   its id. Design guidelines: [09-vocabulary-design.md](09-vocabulary-design.md).

## Not agreed, listed for completeness

- Grounding check (definition graph, grounded / axiomatic / ungrounded). mia: "For grounding it is
  very difficult work. I consider it being good enough for now if it seems feasible to implement
  using Eberban constructs." Keep as a report, not a gate.
- Shared semantic core. Place rules live in `web/src/shared/places.js`, used by the visual
  parser and the CLI. The two SI parsers still diverge on validation (`places.js:150` accepts a
  second `h`, `particle-gloss.js:113` rejects it).
