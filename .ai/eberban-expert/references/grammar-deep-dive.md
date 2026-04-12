# Eberban Grammar Deep Dive

## Morphology

### Phoneme Inventory
- **Consonants** (16): h [h], n [n/ŋ], r [ɣ/ʁ], l [l], m [m], p [p], b [b], f [f], v [v], t [t], d [d], s [s], z [z], c [ʃ/ʂ], j [ʒ/ʐ], k [k], g [ɡ]
- **Vowels** (5): i [i], e [e], a [a], o [o], u [u]
- **Alphabetical order**: hnrlmpbfvtdszcjkgieaou
- No stress. Schwa [ə] optionally inserted between consonant pairs in casual speech. Consecutive vowels = hiatuses (smooth separation, optional [j]/[w] glides).

### Consonant Pairs
- **Initial pairs**: can start words (chart: light blue)
- **Medial pairs**: only mid-word between vowels (chart: pink)
- **Invalid pairs**: forbidden (voicing mismatch, sibilant+sibilant)
- **Triplets**: medial+initial pair (max 3 consonants in row)

### Word Shapes
- **Particle**: C+vhowels only, OR sonorant/a/o+vhowels+sonorants
- **Root**: nonsonorant-C+vhowels+(sonorant|medial|triplet)+..., OR initial-pair+vhowels+...
- **Compound**: e(2-word), en(3-word), er(N-word...e)
- **Borrowing**: u+content+space (relaxed consonant rules)
- **Freeform variable**: i+content+space (borrowing rules). Goal: speaker-defined vocabulary with memorable forms (relaxed morphology makes them easier to remember than GI variables which get confusing quickly). Not widely used yet.

### Eberbanization (adapting foreign words)
Map foreign sounds to closest Eberban phonemes:
- English [k] → k, [dʒ] (J) → dj, [tʃ] (Ch) → tc, [ʃ] (Sh) → c
- English [θ] (th) → t or s, [ð] → d or z (approximate)
- Drop silent letters, map vowels to closest i/e/a/o/u

Then fix morphology violations:
- Borrowings must end with vowel or vowel+single-consonant
- Forbidden clusters → insert buffer vowel (e.g., tcarlz → tcarlaz)
- If borrowing starts with u, use u' to avoid double-u

**Examples:**
- "John" → djon → `za udjon` ("is named John")
- "Charles" → tcarlaz → `za utcarlaz` ("is named Charles")
- "Bob" → bob → `za ubob`
- "Alice" → alis → `za ualis`

**Names use za prefix:** `za` + borrowing = "[E] is named [borrowing]"
**Multiple borrowings:** separate with `be` to prevent fusion

### SSM (Self-Segregating Morphology)
Non-sonorant consonant = word boundary (unless medial pair). Spaces only mandatory before vowel/sonorant-initial words. Two consecutive words can never form a forbidden cluster.

---

## Logic Framework

### Predicates
Pure functions: args -> trivalent truth (true/false/unknown). Every word is a predicate.

### Places (Arguments)
- Implicit context **c** — map/dictionary-like structure. Auto-propagated inward (predicates share parent's c, can't change it for siblings/parents). Carries time/tense/discourse state.
- Explicit: **E** (1st), **A** (2nd), **O** (3rd), **U** (4th)

### Context lifecycle
1. Inter-sentence context exists (must come from somewhere)
2. Each sentence receives a copy as its `c`
3. Within a sentence: `mue` reads c, `mua` locally swaps it for sub-evaluations
4. Between sentences: `an` explicitly updates inter-sentence context. Concept of "automatic `an`" (e.g., advancing "now" in narrative) exists.
5. Cross-sentence composition not fully modeled yet — work in progress.

### Chaining
- Right-grouping: `A (B (C D))`
- **Atom chaining**: left's transitive place shares variable with right's E place
- **Predicate chaining**: left's transitive place stated equivalent to right chain
- **Arity mismatch**: extra places get existential variables (wrapped)

### Transitivity
- Vowel-final = transitive (A place)
- Sonorant-final (n/r/l) = intransitive (E place)
- CCV or -i final = A place is predicate type

