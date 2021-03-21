# Logical connectives (DA)

Logical connectives of family **DA** allow to connect two propositions, defining
the final truth value based on the truth value of its components. **DA** can
be prefixed with **BA** to negate the left component, while it can be suffixed
with **BAY** to negate the right component. **di** allow to ask a question about
which logicial connective would make the result true.

## da (or)

| Left  | Right | Result |
| ----- | ----- | ------ |
| True  | True  | True   |
| True  | False | True   |
| False | True  | True   |
| False | False | False  |

## de (and)

| Left  | Right | Result |
| ----- | ----- | ------ |
| True  | True  | True   |
| True  | False | False  |
| False | True  | False  |
| False | False | False  |

## do (if and only if)

| Left  | Right | Result |
| ----- | ----- | ------ |
| True  | True  | True   |
| True  | False | False  |
| False | True  | False  |
| False | False | True   |

## du (whether or not)

| Left  | Right | Result |
| ----- | ----- | ------ |
| True  | True  | True   |
| True  | False | True   |
| False | True  | False  |
| False | False | False  |

## doho / duhu

*doho* and *duhu* corresponds respectively to *do* and *du* but with their
left and right columns swapped. Using these 6 words, *ba* and *bay*, all
truth table can be expressed (except "always true" and "always false" ones).

## Predicate distributivity

When used on predicates instead of propositions, it has a distributive behavior.

*pe **za udjon de za umiya** pey spi mo* is identical to ***za udjon** spi mo
**de pa** **za umiya** spi mo*.