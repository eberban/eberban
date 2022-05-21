# Dictionary conventions

## Notation

In the dictionary words meaning are given in english with arguments being
represented by vowels in brackets `[]`. The first time the vowel is used it
is followed by an annotation about its type and constraints.

Parenthesis `()` represents predicate arguments, where each argument constraint
is listen in between, separate by commas.

Otherwise the vowel can be followed by one or many eberban words, in which can
the place is constrained to satisfy the expressed property.

> Exemples of definitions:
>
> - `mi: [E:tce* man] is I/me/a speaker/author.`
> - `buri: [E:tce* den] eats [A:tce* den].`
> - `meon: [E:tce* den] is an apple.`
> - `[E:tcei a] is a (non-empty) set of some things that individualy satisfy [A:(tca a)].`
> - `mue: True if property [E:(ma)] is true with the context provided as argument.`
> - `mua: True if context [E:ma] makes [A:()] true.`

## Set arguments

Many predicates expects their arguments to be __sets__, which is expressed in
Eberban by the roots starting with _tc-_. __tce__ in particular states that it
is a non-empty set. In definitions a star `*` is added next to it when the
predicate use this set in a __distributive__ way, which means that the predicate
is also true if we provide a subset. Otherwise it is said to be __collective__,
and a set satisfying the predicate don't necessarily imply that a subset of
it will also satisfying the predicate.

Having mainly set arguments like so means that unless specified the amount of
members of the set is left vague. Thus, the sentence _mi buri meon_ could
equally mean the following :

- __I__ eat __one apple__.
- __We__ eat __one apple__.
- __I__ eat __multiple apples__.
- __We__ eat __multiple apples__.

It also doesn't specify which one the apples everyone is eating: __buri__ is
satisfied if everyone eats at least one of the apples, and every apple is eaten
by at least one.

This allows to be vague by default, which can be made more precise by adding
more words.

## Map arguments and context

Another kind of data structure used in eberban is a __map__ or __dictionary__,
which consist of a set of __keys__ each assiocated with a __value__. This allow
to "store" multiple information into a single atom. Since the context argument
is used to implement many features, it is thus using maps.

Definitions might refer to entries of such maps using the `@` symbol followed
by the name of the key. If `@` is used just after a vowel then it means the
vowel argument is map and the definition is refering to an entry of such map.
If there are no vowel before, it refers to an entry of the context argument.

Exemples will be given in later chapters when explaining concepts using contexts
or maps.