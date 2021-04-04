# Logical connectives (DA)

## Connectives on scopes

Logical connectives of family **DA** allow to connect two scopes, defining
the final truth value based on the truth value of the scopes. **DA** can
be prefixed with **ba** to negate the left scope, while it can be suffixed
with **bay** to negate the right scope. **di** allow to ask a question about
which logicial connective would make the result true.

| left  | right |     | da (and) | de (or) | do (iif) | du    | duhu  |
| ----- | ----- | --- | -------- | ------- | -------- | ----- | ----- |
| True  | True  |     | True     | True    | True     | True  | True  |
| True  | False |     | True     | False   | False    | True  | False |
| False | True  |     | True     | False   | False    | False | True  |
| False | False |     | False    | False   | True     | False | False |

Using these 5 words, **ba** and **bay**, all truth table can be expressed
(except "always true" and "always false" ones).

## Connectives on units

When used on predicates units it has a distributive behavior.

*pe **za udjon de za umiya** pey spi mo* is identical to ***za udjon** spi mo
**de pa** **za umiya** spi mo*.

## Grouping order

**DA** have left priority : `((A DA B) DA C) DA D`. Custom priority can be
expressed using [subscopes](PE.md).