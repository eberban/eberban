# Parse corpus

Hand-written cases run against the PEG parser by `../corpus.test.js`. Each `.yaml` file is a list
of cases. Their purpose is regression protection when `eberban.peggy` changes, a catalogue of edge
cases, and a base of verified example sentences.

## Case format

```yaml
- text: "a mi duna meon pa duna vo mo"        # required: the input
  shape: "a: mi > duna > meon ^pa duna[vo: mo]" # optional: expected structure line
  note: "PA walks up past meon to duna"        # optional: goal or rationale
  source: "refgram logic/explicit_binding.md"  # optional: where the sentence comes from
  error: "Failed to resume"                    # optional: parsing must fail, message contains this
  warning: "discouraged"                       # optional: a warning containing this is emitted
  no_warning: true                             # optional: no warning at all
  snapshot: true                               # optional: full JSON snapshot under __snapshots__/
  todo: "numbers chain through A"              # optional: expectation is right per the sources but
                                               # not met yet; registered as a todo, not run
```

`error` and the other checks are exclusive: an `error` case only checks the failure. `text` may be
`""` for the empty input.

## Shape notation

Produced by `web/src/shared/shape.js`. Structure only; elision, annotations details and locations
are dropped.

| Rendering | Meaning |
|---|---|
| `a: ...` / `(a): ...` | sentence starter; parentheses when elided |
| `o ga: ...`, `on ga: ...`, `nu ga` | O and NI sentences name the defined word first |
| `s1 \| s2` | sentences of one paragraph |
| `p1 \|\| po: p2` | paragraphs, with their PO starter when present |
| `x > y > z` | chain steps, in text order (grouping is right-nested: `x (y z)`) |
| `sa duna`, `zi bure`, `zue sea gali` | SI selection and ZI modifiers prefix the verb |
| `duna[ve: mo \| fo: mi]` | explicit bind group; `vX: chain` per bind; several groups: `[..][..]` |
| `ke ka be: chain` | argument list (sentence, bind, or `pe`) |
| `bi (chain)` | wide negation of the rest of the chain |
| `{chain ri}` | erased chain segment; `... ra` erased sentence; `~ra` erased invalid text |
| `... ^pa duna[vo: mo]` | PA resume; the verb after `^pa` names the step resumed |
| `e(tian sa)`, `e(i(ber ban) ban)`, `er(a b c)` | compounds with parsed prefix |
| `u(mia entropi)`, `i(alis)` | borrowing group, freeform variable |
| `pe(x > y bu z)`, `peho bu(mian meon)` | enumeration, separator and prefix modes |
| `ci(mian)`, `ce(ti i a nu)`, `ca{text}`, `co[raw]`, `co(delim)[raw]` | quotes |
| `#(to jo te)` | number, parts in text order, JI shown only when explicit |
| `di:mian`, `mian+de(gali)`, `mian(da: text)` | annotations |
| `gi/ga` | namespaced word |
| `<empty>` | empty text |
| `?{...}` | node the serializer does not know: a bug to fix in `shape.js` |

## Files

One file per grammar area: `chaining`, `si`, `binds`, `zi-bi`, `pe`, `sentences`, `quotes`,
`numbers`, `compounds`, `borrowings`, `annotations`, `pa`, `morphology`, `examples`.

`../corpus-properties.test.js` holds properties checked over the whole dictionary (every root and
compound parses as itself, concatenated roots re-segment).
