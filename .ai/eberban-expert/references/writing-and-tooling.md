# Eberban Writing Systems & Tooling

## Linear Writing System

Syllable-centered glyphs with vowel in middle, consonants in 4 corners (up-left, up-right, down-left, down-right).

### Placement Rules
- **Unvoiced consonants** -> upper position
- **Voiced consonants** -> lower position
- **Sonorants** -> upper by default
- **Medial clusters**: ending consonant placed opposite to initial
- Spaces ignored; use apostrophe `'` for word breaks

### Computer Font (eberban-Regular.otf)
Only vowels, apostrophe, spaces advance cursor. Consonants stack.
- **Initial pairs**: double 2nd consonant (`tcu` -> `tccu`)
- **Medial pairs**: hyphen between if correct side, capitalize if opposite (`vogbi` -> `voGbi`)
- **Uppercase sonorants/m/h**: move below vowel (default above)
- Space after sonorant = word-final position

## Planar Writing System
Conceptual only — not yet documented. 2D graphical notation replacing VI/FI/SI binding particles.

---

## Web Tooling (web/)

**Tech**: Preact + TypeScript + Vite + PEGgy + jQuery (bootstrap tabs)

### Folder structure (web/src/)
```
grammar/          PEG grammar (.peggy + generated .peggy.js)
shared/           shared utilities (regex, symbols, utils, particle-gloss.js)
vendor/           bootstrap CSS/JS + glyphicons (for tabs)
visual-parser/    visual box renderer (visual.js, boxes.css, index.html)
textual-parser/   text-based parse output
dictionary/       searchable word lookup (Preact/JSX)
root-generator/   tool for creating new root words
styles/           common CSS (reset, common)
```

### Apps
- **Visual parser**: box diagrams + parse tree + glosses (`visual-parser/`)
- **Textual parser**: text-based parse output (`textual-parser/`)
- **Dictionary**: searchable word lookup (`dictionary/`). SI/VI/FI/VEI/TI entries are dynamically generated (not in YAML). Family descriptions shown via `@family` filter. Dynamic entries styled with orange border.
- **Root generator**: tool for creating new root words (`root-generator/`)

### Development
```bash
cd web/
npm i
npm run dev          # dev server (hot reload except .peggy)
npm run build-peggy  # rebuild after .peggy changes
npm run build        # full build
npm run test         # vitest
```

---

## Visual Box Renderer

Files: `web/src/visual-parser/visual.js` + `web/src/visual-parser/boxes.css`

### Architecture (2-phase)
1. **COLLECT**: walk parse tree → flat list of grid items
2. **RENDER**: items → CSS Grid (2 rows: bar + content)

### Item types
- `word` — single word box (root, particle, etc.)
- `group` — SI/ZI prefix(es) + verb, rendered side-by-side
- `nested` — VI/FI bind group, rendered as nested grid in row 2
- `nested-text` — grammatical quote (CA), contains full parsed text
- `erased-chain` — RI-erased chain segment, pre-rendered with opacity
- `terminator` — thin empty box at sentence end
- `separator` — thin box between enum items (prefix mode) or multi-vowel VI/FI subchains (with place label like A·, O≡)
- `vi-args` — VI/FI particle + KI/GI/BA argument list
- `return` — thin vertical connector after inline binds

### PA Echo-Resumptive Rendering
When a chain step has a `resume` field (from PA):
1. Steps between the original verb and PA render at **depth+1** (offset/indented)
2. A **return connector** bridges back from depth+1 to baseline after the "between" items
3. PA particle renders at **original depth** with pink/bind color (`vbox-bind`)
4. Resumed verb renders **dimmed** at original depth (class `dimmed`, first verb only)
5. New VI/FI binds on the resumed verb render at original depth as nested bind groups
6. **Multiple resumes** nest: each resume's continuation goes to depth+1, except the last resume which stays at current depth

### Nesting & Inlining
- VI/FI bind groups + PE enums: nested grids inside `.vbox-bind-group`
- When binds are LAST in chain: items inlined into parent grid with progressive depth offset (`INLINE_DEPTH_OFFSET_PX = 10`)
- Return connector bridges depth back to baseline
- Container verbs (PE enums, grammatical quotes) need extra margin (+5px) to clear bar overflow in inlined/nested binds

