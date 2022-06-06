# Few simple predicates

As a first step, we can define a few useful predicates using the core grammar
that will reduce the verbosity of other definitions. For exemple we can define
predicates for the OR and AND logic gates of 2 propositions.

> vari: True if both `[E:()]` and `[A:()]` are true.
> ```
> po vari ge ga be
> ge vai ga
> ```
> It is however very common to use the pattern `ma vai ... fai ...` as it
> shorter to use and support an arbitrary amount of propositions by
> adding more `fai`.

> vare: True if `[E:()]` or `[A:()]` or both is true.
> ```
> po vare ge ga be
> bi ma
>   vai bi ge
>   fai bi ga
> ```

Then another useful tool is logical implication (if ... then ...). If
proposition E is true then A must also be true. If E is false then logical
implication is true. This operator is useful to restrict universal claims (for
all) to only when E is true.

> varu: `[E:()]` implies that `[A:()]` is true.
> ```
> po varu ge ga be
> ma
>   vai bi ge
>   fai ga
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
>     vai ke go ki
> ```
> With _ki_ and _ka_ satisfying __transitively__ _go_ (either directly or again
> transitively)
> ```
>     fai ki kidvo
>       via ka
>       fio go
> ```

Another useful concept is uniqueness which is often used to define chains.

> zoni: Among the things that satisfy `[E:(a)]` only `[O:a]` satisfy `[A:(a)]`.
>
> ```
> po zoni ge ga ko be
> ```
> __ko__ satisfy both __ge__ and __ga__
> ```
> ma
>   vai ko ge
>   fai ko ga
> ```
> And for any __ki__
> ```
>   fai mae
>     ve ki be
> ```
> If the following points are true:
> - __ki__ and __ko__ are different
> - __ki__ satisfy __ge__
> ```
>       varu
>         ve ma
>           vai bi ki ko
>           fai ki go vei
> ```
> Then __ki__ doesn't satisfy __ga__
> ```
>         fa bi ki ga
> ```