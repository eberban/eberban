# Sentences (p-)

Eberban sentences all start with particles in families __PA__, __PO__ or __PU__,
which are respectively all particles which starts by __pa-__, __po-__ and
__pu-__. They are followed by a combinaison of those elements:

- a __definable word__: a root, compound, __GI__ and i-variable.
- an __inner predicate__, which is a __predicate chain__ optionally prefixed by
  an __argument list__.

__PA__, __PO__ and __PU__ differ in what is expected after them:

- __PA__ must be followed by an __inner predicate__.
- __PU__ must be followed by a __definable word__.
- __PO__ must be followed by a __definable word__ then an __inner predicate__.

If the first sentence of a paragraph doesn't start with __PA/PO/PU__ then it
is an implicity __pa__ sentence.

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
__pae__ wraps a 1-ary predicate that takes as parameter the new context, which
can thus be constrainted in terms of the current implicit context argument.
The vocabulary contains many predicates designed to easily be used with __pae__
to provide many import concepts such as tenses.
</spoiler>

<spoiler>
__pahe__: Register automatic context update
---
__pahe__ wraps a 1-ary like __pae__, which describe how the context is updated
after each __pa__ sentence ends. It is currently unknown if it will be used
significatively by casual speakers, but its existence is necessary to implement
things like the "present" going forward in time after each sentence.
</spoiler>

<spoiler>
__pahi__: Sentence wrapper
---
__pahi__ wraps a 1-ary predicate that will take every sentence expressed with
__pa__ as argument, which is mainly used to configure correctly the context
for some features to work. Will likely not be used by casual speakers.
</spoiler>

## PO

<spoiler>
__po__: Definition
---
__po__ allows to assign a definition to a word, and is an important tool to
create the vocabulary of Eberban and avoid repetitions.

It can also be used by speakers to simplify complex sentences by defining part
of it using __po__, then using the defined predicate(s) into a __pa__ sentence.

Note that the definition don't use the global context argument, and instead
will use the context argument provided by the sentence using this predicate.
</spoiler>

<spoiler>
__poe__: Capturing definition
---
Same as __po__ but captures the current global context. The implicit context
argument will be ignored.
</spoiler>

<spoiler>
__poi__: Question
---
__poi__ allow to ask a question by defining a predicate to be used by the
interlocutors, which they must use in their own sentence.

Defining a 0-ary predicate asks the listener to say if it is
false or not (by using it with or without a negation), while higher arities asks
the listener to provide arguments that makes the predicate true (or negate it if
there is no such arguments).
</spoiler>

<spoiler>
__pou__: Axiom definition
---
Shorthand of defining a predicate using __po__ then enabling it as an axiom
with __pu__. Can be used to as an equivalent to natural languages
[performative] speech act.

[performative]: https://en.wikipedia.org/wiki/Performativity
</spoiler>

## PU

<spoiler>
__pu__: Enable axiom
---
Considers the provided _definable word_ as an axiom, a proposition that is
true by definition, and which is evaluated with the current global context.

Redefining this word will not change the enabled axiom, however enabling it
again using __pu__ will disable the previous one and enable the new one.
</spoiler>

<spoiler>
__pui__: Disable axiom
---
Disable an axiom previously enabled with __pu__.
</spoiler>