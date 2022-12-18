# Time

> More complete (and complex) explanations can be found in [the chapter
> defining such concepts](../from_scratch/core_to_complete/time.md).

## What is the time system?

Time is represented using a graph of instants. It supports multiple possible
futures and pasts, parallel and fictional universes. The implicit context
argument with some predicates allows handling time-related stuff behind the
scene. Events are defined using __time spans__, which are all instants between
a start and end instant, and usually can't be cut into multiple parts. 

## What is the default tense of a sentence?

By default it the present.

It can be set back to any time/tenseless with
```
pae            sve              mai
update-context set-initial-span true
```

The default/initial time span of a sentence can be set to the present with
```
pae            sve              del
update-context set-initial-span present-span
```

(For the following explanations we'll consider it is the present)

## How does a simple sentence work?
```
mian buri meon
cat  eat  apple
```

This sentence is only true if there is an overlap between the following three
events:

- a cat X exists
- an apple Y exists
- X eats Y

This overlapping time span must itself overlap with the initial time span
(present).

## Possible / Necessary?
Tenses have two variants: possible and necessary.

Possible means that there exists at least one timeline in which the event occurs.

Necessary means that it must occur in all timelines.

## How to use tenses in a sentence?
Tense predicates express that some proposition occurs in relation with the
outer sentence AKA __overlapping span__ (the time span that is part of the time
span of all events), that we'll write as C for "context".

The tenses are:
- __sel/sen__: E meets C (end instant of E = first instant of C)
- __sal/san__: E starts C  (they share the same start instant)
- __sol/son__: E finishes C (they share the same end instant)
- __sul/sun__: E is met by C (end instant of C = first instant of E)
- __siel/sien__: E is before C
- __sial/sian__: E contains C
- __siol/sion__: E is contained by C (there is no difference between both
variants)
- __siul/siun__: E is after C
- __sil/sin__: E overlaps with C

The ones ending with __-l__ are the __possible__ variants, while those ending
with __-n__ are the __necessary__ variants.

```
mi sni   mo  vi sul             mo  sni   mi
I  greet you &  possible-met-by you greet me
I greet you, which is possibly immediatly followed by you greeting me.
```

Which can be drawn as:
```
--------------------- Time -------------------->

--------- X is me ------------------------------
------------------- Y is you -------------------
   |---- X greets Y ----|
   |-- Sentence span ---|
         |              |--- sul span -----|
         |              |---- Y greets X --|
         |
        |-| Present (initial span)
```

## Detached time spans

- __zvi:__ `[E:dinu]` is a time span shared by all events of `[A:()]`.
- __zvin:__ Time span `[E:dinu]` contains the context time span.
- __zvil:__ `[E:dinu]` is the context time span.

The predicate __zvi__ is one of the building blocks of the time system, and
allows talking about the time span that is shared/common between all time spans
of a proposition. This time span is itself __NOT__ stated to be part of an outer
shared/common time span.

Stating that a time span is part of the shared time span is done with __zvin__,
while __zvil__ allows accessing this shared time span.