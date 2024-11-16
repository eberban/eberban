# Writing on Eberban's design (Work In Progress)

This document aims to describe my (mia) rationale for the design of Eberban,
both for its grammar and its vocabulary. Eberban is inspired a lot by Lojban and
a bit by Toaq, which this document will explain what I liked and don't like and
how it shaped Eberban. I'll also detail the train of thoughts for some of the
unique aspects of Eberban.

## Starting from Lojban

While I looked a bit at lojban before, I really started to learn Lojban around
the start of 2019. I really liked many of its ideas but started to be annoyed by
many _quirks_ that made it either hard to learn for me or annoying to use.

### Phonology and orthography

One thing I liked about Lojban was its phonology and orthography, which I reused
for Eberban while changing a few details that I didn't liked. I liked a lot that
 a symbol as a one-to-one mapping with a range of accepted sounds, which
simplifies spelling and avoids homophones (_dear_/_deer_ in English). Most
letters were easy for me to utter (my native language is French and I also speak
English), however the consonant __x__ (IPA: [x]) was hard to utter, especialy in
clusters with __r__ and __l__. In thus got rid of it in Eberban.

Regarding the vowels I found the letter __y__ (IPA: [ə]) to cause some issues.
In Lojban some consonant clusters are difficult to utter, and it is allowed to
use a buffer vowel sound to ease their pronunciation. However it was hard for me
to utter another vowel than the 6 Lojban vowels. As __y__ in Lojban have more
restricted uses than the other vowels that I didn't needed in Eberban, I got rid
of __y__ to allow it as a buffer vowel if needed (while Eberban also disallow
some of the most difficult consonant clusters found in Lojban).

Lojban have specific vowel diphthongs, some which I find hard to distinguish
with single vowels (mainly __au__ from __a__). Those diphthongs also comes with
some restrictions when making words with them, which for exemple makes borrowing
my name as "la .mian." invalid (it must be borrowed as "la .miian." instead). In
Eberban I decided to simplify vowel clusters by allowing any cluster of vowels
which are uttered one after the other without pauses or glides (glides are still
allowed for convenience but are alternative and optional pronunciation).

### Self Segregating Morphology

One general idea that I liked in Lojban is the idea of a __[Self Segregating
Morphology (SSM)]__, which is that the shape of words and some smaller elements
are designed in such a way that a stream of sounds or characters can only be
parsed in a single sequence of words, which is not the case in many languages
like English (_attack_ and _a tack_ are usually homophonous). However there a
few aspects of Lojban's SSM that I didn't liked, mainly its use of stress (I
have prosody issues), and some rules being difficult for humans (such as the
[tosmabru] problem). It also comes with a convoluted way of making compound
words (_lujvo_ in Lojban) that require remembering irregular short forms of
words and stringing them together with sometimes the need for a __y__ to
separate consonants that are not allowed to follow each other.

In Eberban, no stress is used and word shapes are designed such that string any
2 words cannot form a forbidden cluster. Words don't have a different short form
when making compounds, and instead the first word of the compound is prefixed
with a vowel indicating the start of a compound and its length ("eberban" is a
compound made from words "ber" and "ban", prefixed by "e" which starts a 2-words
compound).

In both Lojban and Eberban, words are split into 2 large families: particles and
content words, which can be recognized by their morphology (note that some
particles can act as content words, but are still particles for specific reasons
).

[Self Segregating Morphology (SSM)]:
    https://loglangs.wiki/Self-segregating_morphology
[tosmabru]: https://mw.lojban.org/papri/tosmabru

### Foreign names and borrowings

Lojban handles foreign names and borrowings using 2 different constructs. Names
(_cmevla_ in Lojban) must be stressed correctly and necessarily end with a
consonant (while all other Lojban words end with a vowel). Borrowings (_fu'ivla_
in Lojban) are done differently and comes in different classes depending of
which they contain a prefix or not, and are in my opinion difficult to tell
appart from compound words.

In eberban, both are made with a single tool being borrowings, which starts with
a __u__ followed by the borrowed word and ended with a pause. This borrowed part
have less constraints that native Eberban words to accomodate better for foreign
words morphology (even if it still pretty limited), and can end with either a
vowel or a consonant. If it needs to be used as a name, it is them prefixed with
the word "za", which can also be used before native words.

### Particle families

In both Lojban and Eberban, particles are organized into families, such that
grammar rules are expressed in term of families, each particle of a family
conveying a different meaning while sharing the same structure.

