# Predicate bindings

Each predicate unit has a **left chaining place** and a **right chaining
place**, which will define which of its variables will be bound with other
predicate units variables.

By default, both are the `(A)` place. If a definition contains a place written
in brackets `[]` (thus called a "bracketed place"), this place becomes the
**right chaining place**. The families described in the following chapters allow
to extend from this default behavior.

When predicates are chained after each other, for each pair of consecutive
units, the left unit right chaining place will be bound to the right unit left
chaining place. This is called **sequential binding**.

However, if the left unit right chaining place expects a predicate, it will be
bound to the right unit itself. The parameters of this predicate arguments will
be `(A)`, `(E)`, ... in order.

\\[
  S_1 = \exists a_1 [\text{mi}(\color{cyan}{a_1}) \wedge F_2] \\\\
  F_2 = \exists e_2 [\text{don}(\color{cyan}{a_1},\color{purple}{e_2}) \wedge F_3] \\\\
  F_3 = \exists E_3 [\text{tun}(\color{purple}{e_2},\color{magenta}{E_3}) \wedge F_4] \\\\
  F_4 = \forall a_4 (\color{magenta}{E_3}(a_4) \leftrightarrow [\text{mian}(a_4)])
\\]

- In \\(F_2\\), \\(\\color{cyan}{a_1}\\) is chained because **mi** don't have a
  bracket  place.
- In \\(F_3\\), \\(\\color{purple}{e_2}\\) is chained because **don** has a
  `[E]` individual bracket place.
- In \\(F_4\\), \\(\\color{magenta}{E_3}\\) is chained because **tun** has a
  `[E1]` predicate bracket place.

> After a proposition is complete, all variables are turned into constants that
> can be refered to in future propositions.