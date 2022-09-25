# Logical primitives (MI)

Particles of family __MI__ (all particles starting with _m-_) acts as predicate
words, and some of them are defined directly in logical notation with the goal
to express logical primitives that the grammar itself don't cover.

\\[ \begin{align}
\text{ma}(c,e)      &= \text{is-atom}(e) \\\\
\text{mai}(c,e)     &= \top \\\\
\text{mae}(c,E)     &= \forall x. \\ E(c,x) \\\\
\text{mao}(c,E,A)   &= \forall x_0 \dots \forall x_n. \\ E(c,x_0,\dots,x_n) \Rightarrow A(c,x_0,\dots,x_n) \\\\
\text{mui}(c,E)     &= \text{is-unknown}(E) \\\\
\text{mue}(c,E)     &= E(c,c) \\\\
\text{mua}(c,e,A)   &= A(e) \\\\
\end{align} \\]

__ma__ wraps the primitive concept of its argument being an atom.

__mai__ puts no constraint on its argument, and is true for any possible $(e).
However to be used $(e) must exist (at some point an existential variable must
be created), and for some definitions expressing this existence and nothing
more is useful.

__mae__ simply wraps __universal quantification__ \\(\forall\\), and allow to
express something that is true for all possible values. Note that it is then
possible to use logical implication (\\(P \Rightarrow G\\) / \\((\neg P) \wedge
Q\\)) to only speak about a subset of values (the ones satisfying \\(P\\)).

__mao__ allows to express the concept that $(E) is a subset of $(A), in the
sense that any list of arguments that satisfy $(E) also satisfy $(A). It is
useful as it doesn't require the language itself to support variable amount of
arguments. Instead both $(E) and $(A) are just considered predicates of
possibly unknown arity and only the implication is relevant. $(E) and $(A)
can be of different arities, in which can __arity mismatch resolution__ can
be used to give them identical arity. This word can be useful for some
definitions, or to express that a predicate $(E) represents multiple
combinaisons of values that make $(A) true, that answers a question represented
by $(A).

__mui__ allows to interact directly with the trivalent truth values of Eberban
logic, and is only true if the provided predicate $(E) is neither true or false.
It is not possible to define this predicate from logical operators as they
are defined with trivalent truth tables. Here is the truth table of the
__AND__ (\\(\wedge\\)) operator :

| \\(A \wedge B\\) | \\(B = F\\) | \\(B = U\\) | \\(B = T\\) |
|:----------------:|:-----------:|:-----------:|:-----------:|
| \\(A = F\\)      | \\(F\\)     | \\(F\\)     | \\(F\\)     |
| \\(A = U\\)      | \\(F\\)     | \\(U\\)     | \\(U\\)     |
| \\(A = T\\)      | \\(F\\)     | \\(U\\)     | \\(T\\)     |

__mue__ and __mua__ allows to interact with the usually hidden context argument.
__mue__ accepts a 1-ary predicate that is true when provided the context as an
__explicit argument__, while __mua__ takes a proposition $(A) and an atom $(e)
such that $(A) is true when $(e) is provided as the hidden context argument.
Those 2 predicate words are what allows the context argument to be really
useful: the grammar forwards automatically the context parameter for the
speaker, which can then be used by predicates.

Other __MI__ particles are not logical wrapper and are simply root words
included in __MI__ for convinience, and will be explained in a later chapter.