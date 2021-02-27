# Filling place tags [FA/BO]

Predicate place tags are used to fill the places of a predicate.
They may apply to either existing places of the main predicate
("numbered places") or other special places (e.g. "imported places").
They are followed by a (subordinate) predicate filling that place.

It is possible to fill multiple places with the same predicate by chaining
multiple place tags in a row.

```ebb
  spi fa mi fe mi
= spi fa fe mi
= I talk to myself.
```

## Numbered places

As their name implies, these particles are used for filling the numbered places of the
main predicate of a proposition.

**fa, fe, fi, fo, fu**, in this order, are used for filling the 1st place up to
the 5th place. If needed, a higher place can be tagged with subscripts.

**fay** fills the next numered place, counting from the last filled
numbered place (considering places filled with **fa**-like as well as **fay**).

If no numbered place has been filled before, **fay** will fill the 1st place.

## Imported place

The place structures of most words are deliberatly kept simple. However it is
common for a predicate to not have a place for a concept we want to express.

With **bo**, it's possible to import the first place of the following predicate
(it ignores predicate chaining which will be explained in the next section).

```ebb
spi fa mi fe mo bo ple ska
= I talk to you using a computer.

ple: A is a tool used by E to satisfy property [I]
bo ple : "with-tool:"
ska : A is a computer
```

`bo ple` imports the place expressing the concept of *a tool* to tell which tool
is used to talk.

## Place question

**fey** is used to ask which place of a predicate could be filled with the
provided predicate.

```ebb
val fa mo fey spu
= Is a house your origin or destination ?
= Are you going to or coming back from home ?

val: A goes from E to I
spu: A is a nest/house/home for E
```

Does "a house" fill the E position (origin) or I position (destination) ?