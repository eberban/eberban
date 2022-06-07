# Lists

Lists are data structures that contains items in a __specific order__. They
are defined internally with linked lists, as a pair of an item and a list of
the following items (or a sentinel value for an empty list).

> blun: `[E:ma]` is a list.
> ```
> po blun ke be
> ```
> __ke__ is either an empty list (represented by `zai blun`)
> ```
> vare
>   vie ke zai blun
> ```
> Or a pair whose right component is a list.
> ```
>   fia ke seo kin blun     
> ```

Most of the time we'll deal with list of things of the same type and satisfying
a common property.

> blu: `[E:blun]` is a list of things all satisfying `[A:(a)]`.
> ```
> po blu ke gi be
> vare
>   vie ke zai blun
>   fia ma
>     vai ke sea kin gi
>     fai ke seo kin blu gi
> ```

From that definition we can now enable the __bu__ list grammar like so

> `<A> bu <B> bu <C>` is equivalent to:
> ```
> pe se kin
>   va <A>
>   fo kin
>     va <B>
>     fo kin
>       va <C>
>       fo zai blun
> pei
> ```

An important operation on list is called __fold__, which allows to iterate
over the list and evaluate a predicate with a value carried between iterations.

It's arguments are:
- the list to fold
- the initial carry value
- the final carry value
- the predicate to apply for each element, which takes as arguments:
  - the input carry value
  - the output carry value
  - the element of the list

The provided predicate is applied for each element, with the output
carry for an element being the input carry for the next element.
For the first item the input is the initial carry, and for the last
item the output is the final carry.

> Since the predicate will be applied with each value of list it adds the
> constraint that all the elements of the list have the same type.

There are 2 variants of __fold__, one which is left-to-right (first to last)
while the other is right-to-left (last to first).

> bla: Left folds list `[E:blu a]` with initial `[A:b]` and final `[O:b]`
> carries by applying predicate `[U:(b,b,a)]` in first to last order.
> ```
> po bla ke ka ko gu be
> ```
> Either __ke__ is an empty list, in which can the initial and final carry
> values are the same. 
> ```
> vare
>   vie ke zai blun
>     vai ka ko vei
> ```
> Or __ke__ is not an empty list with element __x__, in which case there exist
> a __ki__ such that __gu(ka,ki,x)__ and __ki__ is the initial value of a left
> fold on the rest of the list.
> ```
>   fie ke zi zai blun
>     vai ma
>       vai bo ki
>       fai ka gu va ki fo sae kin ke vei
>       fai bla
>         ve soe kin ke
>         fa ki
>         fo ko
>         fu gu
> ```

> blai: Right folds list `[E:blu a]` with initial `[A:b]` and final `[O:b]`
> carries by applying predicate `[U:(b,b,a)]` in last to first order.
> ```
> po blai ke ka ko gu be
> ```
> Either __ke__ is an empty list, in which can the initial and final carry
> values are the same. 
> ```
> vare
>   vie ke zai blun
>     vai ka ko vei
> ```
> Or __ke__ is not an empty list with element __x__, in which case there exist
> a __ki__ such that __gu(ki,ko,x)__ and __ki__ is the final value of a right
> fold on the rest of the list.
> ```
>   fie ke zi zai blun
>     vai ma
>       vai bo ki
>       fai ki gu va ko fo sae kin ke vei
>       fai blai
>         ve soe kin ke
>         fa ka
>         fo ki
>         fu gu
> ```

Thanks to those predicates we can easily define list concatenation.

> ble: `[E:blu a]` is the concatenation of lists `[A:blu a]` and `[O:blu a]`.
> ```
> po ble ke ka ko be
> so blai
>   ve ka
>   fa ko
>   fiu kie kia kio be
>     kia kin
>       ve kio
>       fa kie
> ```

Finally, we can allow speakers to quickly define sets using the list grammar
with the following predicate.

> bli: `[E:tce a]` is the set containing only all the elements in list `[A:blu a]`.
>
> We first define a predicate ensuring that __ke__ is a set containing alls
> elements in list __ka__.
> ```
> po ga ke ka be
> ka bla
>   va ke
>   fiu kie kia kio be
>     kio tcie kie
> ```
> Then we use it to define __bli__ such that __ke__ is the __smallest__ set
> containing all elements in list __ka__ (so it can't be any set that contains
> them plus additional members that are not in the list).
> ```
> po bli ke ka be
> ma vai ke ga ka
>   fai bi ma 
>     ve bi ke ga ka
>     fe tcia ke   
> ```

> Example of usage (with full grammar and vocabulary):\
> `mi dona bli va za ualisi bu za ubobo`\
> I like Alice and Bob.