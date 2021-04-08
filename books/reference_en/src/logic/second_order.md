# Second-order logic

Second-order logic adds predicate variables in addition to individual variables,
with predicate expecting other predicates as parameters.

The eberban sentence *mi don tun myan* means "I like all cats".

> - **mi:** `(A) is me/a speaker/author.`  
> - **don:** `(A) likes [E].`  
> - **tun:** `(A) is the set of everything that satisfies [E1].`  
> - **myan:** `(A) is a cat.`
>
> `E1` means the `E` place expects a predicate with 1 argument.

Translated into logical notation we get :

\\[
\begin{align}
    P_1         &= \exists a_1 &&\text{mi}(a_1)         &\wedge P_2(a_1) \\\\
    P_2(a_2)    &= \exists e_2 &&\text{don}(a_2,e_2)    &\wedge P_3(e_2) \\\\
    P_3(a_3)    &=             &&\text{tun}(a_3,P_4) \\\\
    P_4(a_4)    &=             &&\text{lwan}(a_4)
\end{align}
\\]

Here \\(P_4\\) is provided as-is to **tun**, which internaly will use it by
providing it an argument. It can use it multiple time with different variables.
Each usage is called an **instance** of this predicate.