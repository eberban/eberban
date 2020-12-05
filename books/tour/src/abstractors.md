# Abstractors [BA]

The **BA** family allows building a new predicate by performing transformations on an existing one, e.g. pre-filling numbered places, pre-filling imported places, or inserting imported places to be filled later.

## Pre-filling existing places

One possible transformation is to pre-fill numbered places of an existing predicate.

|Predicate         |Meaning              |
|------------------|---------------------|
|spi               | ___ talks to ___    |
|ba spi bai        | ___ talks to ___    |
|ba spi fa mi bai  | I talk to ___       |
|ba spi fe mlia bai| ___ talks to the cat|

It is then possible to use the newly formed predicate with ``ba..bai`` in the context of a sentence:
``ba spi fa mi bai fa mo`` &ndash; ``I talk to you``.

Observe that, in this example, the word "mo" is preceded by the place tag "fa", not "fe".
The reason is that resulting predicate ``ba spi fa mi bai`` accepts only a single argument, and this argument is the listener.
The one talking is already fixed to be ``mi``.

Also notice that ``ba..bai`` by itself does nothing: ``ba spi bai`` means exactly the same as ``spi``.

Finally, you may have noticed that the example sentence above does not really need ``ba..bai``, as it could have been rewritten as ``spi fa mi fe mo``.
We opted for a simple sentence here to simplify the explanation, but in practice ``ba..bai`` tends to be required only in more complex scenarios.
Consider, for example: ``spi fa mi fe gra ve ba jve fe mi bai`` &ndash; ``I am talking to the dog of my friend``.
In this case, ``ba..bai`` is needed to ensure that ``fe mi`` applies to ``jve``, and not to something else.

## Pre-filling imported places

Another useful transformation is pre-filling a predicate with an imported place.

|Predicate                |Meaning                                 |
|-------------------------|----------------------------------------|
|spi                      | ___ talks to ___                       |
|ba spi du plir skai bai  | ___ talks to ___ using-tool: computer  |

Sample sentence:
``ba spi du plir skai bai fa mi fe mo`` &ndash; ``I talk to you using-tool a computer``.

## Inserting imported places

Finally, it is also possible to insert imported places into a predicate, but instead of filling them immediately, leave them as open places to be filled later.
The particle `ma` , when used to fill any predicate place, creates a hole which will be filled by a new numbered place (inserted right after all pre-existing ones).

|Predicate                |Meaning                                 |
|-------------------------|----------------------------------------|
|spi                      | ___ talks to ___                       |
|ba spi du plir ma bai    | ___ talks to ___ using-tool: ___       |

Sample sentence:
``ba spi du plir ma bai fa mi fe mo fi skai`` &ndash; ``I talk to you using-tool a computer``.

Technically `ma` could be used to fill numbered places as well, not only imported places, but that is rarely useful.
One possible application would be reordering numbered places, but this can also be done with **SA**.

## Other transformations

In addition to the three transformations described above, which are the most useful ones, it is also possible to perform any other predicate transformations inside ``ba..bai``.

For example, it is possible to reorder places using **SA**:

|Predicate                |Meaning                                  |
|-------------------------|-----------------------------------------|
|djo                      | ___ donates gift ___ to recipient ___   |
|ba si djo bai            | ___ receives gift ___ from donor ___    |

It is also possible to perform multiple transformations inside a single ``ba..bai``.

|Predicate                      |Meaning                                 |
|-------------------------------|----------------------------------------|
|spi                            | ___ talks to ___                       |
|ba spi fa mi du plir skai bai  | I talk to ___ using-tool: computer     |

## BA members

In addition to ``ba``, there are also two other members in the **BA** family for building more specific types of abstractions, namely `be` (propositional abstractions) and `bi` (event abstractions).

<!-- TODO: explain -->

| Particle     | Purpose                             | Definition |
|--------------|-------------------------------------|------------|
| ba           | Generic abstractions       | allow to fill places of a predicate to make a new predicate. New places can be added with FA/DU, and new places can be created using ``ma`` |
| be           | Propositional abstractions | ___ is proposition [proposition] expressed in sentence ___ (text) |
| bi           | Event abstractions         | ___ is the event of [proposition]                                 |

<!-- TODO: [jqueiroz] Optional section -- Computer scientist's view: lambda functions -->
