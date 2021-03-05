# First order logic

It is possible to decompose the first proposition into 2 kinds of "things" :
"drinks", which is a relation, and "a cat" or "milk", which are individuals or
objects that satisfy this relation. In a more general case, a **predicate** is a
proposition template with one or more **open blanks** (called **places**)
that must be filled in to make a complete proposition with a truth value.

The verb "drinks" can be seen as a predicate `Ⓐ drinks Ⓔ`, where Ⓐ and Ⓔ
represents open blanks. We can use variables (written in lowercase) to fill
these blanks and write :

> \\[\exists a \exists e \\: \text{drinks}(a,e)\\] There exist a \\(a\\) and a
> \\(e\\) such that \\(a\\) drinks \\(e\\).

"A cat" can be seen as an individual which fills the Ⓐ place of the predicate `Ⓐ
drinks Ⓔ`, but also of the predicate `Ⓐ is a cat`. The entire sentence can thus
be written as :

> \\[\exists a \exists e \\: \text{is-a-cat}(a) \wedge \text{drinks}(a,e) \wedge
> \text{is-milk}(e)\\]

or, to match more closely how eberban grammar works :

> We first define each statement :
>
> \\[
> P_1 = \exists a_1 \\: \text{is-a-cat}(a_1) \\\\
> P_2 = \exists a_2 \exists e_2 \\: \text{drinks}(a_2,e_2) \\\\
> P_3 = \exists a_3 \\: \text{is-milk}(a_3) \\\\
> \\]
>
> Then we state that some variables are bound together (shared between
> statements) :
>
> \\[
> a_1 = a_2 \\\\
> e_2 = a_3
> \\]
>
> Finally we express the complete statement :
>
> \\[
> P_1 \wedge P_2 \wedge P_3
> \\]

The eberban sentence to say that is :

> myan plin lwan

with the following definitions :

> **myan:** Ⓐ is a cat.  
> **plin:** Ⓐ drinks [Ⓔ].  
> **lwan:** Ⓐ is milk.

Each predicate word matches a proposition in the expression above, with the
definitions providing the variables and how they are bound to each other. The
language doesn't allow to manipulate these variables directly, but provide
particles allowing to change how variables are bound together.