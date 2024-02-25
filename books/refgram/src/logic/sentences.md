# Sentences (A/O/NI) and erasure (RA)

Eberban sentences all start with particles in families __A__, __O__ or __NI__, which are
respectively all particles which start with __a-__, __o-__ and __n-__. They are followed by a
combination of these elements:

- a __definable word__: a root, compound, __GI__ and i-variable.
- an __inner predicate__, which is a __predicate chain__ optionally prefixed by an __argument
  list__.

__A__, __O__ and __NI__ differ in what is expected after them:

- __A__ must be followed by an __inner predicate__.
- __NI__ must be followed by a __definable word__.
- __O__ must be followed by a __definable word__ then an __inner predicate__.

If the first sentence of a paragraph doesn't start with __A/O/NI__, then it is implicitly a __a__
sentence.

## A family

- __a__ (assertion): __a__ allows the speaker to make an assertion of a proposition (0-ary
  predicate).
- __al__ (injunction): __al__ allows the speaker to make a request/order/command.
- __an__ (context update): The context argument of the predicate wrapped with __a__ is filled with a
  globally managed context variable that can be updated using __an__. __an__ wraps a 1-ary predicate
  that takes as its parameter the new context, which can thus be constrained in terms of the current
  implicit context argument. The vocabulary contains many predicates designed to easily be used with
  __an__ to provide many important concepts, such as tenses.
- __anu__ (register automatic context update): __anu__ wraps a 1-ary like __an__, which describes
  how the context is updated after each __a__ sentence ends. It is currently unknown if it will be
  used significantly by casual speakers, but its existence is necessary to implement things like the
  "present" going forward in time after each sentence.
- __ahu__ (sentence wrapper): __ahu__ wraps a 1-ary predicate that will take every sentence
  expressed with __a__ as an argument, which is mainly used to correctly configure the context for
  some features to work. Will likely not be used by casual speakers.

## O family

- __o__ (question):__o__ allows the speaker to ask a question by defining a predicate to be used by
  the interlocutors. This predicate must then be used in reply.

  A 0-ary predicate prompts the listener to assert it is true (a gi), that it is false (a bi/zi gi),
  or that it is unknown (mui). (TODO: Add an easy way to state the **answer** to the question is
  unknown / gi equivalent to mui).

  Similarly, a higher arity predicate prompts the listener to provide the required arguments to make
  the predicate true, to negate it if there are no such arguments, or to assert that it is unknown.
- __on__ (definition): __on__ allows the speaker to assign a definition to a word, and is an
  important tool to create the vocabulary of Eberban and avoid repetitions.

  It can also be used by speakers to simplify complex sentences by defining part of it using __on__,
  then using the defined predicate(s) in a __a__ sentence.

  Note that the definition doesn't use the global context argument, and instead uses the context
  argument provided by the sentence using this predicate.
- __oni__ (capturing definition): Same as __po__ but captures the current global context. The
  implicit context argument is ignored.
- __ol__ (performative / axiom definition): Shorthand of defining a predicate using __on__ then
  enabling it as an axiom with __nu__. Can be used as an equivalent to a [performative] speech act
  in natural language.
  
- __oie/oia/oio/oiu__ (set defaults): Set the default binding for a slot of the given predicate. See
  [the chapter on defaults](default.md)


## NI family

- __nu__ (enable axiom): Considers the provided _definable word_ as an axiom, a proposition that is true by definition, and
  which is evaluated within the current global context.

  Redefining this word will not change the enabled axiom, however enabling it again using __nu__ will
  disable the previous one and enable the new one.
- __ni__ (disable axiom): Disable an axiom previously enabled with __nu__. 

[performative]: https://en.wikipedia.org/wiki/Performativity

## RA eraser

__ra__ is a special word which erase anything said since the start of the current sentence, initial
__A/O/NI__ included. It must be surrounded by spaces or pauses.

It is able to erase it even if the text is ungrammatical, and while erase anything back to the start
of the last sentence where the text was still grammatical (this means that an ungrammatical sentence
followed by grammatically-looking sentences actually just counts as a single ungrammatical
sentence).

However one must be careful with [foreign quotes](../grammar/quotes.md). If the text was grammatical
until now, a __ra__ appearing inside the foreign quote will be quoted and will not erase the
sentence. However if the sentence was ungrammatical, then __ra__ will erase the sentence even if it
looks like it is inside a foreign quote. To avoid this issue, it is recommended to properlly close
the foreign quote (even if the text is ungrammatical), so that __ra__ will properly erase the
sentence regardless of if the sentence was grammatical or not.

To erase only a part of a sentence, use [short erasure "buhu"](../grammar/enum.md).