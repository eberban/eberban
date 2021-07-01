# Morphology

The morphology of eberban is composed of 5 vowels (**a, e, i, o, u**), 16
consonants (**b, c, d, f, g, j, k, l, m, n, p, r, s, t, v, z**) and a
semi-consonant **h**, for a total of 22 letters. There is also one symbol **'**
(**.** is also accepted) marking word boundary, which is optional in written
media as long as there are spaces alongside it. Among the consonants, two
special ones are designated as **sonorants** : **n** and **r**.

Vowels and **h** can appear in clusters. **h** can appear only between 2 vowels,
and the same vowel cannot appear more than one in a row. We call these *vowel
clusters*.

## Words

Letters may be combined to form *words*. There are two main types of words:
*particles* and *roots*. Particles exert grammatical functions, while roots
denote concepts with an intrinsic meaning, such as "cat", "language" or "teach".
Particles are organised in families sharing the same grammar and usually
starting with the same consonnant.


There are also 2 other types of words : *compounds* and *borrowings*. Compounds
are made from one or multiple smaller words, while borrowings allows to imports
foreign words or names. Compounds starts with **a, e, i, o** and borrowings with
**u**.

Borrowings must end in a vowel which can be followed by a sonorant. In written
media it must be followed by a space or word boundary marker, while in speech
the penultimate vowel must be stressed.

> **Remark:** If you are familiar with Lojban, you may view particles as
> analogous to cmavo, roots to gismu, compounds to lujvo and borrowings to
> fu'ivla/cmevla.

Particles starts with a non-sonorant consonant and can't contain a sonorant.

Roots can either start with a non-sonorant consonant but then contain at least
one sonorant, or start with a permissible consonant pair and any number of
sonorants. Sonorants can appear as the second consonant of an initial pair,
between vowel clusters and at the end of roots.

All words starting with a vowel must be preceded by a pause (**'** and/or
space). In written media, a sequence of words is typically, but not necessarily,
separated by spaces (" ").

> **For the advanced reader:** you may have noticed that all words start with
> either a vowel (preceded by a pause), or a non-sonorant; and that all words
> end with either a vowel or a sonorant. This is by design.
> As we will later see, these seemingly artificial restrictions involving
> sonorants ensure that, even if words (except borrowings) are strung together
> without any spaces between them, they can still be uniquely decomposed (i.e.
> spaces can be deterministically added back). This may seem unimportant, and
> indeed in written media spaces are not particularly obnoxious &ndash; they
> are recommended, even. But in spoken form spaces correspond to pauses, and
> this unique decomposition property suddenly becomes important: it means that,
> while speaking, we do not need to pause between every two words! For our
> fellow language nerds out there: this cool property is also known as
> self-segmenting morphophonology :-)
>
> Additionally, the penultimate vowel of borrowings is stressed, allowing
> segmenting to work with borrowings as well.

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

Borrowings have more relaxed rules regarding allowed consonnant clusters. A
maximum of 3 consonnants in a row are allowed, and they can't all be sonorants.
A consonnant cannot be followed by the same one.

Consonnants are split into 2 categories called **voiced** (b, d, g, j, v, z) and
**unvoiced** (c, f, k, p, s, t). A **voiced** consonnant cannot be followed by
an **unvoiced** one, and vice-versa.

Additionnaly the following rules applies :

| Consonnant | Can't be followed by |
| ---------- | -------------------- |
| j          | z                    |
| z          | j                    |
| s          | c                    |
| c          | s                    |