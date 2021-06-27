# Logical connectives (DA)

> Work in progress, exact meaning is not defined yet.

Logical connectives of family **DA** allow to connect two scopes, defining
the final truth value based on the truth value of the scopes. 

| left  | right |     | da (and) | de (or) | di (iif) | do    | du    |
| ----- | ----- | --- | -------- | ------- | -------- | ----- | ----- |
| True  | True  |     | True     | True    | True     | True  | True  |
| True  | False |     | True     | False   | False    | True  | False |
| False | True  |     | True     | False   | False    | False | True  |
| False | False |     | False    | False   | True     | False | False |

Using these 5 words and **bi**, all truth table can be expressed
(except "always true" and "always false" ones).

## Grouping order

**DA** have right priority : `A DA (B DA (C DA D))`.