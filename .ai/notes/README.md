# Eberban AI notes

Working notes for AI assistants (any vendor) helping develop Eberban: its logic, its context
mechanism, its time vocabulary, its layering as a language that defines itself, and the tooling
around it.

Sources of truth, in order:

1. `web/src/grammar/eberban.peggy`: the grammar. Only parser.
2. `books/refgram/src/`: the reference grammar. Logic chapters under `logic/`, vocabulary design
   under `vocabulary/`.
3. `dictionary/en.yaml`: the vocabulary. `short` fields carry typed place signatures; a few entries
   carry a `definition` in Eberban or in lambda notation.

`books/refgram/src/from_scratch/` is an unpublished draft (commented out of `SUMMARY.md`). It uses
an older particle allocation and is treated here as design input, not as specification. See
[05-layering-and-modules.md](05-layering-and-modules.md).

## Files

| File | Content |
|------|---------|
| [01-grammar-overview.md](01-grammar-overview.md) | Compact reference of grammar mechanics, verified against the refgram |
| [02-semantics.md](02-semantics.md) | The logical transcription as one calculus: chaining, wrapping, binds, defaults, negation, sentences. Inconsistencies found |
| [03-context.md](03-context.md) | The hidden context argument: mechanism, everything the vocabulary stores in it, lifecycle, what is missing |
| [04-time-layer.md](04-time-layer.md) | The two documented time models, word-by-word implementability, friction points |
| [05-layering-and-modules.md](05-layering-and-modules.md) | Kernel / base namespaces / human vocabulary; the module story and its open questions |
| [06-provers.md](06-provers.md) | Mapping Eberban logic onto Prolog, ASP, Lean, SMT; what each can and cannot do |
| [07-tooling-plan.md](07-tooling-plan.md) | Tooling direction agreed with mia, in order |
| [08-course.md](08-course.md) | Course for non-logicians: the task as stated, proposed rules, dependencies |
| [09-vocabulary-design.md](09-vocabulary-design.md) | Word-form practice, eberbanization method, recorded design decisions; to be confirmed by mia |
| [open-questions.md](open-questions.md) | Every decision only mia can make, consolidated |

## Status legend used in the notes

- **As written**: restates the refgram or dictionary. Cite the file.
- **Analysis**: an assistant's reading or derivation. Can be wrong; say why it follows.
- **Open**: a question mia has not answered. Never resolve one silently in code or vocabulary.
- **mia**: a verbatim statement by the language author. Load-bearing; do not paraphrase.

## Working rules

- Verify morphology and structure with the parser, not by eye: `npm run cli -- parse "<text>"`
  and `npm run cli -- word <w>` from `web/` (build the parser first with `npm run build-peggy`).
  Regression cases go in the parse corpus, `web/src/grammar/corpus/`.
- Type roots (`pan`, `man`, `gan`, `gien`, `ski`, `sken`, `skan`) are definition-level. They belong in `short` signatures and definitions, not in example sentences.
- Vocabulary changes go through `dictionary/en.yaml` with `id: INSERT_WORD_ID` then `npm run ids` in `dictionary/`.
- The PEG grammar is not to be restructured or replaced. Tooling consumes its output.
- Commit format: `<scope>: <verb> <subject>`, see `CONTRIBUTING.md`.
