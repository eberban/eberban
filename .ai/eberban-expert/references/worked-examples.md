# Eberban Worked Examples

## Simple chain: `a mian etiansa meon`

"There is cat(s) eating apple(s)."

Parse (right-grouping): `mian (etiansa (meon))`
- mian: intrans (E). "e is a cat"
- etiansa: trans (A), atom. "e eats a"
- meon: intrans (E). "e is an apple"
- etiansa meon: A of etiansa shares with E of meon. "e eats a, a is apple"
- mian (etiansa meon): E of mian shares with E of above. "e is cat, e eats a, a is apple"

Logical: `∃e ∃a. mian(c,e) ∧ etiansa(c,e,a) ∧ meon(c,a)`

---

## Right-grouping trap: `a tcu mian dona mi`

"There is the set of cats that like me." (NOT "all cats like me")

Parse: `tcu (mian (dona mi))`
- dona mi: trans A shares with E of mi. "e likes speaker". 1-ary.
- mian (dona mi): intrans E shares. "e is cat AND e likes speaker". 1-ary.
- tcu (mian dona mi): trans A is pred (CCV root). Pred chaining: A ≡ right chain.

Logical: `∃e. tcu(c, e, [x → mian(c,x) ∧ ∃a.(dona(c,x,a) ∧ mi(c,a))])`

This creates a FILTERED set (cats that like me), not "all cats like me".

---

## Explicit binding to avoid grouping trap: `a dona ve tcu mian fa mi`

"The set of all cats likes me."

- dona(c, e, a): "e likes a"
- ve: VI, binds E of dona → tcu mian = "set of all cats"
- fa: FI, binds A of dona → mi = "speaker"
- (vei elided)

Logical: `∃e ∃a. dona(c,e,a) ∧ tcu(c,e,mian) ∧ mi(c,a)`

---

## Same meaning, starting with `a tcu`: `a tcu via mian fe dona mi`

"The set of all cats likes me."

- tcu(c, e, A): "e is set satisfying A"
- via: VI, binds A (pred, equiv) → mian. A ≡ "is a cat".
- fe: FI, binds E (atom, sharing) → dona mi. E of tcu shares with E of dona.
- dona mi: "e likes speaker". E = the liker.
- (vei elided)

Logical: `tcu(c, e, mian) ∧ dona(c, e, a) ∧ mi(c, a)`

---

## Adverb (foi) for tense: `a mi etiansa meon sa duna ve mo fo mi foi sre`

"I eat apple(s) that you **gave** to me."

Parse: `mi (etiansa (meon (sa duna [ve mo fo mi foi sre])))`
- duna(c, e, a, o): "e gives a to o"
- ve mo: E of duna = listener (giver)
- fo mi: O of duna = speaker (recipient)
- foi sre: adverb — sre ("before") wraps ONLY duna's evaluation in past context
- sa: overrides exposed place to A (because E already bound by ve)
- meon chains with exposed A of duna: apple = thing given
- etiansa chains normally: A = apple
- mi chains normally: E = speaker

Key: foi sre wraps only duna. So mi, mo, meon are in PRESENT context (these exist now). Only the giving is past. Without foi, putting sre in the chain would push everything after it into the past.

---

## Adverb (voi/foi) pattern: tool/instrument

Same mechanism applies to "with-tool" predicates. Example pattern:
`mi etiansa meon voi [tool-pred] [tool-chain]`

The tool is scoped to etiansa only — involved in the eating, not in the apple existing or the speaker existing. Without voi, chaining the tool predicate would either filter the whole chain or misplace the tool's relationship.

**General principle:** voi/foi answers "which specific action does this modifier apply to?" rather than "does this apply to the whole proposition?" Works for tenses, tools, locations, manner — any context-like modifier.

---

## Tense scoping: three strategies compared

