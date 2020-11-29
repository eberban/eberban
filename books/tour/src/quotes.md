# Quotes [ZE/ZI/ZU]

Quotes allow to embed text into the discourse.

## Single word quote [ZI]

**zi** allow to quote the next word, ignoring it's grammar. The quote has the
place structure `___ is word [word]`.

## Grammatical quote [ZE]

**ze** allow to quote any grammatical eberban text, which is terminated with
**zei**. Being grammatical, the text can be parsed an analysed by the parser. It
can also contain inner **ze** quotes, as a **zei** will match it's opening
**ze**.

## Foreign quote [ZU]

**zu** allow to quote anything such as foreign text or ungrammatical eberban
text. **zu** is followed by a **single** arbitrary valid eberban word (no
compounds or borrowing), which has the role of delemiter. The quote ends when
this word appear again with spaces before it. The delimiter word should not
appear in the text, both writen with same letters or being pronounced, as it
could lead to ambiguities on where the quote ends in vocal speech.