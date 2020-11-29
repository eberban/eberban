# Predicate places [FA/DU]

Predicate places tags allow to fill the places of a proposition. It can
corresponds to places of the main predicate, or other special places. They are
followed by a predicate filling that place.

If multiple places can be filled with the same predicate, multiple place tags
can be chained in a row.

```ebb
  spi fa mi fe mi
= spi fa fe mi
= I talk to myself.
```

Usually, the main predicate of a proposition is placed first, then places are
filled with **FA/DU**. However, it's possible to fill places before. In this
case, the main predicate must be prefixed with **do**. It can be used to express
the most import part first. 

```
  spi fa mi fe mi
= fa mi do spi fe mi
```

> Because **do** can only appear before the main predicate of a proposition, it
> can also be used to elide terminators when using abstractions.

## Numbered places

As their name implies, these particles allow to fill the numbered places of the
main predicate of a proposition.

**fa, fe, fi, fo, fu, fua, fue, fui, fuo, fuu** allow to tag the 1st place up to
the 10th place. If needed, an higher place can be tagged with subscripts.

**fai** allow to fill the next numered place, counting from the last filled
numbered place (using explicit numbers with **fa**-like or **fai**).

If no numbered place has been filled before, **fai** will fill the 1st place if
used before the main predicate (with **do**), or the 2st place if used after.

## Imported place

The place structures of most words are deliberatly kept simple. However it is
common for a predicate to not have a place for a concept we want to express.

With **du**, it's possible to import the first place of the following predicate
(it ignores predicate chaining which will be explained in the next section).

```ebb
spi fa mi fe mo du pli skai
= I talk to you using a computer.

pli  : ___ is a tool used by ___ to satisfying property [___2]
du pli : "with-tool:"
skai : ___ is a computer
```

`du pli` imports the place expressing the concept of *a tool* to tell which tool
is used to talk.

## Prenex

**foi** don't fill a place, but allows to provide what is called a prenex. It can
be used to define a topic or declare quantified variables, separated from their
use site, usually early/first in the proposition.

```ebb
foi mian fa mi do dul fe mu'i
= About the cat : I like it.
```

## Place question

**fei** allows to ask which place of a predicate could be filled with the provided
predicate.

```ebb
val fa mo fei spu
= Is a house your origin or destination ?
= Are you going to or coming back from home ?

spu : ___ is a nest/house/home of ___
```

