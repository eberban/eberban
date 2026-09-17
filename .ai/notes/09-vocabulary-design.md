# Vocabulary design practice

Carried over from the previous generation of notes, which recorded practice from the Discord
community and mia. None of it is in the refgram (`vocabulary/guidelines.md` covers only vowel
scales, the direction cross and sonorant order). **To be confirmed by mia**; until then treat every
item as analysis. Attributions "mia" below are as the previous notes gave them.

## Word forms

Weight is counted in syllables, not letters. `CVCV` and `CCVCV` weigh about the same.

- 1 syllable (`CCV`, `CVC`): reserved for structural, high-frequency words used across many
  sentences. Never for domain vocabulary.
- 2 syllables (`CVCV`, `CCVV`, `CVCCV`, `CCVCV`): the bulk of everyday vocabulary.
- 3 syllables (`CVCCVV`, `CCVCCV`, ...): rarer or specialised concepts.

Forms are chosen to feel right for the concept (sound symbolism), not to echo any natural
language. Gentle guidance, not rules; a generated form that sounds right wins over the tables.

| Sounds | Evoke | Used for |
|---|---|---|
| m n | soft, warm, small, intimate | small animals, food, affection |
| p t k | sharp, sudden, precise | impacts, small hard things |
| b d g | heavy, solid, deep | large animals, strong emotions |
| f s c | airy, flowing, calm | fog, snow, gentle movement |
| v z j | buzzing, energetic | bee, storm, excitement |
| l r | smooth, alive, liquid | river, leaf, running |
| i | small, thin, bright | insects, blades, lemon |
| e | medium, neutral | general concepts |
| a | open, big, strong | mountain, bear, anger |
| o | round, soft, warm | apple, egg, honey |
| u | deep, dark, heavy, closed | guilt, fear, night |

Onomatopoeia when universal: `m-` cat, `z-`/`bz-` bee, `s-` snake, plosives for hits, `l`/`r`
for water. Only sibilant-bearing pairs can start a root; `kr`, `gr`, `bl`, `tr` are medial only.

Examples in the dictionary: `mian` cat, `meon` apple, `baluor` stone, `gzeon` river, `tcuin` tree.

Process: feel of the concept, consonants and vowels that match, length from frequency,
transitivity from the place structure (vowel-final transitive, consonant-final intransitive),
morphology check with the parser, collision check against the dictionary, say it aloud.

## Eberbanization (adapting foreign words)

The borrowing mechanism itself is `grammar/borrowings.md` (`u` prefix, `be` group end, `za` for
names). This is the method for producing the content after `u`.

Principles: work from IPA, not spelling. Prefer endonyms for peoples, languages and places
(`udjonguo`, `unihon`, `uhangu`, `udoitce`, `umaori`, `ufranse`).

Phoneme mapping. `tc` [tʃ], `dj` [dʒ], `c` [ʃ], `j` [ʒ] are single phonemes. No `w`, `y`, `q`, `x`.

| Source | Eberban | Example |
|---|---|---|
| /w/ | `u` glide before a vowel | Twitch → `tuitc`, Yuan → `iuan` |
| /j/ | `i` glide before a vowel | Yamaha → `iamaha`, Euro → `iuro` |
| /ŋ/ | `n` | Beijing → `ubeidjin` |
| /θ/, /ð/ | `t` or `s`, `d` or `z` | approximate |
| schwa | `a` (observed lean), `e` acceptable | Twitter → `utuitar`, dollar → `uaudolar` |
| diphthongs | vowel hiatus (`ei`, `ai`, `ou`, `au`) | Maori → `umaori` |

Clusters (as written in `borrowings.md`): initial pairs may appear medially, medial pairs
initially, sonorant + consonant counts as one pair, sonorant + initial pair as a triplet, three
consonants at most. Voicing mismatches and sibilant pairs get a buffer vowel.

Endings: a vowel (transitive) or vowel + single consonant (intransitive). A final cluster is
fixed by appending a vowel (mia's default: repeat the last vowel, Felix → `ufeliksi`) or by a
buffer vowel between the consonants (Charles → `utcarlaz`). The choice sets transitivity: Deutsch
→ `udoitc` intransitive, `udoitce` transitive (mia's choice, in the dictionary).

`u`-initial content: `u.ualis` (dot form, see `prefixedWordKey` in `web/src/shared/`).

Initialisms: concatenate the CE spelling units, never source-language letter names.

| P `pi` | B `bu` | F `fi` | V `vu` | T `ti` | D `du` | S `si` | Z `zu` |
|---|---|---|---|---|---|---|---|
| C `ci` | J `ju` | K `ki` | G `gu` | M `mi` | N `nu` | R `ri` | L `lu` |
| H `ihi` | I `i` | E `e` | A `a` | O `o` | U `u` | W `ua` | Y `ia` |
| X `ksi` | Q `ksu` | | | | | | |

BBC → `ububuci`, FM → `ufimi`, USA → `u.usia`, BMW → `ubumiua`, UN → `u.unu`.

Pitfalls: `w`/`y` as consonants; writing `t c h` for [tʃ]; source letter names in initialisms;
leaving a final consonant cluster.

## Design decisions recorded

- **Emotions.** Reactive emotions take a proposition and end in `-i` (happy, sad, angry, fear,
  surprise, proud, guilt, regret, ...). Relational emotions take an entity and end in another
  vowel (love, like, jealous, hatred, trust). `lonely` is unary. The reason for an emotion goes
  through the context, not into the word. `zue` covers "I feel X about [me doing Y]".
- **Deferred.** `cook` (root agreed, multi-step place structure undecided), travel / goes-to
  (paths, steps, pauses), storage containers (to be designed as a whole).
- **Prefix patterns in use.** `tc-` sets, `sp-` time relations and speech, `sk-` events, `zm-`
  colors, `bj-` qualities.
- **Expansion priorities.** Materials, taste / smell / texture, kinship, professions, musical
  instruments, celestial bodies.
