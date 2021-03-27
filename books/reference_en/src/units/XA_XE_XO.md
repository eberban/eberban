# Quotes (XA/XE/XO)

Quotes allow embedding text into the discourse.

## Grammatical quote [XA]

**xa** allows quoting any grammatical eberban text, which is terminated with
**xay**. Being grammatical, the text can be parsed and analysed by the parser.
It can also contain inner **xa** quotes, as a **xay** will match its opening
**xa**. Its meaning is `Ⓐ is text [text]`.

## Single word quote [XE]

**xe** allows quoting the next word, ignoring its grammar. The quote has the
place structure `Ⓐ is word [word]`. **xey** will instead express the family
of the word (specific particle family or root) : `xey xay = Ⓐ is a XA particle`. 

## Foreign quote [XO]

**xo** allows quoting anything such as foreign text or ungrammatical eberban
text. **xo** is followed by a **single** arbitrary valid eberban word (no
compounds or borrowing), which has the role of a delimiter. The quote ends when
this word appear again with spaces before it. The delimiter word should not
appear in the text, either written with same letters or pronounced the same way,
as it could lead to ambiguities regarding where the quote ends in written text
and/or in vocal speech. Its meaning is `Ⓐ is text [text]`.