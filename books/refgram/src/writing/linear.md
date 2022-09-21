# Linear writing system

<img src="symbols.svg" style="width: 100%" />

> Text on the right is `mi ve kali vahul fe buri pcien`, which translates to
> _I drink milk and eat bread_.

The linear writing system is based on a central line called the __stem__ on
which vowel symbols are attached, while consonant symbols added near it. Symbols
for consonants are organized in pairs of voiced and unvoiced consonants which
are mirror of each other relative to the stem.

To write text in this script, the stem first start by a dot or circle, which is
necessary to avoid reading direction ambiguity in some cases. This dot or circle
is also used to write world boundary markers.

Then the letters are written following those steps:

1. If any write the consonant symbol on the correct side, or write a dot/circle
   if the word starts with a vowel.
2. If there is a second consonant, write it next next to the consonant, away
   from the stem.
3. Then write the vowel on the other side of the stem. If there are no prior
   consonant the side can be arbitrarily choosen.
4. Finally, if the vowel is followed by a sonorant, write it next to the vowel,
   away from the stem.
5. Then: 
   - If the next letter is consonant, return to step 1.
   - If the next letter is the initial vowel of the next word, write the
     dot/circle on the stem and go to step 3.
   - If the next letter is a vowel in the same word, move forward along the
   - stem and write the next vowel symbol on the __same side__ as the previous
     vowel.
   - If the next letter is a H, move forward along the stem and write the next
     vowel symbol on the __opposite side__ of the previous vowel.

Since the writing system uses symetry to distinguish letters, it is important
to know if its support medium is mirrored or not (text written on glass readable
from both sides, text seen in a mirror, mirrored picture, etc). For that
purpose, it is recommanded to write near the text the __chirality symbol__ for
which it is easy to see if it is mirrored or not.

The stem can twisted/change direction arbitrarily as long as the curves are
smooth and there is no self intersection.