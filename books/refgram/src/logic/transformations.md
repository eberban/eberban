# Predicate transformations (ZI/BI)

Particles of the __ZI__ family (all particles starting with _z-_) are used to
transform the immediately following predicate, before chaining or explicit
bindings are performed.

> To use a __ZI__ on more than one predicate word it should be wrapped in
> brackets __pe ... pei__, which itself will be prefixed with __ZI__.

## Negations

__zi__ allows the speaker to negate the predicate being prefixed. However,
it doesn't negate any existential variables created when performing __arity
mismatch resolution__, other predicates in the chain, or explicit bindings.
__zi__ is called the __short scope negation__.

> __mi zi etiansa meon__
>
> \\[ \begin{align}
> \text{mi}(c,e)       &= \text{[$e$ is a speaker]} \\\\
> \text{etiansa}(c,e,a)   &= \text{[$e$ eats $a$]} \\\\
> \text{meon}(c,e)     &= \text{[$e$ is an apple]} \\\\
> \\ \\\\
> \text{meon}_1(c,e)   &= \text{meon}(c,e) \\\\
> \\ \\\\
> \text{etiansa}_1(c,e,a) &= \color{magenta}{(\neg \text{etiansa}(c,e,a))} \wedge \text{meon}_1(c,e) \\\\
> \text{etiansa}^w_1(c,e) &= \exists a. \text{etiansa}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{etiansa}^w_1(c,e) \\\\
> \text{mi}^w_1(c)     &= \exists e. \text{mi}_1(c,e)
> \end{align} \\]
>
> Assertion given $(c):\
> I and an apple exists, but I don't eat it.\
> Would be false if no apple existed.

There also exists a __long scope negation__ with particle __bi__, which also
negates existential variables introduced by the arity mismatch resultion and
other predicates in the chain or explicit bindings.

> __mi bi etiansa meon__
>
> \\[ \begin{align}
> \text{etiansa}_1(c,e,a) &= \text{etiansa}(c,e,a) \wedge \text{meon}(c,e) \\\\
> \text{etiansa}^w_1(c,e) &= \color{magenta}{\neg (\exists a. \text{etiansa}_1(c,e,a))} \\\\
> \\ \\\\
> \text{mi}_1(c,e)     &= \text{mi}(c,e) \wedge \text{etiansa}^w_1(c,e) \\\\
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
\\([\text{$e$ is named with property $P$ by $a$}]\\). __SI__ can be added between
__za__ and the predicate to select which argument is used for the property.
__za__ is intransitive as it is most of the time not needed to define who named
$(e) like that.

To speak about the name itself, __zai__ must be used:
\\([\text{$e$ is the name corresponding to property $P$}]\\).

## Anaphora

__ze__ allows the speaker to refer to the latest __non-wrapped__ instance of the
prefixed predicate instead of creating a new instance. Arguments provided to
this reference predicate (ignoring the implicit context argument) are stated to
match ones the instance had.

> __mian etiansa
> a mi dona ze mian__
>
> \\[ \begin{align}
> \text{mian}(c,e)                         &= \text{[$e$ is a cat]} \\\\
> \text{dona}(c,e,a)                       &= \text{[$e$ likes $a$]} \\\\
> \\ \\\\
> \text{etiansa}_1(c,e,a)                     &= \text{etiansa}(c,e,a) \\\\
> \text{etiansa}^w_1(c,e)                     &= \exists a. \text{etiansa}_1(c,e,a) \\\\
> \\ \\\\
> \color{magenta}{\text{mian}_1(c,e_1)}    &= \text{mian}(c,e_1) \wedge \text{etiansa}^w_1(c,e_1) \\\\
> \text{mian}^w_1(c)                       &= \exists e. \text{mian}_1(c,e) \\\\
> \\ \\\\
> \color{magenta}{\text{ze-mian}_1(c,e)}   &= \color{magenta}{e = e_1} \\\\
> \text{dona}_1(c,e_2,a_2)                 &= \text{dona}(c,e_2,a_2) \wedge \color{magenta}{\text{ze-mian}_1(c,a)} \\\\
> \text{dona}^w_1(c,e)                     &= \exists a. \text{dona}_1(c,e,a) \\\\
> \\ \\\\
> \text{mi}_1(c,e)                         &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e) \\\\
> \text{mi}^w_1(c)                         &= \exists e. \text{mi}_1(c,e) \\\\
> \end{align} \\]
>
> Assertion given $(c): A cat eats something.\
> Assertion given $(c): I like __this cat__.

When prefixing a compound, __ze__ will refer to the lastest instance of that
exact compound. To make sentences shorter, __zei__ can be used before a
predicate word to refer the latest compound containing this word.

> `ze eberban` will refer to the latest `eberban` instance, while `zei ban` will
> refer to the latest compound containing `ban`, for exemple `eberban`.

Which one is the __latest instance__ is determined by word order in the text, and
using a predicate defined using this word doesn't make it the __latest__ again.
Thus in

_on gia mian blan a __mian__ etiansa a gia dona ze mian_,

_ze mian_ refers to the __mian__ in bold in the __a__ sentence, and not the
__mian__ in __gia__'s definition.

However if the last instance of the word is indeed in a definition (or in some
predicate that can be used multiple times), then __ze__ refers to the last time
it has been used. Thus in

_on gia __mian__ blan a gia dona ze mian_,

_ze mian_ refers to the __mian__ inside __gia__'s definition, which is last
used in the __a__ sentence. The text can thus be translated as
"A beautiful cat which likes itself".

__zeu__ allows to refer to the __context variable__ used to evaluate the
__last instance__ of the predicate word, while __zeiu__ does the same to refer
to the latest compound containing this word.

> TODO: Formalize how anaphora behaves when the last instance was evaluated
> multiple times with different values. This is related to [donkey anaphora] and
> is far from trivial to solve.

[donkey anaphora]: https://en.wikipedia.org/wiki/Donkey_sentence

<span id="bo"></span>

> A related concept is __forethought reference__ using __KI/GI__ variables. A
> __KI/GI__ variable is first assigned by prefixing with __bo__ before being
> used in reference. Such __KI__ variables can be used similarly to pronouns in
> other languages. Such __GI__ variables are more complex to use, but are
> necessary to define some concepts of Eberban's vocabulary.

# Instantiation

__zu/zui__ allows the speaker to instantiate an argument of some predicate,
which is particularly useful when a predicate is shared using __VI/FI__ or a
__KI__ variable or argument and we want to use it with some arguments. __GI__
variables could be replaced with __KI__ variables that are then used in chaining with
__zu/zui__. __zu__ instantiates the predicate with __transitive__ behavior while
__zui__ is __intransitive__.

## Other

__zue__ allows the speaker to transform a predicate having an __A__ 0-ary
predicate place to a predicate having an __A__ 1-ary predicate place which is
satisfied by the __E__ argument.

__mi katmi mi jvin__ (I want that [I dance]) can thus be replaced by __mi zue
katmi jvin__ (I want to dance).

Note that they are not exactly equivalent, as in the first example the two
__mi__ might not refer to the same individual(s)
(if there are multiple speakers), while in the second example it is necessarily
the same. Aside from this slight difference both examples are here the same
length and thus might seem a bit overkill, but it is more useful if the thing
being repeated is longer than one syllable.