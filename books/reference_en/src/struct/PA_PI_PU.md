# Propositions and paragraphs (PA/PI/PU)

## Proposition [PA + PAI]

**pa** indicates the start of a proposition, while **pai** indicates the end of
it. Both are elidable, meaning they can be removed if the text would not be
parsed differenly. **pa** is often only used to separate propositions, while
**pai** is more rarely used if something needs to be attached to a proposition a
posteriori.

## Predicate arguments [PI]

A predicate can be expressed by following **PA** with a list of
[**KA/GA**](../units/KA_GA.md) variables terminated by **pi**. Each
**KA/GA** binds to the `A`, `E`, etc in order.
Any [**ma**](../units/MA.md) in the scope will add bind following places. If
neither **PI** or **ma** are used then the scope have the same place structure
as the first unit in this scope.

> Declaring these arguments is usefull when using [subscopes](PE.md). At the
> sentence level these arguments are made existential, but are relevant when
> refering to other sentences with the [mua serie](../units/MA.md#propositions).

## Paragraphs, sections, chapters, ... [PU]

Propositions can be separated by particles of **PU** family, indicating a change
in subject. While **pu** is a small change in subject and is analog to a
paragraph separator; **pua**, **pue**, **pui**, **puo** each express an
even greater change in subject, and can be used to separate subsections,
sections, chapters, etc ...