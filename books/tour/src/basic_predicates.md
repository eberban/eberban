# Basic predicates

As seen before, predicates are a core aspect of eberban. There are many ways to
make them, but this section will focus on how definitions are expressed, and on
the most simple ways to have a predicate.

## Terminology

A **proposition** is anything that has a truth value (which can be true or
false). It is equivalent to a nullary predicate (0 open places).

A **predicate** is a proposition template with one or more open blanks (called
      arguments) which may be filled in to yield a complete proposition with a
      truth value. The number of arguments is called the **arity** of the
      predicate.

Sometimes, 1-ary predicate are called properties while 2-ary predicates are
called relations.
## Definitions

Predicates have a precise definition which define their place structure.

- `_A_` represents an open place. `A` can be replaced with `E`, `I`, `O` or `U`,
  which are vowels used in many particles families to indicate a place.
- Next to the letter the arity of the place can be added. If there is no number,
  it defaults to 1-ary.
- As we'll see later, a core concept of the language is "predicate chaining",
  and one place can be the default chaining place. This place is indicated by
  being surrounded by brackets `[]`. Not all predicates have a default chaining
  place.

> **Example :**
>
> ```eng
> tun: _A_ agrees with _E_ than [_I0_] is true.
> ```
>
> Both the 1st and 2nd place expects an property binding. The 3rd place expects
> a proposition, and is the default chaining place.

## Null values

**Null values** can be used as an argument. Each predicate definition can define
how to handle a null value. If it is not defined, an elliptical (infered from
context) value is used. When a place is not filled in a sentence, it is as if it
was filled with a null value.