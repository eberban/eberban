# Explicit bindings (VA/FA)

**VA** and **FA** are similar families that allow to change the **right chaining
place** of a predicate unit, and also allow to add non-restrictive bindings.

However while **VA** only change the chaining place, **FA** is followed by a
whole predicate unit chain until the next **FA**, **VA** or the end of the
sentence. This next **FA/VA** will then be bound to the same left unit as the
current **FA**. **FA** thus allow to perform bindings multiple times with the
same unit.

The absense of **FA/VA** can also be seen as an implicit **vey**. Implicit or
explicit **VA** is called **sequential binding**, while the usage of **FA** is
called **parallel binding** as it allows to perform multiple bindings to the
same left unit in parallel.

In this inner predicate unit chain, the `A` place of the first unit is bound to
the **right chaining place** of the left unit. This can be changed with
[**SA**](SA_ZA.md#sa) to use another place of the first unit of the chain, or
with [**may (MA)**](../units/MA.md) in any part of the chain.

In most cases the last **FA/VA** of a sentence can be either **FA** or **VA**
with no difference in meaning if there is en equivalent in the other family.

> mi vyer fi jve mi ve/fe tca tol  
> *I visit (guided by a friend of mine) a city (which is large).*  
>
> **vyer :** `(A) visits [E] with guide (I).`  
> **jve :** `(A) is a friend of [E].`  
> **tca :** `(A) is a town/city.`  
> **tol :** `(A) is large/much (subjective) in property/dimension [E1].`  
>
> We first define each statement/predicate :
>
> - \\(P_1 = \exists a_1 \\: \text{mi}(a_1)\\)
> - \\(P_2 = \exists a_2 \exists e_2 \exists i_2 \\: \text{vyer}(a_2,e_2,i_2)\\)
> - \\(P_3 = \exists a_3 \exists e_3 \\: \text{jve}(a_3,e_3)\\)
> - \\(P_4 = \exists a_4 \\: \text{mi}(a_4)\\)
> - \\(P_5 = \exists a_5 \\: \text{tca}(a_5)\\)
> - \\(P_6 = \exists a_6 \exists E_6 \\: \text{sol}(a_6,E_6)\\)
>
>
> Then we state that some variables are bound together (shared between
> statements or predicates) :
>
> - \\(a_1 = a_2\\)
> - \\(\\color{green}{i}_2 = a_3\\) because `fi` binds the `I` place
> - \\(e_3 = a_4\\)
> - \\(\\color{green}{e_2} = a_5\\) because `ve/fe` binds the `E` place of the
>   same unit as previous `fi`.
> - \\(a_5 = a_6\\)
>
> Finally we express the complete statement :
>
> \\(P_1 \wedge P_2 \wedge (P_3 \wedge P_4) \wedge P_5 \wedge P_6\\)

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
| fay    | vay | Which place should be bound to make the proposition true ?                                                      |
| fey    |     | Binds with the next place in order. Can be usefull if there are more than 5 places.                             |
|        | vey | Binds with the usual right chaining place. Same as without a **VA**, but necessary if there is a **FA** before. |

## Non-restrictives

The **non-restrictive** particles means that the sentence is true whether or not
the right part is true. It allows to add additionnal details without changing
the truth value. These additionnal details are made in a separate statement.

In the above example, the proposition is only true if the guide is a friend of a
speaker, and the guide not being a friend makes the whole proposition false. If
`fi` is replaced by `fwi`, the guide not being a friend of a speaker doesn't
make the proposition about the visit false.

> - \\(P_1 \wedge P_2 \wedge P_5 \wedge P_6\\)
> - \\(P_3 \wedge P_4\\)

## Adverbials

**Adverbials** allows to bind over the predicate itself instead of one of its
variables. It's a tool for adding reordering flexibility to the language.
Subordinative adverbial only claims the inner clause and the outer (relativized)
part is not claimed to be true. This is not the case for restrictive and
non-restrictive adverbials. "I hope that ..." / "... which I hope is true"
doesn't claim that "..." is true.