# Sets

Sets are one of the main building blocks of the vocabulary and a powerful tool
to define other concepts.

It associates every property (along with the context it is evaluated with) with
a unique atom representing it and all arguments that makes the property true (the
members of the set). The core predicates modeling this are:

<spoiler>

__tcui:__ `[E:ma]` is the (non-empty) set of all things that individually satisfy
`[A:(a)]`.
---
```
po tcui ke ka be
```

We represent the set using a pair containing the property.

```
ke kin
  ve zai tcui
  fa ka
```

And there must exist something that satisfies the predicate represented by
__ka__.

```
  fi ma zu ka
```

</spoiler>

<spoiler>

__tcie:__ `[E:a]` is a member of set `[A:tcui a]`.
---
```
po tcie ke ka be
ma
  ve sae tcui ka
  fe ke zu ba
```

</spoiler>

## Subsets

We are now able to make sets from properties and speak about the members of
these sets. Here we can define a predicate for subsets.

<spoiler>
__tcia:__ `[E:tcui a]` is a subset of `[A:tcui a]`.

---
```
po tcia ke ka be
```

All members of __ke__

```
mao
  vie ki be varu
    vie ki tcie ke
```

Are also members of __ka__

```
    fia ki tcie ka
```
</spoiler>

We can also define predicates for various kinds of subsets which can be useful
to define vocabulary.

<spoiler>

__tcei:__ `[E:tcui a]` is a (non-empty) set of some things that individually satisfy `[A:(a)]`.
---
```
po tcie ke gia be
```

__ke__ is a subset of the set of all things that satisfy __gia__

```
ke tcia tcui gia
```
</spoiler>

<spoiler>

__tcai:__ `[E:tcui a]` is a set containing exactly one member which satisfies `[A:(a)]`.
---
```
po tcai ke gia be
```

__ke__ is a subset of the set of all things that satisfy __gia__

```
ma
  vi ke tcei gia
```

And it is false that there exists two distinct things that are members of __ke__

```
  fi bi ma
    vi bo ka tcie ke
    fi bo ko bi ka
    fi ko tcie ke
```
</spoiler>

<spoiler>

__tcoi:__ `[E:tcui a]` is a set of at least two things that individually satisfy `[A:(a)]`.
---
```
po tcia ke gia be
```

__ke__ is a subset of the set of all things that satisfy __gia__

```
ma
  vi ke tcei gia
```

And there exists at least two distinct things that are members of __ke__

```
  fi bo ka tcie ke
  fi bo ko bi ka
  fi ko tcie ke
```
</spoiler>

## Improved composability

Most of the vocabulary uses set arguments to handle distributive and collective
behavior. However, the above predicates use a property over a generic argument
instead of a set. To be used by the rest of the vocabulary, they must be
wrapped into sets. We'll thus define a series of predicates that performs this
wrapping automatically.

<spoiler>

__tca:__ `[E:tcai a]` is a set containing exactly one member and satisfies `[A:(tcai a)]`.
---
```
po tca ke gia be
ke se tcai gia
```
</spoiler>

<spoiler>

__tcu:__ `[E:tcui a]` is the (non-empty) set of all things that individually satisfy `[A:(tca a)]`.
---
```
po tcu ke gia be
```

__ke__ is the set of all things that are the only member of a set satisfying __gia__.

```
ke tcui
  via be ba tcie tca gia
```
</spoiler>

<spoiler>

__tce:__ `[E:tcei a]` is a (non-empty) set of some things that individually satisfy `[A:(tca a)]`.
---
```
po tce ke gia be
ke tcei
  via be ba tcie tca gia
```
</spoiler>

<spoiler>

__tco:__ `[E:tcoi a]` is a set of at least two things that individually satisfy `[A:(tca a)]`.
---
```
po tco ke gia be
ke tcoi
  via be ba tcie tca gia
```
</spoiler>

<spoiler>

__tci:__ `[E:tca a]` is a member of set `[A:tce a]`.
---
```
po tci ke ka be
ke tca tcie ka
```
</spoiler>

It is thus recommended to mostly use these "wrapped versions" unless accessing
the unwrapped members is necessary, which is the case when speaking about nested
sets (sets of sets).

## Locally largest/smallest

A very useful concept to define more complex vocabulary is that of a set that
satisfies some property such that there exists no superset that also satisfies
said property.

<spoiler>

__djo:__ `[E:tce a]` is the locally largest set that satisfies `[A:(tce a)]`.
---
```
po djo ke gia be
ma
  vi ke gia
  fi bi bo ka
    vi ka bi ke
    fi ka gia
    fi ke tcia ka
```
</spoiler>

We can define a similar word such that there exists no subset.

<spoiler>

__dju:__ `[E:tce a]` is the locally smallest set that satisfies `[A:(tce a)]`.
---
```
po dju ke gia be
ma
  vi ke gia
  fi bi bo ka
    vi ka bi ke
    fi ka gia
    fi ka tcia ke
```
</spoiler>