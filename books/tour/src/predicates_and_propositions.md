# Predicates and propositions

The whole language is based on a concept called a **predicate**. To understand
what predicates are, let's first look at one type of predicate : a **proposition**.

A **proposition** is anything that has a **truth value** (which can be true or false).

```eng
A cat drinks milk.
```

In English, this sentence is a proposition : it claims *a cat is drinking
milk*. A predicate is a proposition template with one or more **open blanks**
(called **arguments**) which may be filled in to make a complete proposition
with a truth value. Thus, a proposition is a predicate with all of its open
blanks filled (which is also called a *nullary* or *0-ary* predicate).

In the above sentence, the verb "drinks" can be seen as a predicate
`___ drinks liquid ___`, where each `___` represent an open blank. The first blank
represents *the one who drinks* while the second represents *what is drunk*.
"A cat" and "milk" are **entities** that fills those blanks to make the complete
proposition. Definitions with some `___` defines what is called a
**place structure**.

```ebb
jle fa mlia fe mlio
```

This is a translation of the above English sentence in eberban. `jle` is
a word having the place structure `___ drinks ___`.

`fa` and `fe` are grammatical **particles** indicating which place of `jle` is
filled (respectively the first and second place). They are followed by a
predicate describing what is filling the place. When a predicate fills a place
expecting an entity, the concept expressed by first place of the filling
predicate is used. It represents anything that could fill this place and make a
proposition true.

`mlia` means `___ is a cat` while `mlio` means `___ is milk`. It thus means that
"*(something which is a cat) drinks (something which is milk)*", or said more
simply : "A cat drinks milk".

---

Places can be left empty if desired. In this case, they get a default value.
This default value can be defined by the definition, otherwise it is
undefined and is infered from context : it is either obvious or not worth
to provide.

```ebb
jle fa mlia
```

Here, the second place is not filled. It means "*A cat drinks*". What the
cat drinks might be unimportant, or the speaker and listener might already know
what it is drinking (maybe the cat is near them).

```ebb
jle fa jve fe mlio
```

`jve` is the word for `___ is a friend of ___`. The value of its second place
is not provided. From context, it might be obvious it's a friend of the
speaker, but this is not guaranted.

> Ways of filling other places of entity predicates will be explained later
> in this book.