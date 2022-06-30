# Few simple predicates

As a first step, we can define a few useful predicates using the core grammar
that will reduce the verbosity of other definitions. For exemple we can define
predicates for the OR and AND logic gates of 2 propositions.

> vari: True if both `[E:()]` and `[A:()]` are true.
> ```
> po vari ge ga be
> ge vi ga
> ```
> It is however very common to use the pattern `ma vi ... fi ...` as it
> shorter to use and support an arbitrary amount of propositions by
> adding more `fi`.

> vare: True if `[E:()]` or `[A:()]` or both is true.
> ```
> po vare ge ga be
> bi ma
>   vi bi ge
>   fi bi ga
> ```

Another useful tool is conditional claim (if ... then ... else ...), with
default arguments to make it work as logical implication.

> varu: If `[E:()]` is then `[A:()]` (default: true) is true, otherwise
> `[O:()]` (default: true) is true.
> ```
> po varu ge ga be
> vare
>   va vari
>     ve ge
>     fa ga
>     vei
>   fe vari
>     ve bi ge
>     fa go
> poia varu mai
> poio varu mai
> ```

A more advanced but useful predicate is about 2 things E and A satisfying a
relation O transitively: either they satisfy the relation directly or there
exist a chain of things that satisfy the relation to go from E to A. It is used
when there are many of those things in a chain, and also works for a (countable)
infinity of things. It is defined recursively.

> kidvo: `[E:a]` and `[A:a]` satisfy relation `[O:(a,a)]` transitively.
> ```
> po kidvo ke ka go be
> ```
> Either _ke_ and _ka_ satisfy _go_ directly
> ```
> vare
>   vie ke go ka
> ```
> Or there exist a _ki_ such that _ke_ and _ki_ satisfy _go_
> ```
>   fia bo ki
>     vi ke go ki
> ```
> With _ki_ and _ka_ satisfying __transitively__ _go_ (either directly or again
> transitively)
> ```
>     fi ki kidvo
>       via ka
>       fio go
> ```

<!-- Another useful concept is uniqueness which is often used to define chains.

> zoni: Among the things that satisfy `[E:(a)]` only `[O:a]` satisfy `[A:(a)]`.
>
> ```
> po zoni ge ga ko be
> ```
> __ko__ satisfy both __ge__ and __ga__
> ```
> ma
>   vi ko ge
>   fi ko ga
> ```
> And for any __ki__
> ```
>   fi mae
>     ve ki be
> ```
> If the following points are true:
> - __ki__ and __ko__ are different
> - __ki__ satisfy __ge__
> ```
>       varu
>         ve ma
>           vi bi ki ko
>           fi ki go vei
> ```
> Then __ki__ doesn't satisfy __ga__
> ```
>         fa bi ki ga
> ``` -->