# Logical primitives (MI)

Particles of family __MI__ (all particles starting with _m-_) act as predicate
words, and some of them are defined directly in logical notation with the goal
to express logical primitives that the grammar itself don't cover.

\\[ \begin{align}
\text{ma}(c,e)      &= \text{is-atom}(e) \\\\
\text{mai}(c,e)     &= \top \\\\
\text{mao}(c,e,A,O)   &= \forall x_0 \dots \forall x_n. \\ O(c,x_0,\dots,x_n) \Rightarrow A(c,x_0,\dots,x_n) \\\\
\text{mui}(c)       &= \text{unknown} \\\\
\text{mue}(c,e)     &= c = e \\\\
\text{mua}(c,e,A)   &= A(e) \\\\
\end{align} \\]

__ma__ (intransitive) wraps the primitive concept of its argument being an atom.

__mai__ (intransitive) puts no constraint on its argument, and is true for any possible $(e).
However to be used $(e) must exist (at some point an existential variable must
be created), and for some definitions expressing this existence and nothing
more is useful.

__mao__ (transitive) allows the speaker to express the concept that $(A) is a subset of $(O),
in the sense that any list of arguments that satisfy $(A) also satisfy $(O). It
is useful as it doesn't require the language itself to support a variable number
of arguments. Instead both $(A) and $(O) are just considered predicates of
possibly unknown arity and only the implication is relevant. $(A) and $(O)
can be of different arities, in which __arity mismatch resolution__ can
be used to give them identical arity. This word can be useful for some
definitions, or to express that a predicate $(A) represents multiple
combinations of values that make $(O) true, that answers a question represented
by $(O). $(E) slot is skipped to make it easier to use in sentences.

__mui__ (intransitive) always returns the __unknown__ truth value.

__mue__ (intransitive) and __mua__ (transitive) allows the speaker to interact with the usually hidden
context argument. __mue__ accepts a 1-ary predicate that is true when provided
the context as an __explicit argument__, while __mua__ takes a proposition $(A)
and an atom $(e) such that $(A) is true when $(e) is provided as the hidden
context argument. These predicate words are what allows the context argument
to be really useful: the grammar automatically forwards the context parameter
for the speaker, which can then be used by predicates.

Other __MI__ particles are not logical wrappers, they are simply root words
included in __MI__ for convenience and will be explained in a later chapter.