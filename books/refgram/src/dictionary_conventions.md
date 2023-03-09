# Dictionary conventions

## Notation

The dictionary makes the distinction between meaning and definition.

### Meaning

The meaning of each word is written in English with arguments
being represented by vowels in brackets `[]`.

The first time the vowel is used it is followed by one or more Eberban words.
These words denote the vowel's type and constraints. Single letters like `a` can
be used to represent an argument's generic type.

The same letter used in multiple places means the arguments share the same type.

Parentheses `()` represent predicate arguments (as opposed to atom or generic arguments),
where each argument constraint is listed in between, separated by commas.

> Exemples of meanings:
>
> - `mi: [E:tce* man] is I/me/a speaker/author.`
> - `buri: [E:tce* den] eats [A:tce* den].`
> - `meon: [E:tce* den] is an apple.`
> - `[E:tcei a] is a (non-empty) set of some things that individualy satisfy [A:(tca a)].`
> - `mua: True if context [E:ma] makes [A:()] true.`

### Definition

The definition of each word is written in Eberban. Defenitions either have an
argument list or re-export the places of the left-most predicate in the chain.

## Set arguments

Many predicates expect their arguments to be __sets__, which is expressed in
Eberban by the roots starting with _tc-_. __tce__ in particular states that it
is a non-empty set. In definitions, a star `*` is added next to it when the
predicate uses this set in a __distributive__ way, which means that the predicate
is also true if we provide a subset. Otherwise it is said to be __collective__,
and a set satisfying the predicate doesn't necessarily imply that a subset of
it will also satisfy the predicate.

Having mainly set arguments like so means that, unless specified, the number of
members of the set is left vague. Thus, the sentence _mi buri meon_ could
equally mean the following :

- __I__ eat __one apple__.
- __We__ eat __one apple__.
- __I__ eat __multiple apples__.
- __We__ eat __multiple apples__.

It also doesn't specify _which_ apples everyone is eating: __buri__ is
satisfied if everyone eats at least one of the apples, and every apple is eaten
by at least one.

This allows the speaker to be vague by default. This can be made more precise by
adding more words.

> For simplicity, translations will be written in singular unless it is
> important to make the distinction.

<!-- ## Map arguments and context

Another kind of data structure used in eberban is a __map__ or __dictionary__,
which consist of a set of __keys__ each assiocated with a __value__. This allow
to "store" multiple information into a single atom. Since the context argument
is used to implement many features, it is thus using maps.

Definitions might refer to entries of such maps using the `@` symbol followed
by the name of the key. If `@` is used just after a vowel then it means the
vowel argument is map and the definition is refering to an entry of such map.
If there are no vowel before, it refers to an entry of the context argument.

Exemples will be given in later chapters when explaining concepts using contexts
or maps. -->