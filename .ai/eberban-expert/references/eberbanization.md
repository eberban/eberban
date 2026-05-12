# Eberbanization (Adapting Foreign Words)

How to borrow foreign words into Eberban while respecting its phonology and morphology. Used for proper nouns, species names, culturally-specific terms, and anything that lacks a native root.

The grammar of the borrowing mechanism itself (`u` prefix, `be` separator, `za` for names) is documented in `books/refgram/src/grammar/borrowings.md`. This file is the *methodology* for converting a foreign word into the form that follows `u`.

## Core Principles

**Work from IPA, not orthography.** "Twitch" is /twɪtʃ/, not t-w-i-t-c-h. Treat the spelling as a hint about pronunciation, never as the input.

**Prefer endonyms for cultures, languages, and places.** Borrow the self-name in its native pronunciation, not the English/French/etc. exonym. Existing dictionary examples:
- `udjonguo` ← Zhongguo (China's endonym), not "China"
- `unihon` ← Nihon (Japan's endonym), not "Japan"
- `uhangu` ← Hanguk (Korea's endonym), not "Korea"
- `udoitce` ← Dutch endonym, not English "Dutch"
- `umaori` ← Maori (endonym)
- `ufranse` ← French endonym "Français"

## Step 1: Map Phonemes to Eberban's Inventory

Eberban has no `w`, no `y`/`j`-as-consonant, no `q`, no `x`. The four affricate/fricative digraphs `tc` [tʃ], `dj` [dʒ], `c` [ʃ], `j` [ʒ] are *single* phonemes — never decompose them.

**Missing-in-Eberban phonemes (the non-obvious mappings):**

| Source sound | Eberban | Notes |
|---|---|---|
| /w/ | `u` (glide before vowel) | "Twitch" /twɪtʃ/ → tuitc; "Yuan" /jwɛn/ → iuan |
| /j/ (y-glide) | `i` (glide before vowel) | "Yamaha" → iamaha; "Euro" /ˈjuə.roʊ/ → iuro |
| /ŋ/ | `n` (single consonant) | "Beijing" /beɪˈdʒɪŋ/ → beidjin → `ubeidjin` |
| /θ/ | `t` or `s` | approximate |
| /ð/ | `d` or `z` | approximate |
| /ə/ schwa | `a` (observed lean) | utuitar (Twitter), uafrikan (African), uaudolar (dollar). `e` is also acceptable when context suggests it. |
| diphthongs (/eɪ/, /aɪ/, /oʊ/, /aʊ/, ...) | vowel hiatuses (ei, ai, ou, au, ...) | no diphthong phonemes; clean separation |

**Sibilants/affricates (single-phoneme digraphs):** `[tʃ]→tc`, `[dʒ]→dj`, `[ʃ]→c`, `[ʒ]→j`.

**Obvious direct mappings:** `[k]→k`, `[ɹ]→r`; vowels `[æa]→a`, `[ɛe]→e`, `[ɪi]→i`, `[ʊu]→u`, `[ɔɒo]→o`.

## Step 2: Fix Cluster Violations

Borrowings have *relaxed* but still-bounded cluster rules (per `books/refgram/src/grammar/borrowings.md`):

- Initial pairs can appear medially.
- Medial pairs can appear initially (after the `u` prefix).
- Sonorant + consonant counts as one pair (sonorant doesn't break the word).
- Sonorant + initial-pair counts as a triplet (max 3 consonants in a row).
- Truly invalid clusters (voicing mismatch, sibilant+sibilant): insert a buffer vowel.

## Step 3: Fix the Ending

Borrowings must end in either:
- a *vowel* (→ transitive borrowing), or
- a *vowel + single consonant* (→ intransitive borrowing).

Consonant *pairs* at the end are forbidden, even if they're a legal medial pair. If the source ends in a cluster, fix by:
- **Appending a vowel** (mia's default: duplicate the last vowel). "Felix" /ˈfiːlɪks/ → `feliks` → `+i` → `ufeliksi`.
- Or inserting a buffer vowel *between* the consonants.

The final-vowel choice also flips transitivity. "Deutsch" → `udoitc` (intrans) vs `udoitce` (trans, mia's choice).

## Step 4: Prefix `u`

Prefix `u` + space (or `'`/`.` to visually join). If the borrowed content itself starts with `u`, write `u'` to disambiguate. Example: `u'ualis` for content `ualis`.

## Step 5: Initialisms

Spell as concatenated **Eberban letter-words** (the CE-quote spelling units), then apply steps 2–4 if needed. Source-language letter-names (English "bi" for B, French "bé") are *not* used — Eberban's own system wins on consistency and avoids importing foreign letter-name phonemes (English "W" /ˈdʌbəlju:/ doesn't fit Eberban cleanly).

**Eberban letter-units** (from `books/refgram/src/grammar/quotes.md`):

| Letter | Unit | | Letter | Unit | | Letter | Unit | | Letter | Unit |
|:---:|:---:|-|:---:|:---:|-|:---:|:---:|-|:---:|:---:|
| P | pi | | B | bu | | F | fi | | V | vu |
| T | ti | | D | du | | S | si | | Z | zu |
| C | ci | | J | ju | | K | ki | | G | gu |
| M | mi | | N | nu | | R | ri | | L | lu |
| H | ihi | | I | i | | E | e | | A | a |
| O | o | | U | u | | | | | | |

**Letters missing from Eberban's alphabet:** `W` = `ua`, `Y` = `ia`, `X` = `ksi`, `Q` = `kiu`.

**Examples:**
- BBC → `bu`+`bu`+`ci` → `ububuci`
- FM → `fi`+`mi` → `ufimi`
- USA → `u`+`si`+`a` → `u'usia` (content starts with `u`, needs `'` separator)
- FBI → `fi`+`bu`+`i` → `ufibui`
- BMW → `bu`+`mi`+`ua` → `ubumiua`
- WWE → `ua`+`ua`+`e` → `u'uauae`
- UN → `u`+`nu` → `u'unu`

## Usage Notes

**Names use `za` prefix**: `za` + borrowing = "[E] is named [borrowing]".
**Multiple borrowings**: separate with `be` to prevent fusion.

## Worked Examples (from existing dictionary)

- "John" /dʒɒn/ → djon → `za udjon`
- "Charles" /tʃɑːlz/ → tcarlz → `lz` end-cluster → buffer → `za utcarlaz`
- "Bob" /bɒb/ → bob → `za ubob` (V+single-C end, valid)
- "Alice" /ˈælɪs/ → alis → `za ualis`
- "Felix" /ˈfiːlɪks/ → feliks → `ks` end → duplicate last vowel → `ufeliksi`
- "Twitter" /ˈtwɪtər/ → /w/→u, schwa→a → tuitar → `utuitar`
- "Twitch" /twɪtʃ/ → tuitc → `utuitc` (intrans) or `utuitce` (trans)
- "Dutch" (endonym, pronounced ≈ /dɔɪtʃ/ in spoken Dutch) → doitc → `udoitce` (trans, mia's choice)
- "Bitcoin" /ˈbɪtkɔɪn/ → bitkoin → `ubitkoin` (-n single, valid)
- "France" /fʁɑ̃s/ → franse → `ufranse`
- "Yuan" /jwɛn/ → /j/→i, /w/→u → iuan → `uiuan`
- "Euro" /ˈjuəroʊ/ → iuro → `uiuro`
- "Zhongguo" /ʈʂʊŋkwo/ → djonguo (with /w/→u) → `udjonguo`
- "Maori" /ˈmaʊri/ → maori (hiatus, not diphthong) → `umaori`
- "BBC" → `bu`+`bu`+`ci` → `ububuci`

## Common Pitfalls

- Using `w`/`y` as consonants — they don't exist. Map /w/→`u`-glide, /j/→`i`-glide.
- Double-encoding digraphs (writing `t-c-h` for [tʃ] when `tc` already is [tʃ]).
- Rendering initialism letters with source-language phonetics (English "bi" for B). Always use Eberban's CE-quote letter-words (`bu` for B, etc.).
- Leaving consonant-cluster endings; the borrowing chapter is strict about this.
