# Predicate transformations

Particles of __ZI__ family (all particles starting with _z-_) allows to
transform the immediatly following predicate, before chaining or explicit
bindings is performed.

> To use a __ZI__ on more than one predicate word it should be wrapped in
> brackets __pe ... pei__, which itself will be prefixed with __ZI__.

## Negations

__zi__ allows to negate the predicate being prefixed. However it doesn't
negate any existential variables created when performing __arity mismatch
resolution__ or other predicates in the chain or explicit bindings. __zi__
is called the __short scope negation__.

> __mi zi buri meon__
>
> \\[ \begin{align}
> \text{mi}(c,e)       &= \text{[$e$ is a speaker]} \\\\
> \text{buri}(c,e,a)   &= \text{[$e$ eats $a$]} \\\\
> \text{meon}(c,e)     &= \text{[$e$ is an apple]} \\\\
> \\ \\\\
> \text{meon}_1(c,e)   &= \text{meon}(c,e) \\\\
> \\ \\\\
> \text{buri}_1(c,e,a) &= \color{magenta}{(\neg \text{buri}(c,e,a))} \wedge \text{meon}_1(c,e) \\\\
> \text{buri}^w_1(c,e) &= \exists a. \text{buri}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \text{mi}^w_1(c)     &= \exists e. \text{mi}_1(c,e)
> \end{align} \\]
> 
> Assertion given $(c):\
> I and an apple exists but I don't eat it.\
> Would be false if no apple existed.

There exist also a __long scope negation__ with particle __bi__, which negates
also existential variables introduced by the arity mismatch resultion and other
predicates in the chain or explicit bindings.

> __mi bi buri meon__
>
> \\[ \begin{align}
> \text{buri}_1(c,e,a) &= \text{buri}(c,e,a) \wedge \text{meon}(c,e) \\\\
> \text{buri}^w_1(c,e) &= \color{magenta}{\neg (\exists a. \text{buri}_1(c,e,a))} \\\\
> \\ \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \text{mi}^w_1(c)     &= \exists e. \text{mi}_1(c,e)
> \end{align} \\]
> 
> Assertion given $(c):\
> I exist and it is false that I eat an apple.\
> It doesn't imply the existence of an apple.

> __bi__ is in its own family __BI__ as it transforms more than just the prefixed
> predicate.

## Names

Prefixing a 1-ary predicate with __za__ transforms it into a name:
\\([\text{$e$ is named with property $P$}]\\). __SI__ can be added between
__za__ and the predicate to select which argument is used for the property.

To speak about the name itself __zai__ must be used itself:
\\([\text{$e$ is the name corresponding to property $P$}]\\).

> Many things can have the same name, but the name itself is unique.

## Reference

__ze__ allows to refer to the latest __non-wrapped__ instance of the prefixed
predicate instead of creating a new instance. Arguments provided to this
reference predicate (ignoring the implicit context argument) are stated to be
equal to the onces the instance had.

> __mian buri
> pa mi dona ze mian__
>
> \\[ \begin{align}
> \text{mian}(c,e)                    &= \text{[$e$ is a cat]} \\\\
> \text{dona}(c,e,a)                  &= \text{[$e$ likes $a$]} \\\\
> \\ \\\\
> \text{buri}_1(c,e,a)                &= \text{buri}(c,e,a) \\\\
> \text{buri}^w_1(c,e)                &= \exists a. \text{buri}(c,e,a) \\\\
> \\ \\\\
> \color{magenta}{\text{mian}_1(c,e)} &= \text{mian}(c,e) \wedge \text{buri}^w_1(c,e) \\\\
> \text{mian}^w_1(c)                  &= \exists e. \text{mian}_1(c,e) \\\\
> \\ \\\\
> \text{dona}_1(c,e,a)                &= \text{dona}(c,e,a) \wedge \color{magenta}{\text{mian}_1(c,e)} \\\\
> \text{dona}^w_1(c,e)                &= \exists a. \text{dona}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                    &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e) \\\\
> \text{mi}^w_1(c)                    &= \exists e. \text{mi}_1(c,e) \\\\
> \end{align} \\]
>
> Assertion given $(c): A cat eats something.\
> Assertion given $(c): I like __this cat__.

When prefixing a compound, __ze__ will refer the lastest instance of that
exact compound. To make sentences shorter, __zei__ can be used before a
predicate word to refer the latest compound containing this word.

> `ze eberban` will refer to the latest `eberban` instance, while `zei ban` will
> refer to the latest compound containing `ban`, for exemple `eberban`.

## Other

__zu__ allow to transform a predicate having a __A__ 0-ary predicate place
a predicate having a __A__ 1-ary predicate place which is satisfied by the __E__
argument.

__mi jine mi jvin__ (I want that [I dance]) can thus be replaced by
__mi zu jine jvin__ (I want to dance).

Note that they are not exactly equivalent, as in the first example the 2 __mi__
might not refer to the same individual(s) (if there are multiple speakers),
while in the second example it is necessarily the same. Aside from this
slight difference both examples are here the same length and thus might
seem a bit overkill, but it is more usefull if the thing being repeated is
longer than one syllable.

