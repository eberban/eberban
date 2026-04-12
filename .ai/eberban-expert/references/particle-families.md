# Eberban Particle Families — Complete Reference

## Sentence-Level

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| A | a- | a (assert), an (ctx update), al (request) | Sentence starters |
| O | o- | o (question), on (define), oni (capture-define), onu (define+axiom), ohi (import namespace), oie/oia/oio/oiu (set defaults) | Definitions & questions |
| NI | n- | nu (enable axiom), ni (disable), no (extract pred), noi (extract all), nohu/nohi (enable/disable all) | Axiom control |
| PO | po- | po (public paragraph), poi (private paragraph) | Paragraph markers |
| RA | ra | ra | Sentence eraser (works on ungrammatical text) |
| RI | ri | ri | Chain eraser (must be grammatical) |

## Binding & Chaining

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| VI | v- | ve/va/vo/vu (atom), vie/via/vio/viu (pred equiv), voi/vioi (adverb), multi-vowel (vao, vaio, veao...) | Left place selection, opens scope |
| FI | f- | fe/fa/fo/fu (atom), fie/fia/fio/fiu (pred equiv), foi/fioi (adverb), fehu/fahu (same/next atom place), fehi/fahi (same/next pred place), multi-vowel (fao, faio...) | Bind same pred as last VI |
| VEI | vei | vei | Close VI/FI scope |
| SI | s- | se/sa/so/su (share), sei/sai/soi/sui (equiv), sae/sao/sue... (two-vowel), si+vowel (transparent) | Override chaining behavior |
| PA | pa- | pa (resume) | Echo-resumptive: resume bindings to matching verb higher in chain |
| PE | pe- | pe (AND/bracket), pea (set-from-each), peo (set-of-atoms), peho (set-of-preds/OR), peu (list), pehu (list-of-preds) | Enumeration & brackets |
| PEI | pei | pei | Close PE scope |
| BU | bu | bu | Separator in enumerations |
| BA | ba- | ba (atom arg), bahi (transitive pred), bahe (intransitive pred), bao (atom in scope), bahio (trans pred in scope), baheo (intrans pred in scope) | Inline argument markers |
| BE | be | be | Close argument list |

## Variables

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| KI | k- | ke/ka/ko/ku (+ more vowel combos) | Atom variables |
| GI | g- | ge/ga/go/gu (transitive), gie/gia/gio/giu (equiv), gi- prefix (intransitive) | Predicate variables |

## Transformations

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| ZI | z- | zi (short negate), za (name), zai (name-itself), ze (anaphora), zei (compound anaphora), zeu (context of last), bo (forethought), zu (instantiate trans), zui (instantiate intrans), zue (promote 0-ary to 1-ary) + infinite unallocated forms (zo, zoi, etc. — reserved, currently meaningless) | Predicate transformations |
| BI | bi | bi | Wide negation (includes existentials + chain) |

## Logical Primitives (MI family)

| Particle | Type | Definition |
|----------|------|------------|
| mi | intrans | speaker(s) |
| mo | intrans | listener(s) |
| mio | intrans | inclusive we |
| mie | intrans | exclusive we |
| moe | intrans | 3rd person |
| me | intrans | demonstrative (salient thing) |
| ma | intrans | is-atom test |
| mai | intrans | always true (existence) |
| mae | trans | partial application: E(args) <=> A(o, args) |
| mao | trans | subset: O(args) ⇒ A(args), i.e. O ⊆ A |
| mui | intrans | always unknown |
| mue | intrans | extract context: c = e |
| mua | trans | evaluate with context: A(e) |

## Quotes

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| CI | ci- | ci (word quote), cie (family quote) | Single word/family quotes |
| CE | ce | ce | Start spelling quote |
| CEI | cei | cei | End spelling quote |
| CA | ca | ca | Start grammatical quote |
| CAI | cai | cai | End grammatical quote (elidible) |
| CO | co | co | Foreign text quote (uses [ ]) |
| COI | coi | coi | Elided foreign quote |

## Numbers

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| TI | t- | ti/te/ta/to/tu (0-4), tie/tia/tio/tiu (5-8), tei/tea/teo/teu (9-C), tai/tae/tao/tau (D-...) | Digits |
| JU | ju | ju | Base specifier |
| JO | jo- | jo (fractional), joi (negative) | Fractional separator |
| JA | ja | ja | Repeating decimal |
| JE | je- | je (positive magnitude), jei (negative magnitude) | Scientific notation |
| JI | ji- | ji (cardinal), jia (raw cardinal), jio (exclusive cardinal), jioa (raw exclusive), jiu (ordinal), jie (numeric value, elidible) | Number usage |

## Annotations

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| DU | du- | du (predicate scope), duo (sentence scope) | Annotation scope |
| DE | de- | de (interjection), dei (hashtag/metadata) | Annotation type |
| DA | da | da | Start parenthetical |
| DAI | dai | dai | End parenthetical |

## Namespace

| Family | Prefix | Members | Purpose |
|--------|--------|---------|---------|
| PI | pi | pi | Access predicate in namespace |

## Infinite Family Vowel Parsing Rules

These families (SI, VI, FI, TI) accept arbitrary vowel combinations. Key rules for parsing/generating:

### VI/FI vowel structure
- Place vowels: e→E, a→A, o→O, u→U
- `i` goes **BEFORE** the vowel it modifies → equivalence binding. `vie`=E≡, `via`=A≡, `vaio`=A·+O≡
- `h` is NOT accepted in VI/FI (no semantic use; consecutive same vowels don't arise)
- Multi-vowel: each non-final vowel consumes 1 predicate, final gets the rest
- Special cases: `vi`/`fi`=unrelated(&), `voi`/`foi`=adverb, `vioi`/`fioi`=adverb equiv
- FI supports multi-vowel (same as VI)
- FI relative-place uses h: `fehu`/`fahu`=same/next (sharing), `fehi`/`fahi`=same/next (equiv)
- FI accepts h ONLY for these XhY relative-place forms; other h usage rejected

### SI vowel structure (refgram §Right place and chaining selection)
- Structure: `s` + (exposed vowels OR single `i`) + optionally (`h` + chain-override vowel) + optionally final `i`
- Exposed vowels: e/a/o/u select places to expose. Chain target = last exposed vowel by default.
- `h` + vowel: overrides chain target WITHOUT exposing that vowel. At most one `h`. Example: `seho` = expose E, chain O.
- Final `i`: switches chaining from sharing to equivalence. Only valid at the very end.
- `i` in other positions is invalid (except `si`+single vowel transparent pattern)
- `si` + single vowel: transparent (re-expose right predicate's places)

### TI digit enumeration
- Vowels enumerated with no consecutive same vowels (they merge phonologically)
- `h` is NOT accepted (no consecutive same vowels → no need for separator)
- Level sizes: length 1 = 5, length n = 5 × 4^(n-1)
- Enumeration order: within each length, iterate in standard vowel order (i,e,a,o,u), each position skipping previous vowel
- Mixed-radix computation: offset + first_vowel × 4^(n-1) + subsequent adjusted indices × 4^(n-1-k)

### Dynamic generation (web/src/shared/particle-gloss.js)
- `generateParticleInfo(word)` → `{ family, gloss, short }` for any valid SI/VI/FI/VEI/TI word
- `tiDigitValue(vowels)` → numeric digit value from vowel sequence
- `computeNumberInfo(value)` → display string + tooltip breakdown for Number AST nodes
- `parseBindPlaces(vowels)` → array of `{place, equiv}` for VI/FI vowel sequences