1. **Verb-only (voi):** `etiansa voi sre vei meon` — sre wraps only etiansa. "Eating was past, apple exists now."
2. **Transparent (sia):** `sia sre etiansa meon` — sre wraps whole right chain, re-exposes etiansa's places. "In the past: e eats apples." Chain flows through.
3. **Plain chain:** `sre etiansa meon` — sre swallows chain as its proposition, exposes sre's own places. Breaks left chain flow.

---

## sia vs zue: attitude/proposition predicates

`gali(c, e, A:())` = "e happy that A"

**sia (transparent):** `mian sia gali etiansa meon`
- gali transparent → chain re-exposes etiansa's places
- gali's E existential (who's happy is unspecified)
- mian chains with etiansa's E (eater)
- "A cat eats apples; someone is happy about it."

**zue (promote):** `mian zue gali etiansa meon`
- zue promotes gali's A:() to A:(p), receives E
- gali's E IS the main chain subject, proposition is about E
- mian chains with gali's E
- "A cat is happy that it eats apples." Cat = happy one = eater.

**Rule of thumb:** zue when subject = attitude holder. sia when attitude holder is separate/unspecified (or for tenses).

---

## Anaphora (ze): what's settled

**ze is purely anaphoric** — back-references original bound variables WITHOUT re-evaluating the predicate. Reconstructs place structure with original variables.

```
a mian etiansa meon           -- "cats eat apples"
a ze etiansa dona mi          -- "the eaten (apples) like(s) me" (trans: chains via A)
a se ze etiansa dona mi       -- "the eater(s) (cats) like(s) me" (se overrides to E)
a va ze etiansa blan          -- "the eaten (apples) are beautiful" (va selects A)
```

**ze preserves transitivity** of the original word. etiansa is vowel-final = transitive, chains via A (eaten). Use se/va to access other slots.

**Shared variables in chains:** `mian zman` share the same E (`mian(c,e) ∧ zman(c,e)`). So `ze mian` ≡ `ze zman`. Full chain constraint comes along via shared variable.

**Atom-position words:** ze creates identity with the bound variable. Clear and unambiguous.
- `se ze tcu` references the set atom (se needed to override CCV transitivity).

**Cross-sentence:** Model by ANDing sentences — existentials stay in scope.

**ze through equivalence boundaries:** UNSOLVED — see `references/open-design-problems.md`.

---

## Vocabulary design: measurement + chaining = adjectives

```
a me jnu epnuencpie tcuin     -- "This is a tall tree"
```

Parse: `me (jnu (epnuencpie (tcuin)))`
- epnuencpie tcuin: "height of trees" (measurement restricted to trees)
- jnu (epnuencpie tcuin): "big in height-of-trees" (comparison class = trees)
- me: "this"

**Key insight:** the class word (tcuin) is chained INTO the measurement, so:
- The comparison is automatically restricted ("big for a tree", not "big for anything")
- Non-trees can't satisfy the measurement → automatic filtering
- Word order is `[scale] [dimension] [class]`, NOT `[class] [dimension] [scale]`

Changing the last word changes the comparison class:
- `jnu epnuencpie tcuin` = "tall tree" (big for a tree)
- `jnu epnuencpie mian` = "tall cat" (big for a cat)
- `jnu epnuencpie` alone = "tall" (big in height, compared to anything)

---

## Multi-place binding: `a mo duna vo mi fa to ji meon foi sre`

"You gave me 3 apples (in the past)."

```
a ── sentence: assertion
│
├─ mo ──────────────── E (giver) ─── "you"
│    ↓ shares E
└─ duna ────────────── verb: "gives"
    ├─ vo ─── mi ──── O (recipient) ─ "me"
    ├─ fa ─── to ji ─ meon ── A (given) ── "3 apples"
    │         │    │    └── ji's A ≡ meon (apple)
    │         │    └── cardinal marker
    │         └── digit 3
    ├─ foi ── sre ─── adverb: "before" (past)
    │         └── wraps ONLY duna's evaluation
    └─ (vei) ──────── elided at sentence end
```

Note: all arguments (mo, mi, meon) exist in PRESENT. Only the giving is past.
For everything in the past, prefix whole sentence with sre: `a sre mo duna vo mi fa to ji meon`

