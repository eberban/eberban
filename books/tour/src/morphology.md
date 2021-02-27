# Morphology

The morphology of eberban is quite simple. In terms of letters, there are 6
vowels (**a, e, i, o, u, q**), 17 consonants (**b, c, d, f, g, j, k, l, m, n, p,
r, s, t, v, x, z**), 2 semi-vowels *w* and *y* and a semi-consonant **h**,
for a total of 26 letters.
There is also one symbol denoting a pause in speech, namely the apostrophe
**'**, which is optional in written media as long as there are spaces alongside
it. Among the consonants, three special ones are designated
(alveolar) **sonorants** : **l, n, r**.

## Letter conventions

While discussing letters, the following conventions are used:
1. A __C__ denotes exactly one consonant (including sonorants).
2. A vowel-tail, represented as __V__, denotes a chain of vowels separated by
   a semi-vowel, **h** or a sonorant (w, y, h, n, l, r). The first vowel can
   be preceded by a semi-vowel. **h** or sonorants can be preceded by **y**.
   A final **y** at the end of the word is also allowed.

## Words

Letters may be combined to form _words_. There are two main types of words:
_particles_ and _roots_. Particles exert grammatical functions, while roots
denote concepts with an intrinsic meaning, such as "cat", "language" or "teach".
There is also a third type of words called _borrowings_, which can be used to
import words from external languages such as English; but you don't need to
worry about it for now, as this will only be covered later.

<!-- TODO: maybe add that pairs of consonants have some restrictions, but that we'll not go into details yet; could be another "advanced section", maybe? -->

__Remark:__ If you are familiar with Lojban, you may view particles as analogous
to cmavo, and roots as analogous to gismu.

Particles always follow the pattern __V__ or the pattern __CV__. On the
other hand, roots always follow either the pattern __VC__, __CVC__, __CCV__
or __CCVC__. The final __C__ (if any) must be a sonorant.
<!--In particular, they always have exactly two consonants and one or more vowels and/or apostrophes.-->

Particles and roots starting with a vowel or a sonorant are technically preceded by a
pause, which may be omitted in writing if there are spaces alongside it. 

Borrowings have the same starting rules, but may end in any letter, always
followed by a pause.

In written media, a sequence of words is typically, but not necessarily,
separated by spaces (" ").

>  **For the advanced reader:** you may have noticed that all words start with
>  either a vowel or sonorant (preceded by a pause), or a non-sonorant; and that all
>  words (except borrowings) end with either a vowel or a sonorant. This is by
>  design. As we will later see, these seemingly artificial restrictions
>  involving sonorants ensure that, even if words (except borrowings) are strung
>  together without any spaces between them, they can still be uniquely
>  decomposed (i.e. spaces can be deterministically added back). This may seem
>  unimportant, and indeed in written media spaces are not particularly obnoxious
>  &ndash; they are recommended, even. But in spoken form spaces correspond to
>  pauses, and this unique decomposition property suddenly becomes important: it
>  means that, while speaking, we do not need to pause between every two words!
>  For our fellow language nerds out there: this cool property is also known as
>  self-segmenting morphophonology :-)
>
>  Additionally, there is a mandatory pause at the end of borrowings, allowing
>  segmenting to work with borrowings as well.

## Compounds
In addition to words, eberban also has the concept of compounds. Think of them
as some kind of "super words", which combine several words to yield a more
precise meaning, hence increasing the expressive power of the language.
<!-- is it fair to say the that a compound _narrows_ the meaning of the (last) word? I
guess not, as the last word could be somewhat figurative, as happens in some
lujvo --> If you are familiar with lojban, you might find compound vaguely
similar to lujvo, and to a lesser extent tanru. They always start with a vowel.
All in all, an eberbanic text is actually a sequence of words and compounds.

TODO...

## Permissible consonant pairs

Not all consonant pairs are allowed in eberban.
The following table lists all permissible consonant pairs.

|     |     |     |     |     |     |     |        |
| --- | --- | --- | --- | --- | --- | --- | ------ |
| cp  | ct  | ck  | cf  | cm  | cn  | cl  | cr     |
| sp  | st  | sk  | sf  | sm  | sn  | sl  | sr     |
| jb  | jd  | jg  | jv  | jm  | jn  | jl  | jr     |
| zb  | zd  | zg  | zv  | zm  | zn  | zl  | zr     |
|     |     |     |     |     |     |     | &nbsp; |
| pl  | pr  | tl  | tr  | kl  | kr  | fl  | fr     |
| xl  | xr  | bl  | br  | dl  | dr  | gl  | gr     |
| vl  | vr  | ml  | mr  |     |     |     |        |
|     |     |     |     |     |     |     | &nbsp; |
| tc  | ts  | dj  | dz  |