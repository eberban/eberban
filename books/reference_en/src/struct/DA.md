# Logical connectives (DA)

> Work in progress, exact meaning is not defined yet.

Logical connectives of family **DA** allow to connect two scopes, defining
the final truth value based on the truth value of the scopes. **di** allow to
ask a question about which logicial connective would make the result true.

| left  | right |     | da (and) | de (or) | do (iif) | du    | dui  |
| ----- | ----- | --- | -------- | ------- | -------- | ----- | ----- |
| True  | True  |     | True     | True    | True     | True  | True  |
| True  | False |     | True     | False   | False    | True  | False |
| False | True  |     | True     | False   | False    | False | True  |
| False | False |     | False    | False   | True     | False | False |

Using these 5 words and **bi**, all truth table can be expressed
(except "always true" and "always false" ones).

## Grouping order

**DA** have left priority : `((A DA B) DA C) DA D`. Custom priority can be
expressed using grouping parenthesis **PE .. PEI** .