Common mistake: `a mo duna meon vo mi` — vo would bind to meon, NOT duna! vi always attaches to the immediately preceding verb.

---

## va vs via on predicate places: `mi katmi va sae tuli mo` vs `mi katmi via sae tuli mo`

**va (sharing):** `mi katmi va sae tuli mo`
- katmi(c, e, A:()): "e wants A to be true"
- va: SHARES katmi's A place with tuli's A place (same proposition reference)
- tuli(c, e, A:()): "e needs A to be true"
- sae: expose A and E of tuli, chain to E → mo
- Result: "I want [some proposition that the listener needs]." The proposition is shared — katmi and tuli talk about the same unspecified proposition.

**via (equivalence/definition):** `mi katmi via sae tuli mo`
- via: DEFINES katmi's A ≡ the right chain (wrapped to 0-ary)
- tuli's A is existential (wrapped away)
- Result: "I want that [the listener needs something]." A is defined AS "listener needs something."

**Rule:** va = both predicates share same argument. via = right chain IS the definition of the argument.

---

## Multi-vowel VI: `mi duna vao mo meon`

"I give the listener an apple."

- duna(c, e, a, o): "e gives a to o"
- vao: each non-final vowel (a) binds one chain element; final vowel (o) binds rest
  - A ← mo (1st element: thing given = listener... but check place structure!)
  - O ← meon (rest: recipient = apple)
- mi chains intransitively: E = speaker

**Syntax pattern:** multi-vowel VI = sequential place binding. `vXY`: X gets 1st element, Y gets rest. `vXYZ`: X gets 1st, Y gets 2nd, Z gets rest.

More examples from refgram:
- `mi kelo vaio: za ubob, sae coriu vihon` — vaio: A(atom)=Bob, iO(pred equiv)=owns car. "I'm thankful to Bob for owning a car."
- `drie veao: mi, meon, e uiuro sfia jo ta` — veao: E=me, A=apples, O=0.2 EUR. "I buy apples for 0.2 EUR."

**Always check the dictionary for place structures** — don't assume from English word order.

---

## SI examples from refgram

```
saeoi = expose A,E,O (in that order → new E=old A, new A=old E, new O=old O)
        chain to O with equivalence (-i suffix)

seho  = expose E only, chain to O with sharing
        (h overrides chain target independently from exposed places)

sea   = expose E and A, chain to A with sharing (last vowel = chain target)
        "e eats a, a is cat" → "(apple) eaten by cat"

sae   = expose A and E (reversed!), chain to E with sharing
        "a eaten by e, e is cat" → same meaning, different exposed order
```

---

## OR with veni: `a veni ve peo bu mian meon vei sae etiansa mi`

"I eat a cat or an apple." (at least 1 of {cats, apples} satisfies "I eat x")

- veni(c,e,a,o): "at least O (default 1) members of set E satisfy A (1-ary pred)"
- ve: bind E → `peo bu mian meon` = set {cats, apples}
- vei: close, chain continues via A (trans, equiv)
- `sae etiansa mi`: expose A(food) and E(eater), right-bind to E. mi chains into E = speaker. 2-ary, but A expects 1-ary → AMR wraps E (already bound to mi). Result: "I eat x."
- sahe would be equivalent but more explicit (h-override hides E). Prefer sae when AMR wraps correctly.

---

## Cross-scope KI: `a pea bu za ualis za ubob pei tcori via ke ka be ke zue katmi duna vao mian ka`

"Alice and Bob want to give each other cats."

- pea...pei: set {Alice, Bob} = E of tcori
- tcori(c,e,A): all pairs in E mutually satisfy 2-ary relation A
- via ke ka be: A is 2-ary. KI variables ke (arg1) and ka (arg2) bridge arg list to chain body.
- Chain: `ke zue katmi duna vao mian ka`
  - duna vao mian ka: bind A=mian (cat), O=ka (receiver)
  - zue katmi: promotes A to 1-ary receiving E. A ≡ wrapped duna = "e gives cat to ka"
  - ke: E chains. ke = wanter/giver.
