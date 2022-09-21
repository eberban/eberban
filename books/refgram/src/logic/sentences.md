# Sentences (p-)

Eberban has multiple kind of sentences, which all begins with particles starting
with __p-__, grouped into the following families :

- __PA__ (all starting with _pa-_): The particle is followed by a predicate or
  chain of predicates.
- __PO__ (_po-_): The particle is followed by a __defined__
  predicate word, __GI__ or freeform variable (word starting with
  _i-); then followed by a definition as a predicate or chain of predicates.
- __PU__ (_pu-_): The particle is followed only by a sigle predicate word,
  __KI/GI__ variable or freeform variable.

In all cases the predicate or chain of predicates can be prefixed by an
__argument list__ if necessary.

## Assertion (pa)

__pa__ allows the speaker to make an assertion. It is followed by a wrapped
0-ary predicate, thus creating existential variables for all arguments of
the predicate.

If the first sentence of a text is an assertion than the initial __pa__
can be omitted.

> Until now we gave translations for chaining only. From now on we'll consider
> above omition and exemples as complete sentences.

## Context update (pae)

The context argument of the predicate wrapped with __pa__ is filled with a
globally managed context variable that can be updated using __pae__.
__pae__ wraps a 1-ary predicate that takes as parameter the new context, which
can thus be constrainted in terms of the current implicit context argument.
The vocabulary contains many predicates designed to easily be used with __pae__
to provide many import concepts such as tenses.

## Repeated context update (pahe)

__pahe__ wraps a 1-ary like __pae__, which describe how the context is updated
after each __pa__ sentence ends. It is currently unknown if it will be used
significatively by casual speakers, but its existence is necessary to implement
things like the "present" going forward in time after each sentence.

## Sentence wrapper (pahi)

__pahi__ wraps a 1-ary predicate that will take every sentence expressed with
__pa__ as argument, which is mainly used to configure correctly the context
for some features to work. Will likely not be used by casual speakers.

## Definition (po)

__po__ allows to assign a definition to a word, and is an important tool to
create the vocabulary of Eberban and avoid repetitions.

It can also be used by speakers to simplify complex sentences by defining part
of it using __po__, then using the defined predicate(s) into a __pa__ sentence.

Note that the definition don't use the global context argument, and instead
will use the context argument provided by the sentence using this predicate.
__poe__ can be used to __capture__ the current global context instead, and the
defined predicate will thus ignore the context argument provided by a sentence
using it.

## Questions (poi)

__poi__ allow to ask a question by defining a predicate to be used by the
listener. Defining a 0-ary predicate asks the listener to say if it is false
or not (by using it with or without a negation), while higher arities asks the
listener to provide arguments that makes the predicate true.