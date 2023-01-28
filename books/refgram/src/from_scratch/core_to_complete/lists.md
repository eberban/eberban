# Lists

Lists are data structures that contains items in a __specific order__. They
are defined internally as linked lists via nested pairs.

A list is either the empty list or a pair with an item of said list as the left
component and another list as the right component.

<spoiler>

__blur:__ `[E:ma]` is the empty list.
---
```
po blur zai blun
```
</spoiler>

<spoiler>

__blun:__ `[E:ma]` is a list.
---
```
po blun ke be
```
__ke__ is either the empty list
```
vare
  vie ke blur
```
Or a pair whose right component is a list.
```
  fia ke seo kin blun
```
</spoiler>

Most of the time we'll deal with lists of things of the same type and satisfying
a common property.

<spoiler>

__blu:__ `[E:blun]` is a list of things all satisfying `[A:(a)]`.
---
```
po blu ke gi be
vare
  vie ke zai blun
  fia ma
    vi ke sea kin gi
    fi ke seo kin blu gi
```
</spoiler>

## BU grammar

From that definition we can now enable the __bu__ list grammar like so

<spoiler>

`<A> bu <B> bu <C>` is equivalent to:
---
```
pe se kin
  va <A>
  fo kin
    va <B>
    fo kin
      va <C>
      fo zai blun
pei
```
</spoiler>

## Fold

An important operation on lists is called __fold__. This allows iterating over
the list to evaluate a predicate with a value carried between iterations.

It's arguments are:
- the list to fold
- the initial carry value
- the final carry value
- the predicate to apply for each element, which takes as arguments:
  - the input carry value
  - the output carry value
  - the element of the list

The provided predicate is applied to each element, with the output carry for an
element being the input carry for the next element. For the first item the input
is the initial carry, and for the last item the output is the final carry.

> Since the predicate will be applied to each value of the list, it adds the
> constraint that all the elements of the list have the same type.

There are two variants of __fold__, left-to-right (first to last) and
right-to-left (last to first).

<spoiler>

__bla:__ Left folds list `[E:blu a]` with initial `[A:b]` and final `[O:b]`
carries by applying predicate `[U:(b,b,a)]` in first to last order.
---
```
po bla ke ka ko gu be
```
Either __ke__ is an empty list, in which case the initial and final carry values
are the same.
```
vare
  vie ke zai blun
    vi ka ko vei
```
Or __ke__ is a list with element __x__, and there exists a __ki__ such that
__gu(ka,ki,x)__ and __ki__ is the initial value of a left fold on the rest of
the list.
```
  fie ke zi zai blun
    vi ma
      vi bo ki
      fi ka gu va ki fo sae kin ke vei
      fi bla
        ve soe kin ke
        fa ki
        fo ko
        fu gu
```
</spoiler>

<spoiler>

__blai:__ Right folds list `[E:blu a]` with initial `[A:b]` and final `[O:b]`
carries by applying predicate `[U:(b,b,a)]` in last to first order.
---
```
po blai ke ka ko gu be
```
Either __ke__ is an empty list, in which case the initial and final carry values
are the same.
```
vare
  vie ke zai blun
    vi ka ko vei
```
Or __ke__ is a list with element __x__, and there exists a __ki__ such that
__gu(ki,ko,x)__ and __ki__ is the final value of a right fold on the rest of the
list.
```
  fie ke zi zai blun
    vi ma
      vi bo ki
      fi ki gu va ko fo sae kin ke vei
      fi blai
        ve soe kin ke
        fa ka
        fo ki
        fu gu
```
</spoiler>

## Various list operations

Thanks to these predicates we can easily define list concatenation.

<spoiler>

__ble:__ `[E:blu a]` is the concatenation of all lists in list `[A:blu blu a]` in order.
---
We first define predicate __ge__ with meaning:
`[E:blu a]` is the concatenation of lists `[A:blu a]` and `[O:blu a]`.
```
po ge ke ka ko be
so blai
  ve ka
  fa ko
  fiu kie kia kio be
    kia kin
      ve kio
      fa kie
```

We then define __ble__ using the above predicate:
```
po ble ke ka be
ka bla
  va ke
  fo blur
  fu kie kia kio be
    kie ge
      va kio
      fo kia
```
</spoiler>

And even inclusion.

<spoiler>

__bla:__ `[E:blu a]` is included/contained in `[A:blu a]`.
---
```
po bla ke ka be
ka ble
  vo ble
    fa ke
```
</spoiler>

We can allow speakers to quickly define sets using the list grammar
with the following predicate.

<spoiler>

__blo:__ `[E:tce a]` is the set of all the elements in list `[A:blu a]`.
---
We first define a predicate ensuring that __ke__ is a set containing alls
elements in list __ka__.
```
po ga ke ka be
ka bla
  va ke
  fiu kie kia kio be
    kio tcie kie
```
Then we use it to define __bli__ such that __ke__ is the __smallest__ set
containing all elements in list __ka__ (so it can't be any set that contains
them plus additional members that are not in the list).
```
po blo ke ka be
ma vi ke ga ka
  fi bi ma
    ve bi ke ga ka
    fe tcia ke
```
</spoiler>

As the vocabulary is designed around set arguments, it is also useful to
express the set which is the union of a list of sets.

<spoiler>

__bli:__ `[E:tce a]` is the union of all sets in list `[A:blu tce a]`.
---
```
po bli ke ka be
ke dju
  via ki be ka bla
    viu ba ba ko be ko tcia ki
```
</spoiler>

> Example of usage (with full grammar and vocabulary):\
> `mi dona bli va za ualisi bu za ubobo`\
> I like Alice and Bob.