# Quotes (c-)

__ci__ (__CI__) allows quoting a single Eberban word (particle, root, borrowing,
compound), ignoring its grammar. It has the definition `[E:tca man] is word
[word].`

__cie__ will instead express the family of the word.

- __ci fe__ : `[E:tca man] is the word "fe".`
- __cie fe__ : `[E:tca man] is word family FE.`
- __ci spi__: `[E:tca man] is the word "spi".`
- __cie spi__: `[E:tca man] is the concept of a root word.`

----

__ce__ (__CE__) and __cei__ (__CEI__) allow, respectively, starting and ending a
spelling quote that is composed of units representing single characters. These
units begin with either of the following: a single consonant (including
sonorants), an initial consonant pair, or nothing. They are then followed by a
series of vowels which can be separated by h.

Since spelling is usually used in noisy environments to clarify how words are
written, units representing Eberban characters include some redundancy to help
recognition.

| Letter | Unit | | Letter | Unit | | Letter | Unit | | Letter | Unit |
|:------:|:----:|-|:------:|:----:|-|:------:|:----:|-|:------:|:----:|
|   P    |  pi  | |   B    |  bu  | |   F    |  fi  | |   V    |  vu  |
|   T    |  ti  | |   D    |  du  | |   S    |  si  | |   Z    |  zu  |
|   C    |  ci  | |   J    |  ju  | |   K    |  ki  | |   G    |  gu  |
|   M    |  mi  | |   N    |  nu  | |   R    |  ri  | |   L    |  lu  |
|   H    |  ihi | |(space) |  uhu | |   I    |  i   | |   E    |  e   |
|   A    |  a   | |   O    |  o   | |   U    |  u   | |        |      |

Spaces between them is optional unless before a unit starting with a vowel.

[Digits](numbers.md) can be spelled by following the same pattern as __TI__ but
by replacing _t_ with _tc_: tci, tce, tca, ...

Examples:

- `za ce bu o bu tco cei` = named B-O-B-3
- `tian de ce ti i a nu cei` = tian (spelled T-I-A-N)

__ceu__ is another member of __CE__ that spells the sounds of a quote.

----

__ca__ (__CA__ family) allows quoting any grammatically correct Eberban text,
and is terminated by __cai__ (__CAI__). The text can itself contain inner __ca__
quotes as __cai__ will match its opening __ca__. The quote acts as a predicate
with meaning `[E:tca ecaskan] is text [text].` (__ecaskan__ being the predicate
word for a grammatically correct Eberban quote, while __skan__ is the word for a
quote or string of arbitrary data).

----

__co__ (__CO__) allows quoting anything such as foreign text, grammatically incorrect Eberban text,
or even arbitrary data. __co__ has two quotation modes :
- if immediately followed by a __[__ (which can be prefixed by spaces), then it quotes foreign text
  until __]__ is reached. Thus this cannot quote text that contains __]__. 
- otherwise it is followed by a single arbitrary root or particle, which has the role of a delimiter
(it is not necessary for it to be an existing particle or root, only a valid form), followed by
__[__. Any following characters (including spaces) are considered part of the quoted text, while in
speech following pause is also considered part of the quote. The quote ends when this word appears
again prefixed by __]__. The delimiter word prefixed by a __]__ must __NOT__ appear in the text,
either written with same letters or pronounced the same way (reminder that __]__ is uttered as a
palatal click), as it will be considered to be the end of the quote, and the remaining part will
leak out of the quote.

This whole block acts as a predicate with the definition `[E:tca skan] is
foreign text/arbitrary data with content: [content].`

As the content may be unreadable for the speaker, they can use the single word
__coi__ (__COI__) instead of the full quote. Foreign quotes are the canonical
way to embed things such as images or URLs into Eberban text. It is recommended
however to provide a description in Eberban to help comprehension for all
speakers, listeners or readers.

```gloss
eberban sae ebansa ca mi dona eberban cai siro co [I like eberban] ebansa euinglic'ban

eberban sae ebansa {ca mi dona eberban cai} siro {co [I like eberban]} ebansa euinglic'ban

{E:$(x) is the Eberban language} {chain A>E} {E:$(y) is expressed in language A:$(x)}
{E:$(y) is text "I like Eberban" (in Eberban)} {E:$(y) has translation A:$(z)}
{E:$(z) is text "I like Eberban" (foreign)} {E:$(z) is expressed in language A:$(w)}
{E:$(w) is the English language}

"mi dona eberban" (in Eberban) has translation "I like Eberban" (in English).
```
