# Predicate chaining

When a predicate place expects something which is not an entity, it is mandatory
to provide an abstraction of the correct type. While it's possible to manually create
abstractions with the use of abstractors (seen later in this book), multiple places like
this leads to deep nesting, which is harder to follow and also verbose.

The language provides a **chaining** mechanism to create complex but "flat"
place structures from multiple adjacent predicates, avoiding the need of
abstractors in most cases.

## Chaining rules

Chaining takes places between a left predicate **L** and a right predicate
**R**. First, find the rightmost place of **L** which expects a non-entity
(proposition/property/...), which we will call **LP**.

> If the rightmost place is not the one you want, see `cia/cie/cii/cio/ciu`
> which are explained in another chapter.

If there is no such **LP**, the output predicate will be equivalent to `L ce R`,
a predicate which represents something which satisfies both **L** and **R**.
Only the place structure of **R** is kept. To fill places of **L**, **ba**
should be used (see chapter on abstractors).

If this **LP** exist, we look at the arity of the argument it expects, which
we'll call **N** (0 for a proposition or event, 1 for a property, ...). We then
remove the first **N** places of **R**, whose meanings will be merged into the
meaning of **L** (see examples). Then, **LP** is replaced by the place structure
of this reduced **R**.

## Proposition example

```eng
broi : ___ wants/desires/wishes that [___] is true
suin :                                ___ is happy about ___

broi suin : ___ wants/desires/wishes that (___ is happy about ___) is true
          = ___ wants that ___ is happy about ___
```

## Property example

```eng
                     ┌── binds to 2nd place ──┐
                     ↓                        ┴
flun : ___ inspires ___ to satisfy property [___2]
spi :                                        ___ talks to ___


                         ┌── binds to 2nd place ──┐
                         ↓                        ┴
flun spi : ___ inspires ___ to satisfy property (XXX talks to ___)
         = ___ inspires ___ to talk to ___
```

> Definitions with properties always describe an entity satisfying the property. This is
> the place merged with the removed first place of the right predicate.

## Chaining with more than 2 predicates

If more than 2 predicates are chained, the chaining is right-grouping.
```ignore
A B C = (A (B C))
```