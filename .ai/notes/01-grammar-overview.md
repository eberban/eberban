# Grammar overview

Compact reference. Every item is **as written** in the refgram unless marked. Chapter paths are
relative to `books/refgram/src/`.

## Morphology (`morphonology/morphology.md`, `morphonology/phonology.md`)

- 16 consonants + 5 vowels (i e a o u) + h. Sonorants n r l. No stress; word boundaries come from
  consonant-cluster rules (self-segregating morphology).
- Word classes: particle (consonant + vowels, or sonorant/vowel-initial forms), root (contains a
  consonant cluster), compound (`e`/`en`/`er` prefix + components), borrowing (`u` + adapted
  foreign word + space), freeform variable (`i` + word + space).
- A bare `n` between spaces is hesitation, dropped by the parser.
- Spaces are mandatory only before vowel- or sonorant-initial words.

## Predicates and places (`logic/intro.md`)

- Every word is a predicate returning true, false or unknown. Undefined words return unknown.
- Arguments: hidden context `c` first, then explicit places E A O U. Arity counts explicit places.
- Places are typed: atom (also called generic) or predicate (with its own arity).

## Transitivity (`logic/chaining.md`)

- Root ends in a vowel: transitive, chains through A. Ends in n r l: intransitive, chains through E.
- A is a predicate place when the root is CCV (exactly three letters) or ends in `-i`.
- Intransitive roots should not have a predicate E place. A root with a single predicate place
  should be transitive with that place as A.
- Compounds: transitivity of the last component; `se` / `sa` / `sai` components force
  intransitive / transitive sharing / transitive equivalence (`grammar/compounds.md`).
- GI: `gi-` intransitive, `ge/ga/go/gu-` transitive, final `-i` equivalence. BA: `ba` atom,
  `bahi`/`bahe` predicate. KI, quotes: intransitive sharing. Numbers: the dictionary entry of
  their JI terminator (`jie` when elided). MI: per dictionary fields `transitive` and `sharing`.
  Borrowings: same last-letter rule as roots, group decided by last item.

## Chaining (`logic/chaining.md`)

- `A B` is a new predicate with A's places. A's chaining place is bound to B.
- Atom place: shares the variable with B's E. B is wrapped to 1-ary; its other places become
  existentials (arity mismatch resolution).
- Predicate place: the place is stated equivalent to B wrapped to the place's arity.
- Longer chains group to the right: `A (B (C D))`.

## Explicit binding (`logic/explicit_binding.md`)

- `ve va vo vu` + chain + `vei`: bind that atom place of the preceding verb to the chain (sharing).
- `vie via vio viu`: bind a predicate place by equivalence (definition). `ve va vo vu` on a
  predicate place shares the predicate instead of defining it.
- `fe fa fo fu` (and `fie fia fio fiu`): bind another place of the same verb as the last open VI.
  `fehu`/`fahu` same/next atom place, `fehi`/`fahi` same/next predicate place.
- Multi-vowel VI/FI (`vao`, `vaio`, `veao`): each non-final vowel takes one unit of the following
  chain, the last vowel takes the rest. `i` before a vowel means equivalence.
- `vi`/`fi`: bind nothing, AND a 0-ary chain. `voi`/`foi`: adverb (`grammar/adverbs.md`).
- Argument list: `VI k1 k2 ... be chain` binds with the listed KI/GI/BA instead of the chain's
  places. Same syntax after `a`, `o`, `on`, and `pe`.
- BA outside a list appends an argument: `ba` atom, `bahi`/`bahe` predicate. `bai`/`baihi`/`baihe`
  append to the sentence argument list.
- `vei` closes the scope; elidible at sentence end.

## SI: chaining override (`logic/explicit_binding.md`)

- `s` + exposed vowels (e a o u) [+ `h` + chain vowel] [+ final `i`].
- Listed vowels are the exposed places in that order; the last one is also the chain place unless
  `h` + vowel overrides it without exposing it. Final `i`: chain by equivalence.
- `si` alone: expose nothing. `si` + one vowel: transparent, the right predicate's places are
  re-exposed and the right chain binds to that place.

## ZI and BI transformations (`logic/transformations.md`)

- `zi` negates only the prefixed word. `bi` negates the wrapped predicate, existentials included.
  Both can be repeated; each occurrence negates the next, so `bi bi bure` is `bure`.
- `za` name from property, `zai` the name itself. `ze` latest instance of the word,
  `zei` latest compound containing it, `zeu`/`zeiu` the context of that instance.
- `bo`/`boi` assign a KI/GI. `zu`/`zui` instantiate a predicate argument (transitive/intransitive).
- `zue` turns `[A:()]` into `[A:(p)]` fed with E.
- `zoie zoia zoio zoiu` read a place default (`logic/default.md`).

## PE enumeration (`grammar/enum.md`)

- `pe ... bu ... pei` brackets and AND. `pea` set from one member of each set, `peo` set of atoms,
  `peho` set of predicates, `peu` list of atoms, `pehu` list of predicates. Prefix mode:
  `PE bu item item pei`, one predicate per item.

## Sentences (`logic/sentences.md`)

- `a` assert, `an` update the inter-sentence context with a 1-ary predicate, `al` request.
  Other A particles get their meaning from `e A sai` compounds.
- `o` question: defines a predicate the answer must use. `on` define, `oni` define capturing the
  current context, `onu` define and enable as axiom, `ohi` import a text as a namespace,
  `oie oia oio oiu` set a place default.
- `nu`/`ni` enable/disable an axiom, `nohu`/`nohi` for a namespace, `no`/`noi` extract from a
  namespace.
- `ra` erases the sentence, `ri` the current chain. `po`/`poi` public/private paragraphs.
- First sentence of a paragraph without A/O/NI is an `a` sentence.

## Defaults (`logic/default.md`)

- `oiX pred prop`: unbound place X of `pred` satisfies `prop`. Applied only when the place is not
  bound by chaining or explicit binding. `oiX pred mai` removes it.
- Re-exported places inherit the default at definition time; later changes to the original do not
  propagate. `oien`-series: default receiving all arguments of the predicate.

## Other grammar

- Compounds `grammar/compounds.md`: `e`/`en`/`er`, nesting, `ei`/`ein`/`ene` shorthands. Meaning is
  lexical, defined in the dictionary.
- Borrowings `grammar/borrowings.md`: `u` + word, must end in vowel or vowel + single consonant,
  groups terminated by optional `be`, names with `za`.
- Quotes `grammar/quotes.md`: `ci` word, `ce ... cei` spelling, `ca ... cai` grammatical, `co [ ]`
  foreign.
- Numbers `grammar/numbers.md`: `[base ju] digits [jo fraction] [ja repeat] [je magnitude] [JI]`,
  digits `ti te ta to tu tie ...`, `ji` cardinal, `jiu` ordinal, `jie` value (elidible).
- Annotations `grammar/annotations.md`: `di-` focus, `de-` interjection/tag, `da ... dai`
  parenthetical, `du`/`duo` scope. No logical effect.
- PA (grammar only, `eberban.peggy`): `pa` + repeated verb resumes binding to an earlier verb of
  the same chain. ZI modifiers must match, leading SI may differ.
- Family prefixes: every family is infinite; unallocated forms parse and mean nothing. `PU` is
  allocated in the grammar and has no dictionary member.
