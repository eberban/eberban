---
name: eberban-expert
description: Deep knowledge of the Eberban logical conlang — grammar, morphology, vocabulary, parser, and tooling
---

# Eberban Expert

Load this skill when working on the Eberban conlang repository or when the user asks about Eberban grammar, vocabulary, translation, or tooling. Load reference files as needed for detailed information.

## What is Eberban

Logical conlang inspired by Lojban and Toaq. Goals: simple, regular, expressive. Translates to higher-order logic with trivalent truth (true/false/unknown). Pure functions, no side effects. Creator: mia.

**Long-term vision**: automated theorem prover — given axioms and a proposition, determine if provably true, false, or unknown. The axiom system (nu/ni/onu) is designed with this in mind.

## Key Design Decisions

- **Grammar is concept-neutral** — particles/syntax provide structural tools (binding, chaining, scoping, enumeration) but never encode domain semantics (no tense particles, no emotion particles, etc.). Practical concepts (time, emotion, color) belong in vocabulary (roots/compounds), which can evolve without parser changes. Exceptions only when the verb-only alternative would be too verbose for speech (e.g., PE enumeration — expressible with verbs alone but unusable in practice).
- **No nouns** — everything is predicates (verbs) chained right-to-left
- **No stress** — Self-Segregating Morphology (SSM) via consonant cluster rules
- **Particle families are infinite** — each family generates infinite forms from a prefix pattern. Some families own a whole consonant prefix (e.g., z- for ZI, m- for MI), others only a consonant+first-vowel prefix (e.g., j- shared by JI/JE/JA/JO/JU — all number-related). Families sharing the same consonant are semantically related. Unallocated forms are grammatically valid but meaningless — reserved for future use without parser changes.
- **Context parameter** — hidden arg `c`, a map/dictionary-like structure carrying time/tense/discourse state. Propagates inward only (predicates can't change parent/sibling context). Inter-sentence context injected per sentence; `an` updates it between sentences. Concept of "automatic `an`" (e.g., advancing "now" between narrative sentences). Mechanism (mue/mua) is stable; context manipulation vocabulary is experimental. **Rationale**: without a hidden context, expressing "In the future: you dance" would require adding explicit time parameters to every verb — not ergonomic. The hidden context solves this transparently.
- **Sets by default** — most predicates operate on sets (tce = non-empty set), not individuals. Singular/plural deliberately vague unless specified.

## Morphology Quick Reference

- **25 symbols**: 16 consonants + 5 vowels (i,e,a,o,u) + h
- **Consonant IPA**: h[h], n[n/ŋ], r[ɣ/ʁ], l[l], m[m], p[p], b[b], f[f], v[v], t[t], d[d], s[s], z[z], c[ʃ/ʂ], j[ʒ/ʐ], k[k], g[ɡ]
- **Sonorants**: n, r, l (critical for SSM boundaries)
- **Vhowels**: vowel strings optionally containing h between vowels
- **Word types**: particle (C+vhowels or sonorant/vowel+vhowels+sonorants), root (needs consonant cluster), compound (e/en/er prefix), borrowing (u- prefix + space), freeform variable (i- prefix + space)
- **Spaces**: mandatory only before vowel/sonorant-initial words
- **Freeform variables**: speaker-defined vocabulary with relaxed morphology, more memorable than GI variables. Not widely used yet.

## Compounds

- **e** (2 components), **en** (3), **er** (N, terminated by `e`)
- Components can be roots, particles, or borrowings (borrowings preferred first)
- **Lexicalized**: must be defined manually in dictionary. Components aid memorability/organization, not compositional.
- **Transitivity**: from last component. Override with **se** (intrans), **sa** (trans), **sai** (trans pred) suffix.
- Example: `etiansa` = `e` + `tian` (food, intrans) + `sa` (→ transitive) = "eats"
- Parser splits compounds: `{family: "Compound", prefix: "e", content: [{word: "tian"}, {word: "sa"}]}`

## Transitivity & Place Structure

- **Vowel-final root** = transitive (chains via A place)
- **Consonant-final root** = intransitive (chains via E place)
- **CCV root or -i final** = A place accepts predicate (not atom)
- Places: E (1st), A (2nd), O (3rd), U (4th) + implicit context c
- Chaining is right-grouping: `A (B (C D))`. Always trace inside-out.
- Atom chaining: shares variable. Predicate chaining: states equivalence.
- Arity mismatch: extra places get existential variables.

## Binding & Scope

- **vi/va/vo/vu** (VI): bind atom places of preceding verb. Opens scope closed by vei. VI = fork the chain to explore multiple paths / bind many slots.
- **via/vie/vio/viu** (VI): bind pred places by equivalence (definition). Use va on pred place for sharing (reference without defining). Sharing: "I know what you want" (opaque reference). Equivalence: "I know that the sky is blue" (defines the proposition).
- **fe/fa/fo/fu** (FI): bind places of SAME verb as last open vi. Terminates previous sub-chain. FI = shortcut for vei+vi (e.g., fa = vei va).
- **Bindings are additive, never consumed.** Can still chain after vei — it AND-s more constraints. But: equivalence (via) twice on same slot ≠ AND — it means the two definitions are equivalent to each other.
- **ve+fe idiom**: common for pronouns. `mi ve etiansa meon fe dona skan vei` = "I eat apples and like dogs." Repeating `mi` would create a new existential (possibly different speaker).
- **SI vs VI/FI**: SI for linear chain override (no branching). VI/FI for branching (bind multiple places independently). Can mix SI+VI but FI is clearer in practice.
- **voi/foi**: adverb attachment. Wraps ONLY the verb's evaluation, not its arguments (narrow/de re scope). foi = attach another adverb to same verb as last voi. For tenses: `sre` at sentence/proposition start scopes naturally (no wrapping needed). Mid-chain: `voi sre` for narrow scope (only verb is past), `sia sre` for wide/transparent scope (whole sub-chain is past).
- **se/sa/so/su** (SI): override chaining. Single vowel = expose + bind same place. Two+ vowels = all exposed (order defines new place structure), last = right-bound. `h`+vowel overrides right-bound. `si`+vowel = transparent (re-expose right pred's places, useful for proposition-place predicates like tenses/attitudes). `-i` suffix = equivalence. `sae` ≈ passive voice.
- **zue** (ZI): promote `[A:()]` to `[A:(p)]` receiving E. SI **after** zue selects places (default `sea`). Use zue when subject = attitude holder; use `sia` when attitude holder is separate/unspecified.
- **KI** (k+vhowels): atom variables. Each distinct form (ke, ka, kai, ...) is a named variable. `ke(c,e)` = "e is fixed atom x". Use in argument lists, chains, or with `bo` for forethought assignment.
- **GI** (g+vhowels): predicate variables. Arity inferred from usage. `gi-` = intransitive, `ge/ga/go/gu-` = transitive, final `-i` = equivalence.
- **bo/boi** (BO): forethought assignment. `bo ke` = assign ke to new atom (breaks previous link). `boi ge` = assign ge to new predicate.
- **zu/zui** (ZI): instantiate predicate from KI variable with args. Mainly for definitions.
- **vei**: closes VI/FI scope (elidible at sentence end).
- **VI attaches to immediately preceding verb** — plan ahead! Place vi right after the verb you need to bind (sentinel VI). PA echo-resumptive in parser helps recover from forgotten sentinels.
- **Prefer vei to close scopes** (avoids nesting). Multi-vowel vi (voa, vea, etc.) is a clean compromise.
- **ze**: anaphora — back-references latest mention of prefixed word. Same participants, NOT re-assertion. Like "it/that" (short-range, auto-resolved).
- **KI as long-lived pronouns**: `bo ke mian blan` assigns ke = beautiful cat. ke persists throughout text. Like naming a character.
- **GI must be defined** (via o/on/boi/equivalence) — undefined GI returns "unknown" (trivalent). Useful as junction points in questions.
- **General binding rule** (any verb): binding a non-existent place = no-op, but same slot bound twice = same variable (additivity always holds).
- **Casual speaker hierarchy**: ze (most common) > KI (when ze ambiguous) > GI (pred variables, rare) > zu/zui (definitions only).

## Logical Primitives (MI)

All `m-` particles. Key members (others are convenience roots like mi, mo, me):
- **ma**: e is an atom. **mai**: always true (asserts existence). **mui**: always unknown (trivalent).
- **mue/mua**: context access. mue exposes hidden c as explicit arg. mua evaluates proposition in different context. Powers the time/tense system.
- **mae**: partial application (definition-level, wrapped by list vocabulary for convenience).
- **mao**: subset/implication over predicates (definition-level).

## Default Arguments

- **oie/oia/oio/oiu** (O): set default constraint for E/A/O/U of a predicate. Only applies when the place is not explicitly bound. `oia pred mai` removes a default.
- **zoie/zoia/zoio/zoiu** (ZI): read current default of a place.
- **oien/oian/oion/oiun**: advanced — default that receives all args of the predicate.
- Defaults inherited when re-exported via wrapping/definition, but changing the original's default later doesn't propagate.
- **Key use case — units**: all unit words have `(default: 1)` on A. `mula` = "1 meter", `to mula` = "3 meters" (number overrides default). Makes bare unit = 1 unit.

## Enumeration (PE)

Two modes: **separator** (`PE item1 bu item2 pei`) or **prefix** (`PE bu item1 item2 pei`).
- **pe**: AND/brackets. `mi pe etiansa bu dona pei meon` = "I eat and like apples."
- **pea**: set from one member of each listed set. `mio pea bu za ualis za ubob` = "we are Alice and Bob."
- **peo**: set of atoms satisfying each item. `peo tcu mian bu meon pei` = "{all cats, some apples}."
- **peho**: set of predicates (OR). `me vone peho bu mian meon` = "this is a cat OR an apple."
- **peu/pehu**: ordered list versions of peo/peho.
- Empty: `PE bu pei`. Empty set doesn't exist; empty list does. `pe bu pei` = always true.
- **pei** elidible at sentence end.
- **PE vs VI/FI**: PE items share the same arguments (same apples eaten and liked). VI/FI bindings create independent existentials (different things). Use PE when the same object participates in multiple actions; use ve/fe when actions have separate objects.

## Vocabulary Design Guidelines

**Vowel scale (IEAOU)**: encodes order/scale from small/negative to big/positive. Final `-i` is skipped in patterns (it encodes transitivity type).

**Directional cross diagram**: vowels encode spatial direction:
```
  A (forward)
  |
O-I-E (left-center-right)
  |
  U (back)
```
A = forward (loudest, 3rd of 5), I = center, others counter-clockwise.

**Pattern preference**: vowel patterns > sonorant patterns. If sonorants are used, follow NRL order with same scale/direction guidelines.

**Type roots are definition-level**: roots like pan, man, gan, gen, gin, ski, sken, ban, stan are for typed definitions (place annotations like `[E:tce* pan]`), not common speech. Don't use them as regular predicates in example sentences or translations — they belong in dictionary `short:` fields and `on` definitions.

## Vocabulary Design Insight

Vocabulary is designed to compose with chaining. Example: "tall tree" = `jnu epnuencpie tcuin`
- Right-grouping: jnu(big) → epnuencpie(height) → tcuin(tree)
- The class (tree) is baked INTO the measurement → comparison restricted to trees automatically
- Word order is `[scale] [dimension] [class]`, NOT `[class] [dimension] [scale]`

## Lojban Pain Points (design motivation)

Eberban addresses specific Lojban issues:
- **Vowel diphthongs**: Lojban `au` indistinguishable from `a` in practice; borrowings forced awkward spellings (e.g., "la .mian." → "la .miian."). Eberban uses clean vowel hiatuses instead.
- **Consonant clusters**: Some Lojban clusters too difficult; buffer vowel `y` was hard for speaker (mia). Eberban removes y entirely, bans difficult clusters via SSM.
- **Names vs borrowings split**: Lojban requires separate cmevla (stress-sensitive, consonant-final) vs fu'ivla (multiple classes, hard to distinguish from compounds). Eberban unifies into single borrowing mechanism (`u...pause`) + `za` prefix for names.

## Borrowings & Borrowing Groups

- **Borrowing**: `u` + foreign word adapted to Eberban phonology + space/pause. Must end with vowel or vowel+single-consonant.
- **Borrowing group**: one or more consecutive borrowings forming a single predicate. Terminated by optional `be`. Example: `umia uentropi be` = single predicate "mia entropi."
- **Separating groups**: `be` is needed between distinct borrowing groups to prevent fusion. `umia be uentropi be` = two separate predicates.
- **Truth value**: always undefined — meaning requires collective speaker understanding (not defined in Eberban).
- **Transitivity**: last borrowing in group determines (vowel-final = trans, consonant-final = intrans).
- **Arguments**: all generic (no type inference). Use `vie`/`via` for predicate equivalence bindings.
- **Names**: `za` prefix. `za umia uentropi` = "is named mia entropi."
- **u-initial content**: when borrowed content starts with `u`, a space is needed after the `u` prefix. `'` or `.` can be used instead of a full space to keep words visually connected (`.` preferred by mia). Example: `u.ualis` instead of `u ualis`.
- **In compounds**: borrowings can be compound components (preferred first in resolution order).
- **Parse tree**: `{kind: "BorrowingGroup", group: [{family: "Borrowing", prefix: "u", content: "..."}], end: be?}`

## Eberbanization (foreign words)

Map foreign sounds to closest Eberban phonemes (English [k]→k, [dʒ]→dj, [tʃ]→tc, [ʃ]→c), then fix morphology violations (insert buffer vowels for forbidden clusters, ensure valid ending). Names use `za` prefix: `za udjon` = "is named John."

## Sentence Types

- `a`: assertion. `an`: context update (updates inter-sentence context). `al`: request/command.
- `o`: question. Introduces a variable + constraint; answers instantiate the variable. Ex: `o gi seha etiansa meon` = "who eats apples?" Reply: `a gi za ualis` = "Alice". Reply: `a bi gi` = "nobody".
- **`be` arg lists (universal)**: With `be`, explicit arg list (KI/GI/BA before be) REPLACES chain-exposed places. Without `be`, chain's exposed places (from chaining rules) are used. bai always adds extra place at end. Applies everywhere `ArgumentsList` is used: sentences (a/o), VI/FI bindings, PE enumeration.
- **Recommended question pattern**: leave subject open (no `mo`), use `seha` to expose E while chaining via A, use `bai` for asked-about args. Ex: `o ge seha zue katmi etiansa bai` = "what does one want to eat?" Answer: `a mi ge meon` = "I want to eat apples." ge is transitive (E=subject, A=food).
- `on`: definition = runtime word creation. Dictionary is conceptually a preloaded text of `on` definitions (like a standard library). `oni`: capturing definition (captures current global context). `onu`: define+enable axiom.
- `nu`/`ni`: enable/disable axiom.
- Casual speakers: use GI variables (short-lived) or i-freeform variables (long-lived) instead of defining root words with `on`.

## Discourse Pronouns (MI convenience)

mi=speaker, mo=listener, mio=inclusive we, mie=exclusive we, moe=3rd person, me=this/the.

## Annotations (d- prefix, no logical effect)

- **DI** (di-): focus prefixes. di=attention, die=contrastive, dia=newsworthiness.
- **DE** (de-): interjection/tag suffix. de=interjection (`de gali`=❤️), dei=hashtag.
- **DA/DAI**: parenthetical. da opens, dai closes. Any valid text inside.
- **DU**: scope. du=word+bindings+chain, duo=entire sentence.

## Namespaces (PI/ohi)

PI accesses a word in a namespace (`parent pi word`), ohi imports a namespace. Future-oriented feature for domain vocabulary grouping (e.g., medical field) or accessing words overridden by another speaker (`mi pi word`). Not expected in casual speech currently.

## Paragraphs (PO)

- **po**: public paragraph/section marker. Exported when imported with ohi. Like `pub` in a programming module.
- **poi**: private paragraph. Not available when imported. Like private utility functions.
- Use case: scientific domain dictionaries with internal helper words (poi) and user-facing words (po).

## Anaphora (ze)

- ze is a variable accessor, not a re-evaluator. Back-references original bound variables without re-asserting the predicate.
- ze preserves transitivity and full place structure of the original word.
- Cross-sentence: model by ANDing sentences (existentials stay in scope).
- ze through equivalence boundaries: UNSOLVED design problem. See `references/open-design-problems.md`.

## PA Echo-Resumptive

PA (`pa-` prefix) lets you resume bindings to a verb earlier in the chain by echoing (repeating) it.

**Problem solved**: VI/FI attach to the immediately preceding verb. If you're deep in a chain and realize you need to bind places of a verb you already passed, you're stuck without PA. PA eliminates the need to plan sentinel VI ahead of time.

**Syntax**: `... verb chain... pa verb [SI] [VI/FI binds] [continuation]`

**Matching rule**: The echoed verb must match the original exactly — ZI modifiers, base word, and post annotations all must be identical. Leading SI CAN differ (you can resume with different place selection). Explicit binds are new (that's the whole point).

**Walk-up**: The parser tries to match PA+verb at the deepest chain step first. If no match, it walks up to the parent step, then grandparent, etc., until a matching verb is found. Unmatched PA produces `E_UnmatchedResume` error.

**After PA+verb you can**: add VI/FI explicit binds, apply different SI, continue chaining (resume_next).

**Multiple resumes**: PA can appear multiple times on the same verb. Each resume can have its own continuation chain.

**Scope**: PA is chain-scoped — cannot cross VI/FI bind boundaries.

**PA forms**: `pa` is the only defined member. Others (`pae`, `pai`, `pao`, etc.) are grammatically valid but reserved. PA_Free carries no annotations (no DI/DE/DA).

**Example**: `a mi duna meon pa duna vo mo` = "I give you an apple." PA resumes to `duna` to bind O=listener, after A=apple was already chained.

See `references/grammar-deep-dive.md` for formal grammar details and `references/worked-examples.md` for traced examples.

## Vocabulary State

~880 entries: ~556 roots, 152 compounds, 172 particles. Strong in time/tense/sets/logic/animals/food/emotions/movement/weather/clothing/objects/nature. Still weak in materials/textures/taste/professions/instruments. See `references/vocabulary-gaps.md`.

**Emotion design**: reactive emotions are proposition-based (-i ending, use `zue` for self-referential). Relational emotions (love, hate, trust, jealous) are entity-based (non-i vowel ending). Unary: lonely. Reason is external (context mechanism). A reflexive combinator (`vla`) was explored but deemed redundant with `zue` for practical cases.

## Numbers

- Format: `[base] ju [int] jo [fract] ja [repeat] je [magn] JI` — all optional except at least one part
- JI at END: ji=cardinal set, jiu=ordinal, jie=numeric value (elidible default)
- Default base is context-dependent (typically 10). Base specified by highest digit (Eberban), natlangs add 1.
- Digits (TI): ti=0, te=1, ta=2, to=3, tu=4, tie=5, tia=6, tio=7, tiu=8, tei=9, tea=A...

## Quotes

- **ci/cie** (CI): single word quote. `ci mian` = "is the word 'mian'"
- **ce...cei** (CE/CEI): spelling quote. Each unit = one character.
- **ca...cai** (CA/CAI): grammatical quote of valid Eberban text. Nested ca...cai supported.
- **co** (CO): foreign quote. `co [text]` — text until `]`. Sentinel variant: `co SENTINEL [text ]SENTINEL`.

## Transitivity & Equivalence (detailed)

Transitivity determines how verbs chain and what their chaining place accepts:
- **Vowel-final root** = transitive (chains via A). **Consonant-final** = intransitive (chains via E).
- **-i final root** = A accepts predicate (equivalence). **CCV root (3 chars only: CC+V)** = same.
- Longer CC- roots: transitivity from last letter only, CCV doesn't force equivalence.
- **Compounds**: last component determines. `se`=intrans, `sa`=trans sharing, `sai`=trans equiv.
- **MI**: dictionary `transitive`/`equivalence` fields.
- **GI**: `gi-` intrans, others trans. Ends `-i` after first vowel → equiv.
- **BA**: `h` present → after h: `i`=trans, `e`=intrans. No `h` → atom intrans. Always sharing.
- **KI/quotes/numbers**: intransitive sharing.
- **Borrowings**: same last-letter rule as roots. Groups: last item determines.

## Critical Files

- `books/refgram/src/` — reference grammar chapters
- `web/src/grammar/eberban.peggy` — formal PEG grammar (source of truth)
- `web/src/visual-parser/visual.js` — visual box renderer
- `web/src/visual-parser/boxes.css` — box renderer styles
- `web/src/visual-parser/index.html` — visual parser page
- `web/src/shared/` — shared utilities (regex, symbols, utils)
- `web/src/vendor/` — bootstrap tabs (was legacy/)
- `dictionary/en.yaml` — complete dictionary (~798 entries, YAML)
- `design.md` — design rationale (Lojban comparison)

## Reference Files

- `references/grammar-deep-dive.md` — morphology, logic, binding, sentences, transformations, time system
- `references/particle-families.md` — complete particle family inventory
- `references/numbers-quotes-vocab.md` — numbers, quotes, enumeration, colors, dictionary conventions
- `references/worked-examples.md` — parsed sentences, common patterns, key lessons
- `references/vocabulary-gaps.md` — domain coverage analysis, expansion priorities
- `references/writing-and-tooling.md` — writing systems, web app, visual renderer, grammar file, dev workflows
- `references/open-design-problems.md` — unsolved: ze through equivalence boundaries
- `references/word-form-design.md` — sound symbolism, length strategy, consonant/vowel meaning associations

## Rules for Contributing

- Individual particles lowercase (ve, fa, sre). UPPERCASE for family names (VI, FI, SI).
- Vocabulary: follow existing patterns. IEAOU = small to big scale. Check `dictionary/en.yaml` for domain prefixes (tc- sets, sr- time, zm- colors).
- Compounds: e/en/er prefix. Transitivity from last component. Add se/sa/sai suffix to override.
- Dictionary entries: id (INSERT_WORD_ID → `npm run ids`), family, gloss, tags, short. Place notation: `[E:type]`, `[A:(pred)]`, `*` for distributive. Compounds stored as `"e tian sa"` (spaces between parts). Spelling entries under `_spelling` key. **No section/category comments** (like `# -- Animals --`) in `dictionary/en.yaml` — just add entries directly.
- PEG grammar: run `npm run build-peggy` after editing eberban.peggy. Morphology rules are fragile — never modify without asking.
- Always verify morphological validity: no forbidden consonant pairs, SSM compliance.
- Borrowings: u-prefix, must end with vowel or vowel+single-consonant. Buffer vowels for forbidden clusters.
- When making UI changes: always make a plan before implementing. Don't change plan without user approval.