- KI needed because nested vao captures ba. ba can't cross scope boundaries.

---

## Question pattern: `o ge seha zue katmi etiansa bai`

"What does one want to eat?" (open subject, transitive answer predicate)

- o ge: question, ge = transitive answer predicate
- No `be` → chain's exposed places = ge's places
- seha zue katmi: expose E (wanter), h-override right-bind to A (pred). 1-ary chain.
- etiansa bai: bai tags food as sentence-level arg → ge's extra place
- ge(c, subject, food): E = wanter (from chain), A = food (from bai)
- Answer: `a mi ge meon` = "I want to eat apples"

---

## Negation scope: zi vs bi

- `mi zi etiansa meon`: narrow. I exist, apples exist, eating doesn't hold.
- `mi bi etiansa meon`: wide. I exist, false that I eat any apple (apple need not exist).
- `bi etiansa meon`: widest. False that anything eats apples.

---

## Definition: "generous" = `on glan seha zue gali duna`

glan(c,e) = "E is happy about E giving things" ≈ generous (intransitive)

- on glan: define glan
- seha zue gali: expose E only, h-override right-bind to A (pred). 1-ary/intransitive.
- duna chains into A: zue makes A 1-ary receiving E → wrapped duna = "E gives something to someone"
- Without `be`: chain's exposed places = glan's places. 1-ary.

---

## Definition: "teaches" = `on [word] ke ka ko be pe ke duna vao ka ko bu ko fule vao ka ke pei`

teaches(c,e,a,o) = "E gives A to O AND O knows A from E" (transitive, 3 places)

- ke ka ko be: 3 explicit KI args (teacher, knowledge, student)
- pe...bu...pei: AND two chains (symmetric weight, cleaner than vi/fi for equal-importance clauses)
- ke duna vao ka ko: teacher gives knowledge to student
- ko fule vao ka ke: student knows knowledge from teacher

**Patterns:**
- `pe...bu...pei` for AND-ing independent clauses in definitions (symmetric/clean)
- `vi`/`fi` also works as AND (vi = 0-ary branch, binds nothing). fi preferred when already inside a VI to avoid nesting.
- vi inside a predicate definition scope can accidentally branch within the wrong context — be careful.

---

## Key Lessons

