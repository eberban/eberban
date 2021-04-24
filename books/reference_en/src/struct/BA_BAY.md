# Negations (BA/BAY)

**BA** and **BAY** are families used to express negations.

## Negating a unit

Any predicate unit can be prefixed with **ba** to negates its statement.
However the existential variables are not negated, and the complete statement
is still true.

> *myan plin **ba** mlan* : A cat is drinking something that is not milk.
>
> We first define each statement :
>
> - \\(P_1 = \exists a_1 \\: \text{myan}(a_1)\\)
> - \\(P_2 = \exists a_2 \exists e_2 \\: \text{plin}(a_2,e_2)\\)
> - \\(P_3 = \exists a_3 \\: \neg\text{mlan}(a_3)\\)
>
> Then we state that some variables are bound together (shared between
> statements) :
>
> - \\(a_1 = a_2\\)
> - \\(e_2 = a_3\\)
>
> Finally we express the complete statement :
>
> \\(P_1 \wedge P_2 \wedge P_3\\)

> **BA** cannot be placed before a **SA**, as **SA** allow to tag places for
> bindings or **ZA**-transformations, which are irrelevent to negations.

## Negating a scope

Any scope can be negated by adding **bay** at the begining of a scope (after
**PI** if present). The existential variables are also negated and the complete
statement is false.

> *(pa) **bay** myan plin mlan* : It is false that {A cat is drinking milk}.
>
> We first define each statement :
>
> - \\(P_1 = \exists a_1 \\: \text{myan}(a_1)\\)
> - \\(P_2 = \exists a_2 \exists e_2 \\: \text{plin}(a_2,e_2)\\)
> - \\(P_3 = \exists a_3 \\: \text{mlan}(a_3)\\)
>
> Then we state that some variables are bound together (shared between
> statements) :
>
> - \\(a_1 = a_2\\)
> - \\(e_2 = a_3\\)
>
> Finally we express the complete statement :
>
> \\(\neg[P_1 \wedge P_2 \wedge P_3]\\)

> If the scope takes arguments, these arguments are not negated as they come
> from outside the scope.
> 
> \\(P_n(a_n, E_n) = \neg[\exists i_n \exists O_n\\: \text{unit}(a_n, E_n, i_n, O_n)]\\)