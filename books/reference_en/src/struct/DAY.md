# Sets (DAY)

Bindings represents single individuals. To speak about a group of individuals,
sets must be used.

While various roots are related to sets, arbitrary sets can be created by using
the **DAY** family. `A day B` represents a group composed solely of A and B.
Binding this set to another predicate place means the group as a whole makes
the sentence true, and not each member individualy.

With more complex roots or sentences, the use of nested sets (sets of sets) may
be needed. The members `dey`, `diy`, `doy`, `duy` allow to quickly express
these.

> `(A day (B dey C dey (D diy E)) day ((F diy G) dey H)`

Nested sets can also be made using subscopes with `PE...PEY`.

> `(A day (pe B day C pey)) = A day (B dey C)`.

While avaible in the main predicate scope grammar rule (mainly to allow its
usage with subscopes and in answers), in can be used in a chain after a `FA`.
Using a `DAY` in this situation will create/continue a set in the scope of the
`FA`, and not create/continue a set of the main predicate scope. If the later
is needed, the terminator `BE` can be used to end a `FA` set.

> `A fa (B day C) be day D`