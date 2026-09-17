# Time layer

mia, on the state of this area:

> "For vocabulary my main dificulty is working on difficult concepts like tenses, that need to be
> both 'non magic' (even if not completely defined, have a strategy to make it implementable in
> Eberban itself) but also be easy to use."

`from_scratch/core_to_complete/time.md` is marked DRAFT. The previous notes record that "the
vocabulary and mechanics are expected to be reworked"; the published chapter carries no such line.

## Two models in the sources

### Model A: current vocabulary (`vocabulary/event_tenses.md`, `vocabulary/calendar_time.md`, dictionary)

- Time is a graph of instants; multiple futures, pasts, parallel and fictional universes.
- A physical entity (`pan`) occupies a space-time volume (`sken`); `skan` is a timespan.
- **Common timespan**: stored in the context. Each `pan` and each action word states that the
  common timespan is inside its own span. Set by `ski` and by time relations, constrained to be
  maximal.
- **Time anchor** (`skun`): a span automatically inside the sentence common timespan, usually the
  present. Changed with `en an skun sai`. **Present** (`sufkun`): real-world now, advances between
  sentences.
- **Events** (`ski`): an object holding the proposition, the involved entities with their volumes,
  "possibly other information". `ski` evaluates its proposition with its own inner common
  timespan. `skul` is the current event. `skin`: event occurs. `skinu`/`skiru`: start/end as
  seconds since an epoch.
- **Relations** between an inner proposition A and a reference event E (default: current context
  event): `spe` before (O: separating duration), `spu` after (O), `spa` starts, `spo` finishes,
  `spui` contains, `spei` contained by, `spai` intersects, `spi` unconstrained, `sari` between,
  `skuli` same span. Vague-duration compounds `e ti/vola/jero/sura/dena/kora/gare/bire spe|spu`.
  `skeri`: one event satisfying a set of relations.
- **Modality**: `smi` possible, `smu` necessary, `sma` counterfactual, `sunai` parallel universe.
  "Sentences state that their content is necessary."
- **Calendar**: units `bire gare kora dena sura jero vola` as "E is n times A (default 1)";
  events `birei garei korai denai surai jeroi volai` as "now is the E-th (0-based) X of A", each
  defaulting to the enclosing unit; weekday compounds `e TI denai`; `e birei denai` anniversary;
  `e bju ski` and `en spe/spu/spai bju ski` occurrence lists.

### Model B: draft (`from_scratch/core_to_complete/time.md`, superseded particles)

- Instant = pair (identifier, set of successor instants). `din` node, `dini` arc, `dinu` path =
  list of nodes = timespan.
- Present = a node under a context key (`den`), advanced between sentences by a registered
  sentence wrapper.
- `zvi`: evaluate a proposition with a maximal shared span under a context key; `zvin`/`zvil`
  state containment / read the span.
- Relations come in two flavours each: possible (`sul`, `sel`, ...) and necessary (`sun`, `sen`,
  ...) via `zvan`, which quantifies over all spans containing the reference span.
- `dan`: presently occurs. `zve`: register initial spans for sentences.

Model B is a bottom-up construction of Model A's "common timespan" and "graph of instants". It
stops before durations and calendars ("A later chapter will introduce the measurement of
durations").

## Word-by-word implementability (analysis)

For each current word: what it needs from the context and from a base layer, and the blocker if
any. "Base" refers to the not-yet-written namespaced core described in
[05-layering-and-modules.md](05-layering-and-modules.md).

| Word | Needs | Sketch | Blocker |
|---|---|---|---|
| `pan`, `sken`, `skan` | volumes and spans as atoms | span = path in the instant graph (Model B `dinu`); volume = span plus space, space undefined | space model absent (`event_tenses.md` "Space relations: TODO") |
| `ski` | event object | pair of (proposition, set of (entity, volume)); predicates can be pair components | "possibly other informations" |
| `skul`, `e ski kagve` | context key | read key | none |
| `skun`, `en an skun sai` | context key, `an` | write key with a property evaluated per sentence | none; the property must determine one context for the first evaluator (02) |
| `sufkun` | per-sentence update | needs the missing sentence-wrapper word or a kernel rule | **no mechanism in current grammar** |
| `skon` | common timespan | read key, state containment | none once the key exists |
| `spa spo spui spei spai spi skuli sari` | span endpoints and containment on the graph | Model B relations on `dinu` lists | none for possibility; necessity needs `zvan`-style quantification, absent from Model A |
| `spe`, `spu` with O duration | a metric between instants | `skinu` gives seconds since epoch, so a metric exists per timeline | metric across branches undefined; "seconds since UNIX epoch" is bound to one calendar/timeline |
| vague `e X spe/spu` | duration sets | number intervals over the metric | as above |
| `smi`, `smu`, `sma`, `sunai` | branching graph, reachability, same-distance spans | possible = some branch, necessary = all branches, `sma` = per its three stated conditions | `sma` needs the metric; `sunai` needs unreachable components |
| `skeri` | set of relation predicates | fold over a set of 2-ary predicates applied to one event | sets of predicates: fine via pairs, but no `tcu` over predicates in the dictionary |
| units `bire .. vola` | numbers with units (`gan`) | sets of acceptable values (month, year vary) | `gan` "extension field with units" undefined |
| events `birei .. volai`, weekdays | calendar as data: boundaries of day/month/year on the timeline | "the current event is inside the E-th X counted from the start of A" | Gregorian rules as Eberban axioms is a large text; alternative is kernel-provided calendar facts |
| `e bju ski`, `en spe bju ski`, ... | ordered occurrence lists | list of events ordered by `skinu` | `skinu` notes reference `jini`/`jiri` for ordering; only `jiri` exists in the dictionary |

Summary: relations, events and the anchor/present machinery are implementable with Model B plus
the map plumbing, and need one decision (necessity vs possibility in relations) and one missing
word (per-sentence update). Durations, `spe`/`spu` distances, `sma` and the
calendar need a metric on instants and calendar data, neither of which the refgram sketches. Those
are the genuinely hard part, and they are also where most everyday sentences live.

## Friction (as reported)

- "yesterday", "tomorrow", "next week" need constructions such as
  `spi se te denai skun spui ...` (`calendar_time.md` last example: "tomorrow I will eat it").
- Calendar dates need several chained calendar-event words (`a se ti e tia denai se tiu garei`).
- Tense scope has three surface forms with different meanings (`voi spe`, `sia spe`, bare `spe`),
  all needed, none default (`grammar/adverbs.md`).
- Interaction between anchor, common timespan and narrative present is not written down as rules,
  only as examples.

## Proposed ergonomics test set (proposal, not agreed)

Sentences any redesign is measured against, by word count and by whether they lower. To be
completed with mia.

- I ate. I eat. I will eat.
- Yesterday I ate an apple. Tomorrow you will dance. Next week we meet.
- I ate the apple you gave me. (gift before eating, apple exists at both)
- While you were dancing, I ate.
- It is 17:54. It is September 1st. It is Sunday.
- The meeting lasts two hours. The meeting starts at 10.
- I have been to Japan. I have never been to Japan.
- If it had rained, I would have stayed.
- Every morning I drink coffee.