### Slot Detection
Bar labels show exposed places (left) and chain place with symbol (right).
- `*` = all places exposed, `~` = transparent SI, `none` = no places
- `A·` = chains A by sharing, `A≡` = chains A by equivalence
- `parseSISlots(word)`: programmatic SI vowel parsing (h-override, transparency, -i equiv)
- `getVerbSlots(verb)`: checks ZI modifiers (hardcoded `ZI_SLOTS` map), then falls back to `getVerbTransitivity`
- `getVerbTransitivity(verb)`: derives from verb form:
  - Roots: last char vowel=trans, CCV (3 chars only)/-i=equiv
  - Compounds: last component, se/sa/sai override
  - MI/GI/BA/PE: family-specific rules
  - Borrowings: same as roots

### Annotations (DI/DE/DA)
- 💬 icon on annotated word boxes, hover shows popover
- `annotationStore` map (keyed by numeric ID) stores HTML to avoid double-escaping
- `annotationAttrs(node)` helper: builds icon + data-attribute
- `buildAnnotationHtml(node)`: renders DI (FOCUS label), DE (tag gloss + verb), DA (PARENTHETICAL + renderText)
- Popover stays open while hovered (200ms delay on mouseleave)

### Erasure (RA/RI)
- **Sentence RA (valid)**: sentence wrapped in `.vbox-erased-sentence` (opacity 0.3), RA box beside it
- **Sentence RA (invalid)**: word box with "INVALID" family + RA box
- **Chain RI**: erased segment as nested `.vbox-bind-group.vbox-erased`, RI as normal word item

### Semantic CSS Variables
- Bars: `--vbox-bar-default` (dark), `--vbox-bar-bind` (pink), `--vbox-bar-adverb` (orange), `--vbox-bar-enum` (green), `--vbox-bar-quote` (gold)
- Words: `--vbox-word-content` (blue), `--vbox-word-si` (lavender), `--vbox-word-bind` (pink), `--vbox-word-zi` (salmon), `--vbox-word-compound` (blue), `--vbox-word-sentence` (dark), `--vbox-word-adverb` (orange), `--vbox-word-enum` (green), `--vbox-word-quote` (gold)

### Key Constants (visual.js)
```
INLINE_DEPTH_OFFSET_PX, SYM_SHARING (·), SYM_EQUIV (≡), SYM_MULTIPLY (×),
SYM_OVERLINE, SYM_ARROW (→), ICON_ANNOT (💬), SUPERSCRIPT map
VOWELS, CONSONANTS, ZI_SLOTS (hardcoded ZI chaining overrides)
```

### Key Functions (visual.js)
- `collectChainItems` — entry: parse tree → item list (erasure, return connector, terminator)
- `stepsToItems` — chain steps → items (SI/ZI prefix extraction, slot info)
- `collectBindItems` — VI/FI binds → items (per-bind adverb detection)
- `collectEnumItems` — PE enum → items (separator/prefix mode)
- `renderGrid` — items → HTML (bar + content cells, depth offset, erased opacity)
- `renderVerbContent` — dispatches to compound/number/enum/quote/wordBox
- `parseSISlots` — SI word → {exposed, chainPlace}
- `getVerbSlots` / `getVerbTransitivity` — verb → slot/transitivity info
- `annotationAttrs` / `buildAnnotationHtml` — annotation icon + popover HTML
- `renderTree` / `setupTreeToggles` — collapsible JSON parse tree viewer
- `collectWords` / `renderGlosses` — glosses tab (Eberban-sorted word table)
- `renderMarkup` — dictionary markup renderer ([E:type], {word}, `code`)
- `setupTooltips` / `setupAnnotationPopovers` — hover interaction setup

### Visual parser tabs
- **Raw**: JSON.stringify of parse result
- **Parse tree**: collapsible tree viewer (all expanded by default, click to collapse)
- **Boxes**: visual box diagram (main renderer)
- **Glosses**: table of all dictionary words used, sorted in Eberban alphabetical order (ieaouhnnrlmpbfvtdszcjkg), with word/family/gloss/short columns. Dictionary markup rendered.

