# Quotes [XE/XI/XU]

Quotes allow embedding text into the discourse.

## Single word quote [XI]

**xi** allows quoting the next word, ignoring its grammar. The quote has the
place structure "_A_ is word [word]". **xiy** will instead express the family
of the word (specific particle family or root).

## Grammatical quote [XE]

**xe** allows quoting any grammatical eberban text, which is terminated with
**xey**. Being grammatical, the text can be parsed and analysed by the parser. It
can also contain inner **xe** quotes, as a **xey** will match its opening
**xe**.

## Foreign quote [XU]

**xu** allows quoting anything such as foreign text or ungrammatical eberban
text. **xu** is followed by a **single** arbitrary valid eberban word (no
compounds or borrowing), which has the role of a delimiter. The quote ends when
this word appear again with spaces before it. The delimiter word should not
appear in the text, either written with same letters or pronounced the same way,
as it could lead to ambiguities regarding where the quote ends in written text
and/or in vocal speech.