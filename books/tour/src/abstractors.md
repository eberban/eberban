# Abstractors [PE]

> **Outdated** : open place binding is not up to date

**pe** allows building a new predicate by performing the same kind of operations
that can be done on the main predicate of the propositoon, e.g. pre-filling
numbered places, pre-filling imported places, or inserting places to be filled
later. The abstraction is closed using **pey**.

## Pre-filling

One possible transformation is to pre-fill numbered places of an existing
predicate.

| Predicate          | Meaning              |
| ------------------ | -------------------- |
| spi                | A talks to E         |
| pe spi pey         | A talks to E         |
| pe spi fa mi pey   | A speaker talks to E |
| pe spi fe myan pey | A talks to the cat   |

It is then possible to use the newly formed predicate with ``pe..pey`` in
another proposition: ``pe spi fa mi pey fa mo`` &ndash; ``I talk to you``.

Observe that, in this example, the word "mo" is preceded by the place tag "fa",
not "fe". The reason is that resulting predicate ``pe spi fa mi pey`` accepts
only a single argument, and this argument is the listener. The one talking is
already fixed to be ``mi``.

Also notice that ``pe..pey`` by itself does nothing: ``pe spi pey`` means
exactly the same as ``spi``.

Finally, you may have noticed that the example sentence above does not really
need ``pe..pey``, as it could have been rewritten as ``spi fa mi fe mo``. We
opted for a simple sentence here to simplify the explanation, but in practice
``pe..pey`` tends to be required only in more complex scenarios. Consider, for
example: ``spi fa mi fe pe jve fe jve pey`` &ndash; ``I am talking to the friend
of my friend``. In this case, ``pe..pey`` is needed to ensure that ``fe jve``
applies to the first ``jve``, and not ``spi``.

## Inserting imported places

It is also possible to insert imported places into a predicate, but instead of
filling them immediately, leave them as open places to be filled later. The
particle `ma` , when used to fill any predicate place, creates a hole which will
be filled by a new numbered place (inserted right after all pre-existing ones).

| Predicate            | Meaning                    |
| -------------------- | -------------------------- |
| spi                  | A talks to E               |
| ba spi du ple ma bai | A talks to E using-tool: I |

Sample sentence: ``pe spi du ple ma pey fa mi fe mo fi ska`` &ndash; ``I talk to
you using-tool a computer``.

Technically `ma` could be used to fill numbered places as well, not only
imported places, but that is rarely useful. One possible application would be
reordering numbered places.

## Other transformations

In addition to the three transformations described above, which are the most
useful ones, it is also possible to perform any other predicate transformations
inside ``pe..pey``.

For example, it is possible to perform multiple transformations inside a single
``pe..pey``.

| Predicate                   | Meaning                            |
| --------------------------- | ---------------------------------- |
| spi                         | A talks to E                       |
| pe spi fa mi du ple ska pey | Me talks to A using-tool: computer |