# Free modifiers (JA/JE/JO/JU/CA)

Free modifiers allow to add information to almost anything. Modifier attached to
grammatical starters or terminators apply to the whole object they define.

## Subscript [JA]

**ja** attaches a number or letter string to a word. It can be used to be more
precise when using a vague particle or use more variables.

## Discursive [JE]

**je** attaches a predicate (without chaining) to the previous word to make a
discursive, for example to provide emotions. To provide more complex predicates
such as chains and filled place, use [**PE** subscopes](PE.md).

## Parenthetical note [JO]

**jo** and it's terminator **joy** allow to add a parenthetical note. This note
can be any valid eberban text.

## Prefix markers [JU]

| Word | Meaning                                                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| jwa  | Emphasis indicator : the next word is especially emphasized.                                                                                   |
| jwe  | Nonce-word indicator : the next word (usually a compound) may be non-standard.                                                                 |
| jwi  | Next word is a metadata tag / hashtag.                                                                                                         |
| jwo  | Tags an open-place unit (KAY/GAY/ma) as the bracket place of a scope.                                                                          |
| ju   | Starts a *free scope* which is closed by the **free suffix juy (JUY)**. Any free modifier attached to either of them will apply to this scope. |

> **ju** and **juy** allows to attach information to a group of words which
> isn't a single grammatical unit for the grammar (hense "free" scope).
>
> The parser currently doesn't check that each **ju** comes with its paired
> **juy**.

## Suffix markers [CA]

| Word   | Meaning                                                                                                          |
| ------ | ---------------------------------------------------------------------------------------------------------------- |
| ca     | Ask if the proposition is true, with emphasis placed on the marked word.                                         |
| cay    | Indirect question marker. Transform a question word into an indirect question.                                   |
| ce     | Imperative. The left chaining place of the tagged predicate should make it true.                                 |
| cey    | Answer. Attached to sentence to indicate it's an answer to a previous question, and not a independent statement. |
| &nbsp; |                                                                                                                  |
| cya    | However/but/in contrast.                                                                                         |
| cye    | Ditto.                                                                                                           |
| cyi    | Similarly.                                                                                                       |
| cyo    | Additionally.                                                                                                    |
| cyu    | Uniquely/only/ solely.                                                                                           |