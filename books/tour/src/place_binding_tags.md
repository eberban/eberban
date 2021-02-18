# Place binding tags [SA]

A predicate can be prefixed with one or more **SA** particle to
specify how it should be used. It doesn't modify the place structure.

| Word | Definition                                                |
| ---- | --------------------------------------------------------- |
| sa   | tags 1st place                                            |
| se   | tags 2nd place                                            |
| si   | tags 3nd place                                            |
| so   | tags 4nd place                                            |
| su   | tags 5nd place                                            |
|      | &nbsp;                                                    |
| say  | SA question : which tag would make the proposition true ? | 
| sey | something related to the predicate (vague transformation)      |
| soy | event of the predicate being true |

One use case is with place filling. **SA** will allow to specify which place of
the filling predicate is bound to the filled place.

```ebb
don fa mi fe ple
= I like a tool.

don: _A_ likes than _E_ (default: _A_) satisfy property [_I_] (default: contextual)
                     |
               ple: _A_ is a tool used by _E_ to satisfy property [_I_]
```

```ebb
don fa mi fe se ple
= I like a user.

       don: _A_ likes than _E_ (default: _A_) satisfy property [_I_] (default: contextual)
                            | 
ple: _A_ is a tool used by _E_ to satisfy property [_I_]
```

> **SA** and **ZA** can be interleaved.