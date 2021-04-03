# Second-order logic

Second-order logic adds predicate variables (in uppercase) in addition to
individual variables :

> mi don tun myan  
> *I like all cats.*
>
> **mi:** `(A) is me/a speaker/author.`  
> **don:** `(A) likes [E].`  
> **tun:** `(A) is the set of everything that satisfies [E1].`  
> **myan:** `(A) is a cat.`

`E1` means the `E` place expects a predicate with 1 argument.

> We first define each statement/predicate :
>
>
> - \\(P_1 = \exists a_1 \\: \text{mi}(a_1)\\)
> - \\(P_2 = \exists a_2 \exists e_2 \\: \text{don}(a_2,e_2)\\)
> - \\(P_3 = \exists a_3 \exists E_3 \\: \text{tun}(a_3,E_3)\\)
> - \\(P_4(a_4) = \text{myan}(a_4)\\)
>
> Then we state that some variables are bound together (shared between
> statements or predicates). The rules defining which place is bound to which
> will be explained the chapter about [bindings](../bindings/intro.md).
>
> - \\(a_1 = a_2\\)
> - \\(e_2 = a_3\\)
> - \\(E_3 = P_4\\)
>
> Finally we express the complete statement :
>
> \\(P_1 \wedge P_2 \wedge P_3\\)
>
> \\(P_4\\) is not included as it's not a complete statement and is embeded
> inside \\(P_3\\).