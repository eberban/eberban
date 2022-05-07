# Sentences (p-)

The speaker can assert some proposition is true by starting a sentence with
__pa__. If the first sentence is not started by any particle starting with _p-_
then __pa__ is infered.

The __PO__ family allow to define custom predicates. __PO__ is followed by the
word being defined, which can be a root, compound, __GI__ or an assignable name
(which have the same form as borrowings but starts with a _i-_ instead of _u-_).
It is then followed by the definition itself, which can be prefixed by an
argument list if needed.

While __po__ simply make a definition, __poi__ allow to ask questions by
defining a predicate the interlocutor is supposed to use. If the defined
predicate don't have arguments it is asked whether the proposition is true or
false. Otherwise it is asked to provide arguments that make the predicate true.

## Example

Alice says:
```gloss
po ga spua mi

po ga spua mi

{Def:} {"ga"} {E:$(x) is a house of A:$(y)} {E:$(y) is me}

ga = `[E] is a house of [A] which is me.` / `[E] is my ([A]) house.`
```

```gloss
poi ge be mo dona ga

poi ge be mo dona ga

{Question:} {"ge"} {end of argument list} {E:$(x) is you} {E:$(x) likes A:$(y)} {E:$(y) is my (A:$(z)) house}

ge = Do you like my house?
```

Bob answers:
```gloss
pa ge

pa ge

{Assert:} {I like your house}

Yes.
```

> While __po__ takes the context parameter from where it is used, __poi__
> captures the context from the definition point, and the context when used
> is ignored. __poe__ can be used to simply define a predicate which capturing
> the context from the definition point.