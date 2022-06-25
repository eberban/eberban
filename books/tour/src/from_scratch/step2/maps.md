# Maps

__Maps__ (also called __dictionaries__) are another important data structure
that contains 0 to many __entries__ composed of a __key__ and a __value__, with
the additional constraint that there cannot be 2 different entries with the same
key.

Maps are usefull in many cases where many informations must be aggregated into a
single thing and easily accessible (pairs are verbose to use when deeply nested,
and lists requires to associate values to indexes which cannot be skipped). Maps
are an obvious choice for context parameters, as they allow to easily implement
new concepts by storing information in the map with a new dedicated key.

> kcin: `[E:ma]` is a map.
> ```
> po kcin ke be
> ```
> __ke__ is either an empty map (represented by `zai kcin`)
> ```
> vare
>   vie ke zai kcin
> ```
> Or a pair with a left identifier
> ```
>   fia ma
>     vai ke sea kin zai kcin
> ```
> And as right part a set of pairs with left parts (keys) being symbols
> ```
>     fai ke seo kin tcei sea kin ma
> ```
> And it is false that there are multiple entries with the same key
> ```
>     fai bi ma
>       vai bo ka tcie soe kin ke
>       fai bo ko tcie soe kin ke
>       fai ka bi ko
>       fai ka sea kin sae kin ko
> ```

> kcil: `[E:kcin]` is the empty map.
> ```
> po kcil zai kcin
> ```

We can then interact more directly with entries using the following:

> kce: `[E:a]` is the value in map `[A:kcin]` for key `[O:ma]`.
>
> ```
> po kce ke ka ko be
> tcie
>   va soe kin ka kcin
>   fe kin
>     ve ko
>     fa ke
> ```

Finally we set the empty map as the context parameter for future sentences.

> ```
> pae kcil
> ```

We can make a variant of _kce_ to directly access a value stored in the
context.

> kcei: `[E:a]` is the value in the context map for key `[A:ma]`.
> ```
> po kcei ke ka be
> mue vie ki be ke kce
>   va ki
>   fo ka
> ```

Future predicates will thus be able to modify the context with a specific key
without messing with other predicates relying on the context (by using their own
different key).

## Map operations

It is then useful to be able to make a map from another one with some
modification.

> kcani: `[E:kcin]` is obtained from `[A:kcin]` by removing the entry with key
> `[O:ma]`. If `[A]` don't have entry with key `[O]` then `[E]` = `[A]`.
> ```
> po kcani ke ka ko be
> ```
> The set of entries of _ke_ is the largest subset of the set of entries of _ka_
> that doesn't contain an entry with key _ko_.
> ```
> ke kcin seo kin djo
>   via ke be ma
>     vai ke tcai soe kin ka
>     fai bi ke sae tci sae kin ko
> ```

> kcoi: `[E:kcin]` is obtained from `[A:kcin]` by inserting an entry with key
> `[O:ma]` and value `[U:ma]`. If `[A]` have an entry with key `[O]` then it is
> removed to insert the entry with key `[O]` and value `[U]`. 
> ```
> po kcoi ke ka ko ku be
> ```
> Given _x_ the map obtained from _ka_ by removing an entry with key _ko_, The
> set of entries of _ke_ is the smallest superset of _x_ such as _ke_ have as
> member an entry with key _ko_ and value _ku_.
> 
> ```
> ke kcin seo kin dju
>   via ke be kcoi
>     va ka
>     fo ko
>     fe seo kin tcai ke sae tci kin
>       ve ko
>       fo ku
> ```

> kcui: `[E:kcin]` is obtained from `[A:kcin]` by transforming the value of
> entry with key `[O:ma]` using relation `[U:(a,a)]`. It implies that `[A]` must
> have an entry with key `[O]`.
> ```
> po kcui ke ka ko gu be
> ke kcoi
>   va ka
>   fo ko
>   fu gu kce
>     va ka
>     fo ko
> ```

## Ergonomic map operations

The above predicates are pretty verbose to use, especially if multiple
operations must be performed in a row. For that reason we're going to define
more ergonomic versions that manage the transformed map using the context. The
predicate `kca` will take as arguments the input and output maps and __a list of
0-ary predicates__. This list will be folded and evaluated with a modified
context containing the input and output map (at each step of the iteration),
which will be used by predicates taking the other parameters explicitly (key and
value, no need to take input and output as they are retreived from the context).

> kca: `[E:kcin]` represents a map that can be optained from `[A:kcin]` by
> applying the list of transformations `[O:blu ()]`.
> ```
> po kca ke ka ko be
> ```
> We fold the list _ko_ with input _ke_, output _ka_ and predicate
> _(kie,kia,gia)_, _kie_ and _kia_ being the input/intermediary/output maps and
> _gia_ being one of the proposition in the list (they are folded in order).
> ```
> ko bla
>   va ke
>   fo ka
>   fiu kie kia gia be
> ```
> We take the current context _ki_
> ```
>     mue vie ki be   
> ```
> And evaluate _gia_ (the proposition in the list) with a context that is
> obtained from _ki_ by inserting the pair _(kie,kia)_ at key _zai kca_.
> ```
>       mua
>         va gia
>         fe kcoi
>           va ki
>           fo zai kca
>           fu kin
>             va kie
>             fo kia
> ```

We can then write predicates that uses this pair instead of taking arguments.

> kcan: Remove entry with key `[E:ma]`.
> ```
> po kcan ke be
> ke so kcani
>   va sae kin kcei zai kca
>   fe soe kin kcei zai kca   
> ```

> kco: Insert entry with key `[E:ma]` and value `[A:a]`.
> ```
> po kco ke ka be
> ke so kcoi
>   va sae kin kcei zai kca
>   fe soe kin kcei zai kca   
>   fo ka
> ```

> kcu: Transform entry with key `[E:ma]` with value relation (old,new)
> `[A:(a,a)]`.
> ```
> po kcu ke ga be
> ke so kcui
>   va sae kin kcei zai kca
>   fe soe kin kcei zai kca   
>   fo ga
> ```

> With these predicates we can write stuff like:
> ```
> po ga ke ka be
> ke kca
>   va ka
>   fo zai ti kcan
>   bu zai te kco ma
>   bu zai ta kcu tcia
> ```
>
> _ka_ is thus _ke_ with:
> - Key _zai ti_ removed
> - Key _zai te_ inserted with some atom as value
> - Key _zai ta_ transformed such that the old value is a subset of the new
>   value

Since we use maps for context it is fairly common to evaluate a proposition
with a modified context. We can make a predicate make that easier.

> kcar: Transformations `[E:blu ()]` are applied on the context before it is
> used to evaluate `[A:()]`.
> ```
> po kcar ke gia be
> mue
>   ve ki be mua
>     va gia
>     fe kca
>       va ki
>       fo ke
> ```