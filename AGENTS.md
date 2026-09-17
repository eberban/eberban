# Eberban AI Knowledge Base

This repository contains an AI-readable knowledge base for the Eberban logical constructed language.
It lives in `.ai/` and is written for any assistant: no vendor-specific directories in the repository.

## Knowledge Base Location

Start with [`.ai/notes/README.md`](.ai/notes/README.md). It indexes:

- `01-grammar-overview.md`: grammar mechanics, verified against the reference grammar
- `02-semantics.md`: the logical transcription as one calculus, with inconsistencies found
- `03-context.md`: the hidden context argument and everything stored in it
- `04-time-layer.md`: the time models and word-by-word implementability
- `05-layering-and-modules.md`: kernel / base namespaces / human vocabulary, module story
- `06-provers.md`: mapping onto Prolog, ASP, Lean, SMT
- `07-tooling-plan.md`: agreed tooling direction
- `08-course.md`: course for non-logicians, task and proposed rules
- `09-vocabulary-design.md`: word-form practice, eberbanization, recorded design decisions
- `open-questions.md`: decisions pending with the language author

Sources of truth are the grammar (`web/src/grammar/eberban.peggy`), the reference grammar
(`books/refgram/src/`) and the dictionary (`dictionary/en.yaml`).
