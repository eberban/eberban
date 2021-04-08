# Unit transformations (SA/ZA/BA)

## SA

**SA** allow to change which is the **left chaining place** of the following
predicate unit. **say** allows to ask which **SA** should be used to make the
proposition true. Other **SA** allow to use special variables that are related
to the predicate unit. If the predicate unit don't have a bracket place, the
**right chaining place** is also modified.

| Word | Definition                                                |
| ---- | --------------------------------------------------------- |
| sa   | tags `A` place                                            |
| se   | tags `E` place                                            |
| si   | tags `I` place                                            |
| so   | tags `O` place                                            |
| su   | tags `U` place                                            |
|      | &nbsp;                                                    |
| say  | SA question : which SA would make the proposition true ?  |
| sey  | something related to the predicate (vague transformation) |
| soy  | event of the predicate being true                         |

> If we define **unit3** as `(A) ... (E) ... [I]`, it will by default have this
> kind of bindings :  
> 
> \\[P_1(\\color{cyan}{a_1}) = \exists \\color{magenta}{e_1} \exists i_1 \\: \text{unit3}(\\color{cyan}{a_1},\\color{magenta}{e_1},i_1) \wedge P_2(i_1) \\]
> 
> If it is prefixed by **se**, the bindings will be changed to :
> 
> \\[P_1(\\color{magenta}{e_1}) = \exists \\color{cyan}{a_1} \exists i_1 \\: \text{unit3}(\\color{cyan}{a_1},\\color{magenta}{e_1},i_1) \wedge P_2(i_1) \\]
> 
> If however `I` was not a bracket place, prefixing with **se** would give :
> 
> \\[P_1(\\color{magenta}{e_1}) = \exists \\color{cyan}{a_1} \exists i_1 \\: \text{unit3}(\\color{cyan}{a_1},\\color{magenta}{e_1},i_1) \wedge P_2(\\color{magenta}{e_1}) \\]
> 
> If \\(P_1\\) is more than 1-ary, additionnal **sa/se/si/so/su/say** can be
> used to choose the other places. If the number of **SA** is less than the
> arity, `A`, `E`, etc in order are used, skipping places that have been chosen
> with **SA**. It is allowed to use the same **SA**, which states the both
> variables are also equal.


> **sey** and **soy** adds a new variable allowing to speak about the unit itself :
> 
> \\[
> P_1(\\color{green}{x}) = \text{is-event}(\\color{green}{x}, P^\prime_1) \wedge P_2(\\color{magenta}{i_1}) \\\\
> P^\prime_1 = \exists a_1 \exists e_1 \exists \\color{magenta}{i_1} \\: \text{unit3}(a_1,e_1,\\color{magenta}{i_1})
> \\]
>
> **Further bindings will still use the original places of the unit.**

## ZA

**ZA** allow to change the place structure or meaning of the following
predicate unit. 

| Word | Definition                                                          |
| ---- | ------------------------------------------------------------------- |
| za   | `(A) is named [predicate-(A)].`                                     |
| zay  | ZA question : what transformation would make the proposition true ? |
| ze   | `(A)` is the same `A` as in the previous instance of this unit.     |
| zi   | Wide-scope negation.                                                |
| zya  | Narrow-scope negation.                                              |
| zo   | `(A) is something referred to by [predicate].`                      |
| zoy  | `(A) is a reference/symbol refering to [predicate].`                |


> **za** allow to make a name from a place of the unit. Other bindings will be
> made with this *name variable* instead of the original places.
> 
> \\[
> P_1(\\color{green}{x}) = \text{is-named}(\\color{green}{x}, \\color{magenta}{a_1}) \wedge \\color{cyan}{P^\prime_1} \wedge P_2(\\color{green}{x}) \\\\
> \\color{cyan}{P^\prime_1} = \exists \\color{magenta}{a_1} \exists e_1 \exists i_1 \\: \text{unit3}(a_1,e_1,i_1)
> \\]
>
> The place can be selected by adding **SA** after **za**.


> **ze** allow to reuse a variable of the previous instance of this unit.
>
> \\[
> P_1(\\color{magenta}{a_1}) = \exists e_1 \exists i_1 \\: \text{unit3}(\\color{magenta}{a_1},e_1,i_1) \wedge P_2(i_1) \\\\
> \vdots \\\\
> P_5(\\color{cyan}{a_5}) = (\\color{cyan}{a_5} = \\color{magenta}{a_1}) \wedge P_2(\\color{cyan}{a_5})
> \\]
> 
> The place can be selected by adding **SA** after **ze**.


> **zo** and **zoy** are similar to **za** but use the unit itself. Other bindings will be
> made with this *referred/symbol variable* instead of the original places.
> 
> \\[
> P_1(\\color{green}{x}) = \text{is-symbol}(\\color{green}{x}, \\color{cyan}{P^\prime_1}) \wedge P_2(\\color{green}{x}) \\\\
> \\color{cyan}{P^\prime_1} = \exists a_1 \exists e_1 \exists i_1 \\: \text{unit3}(a_1,e_1,i_1)
> \\]


> Prefixing by **zi** negates the entire content of the formula :
> 
> \\[P_1(a_1) = \\color{magenta}{\neg(}\exists e_1 \exists i_1 \\: \text{unit3}(a_1,e_1,i_1) \wedge P_2(i_1)\\color{magenta}) \\]
>
> Prefixing by **zya** negates only the unit itself :
>
> \\[P_1(a_1) = \exists e_1 \exists i_1 \\: \\color{cyan}{\neg(}\text{unit3}(a_1,e_1,i_1)\\color{cyan}) \wedge P_2(i_1) \\]
>
> Both can be used at the same time in any order :
>
> \\[P_1(a_1) = \\color{magenta}{\neg(}\exists e_1 \exists i_1 \\: \\color{cyan}{\neg(}\text{unit3}(a_1,e_1,i_1)\\color{cyan}) \wedge P_2(i_1)\\color{magenta}) \\]
>
> The same **zi**/**zya** can be used multiple times, but every pair of them cancel each other.