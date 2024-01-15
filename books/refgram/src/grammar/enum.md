# Enumeration and erasure (BU)

__BU__ is a separator that can appear in any place there is a chain, and
transform it into an enumeration of chains. Depending on which __BU__ is
used this enumeration is used to create a set, list, or to erase previous
words.

__buhu__ erase the current chain, as if it was not said or written, and is
usually followed by a new chain. If there is no other __BU__ than __buhu__
used then this new chain stay as is, and is not transformed in a list or set.

For first non __buhu__ __BU__ used determines what this enumeration produces.
Following non __buhu__ __BU__ don't change what the enumeration produces, and it
is thus shorter to always use __bu__.

- __bu__: a set of atoms/generics
- __bui__: a set of predicates
- __bue__: a list of atoms/generics
- __buei__: a list of predicates



For __bui__ and __buei__, all predicates will have the same arity as the first
chain in the enumeration.

A final __BU__ can appear without being followed by a new chain, which is useful
to create a list/set with only one member. If all chains have been erased with
__buhu__, then it produces an "always true" predicate.

As many words speaks about sets, one must be careful that using __bu__/__bue__
will produce sets/lists of sets. It is usually necessary to either produce
the union with __dji__ or make a set by taking one member from each set with
__djie__.

> __mi seo spi djie [va [za ualis] bu ~~[za ubob] buhu~~ [za utcarli]]__
>
> I speak (say something) to Alice ~~and Bob~~ and Charlie.

Note that __VI/FI/PE__ is often required to use __BU__, as __BU__ has
lower precedence than chaining.

> __[mi seo spi djie za ualis] bu [za utcarli]__
>
> This sentence is nonsence as __djie__ expects a set for __A__ but is provided
> a name directly.

> __pe ... pei__ are particularly useful to make nested sets/lists.