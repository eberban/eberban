# Logic framework

Eberban is based on a custom __[Higher-order Logic (HOL)]__ and tries to stay
pretty close to expressions in such logic while being targeted for human speech.

[Higher-order Logic (HOL)]: https://en.wikipedia.org/wiki/Higher-order_logic

Eberban grammar allows the speaker to manipulate __predicates__. They are
functions that take __arguments__ as input and output a __truth value__ which
can be __true__, __false__ or __unknown/undefined__. They are introduced by
__predicate words__ or created from other predicates using Eberban grammar.

Arguments are not filled using __predicate words__ directly and there is no
word that directly represents them. Instead some __particles__ allow the speaker
to select which arguments are going to be used for various operations on 
__predicates__, such as connecting them with each other. Arguments are typed, 
and can either represent __predicates__ or non-predicates which are called
__atoms__.

The first of these arguments is handled automatically by the grammar and is
called the __context argument__. It is used to carry information between
predicates without verbosity for speakers to implement things, such as tenses.

Other arguments are represented using the vowels __e, a, o, u__ in this order.
They are used in definitions but also in some families of particles related to
argument selection. They are called __explicit arguments__ (to exclude the
_implicit_ context argument), and we call __arity__ (N-ary) the number of
__explicit arguments__.

Here is an exemple of a simple predicate :

> __mian__
>
> \\[ \text{mian}(c,e) = \text{[$e$ is a cat in context $c$]} \\]
> 
> Given $(c), $(e):\
> $(e) is a cat in context $(c).
>
> $(c) and $(e) are arguments that will be provided when used in a sentence.

> In future explanations we'll omit the context argument outside of logical
> notation to be shorter, unless the context argument is the focus of the
> explanation.

Any __predicate word__ not yet defined in the dictionnary or by the speaker
return __unknown/undefined__ for any arguments.