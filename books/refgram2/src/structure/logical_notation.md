# Logical notation

In logical notation, atom or generic variables are written in lowercase cursive \\(x\\),
while predicate variables are written in uppercase cursive \\(X\\). Predicate
words are written in lowercase serif \\(\text{mian}\\).

The Eberban grammar manipulates lots of anonymous predicates. They are
transcribed into the following notation, which each \\(\lambda\\) declaring a
new argument of the anonymous predicate delimited by brackets \\([]\\):

\\[
[\lambda c \lambda e \lambda a \ldots: \ldots]
\\]

As predicate chaining is right-grouping and produce highly nested anonymous
predicates, the following notation to evaluate a predicate produce unreadable
expressions:

\\[
\[\lambda c \lambda e \lambda a \ldots: \ldots\](c,e,a,\ldots)
\\]

We thus define the binary operator \\(\bullet\\) (bullet) to write the arguments
before the predicate. Thus we have the following equivalence:

\\[
(c,e,a,\ldots)\bullet[\lambda c \lambda e \lambda a \ldots: \ldots\] \equiv  [\lambda c \lambda e \lambda a \ldots: \ldots\](c,e,a,\ldots)
\\]

Classical postfixed notation is however prefered for non-anonymous predicates.