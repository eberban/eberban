
# Chaining

When 2 predicates are strung one after the other they form a new predicate,
which have the same arguments as the left predicate. The __context argument__ is
automatically shared between left and right predicates.

Every predicate have a default __chaining behavior__ which dictates how 2
predicates are connected together. If the left predicate have __intransitive
behavior__ then its __E__ place will interact with the right predicate.
Otherwise if the left predicate have __transitive behavior__ then the __A__
place is used.

> For __root words__, they have __transitive behavior__ if they end with a
> __vowel__, while they have __intransitive behavior__ if they end with __n, r
> or l__.
>
> Particles acting as predicates have different rules which will be explained
> later.
>
> When chaining predicates the new predicate inherits the __chaining behavior__
> of the left predicate.

## Atom argument chaining

If the chaining argument is an __atom__ argument, then the variable filling this
argument also fills the __E__ argument of the right predicate.

> __mian mi__
>
> \\[ \begin{align}
> \text{mian}(c,e) &= \text{[$e$ is a cat]} \\\\
> \text{mi}(c,e)   &= \text{[$e$ is a speaker]} \\\\
> \text{mi}_1(c,e) &= \text{mian}(c,e) \wedge \text{mi}(c,e)
> \end{align} \\]
> 
> Given $(c),$(e):\
> $(e) is a cat and a speaker.

If the right predicate have more than one explicit argument then it is wrapped
in a predicate having only one explicit argument, and every other arguments are
filled with __existential variables__. The process of wrapping the predicate and
creating __existential variables__ to have the correct arity is called the
__arity mismatch resolution__, and is a key aspect of Eberban grammar to reduce
verbosity in simple cases.

> __mian buri__
>
> \\[ \begin{align}
> \text{mian}(c,e)   &= \text{[$e$ is a cat]} \\\\
> \text{buri}(c,e,a) &= \text{[$e$ eats $a$]} \\\\
> \text{buri}_1(c,e) &= \exists a. \text{buri}(c,e,a) \\\\
> \text{mian}_1(c,e) &= \text{mian}(c,e) \wedge \text{buri}_1(c,e)
> \end{align} \\]
> 
> Given $(c),$(e):\
> $(e) is a cat and there exist an $(a) such that $(e) eats $(a).\
> $(e) is a cat that eats something.

## Predicate argument chaining

If the chaining argument is a __predicate argument__, then the right predicate
is used to satisfy the argument. If the __predicate argument__ and right
predicate don't match in arity then the __arity mismatch resolution__ is
performed.

> _tce mian_
>
> \\[ \begin{align}
> \text{tce}(c,e,A)   &= \text{[$e$ is a set of things that satisfies $A$ (1-ary)]} \\\\
> \text{mian}(c,e)    &= \text{[$e$ is a cat]} \\\\
> \text{tce}_1(c,e,A) &= tce(c,e,A) \wedge A \Leftrightarrow mian
> \end{align} \\]
>
> Given $(c), $(e), $(A):\
> $(e) is a set of things that satisfies $(A), and $(A) is equivalent to
> _mian_.\
> $(e) is a set/group of cats.

> _gli mian_
>
> \\[ \begin{align}
> \text{gli}(c,e,A)   &= \text{[$e$ is happy about $A$ (0-ary) being true]} \\\\
> \text{mian}(c,e)    &= \text{[$e$ is a cat]} \\\\
> \text{mian}_1(c)    &= \exists e. \text{mian}(c,e) \\\\
> \text{gli}_1(c,e,A) &= gli(c,e,A) \wedge A \Leftrightarrow \text{mian}_1
> \end{align} \\]
>
> Given $(c), $(e), $(A):\
> $(e) is happy about $(A) being true, and $(A) is equivalent to
> \\(\text{mian}_1\\).\
> $(e) is happy that there exist a cat.

## Longer chains

When more than 2 predicates are strung one after the other they are chained in
right-grouping order (`A (B (C D))`).

> _mi dona tcu mian_
>
> \\[ \begin{align}
> \text{mi}(c,e)       &= \text{[$e$ is a speaker]} \\\\
> \text{dona}(c,e,a)   &= \text{[$e$ likes $a$]} \\\\
> \text{tcu}(c,e,A)    &= \text{[$e$ is the set of all things that satisfy $A$ (1-ary)]} \\\\
> \text{mian}(c,e)     &= \text{[$e$ is a cat]} \\\\
> \text{tcu}_1(c,e,A)  &= \text{tcu}(c,e,A) \wedge A \Leftrightarrow mian \\\\
> \text{tcu}_2(c,e)    &= \exists A. \text{tcu}_1(c,e,A) \\\\
> \text{dona}_1(c,e,a) &= \text{dona}(c,e,a) \wedge \text{tcu}_2(c,a) \\\\
> \text{dona}_2(c,e)   &= \exists a. \text{dona}_1(c,e,a) \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{dona}_2(c,e)
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker that likes all cats.