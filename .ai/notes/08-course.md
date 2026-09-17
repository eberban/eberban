# Course for non-logicians

Task stated by mia (2026-09-17), not started.

> "another important task i could have for you is writing a course targeted to non logicians. i
> have many people joining on Discord and trying to learn the lang, but having a hard time reading
> the refgram (expected). 2 blockers for that:
> - lack of vocabulary, of course
> - lack of explanations that don't use too much logical notation, and help building intuition for
>   how the language works and is used. some people are too confused by the refgram and instead
>   try too much to understand Eberban like if it was like English, with verbs, subjects and
>   nouns, which quickly fall apart"

## Where it lives

`books/new_course/` (mdbook, same toolchain as the refgram). Existing chapters: introduction,
morphology, phonology. `README.md` at the repo root explains how to serve a book.

## Proposed rules (proposal, not agreed)

- Every concept enters through a sentence and its box diagram from the visual parser, never
  through a formula. Logical notation appears only in optional "for the curious" asides.
- The first chapter after phonology is about the absence of nouns: every word describes, and
  chaining means each word narrows what the previous one is about. Particles come after that
  intuition is in place.
- One new mechanism per chapter, each mechanism motivated by a sentence the previous chapters
  cannot say.
- Every course sentence is also a parse corpus case (`07-tooling-plan.md`, item 1), so the course
  cannot drift from the parser. Corpus cases are keyed by their text; a course file per chapter
  under `web/src/grammar/corpus/` would keep them findable.
- Vocabulary used by the course is a closed, small set introduced chapter by chapter, drawn from
  the everyday domains the dictionary already covers; gaps found while writing feed the vocabulary
  tooling, not the course.

## Dependencies

- The parse corpus supplies verified example sentences (`web/src/grammar/corpus/examples.yaml`).
- Vocabulary gaps are the other stated blocker; see item 5 of `07-tooling-plan.md`.
