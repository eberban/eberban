# Few simple predicates

As a first step, we can define a few useful predicates using the core grammar
that will reduce the verbosity of other definitions. For exemple we can define
predicates for the OR and AND logic gates of 2 propositions.

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
> it shorter to use and support an arbitrary amount of propositions by adding
> more `fi`. This predicate can still be useful with a predicate having a
> relation place. 

Another useful tool is conditional claim (if ... then ... else ...), with
default arguments to make it work as logical implication.


<spoiler>

__varu:__ If `[E:()]` is then `[A:()]` (default: true) is true, otherwise
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
Alternatively, the GI variables can be replaced with KI. This replaces the `vi-`
particles with regular `ve/fe...etc` particles. This is because the arguments of
varu are already predicates.
```
po varu ke ka ko be
vare
  va vari
    ve ke
    fa ka
    vei
  fe vari
    ve bi ke
    fa ko
poia varu mai
poio varu mai
```
</spoiler>

A more advanced but useful predicate is about 2 things E and A satisfying a
relation O transitively: either they satisfy the relation directly or there
exist a chain of things that satisfy the relation to go from E to A. It is used
when there are many of those things in a chain, and also works for a (countable)
infinity of things. It is defined recursively.

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