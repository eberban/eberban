# Quotes (LA/LE/LO)

Quotes allow embedding text into the discourse.

## Grammatical quote [LA]

**la** allows quoting any grammatical eberban text, which is terminated with
**lai**. Being grammatical, the text can be parsed and analysed by the parser.
It can also contain inner **la** quotes, as a **lai** will match its opening
**la**. Its meaning is `(A) is text [text]`.

## Single word quote [LE]

**le** allows quoting the next word, ignoring its grammar. The quote has the
place structure `(A) is word [word]`. **lei** will instead express the family of
the word (specific particle family or root) : `lei lai = (A) is a LA particle`. 

**leu** provides a predicate describing the meaning of the following particle.
This predicate can be used to answer questions asked using **du GA**.

## Foreign quote [LO]

**lo** allows quoting anything such as foreign text or ungrammatical eberban
text. **lo** is followed by a **single** arbitrary valid eberban word (no
compounds or borrowing), which has the role of a delimiter. The quote ends when
this word appear again with spaces before it. The delimiter word should not
appear in the text, either written with same letters or pronounced the same way,
as it could lead to ambiguities regarding where the quote ends in written text
and/or in vocal speech. Its meaning is `(A) is text [text]`.