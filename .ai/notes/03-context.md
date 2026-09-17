# The context argument

## Mechanism (as written)

- `c` is the first argument of every predicate, filled by the grammar (`logic/intro.md`).
- Chaining and explicit binds pass the same `c` to left and right (`logic/chaining.md`).
- A predicate chained into a predicate place can be instantiated "with a different context
  argument" by the consuming word (`logic/chaining.md`). This is how `mua` works.
- `mue(c,e) = (c = e)` exposes `c`; `mua(c,e,A) = A(e)` evaluates `A` with `e` as context
  (`logic/primitives.md`).
- `an Q` gives the following sentences a context satisfying `Q` (`logic/sentences.md`).
- `on` bodies use the caller's `c`; `oni` freezes the context at definition time.
- `zeu W` / `zeiu W` refer to the context with which the latest instance of `W` was evaluated
  (`logic/transformations.md`).
- Sentences of all interlocutors share one context stream, in utterance order; a transformation
  on speaker change is planned and has no word (`logic/sentences.md`, TODO).
- `dictionary_conventions.md`, section "Map arguments and context" (an HTML comment in the
  source): the context is a map; definitions may write `@key` for an entry of it.

## What the vocabulary stores in `c` (inventory)

Every dictionary entry whose `short` or `notes` reads or writes the context, with the field it
implies. "Field" names are this file's, not the dictionary's.

| Field (analysis) | Read by | Written by | Source |
|---|---|---|---|
| current event / common timespan | `skul`, `e ski kagve`, all `sp-` relations, `sari`, `skuli`, `skon`, `cko`, `zoli` | `ski` (inner timespan), tense words | `vocabulary/event_tenses.md`, dictionary |
| time anchor | `skun`, tense defaults | `en an skun sai` (takes a property, so it can follow `sufkun`) | dictionary |
| present | `sufkun` | "automatically updated between sentences" (no mechanism given) | dictionary |
| opiner | `bzael`, subjective words (`bjan` default), `kuri` | `e bzael mua` | dictionary |
| tools | `zoli`, `etcuzoli` | `zolin` | dictionary |
| number base | numbers | "overwritten in the context (TODO: add word)" | `grammar/numbers.md` |
| speaker / listeners | `mi`, `mo`, `mio`, `mie`, `moe` | speaker-change transformation (TODO) | `grammar/discourse.md`, `logic/sentences.md` |
| arbitrary entries | `kagvehe` (entry by key) | `kagvi`, `kagvihi` (transformation lists) | dictionary |

Generic plumbing present in the dictionary: `kagvin` map, `kagvil` empty map, `kagve` entry of a
map, `kagvehe` entry of the context, `kagvi` map built from a base map by a list of 0-ary
transformations, `kagvihi` evaluate a proposition after applying transformations to the context.
None of these has a definition in the dictionary; `from_scratch/core_to_complete/maps.md` has
definitions for the same design under different names (`kagva`, `kagvar`, `kagvei`).

## Lifecycle (as written, with gaps)

1. A text starts with some context. Where it comes from is not stated (`from_scratch/maps.md`
   sets an empty map; nothing in the current grammar does).
2. Each sentence receives the current context as its `c`.
3. Inside a sentence, `mua` substitutes locally. Nothing a sentence does changes the stream.
4. `an Q` selects the next context. Otherwise the next sentence gets the same context, except for
   whatever "automatically updates" the present. The draft chapters register a sentence wrapper
   (`pahi`) for that; the current grammar has no equivalent word. **Gap.**
5. Definitions do not touch `c` (environment, see [02-semantics.md](02-semantics.md)).

## Analysis: what an implementation needs

- `c` as a record with the fields above, plus a free map for vocabulary-defined keys. Whether the
  record is itself an Eberban map atom (as `kagvin`) or a kernel object is a layering choice
  ([05-layering-and-modules.md](05-layering-and-modules.md)). Either way the kernel only needs:
  read a key, evaluate a proposition with a replaced context. That is exactly `mue` and `mua`.
- `an` needs a deterministic reading (see the `an` note in 02) or a search over candidate contexts.
- The automatic present advance needs a home: a kernel rule, or a registered per-sentence
  transformation as in the draft, with a word for registering it.
- Keys need identities. The draft uses `zai word` (the name of a word) as key. Whether keys are
  names of words or dedicated atoms is open.

## mia on this mechanism

> "Rationale: without a hidden context, expressing 'In the future: you dance' would require adding
> explicit time parameters to every verb, not ergonomic. The hidden context solves this
> transparently." (previous notes, attributed to mia; kept because it matches the refgram intro)

> "I consider it being good enough for now if it seems feasible to implement using Eberban
> constructs (mainly through the context argument)."
