# Place binding tags [SA]

A predicate can be prefixed with one or more **SA** particle to
specify how it should be used. It doesn't modify the place structure.

| Word | Definition                                                |
| ---- | --------------------------------------------------------- |
| sa   | tags A place                                              |
| se   | tags E place                                              |
| si   | tags I place                                              |
| so   | tags O place                                              |
| su   | tags U place                                              |
|      | &nbsp;                                                    |
| say  | SA question : which tag would make the proposition true ? |
| sey  | something related to the predicate (vague transformation) |
| soy  | event of the predicate being true                         |

One use case is with place filling. **SA** will allow to specify which place of
the filling predicate is bound to the filled place.

```ebb
don fa mi fe ple
= I like a tool.

don: A likes that E (default: A, bound to I-A) satisfies property [I] (default: contextual)
                  |
             ple: A is a tool used by E to satisfy property [I]
```

```ebb
don fa mi fe se ple
= I like a tool-user.

       don: A likes that E (default: A, bound to I-A) satisfies property [I] (default: contextual)
                         | 
ple: A is a tool used by E to satisfy property [I]
```

> **SA** and **ZA** can be interleaved.