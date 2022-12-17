# Explicit binding (VI/FI/SI)

## Left atom place selection

When the speaker wants to interact with an argument that normal chaining doesn't
select (due to transitivity, or to interacting with O or U arguments), it is
possible to attach additional bindings using the __VI__ family of particles
after a predicate, followed by another (chain of) predicate(s), which is closed
by the __vei__ particle to return to the previously seen chaining behavior.

> __vei__ is the only member of family __VEI__, and not a member of __VI__.

__ve, va, vo, vu__ allow the binding of atom (or generic) arguments :

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
even as `duna [ve mi, fo mo, fa meon vei]`.

In the last version it is possible to omit the final __vei__. It is, however,
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
with __ge/ga/go/gu-__ have __transitive behavior__.

Any __BA__ used in the argument list allow skipping this argument if it is not
used in the inner predicate. Which __BA__ member is used doesn't matter.

> __mi dona [va ke be: mian buri ke]__
>
> \\[ \begin{align}
> \text{mian}(c,e)       &= \text{[$e$ is a cat]} \\\\
> \text{buri}(c,e,a)     &= \text{[$e$ eats $a$]} \\\\
> \\ \\\\
> \text{buri}_1(c,e,a)   &= \text{buri}(c,e,a) \wedge \color{magenta}{\text{ke}_1(c,e)} \\\\
> \text{buri}^w_1(c,e)   &= \exists a. \text{buri}_1(c,e,a) \\\\
> \\ \\\\
> \text{mian}_1(c,e)     &= \text{mian}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \\ \\\\
> \text{va}_1(c,e)       &= \color{magenta}{\text{ke}_1(c,e)} \wedge \text{mian}_1(c,e) \\\\
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
argument (like a KI), __bai__ a transitivite predicate argument (like a
gi-initial GI), and __bae__ an intransitive predicate argument (like a non
gi-initial GI).

The above example can thus be shortened as _mi dona [va be mian buri __ba__]_.

## Right place and chaining selection

When it is only needed to bind one or two places of a predicate, using __VI/FI__
and multiple lists of multiple arguments quickly becomes verbose. For that
reason, predicates can be prefixed with particles of family __SI__ (all
particles starting with _s-_), which override the chaining behavior.

__se, sa, so, su__ select the place corresponding to its vowel both for the
argument bound with a predicate on its right, and for the single argument that
is exposed in the combined predicate.

> __mian se buri blan__
>
> \\[ \begin{align}
> \text{blan}(c,e)                       &= \text{[$e$ is beautiful]} \\\\
> \\ \\\\
> \text{blan}_1(c,e)                     &= \text{blan}(c,e) \\\\
> \\ \\\\
> \text{buri}_1(c,e,a)                   &= \text{buri}(c,e,a) \wedge \text{blan}_1(c,\color{magenta}{e}) \\\\
> \text{buri}^w_1(c,\color{magenta}{e})  &= \exists a. \text{buri}_1(c,e,a) \\\\
> \\ \\\\
> \text{mian}_1(c,e)                     &= \text{mian}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a cat that eats something, and $(e) is beautiful.

__SI__ particles with two vowels allow to select both individually.

> __meon sae buri mian__
>
> \\[ \begin{align}
> \text{mian}_1(c,e)                    &= \text{mian}(c,e) \\\\
> \\ \\\\
> \text{buri}_1(c,e,a)                  &= \text{buri}(c,e,a) \wedge \text{mian}_1(c,\color{magenta}{e}) \\\\
> \text{buri}^w_1(c,\color{magenta}{a}) &= \exists e. \text{buri}_1(c,e,a) \\\\
> \\ \\\\
> \text{meon}_1(c,e)                    &= \text{meon}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is an apple which is eaten by a cat.

## Left predicate place selection

Using __ve, va, vo, vu__ on a predicate argument will not provide its
definition but instead share it like an atom argument with the following
predicate. The bound place must have the same predicate argument type however.
To provide a definition of the predicate argument the particles __vie, via, vio,
viu__ (and __FI__ equivalents) must be used.

If we take the example `tce mian` from the previous chapter it is equivalent to
`tce via mian`. Sharing with __ve, va, ...__ can be used like so:

> __mi fule [va sae tuli mo]__
>
> \\[ \begin{align}
> \text{fule}(c,e,A)                &= \text{[$e$ knows that $A$ (0-ary) is true]} \\\\
> \text{tuli}(c,e,A)                &= \text{[$e$ needs $A$ (0-ary) to be true]} \\\\
> \text{mo}(c,e)                    &= \text{[$e$ is a listener]} \\\\
> \\ \\\\
> \text{mo}_1(c,e)                  &= \text{mo}(c,e) \\\\
> \\ \\\\
> \text{tuli}_1(c,e,A)              &= \text{tuli}(c,e,A) \wedge \text{mo}_1(c,e) \\\\
> \text{tuli}^w_1(c,A)              &= \exists e. \text{tuli}_1(c,e,A) \\\\
> \\ \\\\
> \text{fule}_1(c,e,A)              &= \text{fule}(c,e,A) \color{magenta}{\wedge \text{tuli}^w_1(c,A)} \\\\
> \text{fule}^w_1(c,e)              &= \exists A. \text{fule}_1(c,e,A) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                  &= \text{mi}(c,e) \wedge \text{fule}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who knows some truth which is needed by a listener.

While using __via__, it has a different meaning :

> __mi fule [via sae tuli mo]__
>
> \\[ \begin{align}
> \text{mo}_1(c,e)                  &= \text{mo}(c,e) \\\\
> \\ \\\\
> \text{tuli}_1(c,e,A)              &= \text{tuli}(c,e,A) \wedge \text{mo}_1(c,e) \\\\
> \text{tuli}^w_1(c)                &= \exists e. \exists A. \text{tuli}_1(c,e,A) \\\\
> \\ \\\\
> \text{fule}_1(c,e,A)              &= \text{fule}(c,e,A) \color{magenta}{\wedge A \Leftrightarrow \text{tuli}^w_1} \\\\
> \text{fule}^w_1(c,e)              &= \exists A. \text{fule}_1(c,e,A) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                  &= \text{mi}(c,e) \wedge \text{fule}^w_1(c,e) \\\\
> \end{align} \\]
>
> Given $(c), $(e):\
> $(e) is a speaker who knows that [some truth is needed by a listener] is true.

## Brackets

__pe__ and __pei__ are like spoken brackets that wrap a predicate or chain of
predicates to define a new one, and have higher priority than chaining : `A B pe
C D pei E F` will be chained in order `A (B ([C D] (E F)))` instead of `A (B (C
(D (E F))))`. __pe__ can also be followed by an argument list to define the
arguments of this new predicate.

Using __VI/FI/SI__ is often preferred and more simple than using __pe__ and
__pei__, but in some cases it is not possible. Those cases will be presented in
later chapters.