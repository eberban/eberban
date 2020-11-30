# Alternative chaining [CA]

Predicate chaining is very powerful, but sometimes its algorithm doesn't do
what you would want. **CA** particles allows to perform chaining with
alternative rules.

**CA** can be prefixed with **ka** to negate the left predicate and suffixed with **kai** to negate
the right part (this allow to cover all truth tables if needed).

| Word | Definition                                                                               |
| ---- | ---------------------------------------------------------------------------------------- |
| ca   | [left] OR [right]                                                                        |
| ce   | [left] AND [right]                                                                       |
| ci   | Chaining question. How [left] and [right] should be chained for the predicate to be true |
| co   | [left] if and only if [right]                                                            |
| cu   | [left] whether or not [right]                                                            |
|      |
| cai  | [left] type of [right]. vague precision, [right] has a vague [left] aspect               |
|      |
| cia  | perform predicate chaining with [left] 1st place instead of rightmost                    |
| cie  | perform predicate chaining with [left] 2nd place instead of rightmost                    |
| cii  | perform predicate chaining with [left] 3rd place instead of rightmost                    |
| cio  | perform predicate chaining with [left] 4th place instead of rightmost                    |
| ciu  | perform predicate chaining with [left] 5th place instead of rightmost                    |