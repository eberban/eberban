
# Chaining

When two predicates are strung one after the other they form a new predicate,
which has the same arguments as the left predicate.

Every predicate has a default __chaining behavior__ which dictates how two
predicates are connected together. If the left predicate has __intransitive
behavior__, then its __E__ place will interact with the right predicate.
Otherwise if the left predicate has __transitive behavior__, then the __A__
place is used.

> For __root words__, they have __transitive behavior__ if they end with a
> __vowel__, while they have __intransitive behavior__ if they end with __n, r
> or l__.
>
> This place can expect either an atom/generic, or a predicate. As this can
> greatly impact the structure of sentences, this is encoded in __root words__
> with the following rules:
> - if the root is a form __CCV__, the A place is a predicate place.
> - if the root ends with an __-i__, the A place is a predicate place.
> - otherwise the place is an atom/generic place.
> - an intransitive root shouldn't have a E predicate place, as it will be chained
>   to as if it was an atom/generic place. If a predicate have a
>   single predicate place, it should be transitive with a single A predicate place.
>   A predicate with many predicate places can have a E predicate place but it
>   must be transitive.
>
> Particles acting as predicates have different rules which will be explained
> later.
>
> When chaining predicates the new predicate inherits the __chaining behavior__
> of the left predicate.

## Atom argument chaining

If the chaining argument is an __atom__ argument, then the variable filling this
argument also fills the __E__ argument of the right predicate. The
__context argument__ is automatically shared between left and right predicates.

> __mian blan__
>
> \\[ \begin{align}
> \text{mian}(c,e)   &= \text{[$e$ is a cat]} \\\\
> \text{blan}(c,e)   &= \text{[$e$ is beautiful]} \\\\
> \\ \\\\
> \text{blan}_1(c,e) &= \text{blan}(c,e) \\\\
> \\ \\\\
> \text{mian}_1(c,e) &= \text{mian}(c,e) \wedge \text{blan}_1(c,\color{magenta}{e})
> \end{align} \\]
>
> Given $(c),$(e):\
> $(e) is a cat and is beautiful.

If the right predicate has more than one explicit argument, then it is wrapped
in a predicate having only one explicit argument and every other argument is
filled with __existential variables__. The process of wrapping the predicate and
creating __existential variables__ to have the correct arity is called
__arity mismatch resolution__ and it is a key aspect of Eberban grammar to
reduce verbosity in simple cases.

> __mian etiansa__
>
> \\[ \begin{align}
> \text{etiansa}(c,e,a)                    &= \text{[$e$ eats $a$]} \\\\
> \\ \\\\
> \text{etiansa}_1(c,e,a)                  &= \text{etiansa}(c,e,a) \\\\
> \color{magenta}{\text{etiansa}^w_1(c,e)} &= \color{magenta}{\exists a. \text{etiansa}_1(c,e,a)} \\\\
> \\ \\\\
> \text{mian}_1(c,e) &= \text{mian}(c,e) \wedge \text{etiansa}^w_1(c,e)
> \end{align} \\]
>
> Given $(c),$(e):\
> $(e) is a cat and there exists an $(a) such that $(e) eats $(a).\
> $(e) is a cat that eats something.

## Predicate argument chaining

If the chaining argument is a __predicate argument__, then the right predicate
is stated to be equivalent to the predicate represented by the argument. If the
__predicate argument__ and right predicate don't match in arity, then the
__arity mismatch resolution__ is performed. The right predicate is not stated as
is, and will be _instantiated_ by the left predicate (according to its
definition). The right predicate is able to be _instantiated_ multiple times and
with any (correctly typed) arguments, and with a different _context argument_.

> __tce mian__
>
> \\[ \begin{align}
> \text{tce}(c,e,A)   &= \text{[$e$ is a set of things that satisfies $A$ (1-ary)]} \\\\
> \\ \\\\
> \text{mian}_1(c,e)  &= \text{mian}(c,e) \\\\
> \\ \\\\
> \text{tce}_1(c,e,A) &= tce(c,e,A) \color{magenta}{\wedge A \Leftrightarrow \text{mian}_1}
> \end{align} \\]
>
> Given $(c), $(e), $(A):\
> $(e) is a set of things that satisfies $(A), and $(A) is equivalent to
> _mian_.\
> $(e) is a set/group of cats.

> __gali mian__
>
> \\[ \begin{align}
> \text{gali}(c,e,A)   &= \text{[$e$ is happy about $A$ (0-ary) being true]} \\\\
> \\ \\\\
> \text{mian}_1(c,e)  &= \text{mian}(c,e) \\\\
> \text{mian}^w_1(c)  &= \exists e. \text{mian}_1(c,e) \\\\
> \\ \\\\
> \text{gali}_1(c,e,A) &= gali(c,e,A) \wedge A \Leftrightarrow \text{mian}^w_1
> \end{align} \\]
>
> Given $(c), $(e), $(A):\
> $(e) is happy about $(A) being true, and $(A) is equivalent to
> \\(\text{mian}^w_1\\).\
> $(e) is happy that there exist a cat.

## Longer chains

When more than two predicates are strung one after the other they are chained in
right-grouping order (`A (B (C D))`).

> __mi dona tcu mian__
>
> \\[ \begin{align}
> \text{mi}(c,e)       &= \text{[$e$ is a speaker]} \\\\
> \text{dona}(c,e,a)   &= \text{[$e$ likes $a$]} \\\\
> \text{tcu}(c,e,A)    &= \text{[$e$ is the set of all things that satisfy $A$ (1-ary)]} \\\\
> \\ \\\\
> \text{mian}_1(c,e)   &= \text{mian}(c,e) \\\\
> \\ \\\\
> \text{tcu}_1(c,e,A)  &= \text{tcu}(c,e,A) \wedge A \Leftrightarrow \text{mian}_1 \\\\
> \text{tcu}^w_1(c,e)  &= \exists A. \text{tcu}_1(c,e,A) \\\\
> \\ \\\\
> \text{dona}_1(c,e,a) &= \text{dona}(c,e,a) \wedge \text{tcu}^w_1(c,a) \\\\
> \text{dona}^w_1(c,e) &= \exists a. \text{dona}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e)
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who likes all cats.