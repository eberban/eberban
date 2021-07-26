# Unit transformations (SA/ZA/BI)

## SA

> __Deprecated :__ __SA__ no longer works that way.

**SA** allow to change which is the **left chaining place** of the following
predicate unit. Other **SA** allow to use special variables that are related
to the predicate unit. If the predicate unit don't have a bracket place, the
**right chaining place** is also modified.

| Word | Definition                                                |
| ---- | --------------------------------------------------------- |
| sa   | tags `A` place                                            |
| se   | tags `E` place                                            |
| si   | tags `I` place                                            |
| so   | tags `O` place                                            |

> If we define **unit3** as `(A) ... (E) ... [I]`, it will by default have this
> kind of bindings :  
>
> \\[F_1 = \exists \color{magenta}{e_1} \exists i_1
> [\text{unit3}(\color{cyan}{x},\color{magenta}{e_1},i_1) \wedge F_2] \\]
>
> Here \\(\color{cyan}{x}\\) represents the variable of the previous unit this
> unit is bound to. In practice \\(\color{cyan}{x}\\) must be replaced by a real
> variable name.
>
> -----
>
> If it is prefixed by **se**, the bindings will be changed to :
>
> \\[F_1 = \exists \color{magenta}{a_1} \exists i_1
> [\text{unit3}(\color{magenta}{a_1},\color{cyan}{x},i_1) \wedge F_2] \\]
>
> Notice \\(\color{cyan}{x}\\) is now used as the second argument of **unit3**,
> and the existential variable now corresponds to the `A` place. 
>
> -----
>
> Since **unit3** has an `I` **bracket place**, \\(F_2\\) will bind to
> \\(i_1\\). However for units that don't have a bracket place, \\(F_2\\) would
> bind to \\(\color{cyan}{x}\\).
>
> -----
>
> **SA** works similarly with predicate bindings. Here is an example with **si
> sa**, bound to a 2-ary predicate place :
>
> \\[
> F_1 = \forall i_1 \forall a_1 [\color{cyan}{X_0}(i_1, a_1) \leftrightarrow
> (\exists e_1 [\text{unit3}(a_1,e_1,i_1) \wedge F_2])]
> \\]
>
> If the number of **SA** is less than the arity, `A`, `E`, etc in order are
> used, skipping places that have been chosen with **SA**. It is allowed to use
> the same **SA**, which states the both variables are also equal.

## ZA

**ZA** allow to change the place structure or meaning of the following predicate
unit. 

| Word | Definition                                                          |
| ---- | ------------------------------------------------------------------- |
| za   | `(A) is named [predicate-(A)].`                                     |
| zai  | ZA question : what transformation would make the proposition true ? |
| ze   | Use the previous instance of this unit.                             |
| zi   | Narrow-scope negation.                                              |
| zo   | `(A) is something referred to by [predicate-(A)].`                  |
| zoi  | `(A) is a reference/symbol refering to [predicate].`                |


> **za** allow to make a name from a place of the unit. Other bindings will be
> made with this *name variable* instead of the original places.
>
> \\[
> F_1 = \exists \color{magenta}{a_1} [\text{is-named}(\color{cyan}{x},
> \color{magenta}{a_1}) \wedge F^\prime_1 \wedge F_2]\\\\
> F^\prime_1 = \exists e_1 \exists i_1 [\text{unit3}(a_1,e_1,i_1)]
> \\]
>
> The place can be selected by adding **SA** after **za**.
>
> -----
>
> **zo** is similar to **za** but express something that is refered by the
> predicate `A` place. The `A` place of the predicate is a symbol for this new
> `A` place.
>
> -----
>
> **ze** allow to re-use a previous instance of this unit and all of its
> variables as if all bindings were made on the original.

> **zoi** is similar to **za/zo** but use the unit itself. Other bindings will
> be made with this *referred/symbol variable* instead of the original places.
>
> \\[
> F_1 = \exists Z_1 [\text{is-symbol}(\\color{cyan}{x}, Z_1) \wedge F^\prime_1
> \wedge F_2] \\\\
> F^\prime_1 = Z_1 \leftrightarrow (\exists a_1 \exists e_1 \exists i_1
> [\text{unit3}(a_1,e_1,i_1)])
> \\]

> Prefixing by **zi** negates only the unit :
>
> \\[F_1 = \exists e_1 \exists i_1
> [\color{cyan}{(\neg}\text{unit3}(x,e_1,i_1)\\color{cyan}) \wedge F_2] \\]

## BI

> To also negate the existential variables and the bindings, **bi** must be used
> instead :
>
> \\[F_1 = \\color{magenta}{\neg(}\exists e_1 \exists i_1
> [\text{unit3}(x,e_1,i_1) \wedge F_2]\\color{magenta}) \\]
>
> **bi** must be placed before any **SA/ZA**.