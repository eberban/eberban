# Logical connectives (DA)

Logical connectives of family **DA** allow to connect two propositions, defining
the final truth value based on the truth value of its components. **DA** can
be prefixed with **ba** to negate the left component, while it can be suffixed
with **BAY** to negate the right component. **di** allow to ask a question about
which logicial connective would make the result true.

| left  | right |     | da    | de    | do    | du    | duhu  |
| ----- | ----- | --- | ----- | ----- | ----- | ----- | ----- |
| True  | True  |     | True  | True  | True  | True  | True  |
| True  | False |     | True  | False | False | False | True  |
| False | True  |     | True  | False | False | True  | False |
| False | False |     | False | False | True  | False | False |

Using these 5 words, **ba** and **bay**, all truth table can be expressed
(except "always true" and "always false" ones).

> **du** and **duhu** truth values ignores respectively their *left* and *right*
> part, which is moved in its own separate statement. This can be usefull when
> making complex statements to express first a sub-statement (instead of using
> [subscopes](PE.md)) and then refering back to it with
> [**mwa/mwe**](../units/MA.md). This is similar to using
> [adverbials](../bindings/VA_FA.md).

## Predicate distributivity

When used on predicates instead of propositions, it has a distributive behavior.

*pe **za udjon de za umiya** pey spi mo* is identical to ***za udjon** spi mo
**de pa** **za umiya** spi mo*.

## Grouping order

**DA** have left priority : `((A DA B) DA C) DA D`. Custom priority can be
expressed using [subscopes](PE.md).