# Predicate bindings

Each predicate unit has a **left chaining place** and a **right chaining
place**, which will define which of its variables will be bound with other
predicate units variables.

By default, both are the `(A)` place. If a definition contains a place written
in brackets `[]` (thus called a "bracketed place"), this place becomes the
**right chaining place**. The families described in the following chapters allow
to override this default behavior.

When predicates are chained after each other, for each pair of consecutive
units, the left unit right chaining place will be bound to the right unit left
chaining place.

However, if the left unit right chaining place expects a predicate, it will be
bound the right unit itself. The parameters of this predicate arguments will be
`(A)`, `(E)`, ... in order.

> mi don tun myan  
> *I like all cats.*
>
> **mi:** `(A) is me/a speaker/author.`  
> **don:** `(A) likes [E].`  
> **tun:** `(A) is the set of everything that satisfies [E1].`  
> **myan:** `(A) is a cat.`
>
> We first define each statement/predicate :
>
>
> - \\(P_1 = \exists a_1 \\: \text{mi}(a_1)\\)
> - \\(P_2 = \exists a_2 \exists e_2 \\: \text{don}(a_2,e_2)\\)
> - \\(P_3 = \exists a_3 \exists E_3 \\: \text{tun}(a_3,E_3)\\)
> - \\(P_4(a_4) = \text{myan}(a_4)\\)
>
> Then we state that some variables are bound together (shared between
> statements or predicates) :
>
> - \\(\\color{green}{a}_1 = a_2\\), because *mi* has no brackets place.
> - \\(\\color{green}{e}_2 = a_3\\), because *don* has a `[E]` individual place.
> - \\(\\color{green}{E}_3 = P_4\\), because *tun* has a `[E1]` individual
>   place.
>
> Finally we express the complete statement :
>
> \\[
> P_1 \wedge P_2 \wedge P_3
> \\]
>
> \\(P_4\\) is not included as it's not a complete statement and is embeded
> inside \\(P_3\\).