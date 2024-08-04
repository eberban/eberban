# Explicit binding (VI/FI/SI/PE/KI/GI/BA)

## Left atom place selection

When the speaker wants to interact with an argument that normal chaining doesn't
select (due to transitivity, or because they want to interact with O or U
arguments), it is possible to attach additional bindings using the __VI__ family
of particles after a predicate, followed by another (chain of) predicate(s),
which is closed by the __vei__ particle to return to the previously seen
chaining behavior.

> __vei__ is the only member of family __VEI__, and not a member of __VI__.

__ve, va, vo, vu__ allow binding atom (or generic) arguments :

> __mi duna [vo mo vei] meon__
>
> \\[ \begin{align}
> \text{mi}(c,e)         &= \text{[$e$ is a speaker]} \\\\
> \text{duna}(c,e,a,o)   &= \text{[$e$ gives $a$ to $o$]} \\\\
> \text{mo}(c,e)         &= \text{[$e$ is a listener]} \\\\
> \text{meon}(c,e)       &= \text{[$e$ is an apple]} \\\\
> \\ \\\\
> \text{mo}_1(c,e)       &= \text{mo}(c,e) \\\\
> \text{meon}_1(c,e)     &= \text{meon}(c,e) \\\\
> \\ \\\\
> \text{duna}_1(c,e,a,o) &= \text{duna}(c,e,a,o) \color{magenta}{\wedge \text{mo}_1(c,o)} \wedge \text{meon}_1(c,a) \\\\
> \text{duna}^w_1(c,e)   &= \exists a \exists o. \text{duna}_1(c,e,a,o) \\\\
> \\ \\\\
> \text{mi}_1(c,e)       &= \text{mi}(c,e) \wedge \text{duna}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who gives an apple to a listener.

To bind more than one argument of the same predicate we have to use the __FI__
family, which interacts with the same predicate as the last non-closed __VI__.

The __FI__ family follows the same pattern of vowels as __VI__.
The above sentence can thus be rewritten as `duna [ve mi, fo mo vei] meon` or
even as `duna [ve mi, fo mo, fa meon vei]`. __FI__ have additional members:
__feu__ to bind the same place as the previous __FI__ or __VI__ in the chain,
while __fau__ binds the next place (this allows bind places of a predicate
having more than 4 slots, which should however be rare).

In the last exemple it is possible to omit the final __vei__. It is, however,
not possible to do so in the previous exemples as we would get the chain
`mo meon` which is not what we want.

## Arguments list

Between __VI/FI__ and the inner predicate an __arguments list__ can be provided
by having zero or more __KI/GI/BA__ terminated with __be__, in which case the
bindings will occur with those arguments instead of the arguments of the
predicate after __be__.

__KI__ (all particles starting with _k-_) represent an atom or generic argument
$(x) and have meaning \\(ki(c,e) = \[\text{$e$ is variable $x$}\]\\).

__GI__ (all particles starting with _g-_), however, represents a predicate whose
arity and type will be inferred from its usage in the sentence. All __GI__
starting with __gi-__ have __intransitive behavior__, while the others starting
with __ge/ga/go/gu-__ have __transitive behavior__. In both cases chaining to
the transitivity place is done by sharing.

Any __BA__ used in the argument list allow skipping this argument if it is not
used in the inner predicate. Which __BA__ member is used doesn't matter.

> __mi dona [va ke be: mian bure ke]__
>
> \\[ \begin{align}
> \text{mian}(c,e)       &= \text{[$e$ is a cat]} \\\\
> \text{bure}(c,e,a)     &= \text{[$e$ eats $a$]} \\\\
> \\ \\\\
> \text{bure}_1(c,e,a)   &= \text{bure}(c,e,a) \wedge \color{magenta}{\text{ke}_1(c,a)} \\\\
> \text{bure}^w_1(c,e)   &= \exists a. \text{bure}_1(c,e,a) \\\\
> \\ \\\\
> \text{mian}_1(c,e)     &= \text{mian}(c,e) \wedge \text{bure}^w_1(c,e) \\\\
> \text{mian}^w_1(c)     &= \exists e. \text{mian}_1(c,e) \\\\
> \\ \\\\
> \text{va}_1(c,e)       &= \color{magenta}{\text{ke}_1(c,e)} \wedge \text{mian}^w_1(c) \\\\
> \\ \\\\
> \text{dona}_1(c,e,a)   &= \text{dona}(c,e,a) \wedge \text{va}_1(c,a) \\\\
> \text{dona}^w_1(c,e)   &= \exists a. \text{dona}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)       &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who likes [something eaten by a cat].

__BA__ can also be used outside of the argument list, which adds an argument at
the end of the list and uses it directly. __ba__ declares an atom/generic
argument (like a KI), __bahi__ a transitivite predicate argument (like a
gi-initial GI), and __bahe__ an intransitive predicate argument (like a non
gi-initial GI). __bai__, __baihi__ and __baihe__ on the other hand always adds
an argument at the end of the **sentence arguments list**, which is mostly
useful when asking questions.

The above example can thus be shortened as _mi dona [va be mian bure __ba__]_.

## Right place and chaining selection

When it is only needed to bind one or two places of a predicate, using __VI/FI__
and multiple lists of multiple arguments quickly becomes verbose. For that
reason, predicates can be prefixed with particles of family __SI__ (all
particles starting with _s-_), which override the chaining behavior.

__se, sa, so, su__ select the place corresponding to its vowel both for the
argument bound with a predicate on its right, and for the single argument that
is exposed in the combined predicate. The right place is bound by sharing, while
adding a final __-i__ makes it bound by equivalence.

> __mian se bure blan__
>
> \\[ \begin{align}
> \text{blan}(c,e)                       &= \text{[$e$ is beautiful]} \\\\
> \\ \\\\
> \text{blan}_1(c,e)                     &= \text{blan}(c,e) \\\\
> \\ \\\\
> \text{bure}_1(c,e,a)                   &= \text{bure}(c,e,a) \wedge \text{blan}_1(c,\color{magenta}{e}) \\\\
> \text{bure}^w_1(c,\color{magenta}{e})  &= \exists a. \text{bure}_1(c,e,a) \\\\
> \\ \\\\
> \text{mian}_1(c,e)                     &= \text{mian}(c,e) \wedge \text{bure}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a cat that eats something, and $(e) is beautiful.

__SI__ particles with two vowels (except __i__) allow to select both, the two
vowels representing the two exposed place, and the second vowel corresponding to
the slot bound with a predicate on its right. As with single vowel the right place
is bound by sharing, while adding a final __-i__ makes it bound by equivalence.

> __meon sae bure mian__
>
> \\[ \begin{align}
> \text{mian}_1(c,e)                    &= \text{mian}(c,e) \\\\
> \\ \\\\
> \text{bure}_1(c,e,a)                  &= \text{bure}(c,e,a) \wedge \text{mian}_1(c,\color{magenta}{e}) \\\\
> \text{bure}^w_1(c,\color{magenta}{a}) &= \exists e. \text{bure}_1(c,e,a) \\\\
> \\ \\\\
> \text{meon}_1(c,e)                    &= \text{meon}(c,e) \wedge \text{bure}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is an apple which is eaten by a cat.

__SI__ particles follow a more general pattern to support more slots and usages:

- __si__ followed by a single vowel makes the predicate "transparent" by
  re-exposing all the places of the predicate on its right, which is bound to
  the slot corresponding to the vowel used. This is mostly useful with predicates
  having a proposition (0-ary) place, such that the predicates before and after
  can be bound together "across" the predicate with the proposition place.
- Otherwise, __SI__ particles are composed of an __s__ followed either by
  one or many __e/a/o/u__ or a single __i__, which can optionally be followed
  by __h__ followed by a single __e/a/o/u__. The one or many __e/a/o/u__ lists
  the slots of the predicate to expose, while a single __i__ exposes none.
  The __h__ followed by a single __e/a/o/u__ selects the slot bound with a
  predicate on the right. When absent, the last __e/a/o/u__ is used instead.
  Final __-i__ encodes if the place is bound with sharing or equivalence.

> Exemples :
> - sia: Transparent A
> - sea: Expose E and A, chain to A with sharing
> - seho: Expose E only, chain to O with sharing
> - saeoi: Expose A, E and O (in this order), chain to O with equivalence.

## Left predicate place selection

Using __ve, va, vo, vu__ on a predicate argument will not provide its
definition but instead share it like an atom argument with the following
predicate. The bound place must have the same predicate argument type however.
To provide a definition of the predicate argument the particles __vie, via, vio,
viu__ (and __FI__ equivalents) must be used. __FI__ have again additional members:
__fei__ to bind the same place as the previous __FI__ or __VI__ in the chain,
while __fai__ binds the next place.

If we take the example `tce mian` from the previous chapter it is equivalent to
`tce via mian`. Sharing with __ve, va, ...__ can be used like so:

> __mi katmi [va sae tuli mo]__
>
> \\[ \begin{align}
> \text{katmi}(c,e,A)               &= \text{[$e$ wants $A$ (0-ary) to be true]} \\\\
> \text{tuli}(c,e,A)                &= \text{[$e$ needs $A$ (0-ary) to be true]} \\\\
> \text{mo}(c,e)                    &= \text{[$e$ is a listener]} \\\\
> \\ \\\\
> \text{mo}_1(c,e)                  &= \text{mo}(c,e) \\\\
> \\ \\\\
> \text{tuli}_1(c,e,A)              &= \text{tuli}(c,e,A) \wedge \text{mo}_1(c,e) \\\\
> \text{tuli}^w_1(c,A)              &= \exists e. \text{tuli}_1(c,e,A) \\\\
> \\ \\\\
> \text{katmi}_1(c,e,A)             &= \text{katmi}(c,e,A) \color{magenta}{\wedge \text{tuli}^w_1(c,A)} \\\\
> \text{katmi}^w_1(c,e)             &= \exists A. \text{katmi}_1(c,e,A) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                  &= \text{mi}(c,e) \wedge \text{katmi}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who wants some proposition (which is needed to be true by a listener) is true.

While using __via__, it has a different meaning :

> __mi katmi [via sae tuli mo]__
>
> \\[ \begin{align}
> \text{mo}_1(c,e)                  &= \text{mo}(c,e) \\\\
> \\ \\\\
> \text{tuli}_1(c,e,A)              &= \text{tuli}(c,e,A) \wedge \text{mo}_1(c,e) \\\\
> \text{tuli}^w_1(c)                &= \exists e. \exists A. \text{tuli}_1(c,e,A) \\\\
> \\ \\\\
> \text{katmi}_1(c,e,A)             &= \text{katmi}(c,e,A) \color{magenta}{\wedge A \Leftrightarrow \text{tuli}^w_1} \\\\
> \text{katmi}^w_1(c,e)             &= \exists A. \text{katmi}_1(c,e,A) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                  &= \text{mi}(c,e) \wedge \text{katmi}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who wants that [some truth is needed by a listener] is true.

## Brackets

__pe__ and __pei__ are like spoken brackets that wrap a predicate or chain of
predicates to define a new one, and have higher priority than chaining : `A B pe
C D pei E F` will be chained in order `A (B ([C D] (E F)))` instead of `A (B (C
(D (E F))))`. __pe__ can also be followed by an argument list to define the
arguments of this new predicate.

Using __VI/FI/SI__ is often preferred and more simple than using __pe__ and
__pei__, but in some cases it is not possible. Those cases will be presented in
later chapters.