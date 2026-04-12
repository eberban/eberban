# Numbers, Quotes, Enumeration, Colors, Dictionary Conventions

## Numbers

**Digits (TI)** — diagonal (same vowel repeated) is skipped:

| | -i | -e | -a | -o | -u |
|---|---|---|---|---|---|
| t- | 0 | 1 | 2 | 3 | 4 |
| ti- | — | 5 | 6 | 7 | 8 |
| te- | 9 | — | A | B | C |
| ta- | D | E | — | F | ... |

Parser also accepts digit symbols 0-9 directly. TI does NOT accept h (no consecutive same vowels possible).

**Format**: `[digits] [base] ju [digits] jo [digits] ja [digits] je [digits] JI`
- All parts optional except at least one must be present
- JI appears at END of number (not beginning)
- Default base 10. jo = fractional. joi = negative. ja = repeating. je/jei = positive/negative magnitude.

**JI (usage, at end)**: ji = cardinal set, jiu = ordinal, jie = numeric value (elidible default)
- `tu ta ji mian` = "42 cats" (cardinal)
- `ta jiu` = "2nd element" (ordinal)
- `tu ta` = `tu ta jie` = "the number 42" (jie elidible)
- `tia jo ti ta ta je ta to` = 6.022 × 10²³

---

## Quotes (c- prefix)

All quote types act as predicates that chain normally.

### ci/cie — single word quote (CI family)
- `ci word` = `[E:tca man] is the word "word"` — quotes one Eberban word as linguistic object
- `cie word` = `[E:tca man] is word family of "word"`
- Examples: `ci fe` = "is the word 'fe'", `cie spi` = "is the concept of a root word"

### ce...cei — spelling quote (CE/CEI)
Each unit = one character. Units: optional consonant(s) + vowels (h allowed between vowels).

**Spelling table:**

| Letter | Unit | | Letter | Unit | | Letter | Unit | | Letter | Unit |
|:------:|:----:|-|:------:|:----:|-|:------:|:----:|-|:------:|:----:|
| P | pi | | B | bu | | F | fi | | V | vu |
| T | ti | | D | du | | S | si | | Z | zu |
| C | ci | | J | ju | | K | ki | | G | gu |
| M | mi | | N | nu | | R | ri | | L | lu |
| H | ihi | | (space) | uhu | | I | i | | E | e |
| A | a | | O | o | | U | u | | | |

Digits spelled with tc- instead of t-: tci=0, tce=1, tca=2, ...

**ceu**: spells the sounds of a quote (not characters).

Examples:
- `za ce bu o bu tco cei` = named B-O-B-3
- `tian de ce ti i a nu cei` = tian (interjection) spelled T-I-A-N

### ca...cai — grammatical quote (CA/CAI)
- Quotes grammatically correct Eberban text
- Nested ca...cai supported (cai matches its opening ca)
- cai is elidible at sentence end
- Definition: `[E:tca ecaskan] is text [text]`

### co — foreign quote (CO)
Two modes:

**Simple:** `co [text]` — text until `]`. Cannot contain `]`.

**Sentinel:** `co SENTINEL [text ]SENTINEL` — SENTINEL is any valid root/particle form (needn't be defined). Quote ends at `]SENTINEL`. Allows `]` inside text. The combo `]SENTINEL` must NOT appear in the quoted text.

Definition: `[E:tca skan] is foreign text/arbitrary data with content: [content]`

In speech: `[` and `]` are realized as palatal click [ǂ].

**coi** (COI): elided quote content — used when content is unreadable (images, URLs). Recommended to add Eberban description alongside.

**Full example:**
```
eberban sae ebansa ca mi dona eberban cai siro co [I like eberban] ebansa euinglic'ban
```
"'mi dona eberban' (in Eberban) has translation 'I like eberban' (in English)"

---

## Enumeration (PE family)

- **pe**: AND/brackets — `pe A bu B pei` = "A and B"
- **pea**: set from one member of each listed set
- **peo**: set of atoms satisfying each item
- **peho**: set of predicates (OR logic)
- **peu**: ordered list
- **pehu**: list of predicates
- **bu**: separator between items
- **pei**: closes PE scope (elidible)

Two modes: separator mode (items separated by bu) or prefix mode (PE followed by bu, then single-predicate items).

Empty enumeration: `PE bu PEI`.

---

## Colors

**zino**: color A of thing E, perceived by O (defaults to opiner). Perception-based, not intrinsic — a white object under red light is perceived red.

**zmXr pattern** (HSV-based): zmir(white), zmer(red), zmar(green), zmor(blue), zmur(black). Broad categories; combine vowels for hue precision (color wheel). zmire(lighter/less saturated), zmure(darker/less value).

---

## Calendar & Time

### Duration words
Number predicate structure: E is X times A (default: 1). Bare unit = 1 unit.
- bire(year), gare(month), kora(week), dena(day), sura(hour), jero(minute), vola(second)
- Milliseconds and smaller: use multiplication with vola
- **vulu**: duration E of event A

### Time-of-day (0-indexed, relative to start of A)
- **surai**: hour E of A (default: day/denai)
- **jeroi**: minute E of A (default: hour/surai)
- **volai**: second E of A (default: minute/jeroi)

E = set of consecutive integers. Negative allowed (minute -2 = 2 min before start).

### Calendar-aligned events (0-indexed, aligned to boundaries)
- **birei**: year E of A (default: Gregorian). Astronomical numbering: year 0 = 1 BC.
- **garei**: month E of A (default: year). Month 0 = January.
- **korai**: week E of A (default: year). Weeks start Monday.
- **denai**: day E of A (default: month). Day 0 = 1st.

E defaults to 0 → "same day/month/year as X." Day-of-week compounds: `e TI denai`.

### Examples
- `a [se tie tu] jeroi [se te tio] surai` = "17:54"
- `a se ti e tia denai se tiu garei` = "September 1st, Sunday" (day 0 of month 8)

---

## Dictionary Conventions

Entry format: `[E:type] description [A:type] more.`
- tce* = distributive non-empty set
- (pred) = predicate argument
- Same letter across places = shared type constraint

**Adding words to dictionary:**
1. Edit `dictionary/en.yaml`, set id to `INSERT_WORD_ID`
2. Run `npm run ids` in dictionary/ folder
3. Fields: id, family (R/C/particle-name), gloss, tags, short, long (optional), see_also, links
