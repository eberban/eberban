# Eberban Vocabulary Status & Gaps

## Current Stats (~880 entries)
- ~556 roots, 152 compounds, 172 particles (38 families)

## Well-Covered Domains
| Domain | Count | Notes |
|--------|-------|-------|
| core grammar | 87 | Particles + logic primitives |
| time/tense | 74+33 | sr- relations, sk- events, duration units |
| number/digit | 46+24 | Complete base system |
| set operations | 36 | tc- prefix pattern |
| space | 29 | Physical entities, directions |
| animal | 25+ | cat, dog, bird, fish, insect, cow, horse, pig, snake, bear, deer, wolf, frog, chicken, sheep, mouse, ant, bee, butterfly |
| emotion | 29 | Happy, sad, angry, fear, love, trust, hatred, jealous, proud, excited, ashamed, guilt, regret, lonely, + existing |
| food/drink | 30+ | Fruits, grains, substances, prepared food, drinks |
| cultural | 23 | Country/language names (compounds) |
| body parts | 22 | Head, eye, ear, hand, foot, joint, organ |
| color | 21 | HSV system (zm- prefix) |
| list operations | 22 | Ordered collections |
| event | 20 | Calendar-aligned occurrences |
| movement | 17+ | Walk, fly, dance, run, jump, climb, swim, fall, push, pull, throw, carry, hold, hit, sit, stand |
| plant/nature | 15+ | Tree, grass, mushroom, forest, mountain, island, leaf, seed, flower |
| weather | 8+ | Rain, wind, sun, snow, cloud, storm, fog, ice |
| clothing | 10+ | Shirt, pants, wear, shoe, hat, jacket, dress, sock, glove |
| objects | 15+ | Book, knife, rope, wheel, key, bag, mirror, candle, pen, box, table, bed, chair, shelf, lamp |

## Weak Domains (still <15 entries)
| Domain | Count | Examples present |
|--------|-------|-----------------|
| measurement | 11 | length, area, volume, mass, speed |
| map operations | 9 | key-value structures |
| kinship | 8 | parent, sibling, child |
| math | 7 | natural, integer, division |
| intensity | 7 | big, small, more, less, same |
| vehicle | 4 | Minimal coverage |
| geometry | 3 | Very basic |

## Missing Domains (0 entries)
- weapons
- sports/games
- musical instruments
- textures (rough, smooth, soft, hard)
- smell/taste (sweet, sour, bitter, spicy — sweet planned as compound sugar+sensation)
- cooking methods (cook root deferred — multi-step process design needed)
- materials (wood, metal, glass, plastic, cloth)
- professions/occupations
- communication technology (internet, email, message)
- celestial bodies (star, moon, planet — beyond "stellar body")

## Semantic Prefix Patterns
| Prefix | Domain | Examples |
|--------|--------|---------|
| tc- | sets | tce (non-empty set), tca, tcu |
| sr- | time relations | sre, sra, sro, sru, srui, srei, srai, sri |
| sk- | events | ski, skun |
| zm- | colors | zmir, zmer, zmar, zmor, zmur |
| sp- | speech/communication | spua, spia |
| bl- | properties/quality | blan, blua |

## Deferred Design Problems
- **cook** — root agreed, but place structure needs deeper design (multi-step processes)
- **travel/goes-to** — same problem (paths, steps, pauses)
- **cabinet / storage containers** — think about storage holistically

## Emotion Design Decisions
- **Reactive emotions** (proposition-based, -i ending): happy, sad, angry, fear, anxiety, awe, awkward, bored, calm, confusion, crave, disgust, sympathy, nostalgia, relief, surprise, romantic, sexual, interest, proud, excited, ashamed, guilt, regret
- **Relational emotions** (entity-based, non-i vowel ending): love, like, friend, jealous, hatred, trust
- **Unary**: lonely
- Reason for emotion is handled externally via the context mechanism, not baked into emotion words
- `zue` already handles "I feel X about [me doing Y]" for proposition-based emotions — no special combinator needed

## Priority for Further Expansion
1. **Materials** — wood, metal, glass, cloth (physical world)
2. **Taste/smell/texture** — sensory vocabulary
3. **Kinship (expand)** — still basic
4. **Professions** — social vocabulary
5. **Musical instruments** — cultural vocabulary
6. **Celestial bodies** — star, moon, planet
