# Quotes [ZE/ZI/ZU]

Quotes allow embedding text into the discourse.

## Single word quote [ZI]

**zi** allows quoting the next word, ignoring its grammar. The quote has the
place structure `___ is the word [word]`.

## Grammatical quote [ZE]

**ze** allows quoting any grammatical eberban text, which is terminated with
**zei**. Being grammatical, the text can be parsed and analysed by the parser. It
can also contain inner **ze** quotes, as a **zei** will match its opening
**ze**.

## Foreign quote [ZU]

**zu** allows quoting anything such as foreign text or ungrammatical eberban
text. **zu** is followed by a **single** arbitrary valid eberban word (no
compounds or borrowing), which has the role of a delimiter. The quote ends when
this word appears again with spaces before it. The delimiter word should not
appear in the text, either written with same letters or pronounced the same way, as it
could lead to ambiguities regarding where the quote ends in written text and/or in vocal speech.