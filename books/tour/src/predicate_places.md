# Predicate places [FA/DU]

Predicate place tags are used to fill the places of a proposition.
They may apply to either existing places of the main predicate ("numbered places") or other special places (e.g. "imported places").
They are followed by a (subordinate) predicate filling that place.

It is possible to fill multiple places with the same predicate by chaining multiple place tags in a row.

```ebb
  spi fa mi fe mi
= spi fa fe mi
= I talk to myself.
```

Usually, the main predicate of a proposition is placed first, then places are
filled with **FA/DU**. However, it is possible to fill places before. In this
case, the main predicate must be prefixed with **do**. It can be used to express
the most important part first.

```
  spi fa mi fe mi
= fa mi do spi fe mi
```

> Because **do** can only appear before the main predicate of a proposition, it
> can also be used to elide terminators when using abstractions.

## Numbered places

As their name implies, these particles are used for filling the numbered places of the
main predicate of a proposition.

**fa, fe, fi, fo, fu, fua, fue, fui, fuo, fuu**, in this order, are used for filling the 1st place up to
the 10th place. If needed, a higher place can be tagged with subscripts.

**fai** fills the next numered place, counting from the last filled
numbered place (considering places filled with **fa**-like as well as **fai**).

If no numbered place has been filled before, **fai** will fill the 1st place if
used before the main predicate (with **do**), or the 2st place if used after.
<!-- TODO: [jqueiroz] we should update this -->

## Imported place

The place structure of most words is deliberatly kept simple. However, it is
common for a predicate to not have a place for a concept we want to express.

With **du**, it's possible to import the first place of the immediately following predicate
(it ignores predicate chaining, which will be explained in the next section).

```ebb
spi fa mi fe mo du plir skai
= I talk to you using a computer.

plir   : ___ is a tool used by ___ to satisfying property [___2]
du plir: "with-tool:"
skai   : ___ is a computer
```

`du plir` imports the place expressing the concept of *a tool*, allowing us to specify tell which tool
is being used to talk.

## Prenex

**foi** does not fill a place, but allows providing what is called a prenex. It can
be used to define a topic or declare quantified variables, separated from their
use site, usually early/first in the proposition.

```ebb
foi mlia fa mi do dul fe muhi
= About the cat: I like it.
```

## Place question

**fei** is used to ask which place of a predicate could be filled with the provided
predicate.

```ebb
vla fa mo fei zda
= Is a house your origin or destination?
= Are you going to or coming back from home?

zda: ___ is a nest/house/home of ___
```

