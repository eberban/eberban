# Few simple predicates

As a first step, we can define a few useful predicates using the core grammar
that will reduce the verbosity of other definitions. For example, we can define
predicates for the OR and AND logic gates that each take two propositions.

<spoiler>


__vari:__ True if both `[E:()]` and `[A:()]` are true. 
---
```
po vari ge ga be 
ge vi ga 
```
</spoiler>

<spoiler>


__vare:__ True if `[E:()]` or `[A:()]` or both is true.
---
```
po vare ge ga be
bi ma
  vi bi ge
  fi bi ga
```
</spoiler>

> It is very common to use the pattern `ma vi ... fi ...` instead of __vari__ as
> it is shorter to use and supports an arbitrary number of propositions by
> adding more `fi`. __vari__ can still be useful with a predicate that has a
> relation place. 

Another useful tool is the conditional claim (if ... then ... else ...) with
default arguments to make it work as logical implication.


<spoiler>

__varu:__ If `[E:()]` is true then `[A:()]` (default: true) is true, otherwise
`[O:()]` (default: true) is true. 
---
```
po varu ge ga go be
vare
  via vari
    vie ge
    fia ga
    vei
  fie vari
    vie bi ge
    fia go
poia varu mai
poio varu mai
```
</spoiler>

A more advanced but useful predicate is the transitive relation. Either E and A
satisfy the relation O _directly_ or there exists a chain of relations that
connect E to A. Transitive relation is used when there is a chain of many
relations, it can even handle a countable infinity of chained relations! It is
defined recursively.

<spoiler>

__kidvo:__ `[E:a]` and `[A:a]` satisfy relation `[O:(a,a)]` transitively.
---
```
po kidvo ke ka go be
```
Either _ke_ and _ka_ satisfy _go_ directly
```
vare
  vie ke go ka
```
Or there exist a _ki_ such that _ke_ and _ki_ satisfy _go_
```
  fia bo ki
    vi ke go ki
```
With _ki_ and _ka_ satisfying __transitively__ _go_ (either directly or again
transitively)
```
    fi ki kidvo
      va ka
      fio go
```
</spoiler>