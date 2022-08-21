# Logic framework

Eberban is based on a custom __[Higher-order Logic (HOL)]__ and tries to stay
pretty close to expressions in such logic while being targeted for human speech.

[Higher-order Logic (HOL)]: https://en.wikipedia.org/wiki/Higher-order_logic

Eberban grammar allow the speaker to manipulate __predicates__. They are a
functions that takes __arguments__ and returns a __truth value__ which can be
__true__, __false__ or __unknown/undefined__. They are introduced by __predicate
words__ or created from other predicates using Eberban grammar.

Arguments are typed, and can be either __predicates__ or non-predicates which
are called __atoms__. They are filled with variables that are handled implicitly
by the grammar.

The first of those arguments is handled automatically by the grammar and is
called the __context argument__. It is used to carry information between
predicates without verbosity for speakers to implement things such as tenses.

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
> $(c) and $(e) are argument that will be provided when used in a sentence.

> In future explanations we'll omit the context argument outside of logical
> notation to be shorter, unless the context argument is the focus of the
> explanation.
