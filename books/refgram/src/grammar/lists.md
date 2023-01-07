# Lists (BU)

Making lists of things is a very useful concept, and thus they get their own
grammar to make them short to make.

In every place a chain of predicates is allowed, __bu__ can be used to mark the
end of an item of the list, and transform the chain into a list of chains.

__bli__ is a predicate making the connection between sets and lists, and thus
allows making sets using the list syntax. It has meaning `[E:tce a] is a set
containing all elements in sequence [A:blu a] (duplicates removed)`, __blu__
being the word for a list.

> __mi seo spi bli [va [za ualisi] bu [za ubobo]]__
>
> I speak (says something) to Alice and Bob.

Note that __VI/FI/PE__ is often required to use __bu__, as __bu__ has
lower precedence than chaining.

> __[mi seo spi bli za ualisi] bu [za ubobo]__
>
> This sentence is nonsense as __bli__ expects an __A__ list argument but is
> provided a name directly.

> __pe ... pei__ are particularly useful to make nested lists.