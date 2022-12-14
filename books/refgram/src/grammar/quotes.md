# Quotes (c-)

__ca__ (__CA__ family) allow quoting any grammatical eberban text, and is
terminated by __cai__ (__CAI__). The text can itself contain inner __ca__ quotes
as __cai__ will match its opening __ca__. The quote acts as a predicate with
meaning `[E:tca ecaskan] is text [text].` (__ecaskan__ being the predicate word
for a grammatically correct Eberban quote, while __skan__ is the word for
a quote or string of arbitrary data).

----

__ce__ (__CE__) and __cei__ (__CEI__) allow respectively to start and end a
spelling quote that is composed of units representing single characters. Those
units take the form of a single consonant (including sonorants), an initial
consonant pair or nothing, followed by a serie of vowels and h. Since spelling
is usually used in noisy environements to clarify how words are written, units
representing Eberban characters include some redundancy to help recognition.

| Letter | Unit | | Letter | Unit | | Letter | Unit | | Letter | Unit |
|:------:|:----:|-|:------:|:----:|-|:------:|:----:|-|:------:|:----:|
|   P    |  pi  | |   B    |  bu  | |   F    |  fi  | |   V    |  vu  |
|   T    |  ti  | |   D    |  du  | |   S    |  si  | |   Z    |  zu  |
|   C    |  ci  | |   J    |  ju  | |   K    |  ki  | |   G    |  gu  |
|   M    |  mi  | |   N    |  nu  | |   R    |  ri  | |   L    |  lu  |
|   H    |  ihi | |   '    |  uhu | |   I    |  i   | |   E    |  e   |
|   A    |  a   | |   O    |  o   | |   U    |  u   | |        |      |

Spaces between them is optional, however if there is no space before a unit
starting with a vowel then a pause (') must be inserted.

Units starting with an initial consonant pair are reserved to encode foreign
characters in the future.

Examples:

- `za ce u nu i ci e fi cei` = named UNICEF
- `buri de ce bu u ri i cei` = buri (spelled BURI)

----

__ci__ (__CI__) allows quoting a single eberban word (particle, root, borrowing,
compound), ignoring its grammar. It has the definition `[E:tca man] is word
[word].`

__cie__ will instead express the family of the word.

- __ci fe__ : `[E:tca man] is the word "fe".`
- __cie fe__ : `[E:tca man] is word family FE.`
- __ci spi__: `[E:tca man] is the word "spi".`
- __cie spi__: `[E:tca man] is the concept of a root word.`

----

__co__ (__CO__) allows quoting anything such as foreign text, ungrammatical
eberban text or even arbitrary data. __co__ is followed by a single arbitrary
root or particle, which has the role of a delimiter (it is not necessary for it
to be an existing particle or root, only a valid form), followed by a __word
boundary marker__. Any following characters (including spaces) are considered
part of the quoted text. The quote ends when this word appears again prefixed by
a __word boundary marker__. The delimiter word prefixed by a word boundary
marker must __NOT__ appear in the text, either written with same letters or
pronounced the same way, as it will be considered to be the end of the quote,
and remaining part will leak out of the quote.

This whole block acts as a predicate with the definition `[E:tca skan] is foreign
text/arbitrary data with content: [content].`

As the content may be unreadable for the speaker, they can use the single word
__coi__ (__COI__) instead of the full quote. Foreign quotes are the canonical
way to embed things such as images or URLs into eberban text. It is recommended
however to provide a description in eberban to help comprehension for all
speakers, listeners or readers.

```gloss
eberban sae banu [ca mi dona eberban cai] siro [co zao'I like eberban'zao] banu euinglic'ban

eberban sae banu {ca mi dona eberban cai} siro {co zao'I like eberban'zao} banu euinglic'ban

{E:$(x) is the eberban language} {chain A>E} {E:$(y) is expressed in language A:$(x)}
{E:$(y) is text "I like eberban" (in eberban)} {E:$(y) has translation A:$(z)}
{E:$(z) is text "I like eberban" (foreign)} {E:$(z) is expressed in language A:$(w)}
{E:$(w) is the english language}

"mi dona eberban" (in eberban) has translation "I like eberban" (in english).
```
