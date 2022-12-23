# VI/FI

## Families patterns

- __VI__ particle family contains all particles starting with __v-__ except
  __vei__.
- __FI__ particle family contains all particles starting with __f-__.
- __VEI__ particle family contains only __vei__.

## Role

Those families allows explicitly bindings predicate chains \\(C\\) to slots of a
chaining unit \\(U\\), in addition to the binding performed by chaining.

A chaining unit wihout explicit binds have the following form, which will be
modified for each __VI/FI__ used:

\\[
[\lambda c \lambda e \lambda a \ldots: U(c,e,a,\ldots)]
\\]

## Members

Most __VI__ and __FI__ comes in pairs that performs the same kind of binding.
__VI__ marks the first explicit bind, while __FI__ must be used for any
  additional explicit bind to the same predicate unit as the preceding __VI__
particle.

### __vi/fi__

Binds no slot, and thus is unrelated to the predicate unit slots. It
allows easily adding propositions that will be evaluated with the same context
as the chaining unit.

\\[
[\lambda c \lambda e \lambda a \ldots: U(c,e,a,\ldots) \color{magenta}{\wedge C(c)}]
\\]

### __ve/va/vo/vu/fe/fa/fo/fu__

Binds the slot represented by the final vowel, of
the anchor predicate unit. The variable satisfying this slot is stated to also
satisfy the property expressed by predicate chain after this particle.

Using __ve__ will translate to the following expression:

\\[
[\lambda c \lambda e \lambda a \ldots: U(c,e,a,\ldots) \color{magenta}{\wedge C(c,e)}]
\\]

### __vie/via/vio/viu/fie/fia/fio/fiu__

Binds the slot represented by the final vowel, of the anchor predicate unit. The
variable satisfying this slot must be a predicate variable, and is stated to be
equivalent to the predicate defined by the inner predicate chain.

Using __vie__ will translate to the following expression:

\\[
[\lambda c \lambda E \lambda a \ldots: U(c,E,a,\ldots) \color{magenta}{\wedge E \Leftrightarrow C}]
\\]

### __vea/fea__

The predicate unit \\(U\\) is wrapped inside proposition that satisfies the provided
predicate chain \\(C\\).

Wrapping can be represented using the following predicate:


\\[
W_{\text{vea}} = [\lambda c \lambda C \lambda U: C(c,[\lambda c_P: U(c_P)])]
\\]

"\\(U\\) vea \\(C_1\\)" this gives the following expression:

\\[
[
  \lambda c \lambda e \lambda a \ldots:
  \color{magenta}{W_{\text{vea}}(c,C_1,
  [\lambda c_1: }U(\color{magenta}{c_1},e,a,\ldots)\color{magenta}{]
)}]
\\]

Additional __fea__ will wrap around __inside__ previous ones. A explicit binding in the form
of "\\(U\\) vea \\(C_1\\) fea \\(C_2\\)" will yield the following expression:

\\[
[
  \lambda c \lambda e \lambda a \ldots:
  \color{magenta}{W_{\text{vea}}(c,C_1,
  [\lambda c_1:}
  \color{cyan}{W_{\text{vea}}(c_1,C_2,
  [\lambda c_2: }U(\color{cyan}{c_2},e,a,\ldots)\color{cyan}{]
  )}
  \color{magenta}{])}]
\\]

Any other explicit binds and chaining occurs inside too. "\\(U\\) vea \\(C_1\\) fe \\(C_2\\)"
will yield the following expression:

\\[
[
  \lambda c \lambda e \lambda a \ldots:
  \color{magenta}{W_{\text{vea}}(c,C_1,
  [\lambda c_1: }U(\color{magenta}{c_1},e,a,\ldots)
  \color{cyan}{\wedge E(c_1,e)}
  \color{magenta}{])}]
\\]

<!-- \\[
[\lambda c \lambda e \lambda a \ldots:
\color{cyan}{\exists P_2 \exists x_2. C_2(c,P_2,x_2)
\wedge P_2 \Leftrightarrow [\lambda c_2:} \\\\
\color{magenta}{\exists P_1 \exists x_1. C_1(\color{cyan}{c_2},P_1,x_1)
\wedge P_1 \Leftrightarrow [\lambda c_1: }U(\color{magenta}{c_1},e,a,\ldots)]]]
\\] -->

