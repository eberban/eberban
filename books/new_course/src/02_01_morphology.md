# Morphology

> In linguistics, morphology is the study of words, including the principles by which they are
> formed, and how they relate to one another within a language.\
> __Source:__ [Wikipedia](https://en.wikipedia.org/wiki/Morphology_(linguistics))

Eberban's morphology is designed to be __Self-Segregating__, which means there is no ambiguity in
word boundaries. By knowing the few simple rules of how Eberban words are shaped, one can properly
separate words written without spaces between them, and without needing to know what most words
actually mean.

## Alphabet

Eberban can be written using the latin alphabet with the following letters:
- __consonants__: n, r, l, m, p , b, f, v, t, d, s, z, c, j, g, k
- __vowels__: i, e, a, o, u
- the letter __h__ 
- extra symbols: - (hyphen) and quotation marks \[ and \]

Any other symbol is considered a space. \[ and \] are also considered spaces outside of the specific
grammar of foreign quotes.

The alphabetical order is `hnrlmpbfvtdszcjkgieaou`.

Among the consonants, __n, r and l__ are designated as __sonorants__ and play important roles in
Eberban's morphology as they can appear more freely inside or at the end of words compared to other
consonants.

## Groups of letters

Some letters used in a row form groups which are important for understanding the morphology rules.

A string of multiple vowels form a group called __vhowels__. __h__ can also appear in this group but
only between 2 vowels.

2 consonants form pairs which are classified in the following categories:
- __initial pair__: can only appear at the start of words
- __medial pair__: can only appear inside a word (not at the start)
- __invalid pair__: not allowed, usually because they are difficult to utter

Invalid pairs are due to consonants being impossible or diffult to utter together, the main reason
being due to voiceness (`p` is the unvoiced counterpart of `b` which is voiced).

Medial pairs on the other hand are pairs that are difficult to utter at the start of a word, but
easier to utter inside a word.

The following chart displays what each pair is, with __initial pairs__ in blue
and __medial pairs__ in red.

![Table of consonant pairs](./assets/chart-pairs.png)

__Medial triplets__ can also appear in words where __medial pairs__ are allowed in the form of
consonants ABC, where AB is a __medial pair__ and BC is an __initial pair__.

## Word types

Words are organized into the following classes:
- __particles__ are words exerting grammatical functions
- __content words__ are words conveying meaning about concrete or abstract subjects. They are
  organized in multiple subclasses:
  - __roots__ are somewhat short words and are the main building blocks of the vocabulary
  - __borrowings__ allow importing foreign words and names with more permissive morphology than
    roots
  - __freeform variables__ allow defining your own words with the same permissive morphology as
    borrowings
  - __compounds__ are words composed of other Eberban words used to extend the vocabulary in a more
    memorable way
  
## Permissive writing

The same letter appearing multiple times in a row (case-insensitive) is considered identitcal to the
letter appearing once. Repeating letters can be informally used to convey length of sounds in
speech.

Eberban text is usually written all lowercase (outside of foreign text quotes), but uppercase can
informally be used to convey volume (yelling). No punctuation symbol is used but informally
punctuation from other languages can be used alongside proper Eberban grammar.

Dot `.` is often used in place of a space to visually join two words which morphologically requires
a space between them. Using multiple dots can be used to convey longer pauses in speech.

Hyphen can be used at syllable boundary to make them stand-out without breaking a word in two, and
also allows a word to continue on a new line (spaces are allowed on the new line before the
continuation of the word).

## Recognize word forms

In general, encountering a space, single (non-sonorant) consonant or initial pair (not part of a triplet) marks the
start of a new word. If the word starts with a vowel or sonorant, it must be prefixed by a space to
separate it from the previous word; otherwise those letters would still be part of the previous word.

### Starts with single consonant

- If a word starts with a single consonant only followed by vhowels, then it is a __particle__.
- If a word starts with a single (non-sonorant) consonant followed not only by vhowels (sonorant,
medial pair or triplet) then it is a __root__.
- If a word starts with a sonorant followed by vhowels and sonorants, then it is __particle__. Those
  are reserved for sentence level particles (they end the current sentence then perform some grammatical function).

### Starts with an initial pair

All words that start with an initial pair are __roots__. The initial pair can be followed by a mix of
vhowels, sonorants, medial pairs or triplets.

### Starts with a vowel

- If a word starts with __a__ or __o__ followed only by vhowels and sonorants, then it is a __particle__.
  Those are also resered for sentence level particles.
- If a word starts with __u__, it is a __borrowing__. It is followed by a mix of vhowels, consonants,
  medial pairs and triplets __and even initial pairs__; and ends once a space is encountered. When
  borrowing a foreign word, one must try to use letters which sounds the closest to original word
  pronunciation. For exemple, the name _Alice_ becomes _ualis_, _computer_ becomes _ukompiutar_, etc.
  If the borrowed word would start with _u_, it is separated from the _u_ prefix of compounds with a
  space (french _utopie_ becomes _u utopi_). For other starting letters the space is accepted but
  optional. (_u alis_ is accepted).
- If a word starts with __i__, it is a __freeform variable__. It follows the same rules as borrowings
  except its prefix is __i__ (thus if the content starts with __i__ a space is mandatory between the
  two __i__).
- If a word starts with __e/en/er__, it is a __compound__. Depending of the prefix it respectively
  starts a compound from the following __2/3/N__ words. If prefix is __er__, the compound stops when
  a single isolated __e__ is encountered. This allow arbitrary long compounds, but its usage will be
  very rare. Spaces between each word, and after the prefix is allowed
  and optional. Words making the compound can be roots, particles and borrowings. Freeform variables
  and compounds are not allowed.\
  __Exemples:__
  - _eberban_ = _e ber ban_ = 2-compound made from _ber_ and _ban_.
  - _euinglic.ban_ = _e uinglic ban_ = 2-compound made from _uinglic_ and _ban_.
  - _encepeusa_ = _en ce peu sa_ = 3-compound made from _ce_, _peu_ and _sa_.