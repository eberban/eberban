# Basic predicates

As seen before, predicates are a core aspect of eberban. There are many ways to
make them, but this section will focus on the most simple ones.

## Terminology

- **Proposition** : A proposition is anything that has a truth value (which can
      be true or false). It is equivalent to a nullary predicate (0 arguments).
- **Predicate** : a proposition template with one or more open blanks (called
      arguments) which may be filled in to yield a complete proposition with a
      truth value. The number of arguments is called the **arity** of the
      predicate.
- **Property** : predicate with 1 argument.
- **Relation** : predicate with 2 arguments.
- **Entity** : everything that satisfies a given property.
- **Event** : a proposition that is claimed to occur (it is itself a
  proposition)

## Definitions

Predicates have a precise definition which define their place structure.

- `___` represents an open place, which by default expects an entity.
- `[___]` represents a proposition place.
- `[___N]` represents a property place, with N indicating which other place of
  the predicate the property applies to. If the property applies to multiple
  places, each place will be separated with a `,`.
- `[___N|M]` represents a relation place. Same thing as properties, but the `,`
  separate the 2 places of the relation. If a predicate expect a predicate with
  more than 2 places (rare), more `|` are used.
- `{___}` represents a predicate place structure (rare).

From this definition can be extracted a **predicate signature**, representing
shortly what each place expects.

- Entity places are represented by a `.`
- Proposition places by a `0`
- Properties with `[N]`
- Relations with `[N|M]`
- Predicates place structure with `P`.

> **Example :**
>
> ```eng
> cfa (..[2]) : ___ requests to ___ that they satisfy property [___2]
> ```
>
> Both the 1st and 2nd place expects an entity. The 3rd place expects a property
> which is satisfied by the 2nd place. The signature provided in parenthesis
> express only the types of each place.

## Null values

**Null values** can be used as an argument. Each predicate definition can define
how to handle a null value. If it is not defined, an elliptical (infered from
context) value is used. When a place is not filled in a sentence, it is as
if it was filled with a null value.