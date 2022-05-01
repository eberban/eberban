# Logic framework

Eberban is based on a custom __[Higher-order Logic (HOL)]__ and tries to stay
pretty close to expressions in such logic while being targeted for human speech.

__Predicates__ are functions that takes __arguments__ and returns a ternary
__truth value__: true, false or unknown/undefined. As eberban aims to have its
vocabulary formally defined from logical notation and axioms, _true_ fand
_false_ are returned when it's possible to infer/prove it from those axioms.
When it's not possible, _unknown_ is returned.

> Having a formaly defined dictionnary is a long time goal of eberban. Until
> then many words will not have a logical definition.

Predicates take as __arguments__ either other predicates or non-predicates
__atoms__ (are also called "symbols"). The type of the arguments is infered from
the definition of the predicate in which they are constrainted by being provided
to other predicates or by being provided arguments. Some arguments may not have
their type constrainted, in which case they have a generic type.

[Higher-order Logic (HOL)]: https://en.wikipedia.org/wiki/Higher-order_logic

## Context

All predicates have a first hidden argument being a __context__ atom, which is
handled implicitly by the grammar and carried away and mutated between sentences
or when entering nested parts of those sentences. They can be exposed using some
predicates provided by the language and allow to implement complex concepts such
as tenses, and them being implicitly carried allow the users to focus on more
concrete arguments that they have to provide explicitely.

