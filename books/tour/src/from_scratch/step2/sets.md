# Sets

Sets are one of the main building blocks of the vocabulary, and a powerful tool
to define other concepts.

It associates every property (along with the context it is evaluated with) with
a unique atom representing it and all arguments that makes the property true (the
members of the set). The core predicates modeling this are:

- tcui: `[E:ma]` is the (non-empty) set of all things that individualy satisfy
  `[A:(a)]`.
- tcie: `[E:a]` is a member of set `[A:tcui a]`.

## Axiom

Defining sets using only __po__ is however not possible, as __tcui__ and
__tcie__ depends on each other to be defined. Instead we need to define a
proposition stating that thoses predicates exists and satisfy the constraints of
sets and membership, and use __pi__ to make this proposition an __axiom__, which
is assumed to be true.

> We first define the proposition of the axiom, which by convention is named
> with a compound made from one of the defined predicates and the particle for
> axioms __pi__.
> ```
> po e tcui pi be
> ```
> We then state that predicates __tcui__ and __tcie__ exist:
> ```
> ma
>   vi bo tcui
>   fi bo tcie
> ```
> Then for every property __gi__ (we express it is a property by providing it
> one generic argument (mai). However it means that __gi__ must be true for at
> least one argument. Thus, there will be no concept of an empty set).
> ```
>   fi mae
>     ve gi be varu
>       vie gi mai
> ```
> Then for every context __ki__ (which is a atom)
> ```
>       fia mae
>         ve ki be varu
>           vie ki ma
>           fie ki mua
> ```
> There exist a set __ke__ representing this property (with this context)
> ```
>             ma
>               vi bo ke tcui gi
> ```
> And for all __ka__, __ka__ is a member of set __ke__ if and only if __ka__
> satisfy __gi__
> ```
>               fi mae
>                 ve ka be mai
>                   vie ka tcie ke
>                   fie ka gi
> ```
> In the current state the proposition claims that such predicates exists, but
> there is no way to prove it (thus the truth value is unknown). It is now time
> to use __pi__ to make it __axiomatically true__.
>
> ```
> pi e tcui pi
> ```

## Subsets

We are now able to make sets from properties, and to speak about the members
of those sets. From those we can define a predicate for subsets.

> tcia: `[E:tcui a]` is a subset of `[A:tcui a]`.
>
> ```
> po tcia ke ka be
> ```
>
> All members of __ke__
>
> ```
> mae
>   ve ki be varu 
>     vie ki tcie ke
> ```
>
> Also are members of __ka__
>
> ```
>     fia ki tcie ka
> ```

We can also define predicates for various kinds of subsets which can be useful
to define vocabulary.

> tcei: `[E:tcui a]` is a (non-empty) set of some things that individualy satisfy `[A:(a)]`.
>
> ```
> po tcie ke gia be ...
> ```
>
> __ke__ is a subset of the set of all things that satisfy __gia__
>
> ```
> ke tcia tcui gia
> ```

> tcai: `[E:tcui a]` is a set containing exactly one member which satisfy `[A:(a)]`.
>
> ```
> po tcia ke gia be ...
> ```
>
> __ke__ is a subset of the set of all things that satisfy __gia__
>
> ```
> ma vi ke tcei gia ...
> ```
> 
> And it false that there exist 2 distinct things that are members of __ke__ 
> 
> ```
> fi bi ma
> vi bo ka tcie ke
> fi bo ko bi ka
> fi ko tcie ke
> ```

> tcoi: `[E:tcui a]` is a set of at least 2 things that individualy satisfy `[A:(a)]`.
>
> ```
> po tcia ke gia be ...
> ```
>
> __ke__ is a subset of the set of all things that satisfy __gia__
>
> ```
> ma vi ke tcei gia ...
> ```
> 
> And there exist (at least) 2 distinct things that are members of __ke__ 
> 
> ```
> fi bo ka tcie ke
> fi bo ko bi ka
> fi ko tcie ke
> ```

## Improved composability

Most of the vocabulary use set arguments to handle distributive and collective
behavior. However the above predicates use a property over a generic argument
instead of a set, meaning that set-based predicates cannot be used in it
without wrapping this argument into a set. We'll thus define a serie of
predicates that performs this wrapping.

> tca: `[E:tcai a]` is a set containing exactly one member, and satisfy `[A:(tcai a)]`.
>
> ```
> po tca ke gia be
> ke se tcai gia
> ```

> tcu: `[E:tcui a]` is the (non-empty) set of all things that individualy satisfy `[A:(tca a)]`.
>
> ```
> po tcu ke gia be ...
> ```
>
> __ke__ is the set of all things that are the only member a set satisfying __gia__.
>
> ```
> ke tcui via be ba tcie tca gia
> ```

> tce: `[E:tcei a]` is a (non-empty) set of some things that individualy satisfy `[A:(tca a)]`.
>
> ```
> po tce ke gia be
> ke tcei via be ba tcie tca gia
> ```

> tco: `[E:tcoi a]` is a set of at least 2 things that individualy satisfy `[A:(tca a)]`.
>
> ```
> po tco ke gia be
> ke tcoi via be ba tcie tca gia
> ```

> tci: `[E:tca a]` is a member of set `[A:tce a]`.
>
> ```
> po tci ke ka be
> ke tca tcie ka
> ```

It is thus recommanded to mostly use those "wrapped versions" unless accessing
to the unwrapped members is necessary, which is the case when speaking about
nested sets (sets of sets). 

## Set operations

We can also define predicates for the set operations __union__, __intersection__
and __difference__.

> dji: `[E:tce a]` is the union of sets `[A:tce a]` and `[O:tce a]`.
> ```
> po dji ke ka ko be
> ke tcu
>   va ki be vare
>     ve ki tci ka
>     fa ki tci ko
> ```

> dje: `[E:tce a]` is the intersection of sets `[A:tce a]` and `[O:tce a]`.
> ```
> po dje ke ka ko be
> ke tcu
>   va ki be vari
>     ve ki tci ka
>     fa ki tci ko
> ```

> dja: `[E:tce a]` is the difference between sets `[A:tce a]` and `[O:tce a]`.
> ```
> po dja ke ka ko be
> ke tcu
>   va ki be vari
>     ve ki tci ka
>     fa bi ki tci ko
> ```

Another common concept is the largest unique set that satisfy some property.
There doesn't exist another that that contains it and also satisfy the
property.

> djo: `[E:tce a]` is the largest unique set that satisfy `[A:(tce a)]`.
> ```
> po djo ke gia be
> ma
>   vi ke gia
>   fi bi bo ka
>     vi ka bi ke
>     fi ka gia
>     fi ke tcia ka
> ```

Same with the smallest unique set:

> dju: `[E:tce a]` is the smallest unique set that satisfy `[A:(tce a)]`.
> ```
> po dju ke gia be
> ma
>   vi ke gia
>   fi bi bo ka
>     vi ka bi ke
>     fi ka gia
>     fi ka tcia ke
> ```