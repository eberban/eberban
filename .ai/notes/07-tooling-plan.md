# Tooling plan

What was agreed with mia in the session of 2026-09-16/17, with the words that agreed it. Item 1
is implemented; the rest is not.

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
   - Test format: world fixture (atoms, fact tables per undefined root, context fields) plus
     cases `text` → `true | false | unknown`.
3. **Dictionary lint.** mia: "why not". Signature syntax, transitivity versus signature (the check
   already found `vire` with `[E] visits [E]` and `stini` vowel-final with one place), CCV and
   final `-i` imply a predicate A place, compound components and `see_also` targets exist,
   embedded examples parse, morphology validity. No stats command: "there is already counts
   displayed on the dictionary page".
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