A big issue for me in Lojban particle families is that particles of a same
family most of the time don't look like each other. This is especially an issue
as Lojban has a big number of particles, and that a few families exibit some
patterns. Eberban on the other hand have less particles and particle families,
and all particles in a family share a common prefix (all particles in the family
named __PA__ starts with __pa__, all particles in family __VI__ starts with
__v__, etc). In my opinion, this helps to learn and recognize them, at the cost
of them being less distinguishable in high-noise environements. I however prefer
to utter longer vowels and make slightly more efforts to articulate than to have
trouble learning and recognizing particles (outside from very common particles,
I still cannot read Lojban without using a parser or dictionnary to know which
family particles are part of).

## Eberban unique aspects

### Chaining and the absence of noun phrases

In Lojban there is a main verb and other parts of the sentence acts like nouns
(either by being particles acting like nouns, or by being a verb transformed
into a noun using a particle).

Eberban words either acts like __verbs__ (also called __predicates__) or
structure the sentence or text shape (all structuring words are particles, but
some particles acts like verbs), and there is nothing that looks like a noun.
Verbs are chained one after the other, and adjacent verbs share a common
_thing_, like an invisible noun that is managed for you by the language.

|  | mian |  | etiansa |  | meon |  | zman |
|--|------|--|------|--|------|--|------|
| There is some X which | is a cat | and which | eats some Y | which | is an apple | and which | is red

Verbs in the chain are grouped in a right-first order to form new verbs. The
sentence above is grouped in order `mian (etiansa (meon zman))`, forming the
following intermediary verbs:

- meon zman: is a apple which is red
- etiansa meon zman: eats an apple which is red
- mian etiansa meon zman: is a cat which eats an apple which is red

Unlike many natural languages (natlangs), Eberban verbs don't have cases, but
instead have ordered "places" (also called slots or parameters) for which the
first 4 are commonly refered to using the vowels E, A, O and U in this order
(the alphabetical order of vowels in Eberban is IEAOU, and all particles
refering to those places will use the corresponding vowel, while I can be used
alongside them to form some patterns). How verbs interacts with adjacent verbs
depends on 2 concepts:

- __Transitivity:__ the transitivity of a verbs determines which place will be
  used to interact with the chain of predicates on its right. For non-particle
  words, transitivity is encoded by the last letter of the word. If it is a
  vowel the verb is __transitive__ and the A place will be used, otherwise it is
  __intransitive__ and the E place will be used. Transitivity can be modified
  explicitly in a sentence using a particle of family __SI__.
- __Type of the place:__ all places have a type which represents the kind of
  thing that must be used. It can either be a verb with itself its own typed
  places, or a non-verb which called an __atom__ (which usually represent
  individuals or concepts). If the place selected by the transitivity rules is
  an atom place, then the atom is shared with the E place of the following chain
  (another place can also be selected using a particle in family __SI__). If the
  place selected is a verb place, then the following chain is stated to be
  equivalent with verb in this place. ("mi gali [mi jvin]" means "I am happy that
  [I dance]")

If one wants to make verbs interact in a different way from the default,
particles in family __VI__ and __FI__ can be used to explicly state which place
to use and how it related to the following chain. As __VI__ and __FI__ starts
their own subchains, they can also be used to interact with multiple places of
the same verb ("mi vani va \[spua mi\] fo \[spua mo\]" means "I go from [a home
of mine] to [a home of yours]").

### Logic framework and context parameter

Eberban aims to encode Higher-Order Logic statements. Each verb can be seen as a
function such that for every possible combinaison of inputs, it returns a
trivalent truth value: either True, False or Unknown. A long term goal for
Eberban is to have an interpreter such that given some facts (irrefutable
truths, also called axioms) and a proposition, the interpreter could state if
the proposition is __provably__ true, false, or unable to prove.

[pure functions]: https://en.wikipedia.org/wiki/Pure_function

Those functions are [pure functions]: the output depends solely on the input
arguments and it can have no side effet. However this make a problem arise: how
to express sentences like "In the future: [You dance]". How "dance" is able to
know the time if its only parameter is "you"? One solution could be to have an
additional parameter for the time, but that would require to explicitly provide
the time to every verb that depends on it, and would require to have a place for
many other concepts; which are both not ergonomic.

The strategy choosen for Eberban is to have an hidden parameter called the
__context parameter__ which is automatically managed by the language. Each verb
will automatically provide the message it receives to verbs it depends on (the
following chain and any verbs that are used in its definition). Additionally,
the language contain 2 special verbs __mue__ and __mua__ that allow respectively
to extract the current context and evaluate a verb with an arbitrary context.
Thanks to those verbs, vocabulary expressing time can modify the context it
provides to following chain to encode the time relation. To encode concepts like
the time passing by between sentences, the language have grammar to register
context changes that will be applied between each sentences.

The context parameter is a powerful tool that can be used to implement many
concept that "just work" in other languages like tenses, and to design ergonomic
vocabulary that uses the context parameter to "carry information around" to
reduce verbosity.

