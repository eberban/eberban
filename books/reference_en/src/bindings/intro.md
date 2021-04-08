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
bound to the right unit itself. The parameters of this predicate arguments will be
`(A)`, `(E)`, ... in order.

\\[
\begin{align}
    P_1         &= \exists a_1 &&\text{mi}(a_1)         &\wedge P_2(\\color{cyan}{a_1}) \\\\
    P_2(a_2)    &= \exists e_2 &&\text{don}(a_2,e_2)    &\wedge P_3(\\color{purple}{e_2}) \\\\
    P_3(a_3)    &=             &&\text{tun}(a_3,\\color{magenta}{P_4}) \\\\
    P_4(a_4)    &=             &&\text{lwan}(a_4)
\end{align}
\\]

- In \\(P_1\\), \\(\\color{cyan}{a_1}\\) is chained because **mi** don't have a
  bracket  place.
- In \\(P_2\\), \\(\\color{purple}{e_2}\\) is chained because **don** has a
  `[E]` individual bracket place.
- In \\(P_3\\), \\(\\color{magenta}{P_4}\\) is chained because **tun** has a
  `[E1]` predicate bracket place.