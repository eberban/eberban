# First order logic

It is possible to decompose the first proposition into 2 kinds of "things" :
"drinks", which is a relation, and "a cat" or "milk", which are individuals or
objects that satisfy this relation. In a more general case, a **predicate** is a
proposition template with one or more **open blanks** (called **places**) that
must be filled in to make a complete proposition with a truth value.

The verb "drinks" can be seen as a predicate `(A) drinks (E)`, where `(A)` and
`(E)` represents open blanks. We can use variables (written in lowercase) to
fill these blanks and write :

> \\(
> \exists \color{cyan}{a} \exists \color{magenta}{e} \\
> \text{drinks}(\color{cyan}{a},\color{magenta}{e})
> \\)
>   
> There exist an \\(\color{cyan}{a}\\) and there exist an
> \\(\color{magenta}{e}\\) such that \\(\color{cyan}{a}\\) drinks
> \\(\color{magenta}{e}\\).

"A cat" can be seen as an individual which fills the `A` place of the predicate
`(A) drinks (E)`, but also of the predicate `(A) is a cat`. The entire sentence
can thus be written as :

> \\(
> \exists \color{cyan}{a} \\:
> \text{is-a-cat}(\color{cyan}{a}) \wedge
> \exists \color{magenta}{e} \\:
> \text{drinks}(\color{cyan}{a},\color{magenta}{e}) \wedge
> \text{is-milk}(\color{magenta}{e})
> \\)

In eberban, each root word defines such a predicate, and the chaining of these
predicates express how the existential variables are shared between them, while
the grammar provide tools to deviate from the default set of rules.

The above sentence can be translated in eberban as *mian puana vaule*, with the
following roots definitions :

- **mian:** `(A) is a cat.`  
- **puana:** `(A) drinks [E].`  
- **vaule:** `(A) is milk.`

In this book, the translations from eberban sentences to logic will be made by
having usually one line per root word, \\(S_n\\) lines expressing statements
while \\(F_n\\) express formulas that are embeded in other statements or
formulas.

\\[
S_1 = \exists \color{cyan}{a_1} [\text{mian}(\color{cyan}{a_1}) \wedge F_2] \\\\
F_2 = \exists \color{magenta}{e_2} [\text{puana}(\color{cyan}{a_1}, \color{magenta}{e_2}) \wedge F_3] \\\\
F_3 = [\text{vaule}(\color{magenta}{e_2})]
\\]