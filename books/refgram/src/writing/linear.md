# Linear writing system

<img src="symbols.svg" style="width: 100%; background: white; border: 2px solid black" />

The linear writing system is structured around syllables with a vowel written in the center and the
consonants or sonorants being written above or below, forming four corners (up left, up right, down
left, down right). 

- If a syllable starts with a sonorant (N-initial particles, or multi-syllables words like
ma-__na__.), it can be written either in the top or bottom left. 
- If a syllable starts with one or two consonants, they must be placed up or down depending if the
  first consonant is unvoiced (up) or voiced (down). If there are two consonants they occupy thus
  both left and right place. We know the right one doesn't correspond to the syllable end because
  there is another consonant on its left.
- If a syllable ends with a sonorant and is the last syllable of the word, it must be placed on the
  right and opposite side of the initial consonant or sonorant. If there is no initial it can be
  written either up or down.
- If a syllable ends with a consonant because it is part of a medial pair or triplet, then the first
  consonant must be placed on the opposite side of the initial consonant of the current syllable,
  and the following consonants will be written at the start of the next syllable (following syllable
  start rules). This means that for exemple in `vog-bi`, since initial `v` is written at the bottom
  left, the `g` must be written at the top right, even though it is voiced and thus is usually
  written at the bottom. We know it's a `g` and not a `k` thanks to the following `b` which is
  voiced and thus written at the bottom left. If the syllable doesn't have an initial consonant it
  is adviced to write the ending consonant on its usual side, however it is not mandatory.
- This writting system ignores spaces. Use symbol for pause (`'`) when necessary. In borrowings and
  freeform variables ending with a consonant, it must be written at the start of the pause symbol
  (avoiding the ambiguity of consonants at the end of syllable which is usually resolved thanks to
  the following consonant, while there is none here).

## Computer font

A computer font is [available to
download](https://eberban.github.io/eberban/font/eberban-Regular.otf).

To write with this font some modifications needs to be made to texts to be rendered properly.
However it uses the fact that the Eberban grammar doesn't care of case or repeated letters. This
thus mean that text written with this font is perfectly valid Eberban but may look a bit odd (with
repeated letters, uppercase and hyphens) when displayed with another font.

The font works by only having vowels, `'` and space moving the cursor forward. Consonants, sonorants
and `H` are written without moving the cursor and *stacks* above or below the following vowel. They
are however not automatically moved to the right or the opposite side, and the following
modifications must be made :

- initial pair: the second consonant (or sonorant) must be doubled to be shifted to the right. `tcu`
  must thus be written `tccu`.
- medial pairs and triplets: medial pairs consonants (or sonorants) are split between the end of the
  a syllable and the start of the next.
  - If the first letter can be written on the correct side (up/down), an hyphen `-` must be written
  between them to shirt the first letter in the correct place. `padgon` is thus written `pad-gon`.
  - If the first letter must be written on the opposite side, it just needs to be written in
    uppercase. `vogbi` is thus written `voGbi`
- sonorants: sonorants by default are considered to be at the start of a syllable. In words ending
  with a sonorant however they should be placed at the end of the syllable. Writing a space after
  them shift them to the correct place. Sonorants at the start of a medial pair or a triplet in a
  borrowing also support being followed by an hyphen `-`, as a space would break the word apart.
- sonorants, M and H: by default they are written above the vowels, but writing them uppercase moves
  them below.