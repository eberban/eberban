# Sentences (A/O/NI/RA/PO/PU)

Eberban sentences all start with particles in families __A__, __O__ or __NI__, which are
respectively all particles which start with __a-__, __o-__ and __n-__. They are followed by a
combination of these elements:

- a __definable word__: a root, compound, __GI__ and i-variable (optionally namespaced, see __ohi__
  explanation below).
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

- __o__ (question): __o__ allows the speaker to ask a question by defining a predicate to be used by
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

- __oni__ (capturing definition): Same as __on__ but captures the current global context. The
  implicit context argument is ignored.

- __ol__ (performative / axiom definition): Shorthand of defining a predicate using __on__ then
  enabling it as an axiom with __nu__. Can be used as an equivalent to a [performative] speech act
  in natural language.

- __ohi__ (imports): Imports definitions and enabled axioms from eberban quote in slot __E__ under
  the __namespace__ represented by the "defined predicate" following __ohi__. Predicates in
  namespaces can be used by prefixing them with the namespace predicate followed by __PI__ (with
  single member __pi__) If word __ga__ is imported in __namespace__ __gi__ (using `ohi gi <quote
  defining ga>`), then it can be used with `gi pi ga`.  

- __oie/oia/oio/oiu__ (set defaults): Set the default binding for a slot of the given predicate. See
  [the chapter on defaults](default.md)

[performative]: https://en.wikipedia.org/wiki/Performativity

## NI family

- __nu__ (enable axiom): Considers the provided _definable word_ as an axiom, a proposition that is
  true by definition, and which is evaluated within the current global context.

  Redefining this word will not change the enabled axiom, however enabling it again using __nu__
  will disable the previous one and enable the new one.

- __ni__ (disable axiom): Disable an axiom previously enabled with __nu__. 
  
- __nohu__: enable all axioms in given namespace.
  
- __nohi__: disable all axioms in given namespace.
  
- __no__: extract a predicate from its namespace to put it in the root namespace. Equivalent to
  `on <pred> <namespace> pi <pred>`

- __noi__: extract all predicates from given namespace. `noi <namespace>` is equivalent to saying
  `no <namespace> pi <pred>` for all `<pred>` in `<namespace>`.


## RA eraser

__ra__ is a special word which erase anything said since the start of the current sentence, initial
__A/O/NI__ included. It must be surrounded by spaces or pauses.

It is able to erase it even if the text is ungrammatical, and will erase anything back to the start
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

## Paragraph marker PO

__PO__ can be placed before __A/O/NI__ to mark a change of subject or
new paragraph. If __PO__ is not followed by one of them then __a__ is implied.
If multiple prefixes in a row are used it must be the first of them.

__PO__ contains 2 members __po__ and __poi__, which affects definitions involving namespaces:
- Inside a text imported with __ohi__, __po__ marks the following definitions as __public__, meaning
  they'll be accessible in the namespace using __PI__. __poi__ on the other end marks the following
  definitions as __private__, making them inaccessible in the namespace. This allows to hide
  implementation details.
- Outside a text imported with __ohi__, predicates defined in a namespace will not be exported
  by __noi__ if defined in a __poi__ paragraph, while they will be exported if defined in a __po__
  paragraph. In both cases they are accessible with __PI__.

## Sentence terminator PU

Every sentence can optionally be terminated with __PU__ (with single member __pu__). It's sole
purpose is to [attach annotations](../grammar/annotations.md) on the sentence after the fact, as
if it was attached on __A/O/NI__.

## Conversations and special namespaces

In a conversion between multiple interlocutors, the following rules applies:
- the context is carried between the sentences of all interlocutors, in order of utturance
- a context transformation is applied when changing speaker to update personal pronouns and related
  concepts (TODO: create word for it and define how it works)
- definitions made by an interlocutor applies to all. All interlocutors shares the same word
  meanings in the _root namespace_.

__MI__ is used for special namespaces than can be used but not modified freely by the speakers, and
allows mitigating problems that can be caused by the above rules (like an interlocutor redefining
a word another wants to use for its former meaning).

- __mio__ (inclusive we) namespace contains all the words defined in the official dictionnary. It
  can be used to access a word that has been overwritten by any interlocutor's definition.
- __mi__ (speaker) namespace contains all the words from __mio__, but is modified by any definitions
  made by the speaker; and is not modified by definitions made by other interlocutors.
- __mo__ (interlocutor) namespace contains all the words from __mio__, but is modified by any
  definitions made by interlocutors; and is not modified by definitions made by the speaker.