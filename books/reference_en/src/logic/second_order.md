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
S_1 = \exists a_1 [\text{mi}(a_1)      \wedge F_2] \\\\
F_2 = \exists e_2 [\text{don}(a_1,e_2) \wedge F_3] \\\\
F_3 = \color{cyan}{\exists E_3} [\text{tun}(a_3,\color{cyan}{E_3}) \wedge F_4] \\\\
F_4 = \color{magenta}{\forall a_4} (\color{cyan}{E_3}(\color{magenta}{a_4})
\leftrightarrow [\text{myan}(\color{magenta}{a_4})])
\\]

> \\(F_4\\) is read as "For all \\(\color{magenta}{a_4}\\),
> \\(\color{cyan}{E_3}(\color{magenta}{a_4})\\) is equivalent to
> \\(myan(\color{magenta}{a_4})\\)". This notation allow to define
> \\(\color{cyan}{E_3}\\) using some arguments that will be provided by **tun**.