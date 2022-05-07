# Chaining and explicit binding

## Definitions

Other explicit arguments are represented by the vowels E, A, O and U in order,
and definitions in english describe their relation, types and constraints like
so:

- `mi: [E:tce* man] is I/me/a speaker/author.`
- `buri: [E:tce* den] eats [A:tce* den].`
- `meon: [E:tce* den] is an apple.`
- `mian: [E:tce* den] is a cat.`
- `jvin: [E:tce* den] dances.`

> `tce` is the word for set/group, with `*` being a notation for distributive
> behavior (each member of the group satisfies the predicate, instead of the
> group as a whole). `man` is the word for an atom, and `den` a word for a
> physical entity/object. Those places thus represents sets/groups of
> atoms/physical entities.
> 
> To simply translations, `tce*` places will usually be translated as singular
> (group of 1), however no number is implied and it could actually refer to more
> than one thing.

## Chaining

The language don't expose existential variables like nouns would be used with a
verb. Instead, predicates are connected together to express that some
existential variable is shared between them in specific arguments places.

When strung one after the other the following rules apply:

- if the predicate word ends with a sonorant (n/r/l), it binds its E places to
  the predicate before and after it. This is called __intransitive behavior__
  (it doesn't change place). Chaining multiple intransitive predicates thus adds
  information on the same thing.
- if the predicate word don't end with a sonorant, it binds its E place to the
  predicate before it, and binds its A place to the predicate after it. This is
  called __transitive behavior__.
- some particles (such as _mi_) also acts as predicates and follow different
  rules which will be detailed later.

> The word shape is thus choosen depending on which transitivity is more
> practical given the meaning and expected usage.

In all the above cases the place is bound to the E place of the following
predicate.

```gloss
mi buri meon

mi buri meon

{E:$(x) is me} {E:$(x) eats A:$(y)} {A:$(y) is an apple}

I eat an apple.
```

## Explicit binding

If those places are not the ones we want, we can use particles in family __VI__
(all particles starting with _v-_) to chose which place of the predicate on
their left should be used.

```gloss
mi buri ve mian

mi buri ve mian

{E:$(x) is me} {E:$(x) eats A:$(y)} {bind eats:E:$(x)} {E:$(x) is a cat}

I eat something and am a cat.
```

If we want to bind again _buri_ (same place or another one) we can use particles
in family __FI__ (all particles starting with _f-_) :

```gloss
mi buri ve mian fa meon

mi buri ve mian fa meon

{E:$(x) is me} {E:$(x) eats A:$(y)} {bind eats:E:$(x)} {E:$(x) is a cat}
{bind eats:A:$(y)} {E:$(y) is an apple}

I am a cat and eat an apple.
```

> Note than the sentence could be simplified as *mi mian buri (va) meon*, or
> even *mian mi buri meon* (the order of consecutive intransitive predicates is
> irrelevant).
> 
> VI/FI is often needed to use predicates with O and U places.
>
> __vei__ can be used instead of a __FI__ to bind the normal chained place. It
> also closes the scope started by a __VI__, which is important when multiple
> __VI__ are nested as it allows to use __FI__ to refer to an outer __VI__.
>
> __vi/fi__ binds the last place of a predicate. It is useful as many predicate
> expose by convention an __event__ as their last place.
>
> __vai/fai__ binds no place at all, and is useful to express that 2 sentences
> are true together even if they don't share any variables.

## Chaining modification

Particles of family __SI__ (all particles starting with _s-_) allow to locally
modify the chaining rules defined above. Particles __se, sa, so, su__ binds
their respective vowel place with the predicate before and after.

For __SI__ members with two vowels like __sea, sao, ...__, the first vowel
specify the place for the predicate before, and the second vowel for the
predicate after.

```gloss
mi buri sae buri mian

mi buri sae buri mian

{E:$(x) is me} {E:$(x) eats A:$(y)} {A>E chaining} {E:$(z) eats A:$(y)}
{E:$(z) is a cat}

I eat what is eaten by a cat.
```

> When you're only interested by binding 2 places which don't follow the
> default chaining behavior, it is simpler to use __SI__ than __VI/FI__.