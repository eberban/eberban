# Default arguments

Some predicates are often used with the same arguments. While it can be
possible to define new predicates that wraps them and provide this argument,
thus would lead to multiple words for the same concepts, and might not be
practical for predicates made with some grammar rules such as numbers. Also,
those common arguments might be specific to some text or speech.

To address the above, Eberban allows the management of __default arguments__,
which are properties that some arguments must satisfy __only when there are no
explicit bounds on them__.

Let's take as exemple the predicate __espuateran__, which means

\\[\text{espuateran}(c,e,a) = [\text{$e$ is the home planet of species $a$}]\\]

We could want that __A__ are humans by default so that we don't have to always
specify it is the home planet of humans/Earth nor have to define another
separate predicate.

To do that, we can use the __poie/poia/poio/poiu__ serie in __PO__ to define
what is this default property: `poia espuateran flan` defines that by default
the __A__ place of __espuateran__ satisfy the property __flan__ (being a human).
The __E__ place don't have a default bind, which can be seen as having the
default bind of satisfying __mai__ (exists).

> `poia espuateran mai` can thus be used to "remove" the default human bind.

This default property can be used with the __zoie/zoia/zoio/zoiu__ serie
in __ZI__: `zoia espuateran` is thus equivalent to `flan` in this case.

Any argument that is not re-exported as an argument of the wrapping predicate and
not bound with chaining or explicit binding automatically have the default bound.

If an argument is re-exported by the wrapping predicate, the default bound is
not used, however the wrapped predicate inherits of it (as if __poie/etc__ was
used on them too). This also applies with __PO__ definitions, such as if we
define a predicate with `po ga espuateran` then the __A__ argument of __ga__
also defaults to _flan_, and _ga_ can be used in place of _espuateran_.

> Note that after defining _ga_, changing a default bind on _espuateran_ will
> not modify the one of _ga_. `poia ga ...` will thus be required instead.

Here is an example with all default bindings added: 

> __mi dona espuateran__
>
> \\[ \begin{align}
> \text{mi}(c,e)                &= \text{[$e$ is a speaker]} \\\\
> \text{dona}(c,e,a)            &= \text{[$e$ likes $a$]} \\\\
> \\ \\\\
> \text{espuateran}_1(c,e,a)    &= \text{espuateran}(c,e,a) \\\\
> \text{zoia-espuateran}_1(c,e) &= \text{zoia-espuateran}(c,e) \\\\
> \text{espuateran}^w_1(c,e)    &= \exists a. \text{espuateran}_1(c,e,a) \color{magenta}{\wedge \text{zoia-espuateran}_1(c,a)} \\\\
> \\ \\\\
> \text{dona}_1(c,e,a)          &= \text{dona}(c,e,a) \wedge \text{espuateran}^w_1(c,e) \\\\
> \text{zoia-dona}_1(c,e)       &= \text{zoia-dona}(c,e) \\\\
> \text{dona}^w_1(c,e)          &= \exists a. \text{dona}_1(c,e,a) \color{magenta}{\wedge \text{zoia-dona}_1(c,a)} \\\\
> \\ \\\\
> \text{mi}_1(c,e)              &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e) \\\\
> \text{mi}^w_1(c)              &= \exists e. \text{mi}_1(c,e) \\\\
> \end{align} \\]
>
> I like the home planet of humans (Earth, until humans start to live on other planets).

Manually binding the argument will prevent the default bind to be added:

> __mi dona espuateran va mian__
>
> \\[ \begin{align}
> \text{mi}(c,e)                &= \text{[$e$ is a speaker]} \\\\
> \text{dona}(c,e,a)            &= \text{[$e$ likes $a$]} \\\\
> \text{mian}(c,e)              &= \text{[$e$ is a cat]} \\\\
> \\ \\\\
> \text{mian}_1(c,e)            &= \text{mian}(c,e) \\\\
> \\ \\\\
> \text{espuateran}_1(c,e,a)    &= \text{espuateran}(c,e,a) \color{magenta}{\wedge \text{mian}_1(c,e)}\\\\
> \text{espuateran}^w_1(c,e)    &= \exists a. \text{espuateran}_1(c,e,a) \\\\
> \\ \\\\
> \text{dona}_1(c,e,a)          &= \text{dona}(c,e,a) \wedge \text{espuateran}^w_1(c,e) \\\\
> \text{zoia-dona}_1(c,e)       &= \text{zoia-dona}(c,e) \\\\
> \text{dona}^w_1(c,e)          &= \exists a. \text{dona}_1(c,e,a) \color{magenta}{\wedge \text{zoia-dona}_1(c,a)} \\\\
> \\ \\\\
> \text{mi}_1(c,e)              &= \text{mi}(c,e) \wedge \text{dona}^w_1(c,e) \\\\
> \text{mi}^w_1(c)              &= \exists e. \text{mi}_1(c,e) \\\\
> \end{align} \\]
>
> I like the home planet of cats (still Earth, unless we find or bring cats on other planets).

> Other chapters will omit default binds unless they are important to reduce
> verbosity.