### Dictionary markup (`renderMarkup`)
Patterns in dictionary short/long fields, rendered in tooltips and glosses:
- `[E:type]`, `[A:(pred)]`, `[*:...]` → styled place notation (blue label + light bg)
- `{word}` → styled word reference (green monospace)
- `` `code` `` → styled inline code (gray bg)
Dark-background overrides for tooltips.

---

## Grammar File

`web/src/grammar/eberban.peggy` — PEG grammar, source of truth.

### Parse hierarchy
MainWithError > Text > Paragraphs > Paragraph > Sentence > Chain > ChainVerb > NativeWord

### Key grammar rules
- **Elidible particles** (6): A, BE, PEI, VEI, JI(jie), CAI
- **PostWord**: `!Sonorant &Consonant / DigitSymbol / Spaces / EOF` — word boundary check (EOF added for end-of-input particles like DAI)
- **PostSentence**: includes SentenceStarter, PO_Free, CAI_Free, DAI_Free, RA, GrammaticalQuoteTerminatorElider, EOF
- **Paragraph tail guards**: `!PO_Free !DAI_Free` before SentenceErasedInvalid to prevent greedy consumption past paragraph/parenthetical boundaries
- **FreePrefix**: `FreeMetadata` = optional DU scope + DI focus
- **FreePostfix**: `FreeInterjection / FreeParenthetical` (no `?`)
- **FreeInterjection**: `DE_Free SI_Free? (ChainVerbModified / ChainVerbSelect)`
- **FreeParenthetical**: `DA_Free Text DAI_Free` (DAI not elidible, has error reporting)
- **pre/post fields**: unified naming — `with_free()` sets `pre`/`post` on particles, `VerbDefinablePart` sets `pre` on verbs, `ChainVerb` sets `post` on verbs

### Parse tree shapes
- **Sentence**: `{kind, starter, definition, defined?, pred?, eraser?}`
- **Chain**: `{verb, next?, select?, explicit_binds?, modifiers?, erased?}`
- **Erased chain**: `{erased: [{chain, eraser: "ri"}, ...], ...normalChain}`
- **Bind group**: `{binds: [{start, inner}], end}`
- **Interjection**: `{kind: "Interjection", tag, select?, verb}`
- **Parenthetical**: `{kind: "Parenthetical", start, content, end}`
- **BorrowingGroup**: `{kind: "BorrowingGroup", group: [{content}], end}`
- **Number**: `{kind: "Number", value: {int?, base?, fract?, repeat?, magn?, end?}}`
- **Compound**: `{family: "Compound", prefix, content: [...], postfix?}`
- **Quotes**: SingleWordQuote, Spelling Quote, GrammaticalQuote, ForeignQuote

### Error recovery
- 31+ error rules (E_ prefix). RA/RI erasers recover from ungrammatical text.
- `E_UnmatchedLeadings`: catches stray FI, VEI, BE, PEI, BU, DAI, PA at root level
- `E_UnclosedParenthetical`: missing DAI

### Key families in parse output
Root, Compound, MI, SI, VE (covers all VI), FI, VEI, ZI, BI, BO, TI, JI/JO/JA/JE/JU, CI/CE/CEI/CA/CAI/CO, PE/PEI, BU, KI, GI, BA, BE, PO, NI, A, O, DI, DE, DA, DAI, RA, RI

---

## Dictionary (dictionary/)

`dictionary/en.yaml` — YAML format.

Adding words:
1. Edit en.yaml, set id to `INSERT_WORD_ID`
2. Run `npm run ids` in dictionary/ folder
3. Fields: id, family (R/C/particle-name), gloss, tags, short, long (optional), see_also, links
4. Compound keys: `"e tian sa"` (spaces between parts)
5. Spelling entries: under `_spelling` key
6. Borrowings: no dictionary entry (u- prefix, gloss shows empty)
7. Unknown words: renderer shows "???" as gloss

---

## Books (books/)

Built with mdbook + mdbook-linkcheck + mdbook-regex-replacer.
```bash
cd books/refgram/  # or books/new_course/
mdbook serve
```
