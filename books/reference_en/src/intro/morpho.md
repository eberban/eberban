# Morphology

The morphology of eberban is quite simple. In terms of letters, there are 6
vowels (**a, e, i, o, u, q**), 17 consonants (**b, c, d, f, g, j, k, l, m, n, p,
r, s, t, v, x, z**), 2 semi-vowels **w** and **y** and a semi-consonant **h**,
for a total of 26 letters. There is also one symbol denoting a pause in speech,
namely the apostrophe **'**, which is optional in written media as long as there
are spaces alongside it. Among the consonants, three special ones are designated
(alveolar) **sonorants** : **l, n, r**.

## Letter conventions

While discussing letters, the following conventions are used:
1. A **C** denotes exactly one consonant (including sonorants).
2. A vowel-tail, represented as **V**, denotes a chain of vowels separated by a
   semi-vowel, **h** or a sonorant (n, l, r). The first vowel can be preceded by
   a semi-vowel if it doesn't follow a consonant pair. **h** or sonorants can be
   preceded by **y**. A final **y** at the end of the word is also allowed.

## Words

Letters may be combined to form *words*. There are two main types of words:
*particles* and *roots*. Particles exert grammatical functions, while roots
denote concepts with an intrinsic meaning, such as "cat", "language" or "teach".
Particles are organised in families sharing the same grammar and usually
starting with the same consonnant.

There are also 2 other types of words : *compounds* and *borrowings*. Compounds
are made from one or multiple particles or roots, while borrowings allows to
imports foreign words or names.

> **Remark:** If you are familiar with Lojban, you may view particles as
> analogous to cmavo, roots gismu, compounds to lujvo and borrowings to
> fu'ivla/cmevla.

Particles always follow the pattern pattern **CV** or stars with an **q**.
On the other hand, roots always follow either the pattern **CVC**, **CCV** or
**CCVC**. The final **C** (if any) must be a sonorant. Borrowings may end in any
letter, always followed by a pause. No words can start with a sonorant.

All words starting with a vowel or semi-vowel must be preceded by a pause
(**'** and/or space). In written media, a sequence of words is typically, but
not necessarily, separated by spaces (" ").

>  **For the advanced reader:** you may have noticed that all words start with
>  either a vowel/semi-vowel (preceded by a pause), or a non-sonorant; and that
>  all words (except borrowings) end with either a vowel or a sonorant. This is
>  by design. As we will later see, these seemingly artificial restrictions
>  involving sonorants ensure that, even if words (except borrowings) are strung
>  together without any spaces between them, they can still be uniquely
>  decomposed (i.e. spaces can be deterministically added back). This may seem
>  unimportant, and indeed in written media spaces are not particularly
>  obnoxious &ndash; they are recommended, even. But in spoken form spaces
>  correspond to pauses, and this unique decomposition property suddenly becomes
>  important: it means that, while speaking, we do not need to pause between
>  every two words! For our fellow language nerds out there: this cool property
>  is also known as self-segmenting morphophonology :-)
>
>  Additionally, there is a mandatory pause at the end of borrowings, allowing
>  segmenting to work with borrowings as well.

## Permissible consonant pairs

Not all consonant pairs are allowed in eberban. The following table lists all
permissible consonant pairs.

|     |     |     |     |     |     |     |        |
| --- | --- | --- | --- | --- | --- | --- | ------ |
| cp  | ct  | ck  | cf  | cm  | cn  | cl  | cr     |
| sp  | st  | sk  | sf  | sm  | sn  | sl  | sr     |
| jb  | jd  | jg  | jv  | jm  | jn  | jl  | jr     |
| zb  | zd  | zg  | zv  | zm  | zn  | zl  | zr     |
|     |     |     |     |     |     |     | &nbsp; |
| pl  | pr  | tl  | tr  | kl  | kr  | fl  | fr     |
| bl  | br  | dl  | dr  | gl  | gr  | vl  | vr     |
| ml  | mr  |     |     |     |     |     |        |
|     |     |     |     |     |     |     | &nbsp; |
| tc  | ts  | dj  | dz  | kc  | ks  | gj  | gz     |
| pc  | ps  | bj  | bz  |

## Permissible consonnant clusters in borrowings

Borrowings have more relaxed rules regarding allowed consonnant clusters.
A maximum of 3 consonnants in a row are allowed, and they can't all be
sonorants. A consonnant cannot be followed by the same one.

Consonnants are split into 2 categories called **voiced** (b, d, g, j, v, z)
and **unvoiced** (c, f, k, p, s, t, x). A **voiced** consonnant cannot be
followed by an **unvoiced** one, and vice-versa.

Additionnaly the following rules applies :

| Consonnant | Can't be followed by |
| ---------- | -------------------- |
| j          | z                    |
| z          | j                    |
| s          | c                    |
| c          | s, x                 |
| x          | c, k, l, r           |
| k          | x                    |