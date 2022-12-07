# Sentences (p-)

Eberban sentences all start with particles in families __PA__, __PO__ or __PU__,
which are respectively all particles which start with __pa-__, __po-__ and
__pu-__. They are followed by a combination of these elements:

- a __definable word__: a root, compound, __GI__ and i-variable.
- an __inner predicate__, which is a __predicate chain__ optionally prefixed by
  an __argument list__.

__PA__, __PO__ and __PU__ differ in what is expected after them:

- __PA__ must be followed by an __inner predicate__.
- __PU__ must be followed by a __definable word__.
- __PO__ must be followed by a __definable word__ then an __inner predicate__.

If the first sentence of a paragraph doesn't start with __PA/PO/PU__, then it
is implicitly a __pa__ sentence.

## PA

<spoiler>
__pa__: Assertion
---
__pa__ allows the speaker to make an assertion of a proposition
(0-ary predicate).
</spoiler>

<spoiler>
__pae__: Context update
---
The context argument of the predicate wrapped with __pa__ is filled with a
globally managed context variable that can be updated using __pae__.
__pae__ wraps a 1-ary predicate that takes as its parameter the new context, 
which can thus be constrained in terms of the current implicit context argument.
The vocabulary contains many predicates designed to easily be used with __pae__
to provide many important concepts, such as tenses.
</spoiler>

<spoiler>
__pahe__: Register automatic context update
---
__pahe__ wraps a 1-ary like __pae__, which describes how the context is updated
after each __pa__ sentence ends. It is currently unknown if it will be used
significantly by casual speakers, but its existence is necessary to implement
things like the "present" going forward in time after each sentence.
</spoiler>

<spoiler>
__pahi__: Sentence wrapper
---
__pahi__ wraps a 1-ary predicate that will take every sentence expressed with
__pa__ as an argument, which is mainly used to correctly configure the context
for some features to work. Will likely not be used by casual speakers.
</spoiler>

## PO

<spoiler>
__po__: Definition
---
__po__ allows the speaker to assign a definition to a word, and is an important
tool to create the vocabulary of Eberban and avoid repetitions.

It can also be used by speakers to simplify complex sentences by defining part
of it using __po__, then using the defined predicate(s) in a __pa__ sentence.

Note that the definition doesn't use the global context argument, and instead
uses the context argument provided by the sentence using this predicate.
</spoiler>

<spoiler>
__poe__: Capturing definition
---
Same as __po__ but captures the current global context. The implicit context
argument is ignored.
</spoiler>

<spoiler>
__poi__: Question
---
__poi__ allows the speaker to ask a question by defining a predicate to be used
by the interlocutors. This predicate must then be used in reply.

A 0-ary predicate prompts the listener to assert it is true (pa gi), that it is
false (pa bi/zi gi), or that it is unknown (mui).

Similarly, a higher arity predicate prompts the listener to provide the required
arguments to make the predicate true, to negate it if there are no such
arguments, or to assert that it is unknown.
</spoiler>

<spoiler>
__pou__: Axiom definition
---
Shorthand of defining a predicate using __po__ then enabling it as an axiom
with __pu__. Can be used as an equivalent to a [performative] speech act in 
natural language.

[performative]: https://en.wikipedia.org/wiki/Performativity
</spoiler>

## PU

<spoiler>
__pu__: Enable axiom
---
Considers the provided _definable word_ as an axiom, a proposition that is
true by definition, and which is evaluated within the current global context.

Redefining this word will not change the enabled axiom, however enabling it
again using __pu__ will disable the previous one and enable the new one.
</spoiler>

<spoiler>
__pui__: Disable axiom
---
Disable an axiom previously enabled with __pu__.
</spoiler>