---

## Explicit Binding

### VI (v+vowel): Select left atom place
ve=E, va=A, vo=O, vu=U. Opens scope closed by vei.
**VI = fork the chain.** Normal chaining is linear; VI lets you branch to bind multiple places independently. The chain inside the scope fills the bound place like chaining would.

### VI pred (v+i+vowel): Select left pred place by equivalence (definition)
vie=E, via=A, vio=O, viu=U.
**Critical distinction**: ve/va/vo/vu on pred place = SHARE reference (no definition). vie/via/vio/viu = DEFINE by equivalence.
- `katmi va sae tuli mo` → wants [some proposition that listener needs] (shared prop, different meanings possible)
- `katmi via sae tuli mo` → wants that [listener needs something] (defined prop, A ≡ "listener needs")

### Multi-vowel VI/FI: Bind multiple places in one scope
vao = bind A then O. vaio = bind A then predicate-O. Compact alternative to FI chains.
- Each **non-final** vowel consumes exactly 1 unit (word, quote, number, PE enum) from the following chain.
- The **final** vowel gets the remaining chain.
- `i` before a vowel = equivalence binding (predicate place).
- Ex: `X vao mian blan etiansa meon vei` → A=mian (1 word), O=`blan etiansa meon` (rest of chain).
- Ex: `X vaoe mian meon blan etiansa vei` → A=mian, O=meon, E=`blan etiansa` (rest).

### FI (f+vowel): Bind same pred as last open VI, supports multi-vowel
**FI = shortcut for vei+vi** (e.g., fa = vei va). Closes current sub-chain and opens new one on same verb.
Same vowel mapping. Convenience members:
- Atom context: feu=same atom place, fau=next atom place
- Predicate context: fei=same pred place, fai=next pred place

### Binding properties

- **Bindings are additive, never consumed.** Chaining after vei AND-s more constraints on the same place. `etiansa ve mian fa meon vei blan` = "cat eats beautiful apple" (blan adds to A).
- **Double equivalence (via) on same slot ≠ AND** — it means the two definitions are equivalent to each other. Probably a mistake if unintentional.
- **ve+fe idiom for pronouns**: `mi ve etiansa meon fe dona skan vei` = "I eat apples and like dogs." Repeating `mi` would introduce a new existential (possibly different speaker).
- **SI vs VI/FI**: SI = linear chain override (no branching). VI/FI = branching (bind multiple places independently). Can mix but FI is clearer in practice.

### voi/foi: Adverb attachment
Y evaluated by X (Y bound to A of X). Prevents Y's bindings from leaking. Used for context modification (tenses) and preposition-like clauses.

### SI (s+vowel): Override chaining

General pattern: `s` + vowel list + optional `h`+vowel + optional final `-i`

**Single vowel** (`se, sa, so, su`): expose AND right-bind the same place.
- `se etiansa blan` — expose E, bind E to blan. "e eats something, e is beautiful." 1-ary (E).

**Two+ vowels** (`sae, sea, seao, ...`): ALL listed vowels are exposed. Last vowel is also the right-bound place. Exposed order defines new place structure (1st→E, 2nd→A, etc.).
- `sae etiansa mian` — expose A and E, bind E to mian. "a eaten by cat e." 2-ary (A, E).
- `sea etiansa mian` — expose E and A, bind A to mian. "e eats cat." 2-ary (E, A).

**`h` override** (`seho, sahoi, ...`): `h`+vowel explicitly picks the right-bound place. The h-prefixed vowel is the chain target only — it is NOT exposed. At most one `h` allowed.
- `seho etiansa` — expose E only (not O), chain to O.
- `sehai etiansa` — expose E only, chain to A with equivalence.
- Compare: `sea` (expose E+A, chain A) vs `seha` (expose E only, chain A).
- Use `h` when AMR would wrap the wrong place. If the target arity is lower and AMR naturally wraps the right places, prefer the simpler form (e.g., `sae` over `sahe` when the extra place gets wrapped anyway).