1. **Right-grouping is the default** — `A (B (C D))`. Always trace inside-out.
2. **Pred chaining (CCV/A-pred) filters** — `tcu X` makes "set of things satisfying X", so anything chained after the content word becomes part of the filter.
3. **VI/FI breaks grouping** — use ve/va/vo/vu + fe/fa/fo/fu to explicitly bind places when default chaining gives wrong meaning.
4. **via vs ve** — use via/vie/vio/viu for predicate places (equivalence), ve/va/vo/vu for atom places (sharing).
5. **FI terminates previous chain** — fe/fa appearing inside a VI scope ends the current sub-chain and starts a new one for another place of the same verb.
6. **vei is elidible** at sentence end.
7. **Sets are default** — predicates operate on sets (tce*), so singular/plural is deliberately vague unless specified.
8. **Prefer vei over nesting** — close VI scopes with vei early to avoid deep nesting. vo+fa is also good. Multi-vowel vi (voa, vea, etc.) is a clean compromise when applicable.
9. **vi is a sentinel** — place vi right after the verb you want to bind, BEFORE the chain fills other slots. Think ahead: once chaining moves past a verb, you can't go back to bind its places without vi already in place. Forgetting to place vi is a common mistake.
10. **vi attaches to immediately preceding verb** — `X Y vo Z` binds vo to Y, NOT X. To bind X's places, put vi right after X: `X vo Z vei Y`.
11. **PA echo-resumptive** — PA lets you echo-repeat a verb to resume bindings to it. Addresses the common mistake of forgetting a sentinel vi. Leading SI can differ (resume with different place selection), but ZI modifiers and the base verb must match exactly. PA is chain-scoped — cannot cross VI/FI bind boundaries. See PA examples below.
12. **voi/foi for scoped modifiers** — voi opens adverb scope on preceding verb, foi attaches to same verb as last open vi. Both wrap ONLY the verb's evaluation, not its arguments. Use for tenses, tools, locations.
13. **FI has 4 convenience members, not 2** — atom context: feu (same place), fau (next place). Predicate context: fei (same pred place), fai (next pred place). Don't confuse them.
14. **va ≠ via on predicate places** — va SHARES a predicate reference. via DEFINES by equivalence. `katmi va X` = wants same thing X needs. `katmi via X` = wants that X-needs-something.
15. **O/on sentence structure** — `o` and `on` require a definable word THEN an inner predicate: `on ga etiansa meon` (define ga as "eats apples"). `a` only needs inner predicate.
16. **Always check dictionary for place structures** — don't assume E/A/O mapping from English. Translate by looking up the actual place structure first.
17. **AMR vs explicit h-override** — when target arity is lower, AMR wraps extra places. Use `h`-override only when AMR would wrap the wrong place. Prefer simpler SI forms (sae over sahe) when AMR handles it.
18. **be arg lists are universal** — with `be`, explicit arg list replaces chain-exposed places. Without `be`, chain's exposed places are used. bai adds extra at end. Applies in sentences (a/o), VI/FI, PE enumeration.
19. **KI bridges scopes, ba is scope-local** — ba attaches to innermost ArgumentsList-hosting structure. KI can be named in outer scope and referenced in nested scopes.
20. **zue for subject-oriented propositions** — `mi zue katmi jvin` = "I want to dance." Without zue, the dancer is existential (disconnected from speaker).
21. **PA is chain-scoped** — PA cannot cross VI/FI bind boundaries. Inside a VI bind, PA can only resume verbs within that bind's inner chain. If you need to resume a verb in the parent chain, close the bind first (vei) then use PA.

---

## PA Echo-Resumptive: Basic — `a mi duna meon pa duna vo mo`

"I give you an apple."

**Without PA** (planned ahead): `a mi duna vao meon mo`

Parse (right-grouping): `mi (duna (meon))`
- duna meon: duna's A (trans) shares with meon's E. "e gives apple to o"
- mi (duna meon): mi's E shares with duna's E. "speaker gives apple to o"
- O of duna is unbound (existential recipient)

PA resume: `pa duna vo mo`
- Parser walks up: meon ≠ duna (fail), duna ≡ duna (match!)
- Resume attaches to the duna step
- vo mo: bind O of duna to mo = listener

Result: `duna(c, speaker, apple, listener)` = "speaker gives apple to listener"

---

## PA Echo-Resumptive: Deeper verb — `a mi dona etiansa meon pa etiansa ve blan`

"I like a beautiful apple-eater."

**Without PA** (planned ahead): `a mi dona etiansa va meon fe blan vei`

Parse: `mi (dona (etiansa (meon)))`
- etiansa meon: A=apple. "e eats apple"
- dona (etiansa meon): A of dona shares with E of etiansa. "e likes apple-eater"
- mi: E=speaker. "speaker likes apple-eater"

PA resume: `pa etiansa ve blan`
- Parser walks up: meon ≠ etiansa (fail), etiansa ≡ etiansa (match!)
- ve blan: bind E of etiansa to blan. "eater is beautiful"

Result: "speaker likes [beautiful apple-eater]"

Key: PA walked past meon to find etiansa two levels up.

---

## PA Echo-Resumptive: ZI must match — `a mi zi duna meon pa zi duna vo mo`

"I don't give you an apple."

- `zi duna` in the chain: zi negates duna (short negation)
- `pa zi duna`: echo must include zi — it's part of ChainVerb
- `vo mo`: bind O = listener

**Error case**: `pa duna vo mo` (without zi) → `E_UnmatchedResume` because `zi duna ≠ duna`

Rule: leading SI can differ, but ZI modifiers + base word must match exactly.
