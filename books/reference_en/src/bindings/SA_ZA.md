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
| say  | SA question : which tag would make the proposition true ? |
| sey  | something related to the predicate (vague transformation) |
| soy  | event of the predicate being true                         |

## ZA

**ZA** allow to change the place structure and/or meaning of the following
predicate unit. Any bindings will be made with the final place structure instead
of the original.

| Word | Definition                                                                                                 |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| za   | `(A) is named [predicate-(A)].`                                                                            |
| zay  | ZA question : what transformation would make the proposition true ?                                        |
| ze   | Use the same instance and variables of the following unit instead of a new one.                            |
| zi   | `[A?] is an instance of predicate [predicate] with places (E).` (`?` indicates it takes a predicate as-is) |
| zo   | `(A) is something referred to by [predicate].`                                                             |
| zoy  | `(A) is a reference/symbol refering to [predicate].`                                                       |
| zu   | scalar negator : other than/un-/non-[predicate] (scale or set is implied). Keeps the same place structure. |

> When using [**po** with a **GAY**](../units/KA_KAY_GA_GAY.md), **SA/ZA** must
> be placed before the unit itself : `GAY po ZA <unit>` or `ZA <unit> po GAY`.
> **SA** don't have any effect on **GAY** affectation, and will only affect the
> surroundng statement.