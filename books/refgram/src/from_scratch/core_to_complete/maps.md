# Maps

There are many cases where lots of information must be aggregated into a single
and easily accessible thing. Data structures defined thus far aren't ideal:
pairs become verbose when deeply nested, and lists require associating values to
indices that cannot be skipped. So we use maps.

__Maps__ (also called __dictionaries__) are another important data structure
that contain zero to many __entries__ composed of a __key__ and a __value__,
with the additional constraint that there cannot be two different entries with
the same key.

Maps are also an obvious choice for context parameters as they allow easily
implementing new concepts by storing information in the map with a new dedicated
key.

<spoiler>

__kagvin:__ `[E:ma]` is a map.
---
```
po kagvin ke be
```
__ke__ is either an empty map (represented by `zai kagvin`)
```
vare
  vie ke zai kagvin
```
Or a pair with an identifier on the left
```
  fia ma
    vi ke sea kin zai kagvin
```
And on the right a set of entries (defined as pairs), of which each has a key on
the left
```
    fi ke seo kin tcei sea kin ma
```
And it is false that there are multiple entries with the same key
```
    fi bi ma
      vi bo ka tcie soe kin ke
      fi bo ko tcie soe kin ke
      fi ka bi ko
      fi ka sea kin sae kin ko
```
</spoiler>

<spoiler>

__kagvil:__ `[E:kagvin]` is the empty map.
---
```
po kagvil zai kagvin
```
</spoiler>

We can then interact more directly with entries using the following:

<spoiler>

__kagve:__ `[E:a]` is the value in map `[A:kagvin]` for key `[O:ma]`.
---
```
po kagve ke ka ko be
tcie
  va soe kin ka kagvin
  fe kin
    ve ko
    fa ke
```
</spoiler>

Finally we set the empty map as the context parameter for future sentences.

```
pae kagvil
```

We can make a variant of _kagve_ to directly access a value stored in the
context.

<spoiler>

__kagvei:__ `[E:a]` is the value in the context map for key `[A:ma]`.
---
```
po kagvei ke ka be
mue vie ki be ke kagve
  va ki
  fo ka
```
</spoiler>

Future predicates will thus be able to modify the context with a specific key
without messing with other predicates relying on the context (by using their own
different key).

## Map operations

It is then useful to be able to make a map from another one with some
modification.

<spoiler>

__kagvani:__ `[E:kagvin]` is obtained from `[A:kagvin]` by removing the entry with key
`[O:ma]`. If `[A]` doesn't have entry with key `[O]` then `[E]` = `[A]`.
---
```
po kagvani ke ka ko be
```
The set of entries of _ke_ is the largest subset of the set of entries of _ka_
that doesn't contain an entry with key _ko_.
```
ke kagvin seo kin djo
  via ke be ma
    vi ke tcai soe kin ka
    fi bi ke sae tci sae kin ko
```
</spoiler>

<spoiler>

__kagvoi:__ `[E:kagvin]` is obtained from `[A:kagvin]` by inserting an entry
with key `[O:ma]` and value `[U:ma]`. If `[A]` has an entry with key `[O]` then
it is removed to insert the entry with key `[O]` and value `[U]`.
---
```
po kagvoi ke ka ko ku be
```
Given _x_ the map obtained from _ka_ by removing an entry with key _ko_, the
set of entries of _ke_ is the smallest superset of _x_ such that _ke_ has an
entry with key _ko_ and value _ku_ as a member.
```
ke kagvin seo kin dju
  via ke be kagvoi
    va ka
    fo ko
    fe seo kin tcai ke sae tci kin
      ve ko
      fo ku
```
</spoiler>

<spoiler>

__kagvui:__ `[E:kagvin]` is obtained from `[A:kagvin]` by transforming the value
of the entry with key `[O:ma]` using relation `[U:(a,a)]`. It implies that `[A]`
must have an entry with key `[O]`.
---
```
po kagvui ke ka ko gu be
ke kagvoi
  va ka
  fo ko
  fu gu kagve
    va ka
    fo ko
```
</spoiler>

## Ergonomic map operations

The above predicates are pretty verbose to use, especially if multiple
operations must be performed in a row. For this reason, we're going to define
more ergonomic versions that manage the transformed map using the context. The
predicate `kagva` will take as arguments an input and an output map and __a list
of 0-ary predicates__. This list will be folded and evaluated with a modified
context containing the input and output map (at each step of the iteration),
which will be used by predicates taking the other parameters explicitly (key and
value, no need to take input and output as they are retreived from the context).

<spoiler>

__kagva:__ `[E:kagvin]` represents a map that can be obtained from `[O:kagvin]`
(default: empty map) by applying the list of transformations `[A:blu ()]`.
---
```
po kagva ke ka ko be
```
We fold the list _ko_ with input _ke_, output _ka_ and predicate
_(kie,kia,gia)_, with _kie_ and _kia_ being the input/intermediary/output maps
and _gia_ being one of the propositions in the list (they are folded in order).
```
ka bla
  va ke
  fo ko
  fiu kie kia gia be
```
We take the current context _ki_
```
    mue vie ki be
```
And evaluate _gia_ (the proposition in the list) with a context that is
obtained from _ki_ by inserting the pair _(kie,kia)_ at key _zai kagva_.
```
      mua
        va gia
        fe kagvoi
          va ki
          fo zai kagva
          fu kin
            va kie
            fo kia
```
We finally set the default O argument, which simplifies creating from empty maps.
```
poio kagva kagvil
```
</spoiler>

We can then write predicates that use this pair instead of taking arguments.

<spoiler>

__kagvan:__ Remove entry with key `[E:ma]`.
---
```
po kagvan ke be
ke so kagvani
  va sae kin kagvei zai kagva
  fe soe kin kagvei zai kagva
```
</spoiler>

<spoiler>

__kagvo:__ Insert entry with key `[E:ma]` and value `[A:a]`.
---
```
po kagvo ke ka be
ke so kagvoi
  va sae kin kagvei zai kagva
  fe soe kin kagvei zai kagva
  fo ka
```
</spoiler>

<spoiler>

__kagvu:__ Transform entry with key `[E:ma]` with value relation (old,new)
`[A:(a,a)]`.
---
```
po kagvu ke ga be
ke so kagvui
  va sae kin kagvei zai kagva
  fe soe kin kagvei zai kagva
  fo ga
```
</spoiler>

With these predicates we can write stuff like:
```
po ga ke ka be
ke kagva
  vo ka
  fa zai ti kagvan
  bu zai te kagvo ma
  bu zai ta kagvu tcia
```

_ka_ is thus _ke_ with:
- Key _zai ti_ removed
- Key _zai te_ inserted with some atom as its value
- Key _zai ta_ transformed such that the old value is a subset of the new
  value

Since we use maps for context it is fairly common to evaluate a proposition
with a modified context. We can make a predicate mkae this easier.

<spoiler>

__kagvar:__ Transformations `[E:blu ()]` are applied on the context before it is
used to evaluate `[A:()]`.
---
```
po kagvar ke gia be
mue
  ve ki be mua
    va gia
    fe kagva
      va ki
      fo ke
```
</spoiler>