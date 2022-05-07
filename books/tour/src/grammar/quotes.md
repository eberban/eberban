# Quotes (c-)

__ca__ (__CA__ family) allow quoting any grammatical eberban text, and is
terminated by __cai__ (__CAI__). The text can itself contain inner __ca__
quotes as __cai__ will match its opening __ca__. The quote acts as a predicate
with meaning `[tca man] is text [text].`

__ce__ (__CE__) allows quoting a single eberban word (particle, root, borrowing,
compound), ignoring its grammar. It has the definition `[tca man] is word [word].`

__cei__ will instead express the family of the word.

- __ce fe__ : `[tca man] is the word "fe".`
- __cei fe__ : `[tca man] is word family FE.`
- __ce spi__: `[tca man] is the word "spi".`
- __cei spi__: `[tca man] is the concept of a root word.`

__co__ (__CO__) allows quoting anything such as foreign text, ungrammatical
eberban text or even arbitrary data. __co__ is followed by a single arbitrary
root or particle, which has the role of a delimiter (it is not necessary for it
to be an existing particle or root, only a valid form), followed by a space. Any
additional space is considered part of the quoted text. The quote ends when this
word appears again prefixed by a pause character in written media, and with a
pause before it in speech, and both are not part of the quoted text. The
delimiter word prefixed by a pause must not appear in the text, either written
with same letters or pronounced the same way, as it could lead to ambiguities
regarding where the quote ends. This block acts as a predicate with the
definition `[tca man] is foreign text/arbitrary data with content: [content].`

As the content may be unreadable for the speaker, they are free to pronounce
only the enclosing delimiter while skipping the content. Foreign quotes are
the canonical way to embed things such as images or URLs into eberban text.
It is recommended however to provide a description in eberban to help
comprehension for all speakers, listeners or readers.

```gloss
eberban sae banu [ca mi dona eberban cai] siro [co zao I like eberban'zao] banu euinglici'ban

eberban sae banu {ca mi dona eberban cai} siro {co zao I like eberban'zao} banu euinglici'ban

{E:$(x) is the eberban language} {chain A>E} {E:$(y) is expressed in language A:$(x)}
{E:$(y) is text "I like eberban" (in eberban)} {E:$(y) has translation A:$(z)}
{E:$(z) is text "I like eberban" (foreign)} {E:$(z) is expressed in language A:$(w)}
{E:$(w) is the english language}

"mi dona eberban" (in eberban) has translation "I like eberban" (in english).
```