**`si` + vowel = transparent** (`sia, sie, sio, siu`): re-expose all places of the RIGHT predicate. The vowel picks which place of the SI-prefixed predicate receives the right chain. The prefixed predicate's own places exist but are not re-exposed (accessible via VI/FI, otherwise existential).
- `sia sre etiansa meon` — sre's A gets "eats apples" as proposition, but chain re-exposes etiansa's places. "In the past: e eats apples." Tense wraps whole chain without breaking flow.
- Use case: proposition-place predicates (tenses, attitudes) where you want the main chain to flow through.

**`-i` suffix** = equivalence binding (any form).

### zue: Proposition-to-predicate promotion (ZI family)

Transforms `[A:()]` (proposition) into `[A:(p)]` (1-ary predicate) receiving the `[E:p]` content. Result is transitive.

- `zue gali` = implicit `zue sea gali`: E=entity, A=proposition → "e happy that (A about e)"
- SI **after** zue selects places: 2-vowel `sXY` (X=entity, Y=proposition), 1-vowel `sY` = `seY`. `se` nonsensical (same place for both).

**sia vs zue:**
- `mian sia gali etiansa meon` — gali transparent. E of gali existential (who's happy is unspecified). mian chains with etiansa's E (eater). "A cat eats apples, someone is happy about it."
- `mian zue gali etiansa meon` — gali's E IS the main chain subject, proposition is about E. "A cat is happy that it eats apples." Cat = happy one = eater.

**Tense scoping comparison:**
1. `etiansa voi sre vei meon` — sre wraps only etiansa. "Eating was past (apple exists now)."
2. `sia sre etiansa meon` — sre wraps whole right chain transparently. "In the past: e eats apples."
3. `sre etiansa meon` (no SI) — sre swallows chain, exposes sre's own places. Breaks left chain flow.

### KI (k+vhowels): Atom variables

All `k-` particles (ke, ka, ko, ku, kai, keo, ...) — infinite family. Each is a distinct variable name. Acts as predicate: `ke(c, e)` = "e is fixed atom x". Type (p), 1-ary.

**Usage patterns:**
1. **In argument lists** (VI/FI): `va ke be: mian etiansa ke` — ke shared between inner chain and outer verb's place.
2. **In chains**: ke appears like any 1-ary predicate, chains via E.
3. **Forethought** (`bo ke`): assign ke to a new atom value. Breaks link with previous instances of that KI.

### GI (g+vhowels): Predicate variables

All `g-` particles (ge, ga, gie, gia, ...) — infinite family. Represents a predicate; arity/type inferred from usage.

- `gi-` prefix = intransitive sharing behavior
- `ge/ga/go/gu-` prefix = transitive behavior
- Final `-i` = chaining by equivalence (like roots)

### bo/boi (BO): Forethought assignment

- `bo` + KI/word = create/assign as new atom variable. Type (p). Breaks link with any previous value.
- `boi` + GI/word = create/assign as new general predicate variable. Arbitrary arity, constrained by usage.
- `bo` before non-KI words (e.g., freeform variables) makes them behave like KI.

### zu/zui (ZI): Instantiation

- `zu pred` = instantiate predicate arg with transitive behavior
- `zui pred` = instantiate with intransitive behavior
- Use case: predicate stored in KI variable, want to call it with arguments via VI/FI. Mainly for definitions, not casual speech.
- GI variables could be replaced with KI + zu/zui.

### PA Echo-Resumptive

PA lets you resume bindings to a verb earlier in the chain by echoing (repeating) it.

**Grammar rule** (eberban.peggy:238-268):
```
ChainInner = ChainNegation
    / chain:ChainVerbAndBinds next:ChainInner?
    resume:(
        resume_start:PA_Free !E_ResumeChainEmpty resume_chain:ChainVerbAndBinds
        &{ return JSON.stringify(chain.verb) === JSON.stringify(resume_chain.verb) }
        resume_next:ChainInner?
    )*
```

**Matching**: compares `chain.verb` (ChainVerb = ZI modifiers + base word + post annotations) via JSON.stringify. Leading SI is in `chain.select`, NOT in `chain.verb`, so SI can differ between original and echo. Explicit binds are separate too (that's the point — add new ones).

**Walk-up mechanism**: PEG backtracking. PA+verb is tried at the deepest chain step first. If the `&{...}` predicate fails (verb mismatch), PEG backtracks the consumed PA+verb, the `*` yields zero matches, and ChainInner returns. The unconsumed PA+verb then gets tried at the parent step's `resume` clause. Repeats until match or root-level `E_UnmatchedResume` error.

**Parse tree shape**: when PA matches, the chain step gains a `resume` field:
```javascript
{
  verb: ...,         // original verb
  next: ...,         // normal chain continuation (steps after verb, before PA)
  resume: {          // single object or array (multiple resumes)
    start: PA_Free,  // PA particle node (with any spacing)
    chain: ChainVerbAndBinds,  // echoed verb + optional SI + new binds
    next?: ChainInner          // continuation chain after resume
  }
}
```

**Multiple resumes**: the `*` quantifier allows multiple PA on the same step. Stored as array when >1. Each can have its own continuation.

**Scope**: PA operates within a single Chain. Cannot cross VI/FI bind scope boundaries (those start new Chain/ChainInner parses). Can cross into parent steps within the same chain.

**Error rules**:
- `E_ResumeChainEmpty` (line 236): PA not followed by a verb
- `E_UnmatchedResume` (line 150): PA+verb at root level with no matching verb in chain. Message: "while leading SI can differ, anything following a ZI must match"

**PA particle** (line 605): `PA = &ParticleWord &(p a Vhowels &PostWord) x:ParticleWord`. All `pa-` forms are valid; only `pa` is defined.

**PA_Free** (line 555): no FreePrefix/FreePostfix — PA cannot carry DI/DE/DA annotations.

**GrammaticalQuoteTerminatorElider** (line 191): PA_Free is listed, meaning PA can terminate elided grammatical quote boundaries (like FI, VEI, PEI, BU).

### Practical hierarchy for casual speakers
1. **ze** — back-reference latest instance (most common)
2. **KI** — explicit named variable when ze is ambiguous
3. **GI** — predicate variable (rarer in casual speech)
4. **zu/zui** — definition-level, casual speakers can avoid

### BA: Inline/anonymous arguments

Essentially "anonymous KI/GI" — when you need a variable but don't need to name or reference it later.

**In argument lists** (inside VI/FI scope, before `be`): used to **skip** an argument position. Which BA member is used doesn't matter — just a placeholder.

**Outside argument lists** (inline in chain): adds an argument at end of the argument list and uses it directly.
- **ba**: atom argument (like anonymous KI)
- **bahi**: transitive predicate argument (like anonymous transitive GI)
- **bahe**: intransitive predicate argument (like anonymous intransitive GI)

**Sentence-level variants** (bai/baihi/baihe): adds to the **sentence** argument list. Main use: questions with `o`, where sentence args become what the question asks about.

**ba vs KI:** ba attaches to the innermost structure that can host an ArgumentsList (VI/FI, sentences, PE enumeration). If nested structures exist (e.g., vao inside via), ba is captured by the inner one. Use KI variables when you need cross-scope references — KI can be named in an outer arg list and referenced inside nested structures.

**Example — cross-scope KI:**
`tcori via ke ka be ke zue katmi duna vao mian ka` = "mutually want to give cats to each other." ke/ka bridge outer via arg list to inner vao. ba can't do this.

---

## Logical Primitives (MI family)

All `m-` particles act as predicate words. Core members are defined directly in logic:

| Particle | Places | Meaning |
|----------|--------|---------|
| `ma` | (c, e) intrans | e is an atom |
| `mai` | (c, e) intrans | always true — asserts e exists |
| `mae` | (c, E, A, o) trans | partial application: E ≡ A with first slot filled by o |
| `mao` | (c, e, A, O) trans | subset: ∀args O(args)⇒A(args). O ⊆ A. E skipped |
| `mui` | (c) 0-ary | always unknown (trivalent third value) |
| `mue` | (c, e) intrans | e is the context argument (exposes hidden c) |
| `mua` | (c, e, A) trans | A is true when e is used as context argument |

- **ma/mai**: type-checking. mai useful in definitions to express bare existence.
- **mae**: currying primitive. Definition-level; wrapped by list vocabulary for practical use.
- **mao**: predicate subset/implication: O ⊆ A (anything satisfying O also satisfies A). Handles different arities via mismatch resolution. Definition-level.
- **mue/mua**: context pair. Powers the time/tense system — sre etc. use mua to evaluate predicates in modified contexts. Context manipulation vocabulary is experimental; the mue/mua mechanism itself is stable.
- **mui**: trivalent unknown value.
- Other m- particles (mi, mo, me, etc.) are convenience roots, not logical primitives.

## Default Arguments

**Setting defaults (O family):**
- `oie/oia/oio/oiu` + predicate + constraint: set default for E/A/O/U. Only applies when place not explicitly bound.
- `oia espuackuil flan` = "A of espuackuil defaults to flan (human)"
- `oia espuackuil mai` = remove default (mai = always true = no constraint)

**Reading defaults (ZI family):**
- `zoie/zoia/zoio/zoiu` + predicate: retrieve current default. `zoia espuackuil` = currently `flan`.

**Behavior:**
- Explicit binding (chaining, VI/FI) overrides default — default not applied.
- Re-exported args inherit defaults. But changing original's default later doesn't propagate to definitions.

**Advanced:** `oien/oian/oion/oiun` — default that receives all args of the predicate (cross-slot dependency).

**Key use case — units:** All unit words (`mula`, `vola`, `gulo`, etc.) have `(default: 1)` on A place.
- `mula` = "1 meter" (A defaults to 1)
- `to mula` = "3 meters" (number chains into A, overrides default)
- `to je to jie mual jume vola` = "4 km/h"
- Makes bare unit = 1 unit without explicit binding.

---

## Enumeration (PE/BU)

Two modes:
- **Separator**: `PE item1 bu item2 bu item3 pei` — items are chains separated by bu
- **Prefix**: `PE bu item1 item2 item3 pei` — bu right after PE, items are single predicates

| Particle | Result | Example |
|----------|--------|---------|
| `pe` | predicate (AND) | `mi pe etiansa bu dona pei meon` = "I eat and like apples" |
| `pea` | set (one from each) | `mio pea bu za ualis za ubob` = "we are Alice and Bob" |
| `peo` | set of atoms | `peo tcu mian bu meon pei` = "{all cats, some apples}" |
| `peho` | set of predicates (OR) | `me vone peho bu mian meon` = "this is cat OR apple" |
| `peu` | ordered list of atoms | `peu bu mian meon pei` = list [a cat, an apple] |
| `pehu` | ordered list of predicates | (mostly used in complex definitions) |

- Empty: `PE bu pei`. Empty set doesn't exist in Eberban; empty list does. `pe bu pei` = always true.
- **pei** elidible at sentence end.
- **bu** is only member of BU family.

---

## Sentence Types

| Particle | Type | Behavior |
|----------|------|----------|
| a | assertion | Assert 0-ary proposition. Implicit if 1st sentence of paragraph lacks A/O/NI |
| an | context update | Update inter-sentence context via 1-ary predicate. Context propagates inward only — sentences can't change parent context. `an` is the explicit mechanism to update between sentences. Concept of "automatic `an`" exists (e.g., advancing "now" in narrative). |
| al | injunction | Request/command |
| o | question | Introduce variable + constraint; answers instantiate the variable. Ex: `o gi seha etiansa meon` = "who eats apples?" Reply: `a gi za ualis` = "Alice". Reply: `a bi gi` = "nobody". |
| on | definition | Runtime word creation. Syntax: `on` + definable word + inner predicate. Dictionary = preloaded `on` definitions (like a standard library). Uses caller's context, not global. |
| oni | capturing def | Like on but captures current global context |
| onu | performative | Define + enable as axiom |
| nu | enable axiom | Treat word as axiom in current context |
| ni | disable axiom | Disable axiom |

## Erasers
- **ra**: erase from sentence start (works on ungrammatical text)
- **ri**: erase current chain (must be grammatical)

## Paragraphs (PO)
- **po**: public paragraph/section. Exported when text imported with ohi.
- **poi**: private paragraph. Not available when imported.

## Discourse Pronouns (MI convenience)

mi=speaker, mo=listener, mio=inclusive we, mie=exclusive we, moe=3rd person (neither speaker nor listener), me=this/the (something speaker has in mind).

## Annotations (d- prefix, no logical effect)

- **DI** (di-): focus prefixes. di=attention, die=contrastive ("it's THIS not that"), dia=newsworthiness.
- **DE** (de-): suffix, followed by single predicate. de=interjection (`de uahaha`=laughter, `de gali`=❤️), dei=hashtag/metadata tag. Wrap chains in pe...pei.
- **DA/DAI**: parenthetical. da opens, dai closes. Any valid eberban text inside.
- **DU**: scope override prefix for annotations. du=word+bindings+chain, duo=entire sentence.

---

## Transformations (ZI family)

| Particle | Effect |
|----------|--------|
| zi | Short negation (only prefixed predicate) |
| bi | Wide negation (includes existentials + chain) |
| za | Name: [e named with property P by a] |
| zai | The name itself |
| ze | Anaphora: latest instance of prefixed predicate |
| zei | Compound anaphora: latest compound containing word |
| zeu | Context of latest instance |
| bo | Forethought: assign KI/GI variable before use |
| zu | Instantiate predicate arg (transitive) |
| zui | Instantiate predicate arg (intransitive) |
| zue | Promote 0-ary A to 1-ary sharing E |

## Particle Family Prefix Design

ALL particle families are infinite, generating forms from a prefix pattern:
- **Whole-consonant prefix**: family owns all forms starting with that consonant (e.g., z- for ZI, m- for MI, v- for VI)
- **Consonant+vowel prefix**: family owns a narrower slice (e.g., j- consonant shared by JI/ji-, JE/je-, JA/ja-, JO/jo-, JU/ju- — all number-related). Families sharing the same consonant are semantically related.

Unallocated forms within a family are grammatically valid but meaningless — reserved for future use without parser changes. Only explicitly defined members carry semantics.

Key difference: `mi zi etiansa meon` = I exist, apple exists, I don't eat it. `mi bi etiansa meon` = I exist, false that I eat any apple (apple need not exist).

---

## Numbers

**Digits (TI)** — diagonal (same vowel repeated) is skipped:

| | -i | -e | -a | -o | -u |
|---|---|---|---|---|---|
| t- | 0 | 1 | 2 | 3 | 4 |
| ti- | — | 5 | 6 | 7 | 8 |
| te- | 9 | — | A | B | C |
| ta- | D | E | — | F | ... |

Parser also accepts digit symbols 0-9 directly.

**Format**: `[base ju] integer [jo fractional] [ja repeated] [je magnitude] [JI]`
- base = single TI + ju (optional, default base 10 = tei ju)
- integer = zero or more TI digits (if zero, fractional or magnitude required)
- jo = fractional separator (joi = also makes negative)
- ja = repeating decimal (at least 1 TI)
- je = magnitude: multiply by base^magnitude (jei = negative magnitude)
- JI at END (jie elidible default = numeric value)

**JI (usage, at end)**: ji = cardinal set, jiu = ordinal, jie = numeric value (elidible default)
- `tu ta ji mian` = "42 cats" (cardinal)
- `ta jiu` = "2nd element" (ordinal)
- `tu ta` = `tu ta jie` = "the number 42" (jie elidible)
- `tia jo ti ta ta je ta to` = 6.022 × 10²³

---

## Time System

> **⚠ Subject to change.** Core ideas (graph of instants, common timespan, context-based propagation) are solid, but expressing many common things has too much friction. Expect vocabulary and mechanics to be reworked.

**Time = graph of instants** supporting multiple timelines, possible futures/pasts, parallel and fictional universes.

### Physical entities & space-time
- **pan**: physical entity, associated with a **skan** (space-time volume) — the spatial volume it occupies at each instant it exists (possibly across multiple timelines).

### Common timespan
Intersection of all involved entities' existence periods. **Maximal** (given timespan x, no larger y exists that also makes the proposition true while being contained by all involved entities/actions). Placed in context by **ski** and time relation words.

Example: "In this room there is a cat, and you eating an apple" — the cat's existence, your existence, the apple's existence, and the eating action all contain the common timespan.

### Time anchor
- **skun**: current time anchor — automatically contained by sentence common timespan, usually = present.
- **sufkun**: real-world present — auto-advances between sentences ("move forward in time").
- Change anchor: `en an skun sai` in an `an` sentence.

### Time relations (sr- prefix)
sre=before, sra=starts, sro=finishes, sru=after, srui=contains, srei=contained-by, srai=intersects, sri=unconstrained.

**sre/sru have O slot** for duration separating the two timespans.

### Vague durations
Compounds with time units give vague time scales for sre/sru's O slot:
- `e ti sre/sru`: very short (<1s)
- `e vola sre/sru`: seconds (1s–1min)
- `e jero sre/sru`: minutes (1min–1h)
- `e sura sre/sru`: hours (1h–1day)
- `e dena sre/sru`: days (1day–1week)
- `e kora sre/sru`: weeks (1week–1month)
- `e gare sre/sru`: months (1month–1year)
- `e bire sre/sru`: ≥1 year

### Duration units
Number predicate structure: E is X times A (default: 1). Bare unit = 1 unit.
bire(year), gare(month), kora(week), dena(day), sura(hour), jero(minute), vola(second).
**vulu**: duration E of event A.

### Events (ski)
An event is modeled as: proposition + set of physical entities with their space-time volumes.
- **ski**: relates event E with its defining proposition A. Evaluates with its own inner common timespan (no temporal relation with outer context — "I like the event of [you dance]" ≠ simultaneous).
- **skul**: refers to current event (inside ski or sentence).

### Modal logic
- **sni**: A is possible (occurs in ≥1 timeline containing common timespan)
- **snu**: A is necessary (occurs in all timelines)

### Counterfactual (sna)
"A would be true if E was true." Implies:
1. Both E and A are false in current timeline
2. At any past instant I: if E occurs in future of I, then A necessarily occurs too
3. A is evaluated in other timelines with matching duration and distance from I

### Calendar events
**0-indexed** — first day/month = 0. Astronomical year numbering (year 0 = 1 BC).

**Time-of-day** (relative to start of A, 0-indexed):
- **surai**: hour E of A (default: day/denai)
- **jeroi**: minute E of A (default: hour/surai)
- **volai**: second E of A (default: minute/jeroi)

E is a set of consecutive integers. Negative numbers allowed (minute -2 = 2 min before start).

**Calendar-aligned** (aligned to calendar boundaries — midnight, month start, etc.):
- **birei**: year E (default: 0) of A (default: Gregorian). Year 1 = 1 AD, year 0 = 1 BC.
- **garei**: month E (default: 0) of A (default: year/birei)
- **korai**: week E (default: 0) of A (default: year/birei). Weeks start Monday.
- **denai**: day E (default: 0) of A (default: month/garei)

E defaulting to 0 → quickly express "same day/month/year as X."
Day-of-week compounds: `e TI denai` for each weekday.

**Examples:**
- `a [se tie tu] jeroi [se te tio] surai` = "It is 17:54" (minute 54 of hour 17)
- `a se ti e tia denai se tiu garei` = "It is September 1st" (day 0 of month 8, Sunday)
- `a mi drie meon sri se te denai skun srui mi etiansa ze meon` = "I buy an apple, and tomorrow I will eat it."

---

## Colors

**zino**: color A of thing E, perceived by O. Perception-based — a white object under red light is perceived red (unless observer is colorblind).

**zmXr pattern** (HSV-based): zmir(white), zmer(red), zmar(green), zmor(blue), zmur(black). Vowel combinations for hue precision (color wheel).

**zmire/zmure**: lighter (less saturated) / darker (less value).

---

See also: `references/numbers-quotes-vocab.md` for numbers, quotes, enumeration, colors, dictionary conventions.
