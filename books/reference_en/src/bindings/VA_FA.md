# Explicit bindings (VA/FA)

| FA     | VA  | Definition                                                                                                      |
| ------ | --- | --------------------------------------------------------------------------------------------------------------- |
| fa     | va  | Binds `A` place (restrictive)                                                                                   |
| fe     | ve  | Binds `E` place (restrictive)                                                                                   |
| fi     | vi  | Binds `I` place (restrictive)                                                                                   |
| fo     | vo  | Binds `O` place (restrictive)                                                                                   |
| fu     | vu  | Binds `U` place (restrictive)                                                                                   |
| &nbsp; |     |                                                                                                                 |
| fwa    | vwa | Binds `A` place (non-restrictive)                                                                               |
| fwe    | vwe | Binds `E` place (non-restrictive)                                                                               |
| fwi    | vwi | Binds `I` place (non-restrictive)                                                                               |
| fwo    | vwo | Binds `O` place (non-restrictive)                                                                               |
| fwu    | vwu | Binds `U` place (non-restrictive)                                                                               |
| &nbsp; |     |                                                                                                                 |
| fya    | vya | Adverbial : Binds predicate unit (restrictive)                                                                  |
| fye    | vye | Adverbial : Binds predicate unit (non-restrictive)                                                              |
| fyi    | vyi | Adverbial : Binds predicate unit (subordinative)                                                                |
| &nbsp; |     |                                                                                                                 |
| fey    | vey | Which place should be bound to make the proposition true ?                                                      |


**FA** and **VA** are placed between 2 units, before any **SA/ZA** of the right
unit.

## Sequential binding modifier : VA

**VA** allows to change how sequential binding is performed, overwriting the
default rules.

**va/ve/vi/vo/vu** allow to change which place is used in the binding.

> Lets define **unit3** as `(A) ... (E) ... (I1)`
> Default sequential bindings between this unit expressed in \\(P_1\\) and
> a following one in \\(P_2\\) is :
>
> \\[ P_1(a_1) = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1) \wedge P_2(a_1)\\]
>
> By using **ve** between **unit3** and the following unit will result in this
> bind :
>
> \\[ P_1(a_1) = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1) \wedge P_2(\color{magenta}{e_1})\\]
>
> Since the `I` place expects a predicate, using **vi** between **unit3** and
> the following unit will result in this bind :
> 
> \\[ P_1(a_1) = \exists e_1 \\: \text{unit3}(a_1, e_1, \color{magenta}{P_2})\\]
>
> **va** is usefull is the unit have a bracket place that we don't want to bind
> to.

**vwa/vwe/vwi/vwo/vwu** are called **non-restrictive bindings**. Instead
of the binding being part of the current statement, it is part of its own
independent statement. It is used to add additionnal information which can be
false without changing the truth value of the main statement.

> By using **vwa** between **unit3** and the following unit will result in this
> bind, \\(\color{magenta}{P^\alpha_1}\\) being an independent statement :
>
> \\[
> P_1(a_1) = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1) \\\\
> \color{magenta}{P^\alpha_1 = P_2(a_1)}
> \\]

**vya/vye/vyi** are called **adverbials**. They allow to perform a bind on the
predicate itself.

> **vya** performs a restrictive bind over the predicate itself :
> 
> \\[
> P_1(a_1) = \color{magenta}{P^\alpha_1} \wedge \color{cyan}{P_2}(\color{magenta}{P^\alpha_1}) \\\\
> \color{magenta}{P^\alpha_1} = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1)
> \\]
>
> **vye** performs a non-restrictive bind, which is stated in its own
> \\(P^\beta_1\\) independant statement.
> 
> \\[
> P_1(a_1) = \color{magenta}{P^\alpha_1} \\\\
> \color{magenta}{P^\alpha_1} = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1) \\\\
> P^\beta_1 = \color{cyan}{P_2}(\color{magenta}{P^\alpha_1})
> \\]
>
> **vyi** performs a subordinative bind. This predicate itself is not stated to
> be true.
> 
> \\[
> P_1(a_1) = \color{cyan}{P_2}(\color{magenta}{P^\alpha_1}) \\\\
> \color{magenta}{P^\alpha_1} = \exists e_1 \exists I_1 \\: \text{unit3}(a_1, e_1, I_1)
> \\]

## Parallel binding modifier : FA

**FA** allow to perform multiple bindings on the same left unit. Each **FA**
starts a **FA-scope** that ends when reaching another **FA** or **VA**, and
thus can't contain other **FA** or **VA** (for more complex statements,
use [subscopes](../struct/PE.md)). **fay** is a terminator for **FA** which can
be used to return to the sequential binding without using a **VA**.
(is needed when using [**DAY**](../struct/DAY.md) in the sequential binding
immediately after a **FA-scope** also contains **DAY**)

**FA** contains an equivalent of every **VA**, performing the same logic but
in a parallel way.

> mi vyer fi jve mi ve tca pcaro tol  
> *I visit (guided by a friend of mine) a city (which area is large).*  
>
> - jve: `(A) is a friend of [E].`
> - mi: `(A) is I/a speaker/author.`
> - pcaro: `(A) has area [E] (measure, meters^2 by default / object(s) with same area).`
> - tca: `(A) is a town/city.`
> - tol: `(A) is a large number (subjective/contextual) in dimension/unit [E1].`
> - vyer: `(A) visits [E] with guide (I).`
>
> \\[
> \begin{align}
> P_1 &= \exists a_1 &&\text{mi}(a_1) &\wedge P_2(a_1) \\\\
> P_2(a_2) &= \exists e_2 \exists i_2 &&\text{vyer}(a_2,e_2,i_2) &\wedge \color{cyan}{P_3}(i_2) &\wedge \color{magenta}{P_5}(e_2) \\\\
> \color{cyan}{P_3}(a_3) &= \exists e_3 &&\text{jve}(a_3,e_3) &\wedge P_4(e_3) \\\\
> P_4(a_4) &= &&\text{mi}(a_4) \\\\
> \color{magenta}{P_5}(a_5) &= &&\text{tca}(a_5) &\wedge P_6(a_5) \\\\
> P_6(a_6) &= \exists e_6 &&\text{pcaro}(a_6,e_6) &\wedge P_7(e_6) \\\\
> P_7(a_7) &= \exists e_7 &&\text{tol}(a_7,e_7)
> \end {align}
> \\]