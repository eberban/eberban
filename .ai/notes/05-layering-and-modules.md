# Layering and modules

## Direction set by mia (verbatim)

> "the from scratch part should probably be redone entirely. this was my human attempt to do
> something from core grammar. it should probably be namespaced and not mixed with human targeted
> vocabulary, and instead haave more high level vocabulary that use those low level namespaced
> concepts"

> "probably separate between low level verbose base, and then ergonomic vocabulary above for
> himans"

> (base namespaces) "can be multiple texts"

> "It may be better if Eberban could be both a good spoken language (feels already good right
> know) but also a good proglang for itself. Maybe that could depend only on a good base layer of
> vocabulary that abstracts correctly the difficult stuff and expose it in a more usable
> framework."

> "Yeah eberban have all that, but its very verbose, and the way 'code is written' is very
> different from proglangs as it is not imperative language, and instead is about predicates and
> truth values."

## Layers

| Layer | Form | Audience | Tested by |
|---|---|---|---|
| Kernel | code (grammar semantics of [02-semantics.md](02-semantics.md), MI primitives, trivalent logic, context passing, environment) | tooling | parse corpus, evaluator unit tests |
| Base | Eberban texts imported with `ohi`, one namespace each: data structures (pairs, identifiers, sets, lists, maps), context plumbing, instant graph and spans, numbers | definitions | world fixtures |
| Human vocabulary | Eberban definitions in the dictionary, written against base words | speakers | world fixtures and the ergonomics test set |

Rules that follow from the direction:

- Only the kernel is code. Anything the base cannot express is a missing primitive or an unclear
  grammar rule, and the tooling should say which.
- Base words are never spoken, so they need no short or memorable forms. Length and explicitness
  are free there.
- Human words carry definitions that reference base words. Whether the human dictionary entries
  that already exist for plumbing (`kin`, `kagvin`, `kagvil`, `kagve`, `bjur`, `bju`, `bjea`,
  `tcuhi`, `tcehi`, `tcohi`, `tcihe`) stay as human words or move into the base is open.
- The draft chapters under `from_scratch/` are the first attempt at the base, with the old
  particle allocation. Their construction order (pairs, identifiers, sets, lists, maps, time) and
  the per-word explanations are reusable; the texts themselves are not.

## Module story as written (`logic/sentences.md`, dictionary entries `ohi`, `po`, `poi`, `no`, `noi`)

- `ohi ns <quote>`: import the definitions and enabled axioms of an Eberban text (`[E:tca ecaman]`,
  a grammatical quote atom) under namespace `ns`, where `ns` is the definable word right after
  `ohi`. Namespace names and predicate names are independent.
- `ns pi word`: use a namespaced word.
- Inside an imported text, `po` paragraphs are public, `poi` paragraphs private.
- Outside an imported text, `on ns pi word ...` defines into a namespace; `noi ns` re-exports the
  `po` ones into the root, `no ns pi word` one word.
- `nohu ns` / `nohi ns`: enable / disable all axioms of a namespace.
- Nested namespaces: the imported text may itself use `ohi`.
- Special namespaces: `mio` the official dictionary, `mi` the speaker's definitions on top of it,
  `mo` the interlocutors'. All interlocutors share the root namespace and can redefine words in it.
- Redefining a word does not change an enabled axiom.

So the syntax exists: opener (`ohi`), access (`pi`), visibility (`po`/`poi`), re-export (`no`/`noi`),
axiom scoping (`nohu`/`nohi`). What is missing is the scoping semantics.

## Open questions for a scoping specification

Each with the options seen so far. None decided.

1. **Hygiene of an imported text.** Does the text see the importer's environment (its definitions,
   its axioms, its defaults) or a clean root plus the official dictionary? Clean is the usual
   module answer and makes a base text a reproducible unit; seeing the importer allows overriding.
2. **Import time.** Is the imported text evaluated once at `ohi` (definitions captured) or is its
   quote re-read at each use? Once is the only workable reading for axioms.
3. **Context at import.** Definitions in the text use the caller's `c` (`on`) unless `oni`.
   Axioms enabled inside the text are "evaluated within the current global context": the
   importer's at import time, or at each sentence?
4. **Private helpers and `on` inside `poi`.** Visible for the rest of the imported text, invisible
   through `pi`: stated. Whether a public word's definition may reference a private helper after
   import (it must, for `poi` to be useful) implies definitions close over their text's own
   environment, which is answer "clean plus own" to question 1.
5. **Shadowing.** `on` on a word that already exists in the root replaces it for everyone
   (`sentences.md`). Inside a namespace the same rule presumably applies per namespace. Whether a
   human-vocabulary text may shadow a base word bare after `noi base` is the practical case.
6. **Collisions on `noi`.** Two namespaces exporting the same word: last wins, error, or refuse?
7. **Defaults across namespaces.** `oia ns pi word ...` is grammatical (`VerbDefinableUsage` accepts
   namespaces). Whether a default set by the importer on a base word is seen inside the base text.
8. **Quotes as module source.** `ohi` takes a quote atom. A base text is long. Whether a text can
   be referenced by name (a word whose value is the quote) or must be inlined at `ohi`.
9. **Cycles.** Two base texts importing each other. Refuse, or allow with late binding?
10. **Keys for context entries.** `zai word` (the name of a word) as in the draft, or dedicated
    atoms.

## Verbosity (analysis)

Levers that need no grammar change:

- `noi base` at the top of a human-vocabulary text removes `pi` from every reference.
- Defaults (`oiX`) remove arguments from common calls; the draft uses them for the empty map and
  the context span.
- Transformation lists (`kagvi`, `kagvihi`) turn nested map rewrites into flat lists of 0-ary
  words, which is the closest thing to a statement sequence the logic offers.
- Base words can be long and descriptive since they are never spoken.

The remaining cost is structural: a definition is a formula, so "steps" are conjuncts sharing
variables, and threading a value through steps needs a carry (the fold pattern). That is the same
cost as writing in a pure logic language such as Prolog or a proof assistant, and the same
solutions apply: name intermediate predicates, use folds, keep bodies short.
