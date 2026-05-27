# Contributing

## Commit messages

Format: `<scope>: <verb> <subject>`

Plain-English verbs so non-developers following the project can scan the log and the Discord feed.

### Scopes

- `dict`: dictionary entries (`dictionary/`)
- `grammar`: PEG grammar and morphology rules (`web/src/grammar/`)
- `book`: refgram, new_course, other mdbook content (`books/`)
- `web`: website, parsers, UI (`web/`)
- `ci`: workflows, dependabot (`.github/`)
- `deps`: dependency bumps

### Verbs

- `add`: new entry or feature
- `remove`: deletion
- `rename`: renaming an existing thing
- `change`: modify behavior or content
- `fix`: bug fix

### Examples

- `dict: add ksu "Q letter"`
- `dict: rename kiu to ksu (avoid ki+u ambiguity)`
- `dict: change gloss of foo`
- `grammar: fix cluster rule for n+r`
- `book: rewrite particle chapter intro`
- `web: fix textual parser crash on empty input`
- `deps: bump vite to 8`

### Notes

- Title only; add a body only when the change really needs explanation.
- Imperative mood, lowercase scope and verb.
- Keep the title under 72 characters when feasible.
- A push to `master` posts each commit to the project Discord channel, so commit titles are read by the wider community, not only by developers.
