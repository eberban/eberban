# Time

> __DRAFT__: Time-related concepts and vocabulary are __work in progress__ and
> might change in the future.

Design a tense system that is easy to use at high level, but that is defined in
Eberban at low level is a major chalenge, and is the reason for the existence of
some parts of the grammar (even if those parts are more general purposed and
don't depend on the tense system).

## Representing time

First, we want to represent time and the differents states in which the universe
are alongside it. We also want a model that allows us to deal with multiple
possible futures or even parallel or fictional universes.

To do that we'll first define a __node__ in a __directed graph__ (also called
__digraph__), with (directed) __arcs__ representing a transition from a node to
another. Nodes can represent __time instants__, and arcs can represents which
possible state of the universe is immediately following this one. 

> Even if nodes and digraphs can be used for more general purposes, we'll use
> time related terminology to keep things easier to follow.

We'll define a node as a pair of an identifier (`zai din`) and set of nodes that
this node have arcs towards. Note that while sets can't be empty, we want to
support nodes with no arcs, which is done by using a sentinel value instead of
the set (`zai din` again). 

> din: `[E:ma]` is an instant (digraph node).
>
> ```
> po din ke be
> ke kin
>   va zai din
>   fo vare
>     ve zai din
>     fa tce din
> ```

We can then define predicates to more easily speak about arcs and paths
(transitive arcs). We'll also call paths __time spans__.

> dini: There exist an arc from node `[E:din]` to node `[A:din]`.
>
> ```
> po dini ke ka be
> ke din kin
>   vo sae tci ka din
> ```

> dinu: There exist an path `[O:blu din]` from node `[E:din]` to node `[A:din]`.
>
> ```
> po dinu ke ka ko be
> ```
> We exclude the final node since we don't want to speak about an arc from it to
> another one (since its the last one).
> ```
> ko ble
>   vo ka bu
> ```
> The rest of the list contains nodes such that each node have an arc towards
> the next node in the list, or the final node for the penultimate node in the
> list.
> ```
>   fa bla
>     va ke
>     fo ka
> ```
> The item is the input carry and have an arc towards the output carry.
> ```
>     fu kie kia kio be kie kio dini kia
> ```

## Present

To represent the flow of time with the concept of "present", we store in the
context a node, and between sentences we update it (thanks to __pahe__) by
taking a node such that there exist a path between the old and the next one (the
new present is in the future of the old one).

> den: `[E:()]` is evaluated with a more recent present.
> ```
> po den gie be
> kcar
>   va gia
>   fe zai den kcu dinu
> ```

We'll define a predicate to help using predicates like __sin__ (with a single
proposition argument) with __pae__ and __pahe__.

> pane: `[E:ma]` is the context exposed to a predicate when it evaluated by
> `[A:(())]`.
> ```
> po pane ke gia be
> gia
>   via be mue ke
> ```

We can pick a first present node.

> ```
> pae pane
>   va gi be kcar
>     va gia
>     fe zai den kco din
> ```

And setup the automatic present update. (we also assign it to _epahegi_ so that
it can easily be composed with other future transformations)

> ```
> po epahegi pane den 
> pahe epahegi
> ```

We also make a predicate for the time span containing only the present, as it
will be useful later.

> del: `[E:blu din]` is the present time span
> ```
> po del ke be
> ke ve kcei zai den bu
> ```

## Events

Many predicates represents something that happens in some time span. To make
them composable, they interact with the context, and states that time span in
key `zai zvi` is part of their time span, which can also be seen as their own
path being a concatenation of a prefix span, `zai zvi` span and a suffix span
where the prefix and suffix can be empty. The predicate `zvi` can be used to
setup such entry in the context (and make it the longest possible).

> The provided proposition will be evaluated with a span _x_ such that there
> doesn't exist another span _y_ containing _x_ that also make the proposition
> true. They might however be multiple possible _x_ that don't contain each
> other.

> zvi: `[E:blu din] is a time interval shared by all events of [A:()].` We
> define a first predicate to evaluate A with a span in the context
> ```
> po izvi ke gia be
> kcar
>   va gia
>   fe zai zvi kco ke bu
> ```
> Then we really define `zvi` by ensuring this span cannot be made longer by
> concatenation.
> ```
> po zvi ke gia be
> ma
>   vai ke izvi gia
>   fai bi ma
>     ve pe ble
>       va zi blur
>       fo ble
>         va ke
>         fo zi blur
>     pei fe izvi gia
> ```

A predicate modeling an event can then use the following predicate to state that
the context span is contained into the provided span.

> zvin: Time span `[E:blu din]` contains context time span.
> ```
> po zvin
> sa bla ve kcei zei zvi
> ```

In some cases it can be useful to refer to the context time span itself.

> zvil: `[E:blu din]` is the context time span.
> ```
> po zvil
> kcei zei zvi
> ```
> 

## Tenses

Since our model of time allows multiple possible futures of a same instant, we
must distinguish between time span relations that are __possible__ and
__necessary__. A relation is __possible__ if there exist a time line in which
the relation holds. A relation is __necessary__ if in all time lines the
relation hold. To make the tense composable with the context time span, they
express a relation between the context time span and the time span of the
provided proposition.

Let's first start with a simple one: the proposition time span is met by the
context time span, which means that the last instant of the context time
span is the first instant of the proposition time span.

> siul: It is possible that `[E:()]` is met by the context time span.
> ```
> po siul gie be
> ma
> ```
> _ke_ is a time span of events in _gie_
> ```
>   vai bo ke zvi gie
> ```
> _ki_ is the first instant of time span _ke_
> ```
>   fai pe ke ble
>     va bo ki bu
>   pei
> ```
> _ki_ is the last instant of the context time span
> ```
>   fai zvil ble
>     vo ki bu
> ```

To make the __necessary__ variant we need to check that for all time spans _x_
that contains the context time span, either:
- _x_ contains the proposition time span
- _x_ is contained in a larger time span that itself contains the proposition
  time span

> This second case allows to handle the time spans that would be "to short" to
> contain the proposition time span which will be "further away".

> zvan: For all time span _x_ that contains the context time span, either:
> - `[E:(blu din)]` evaluated with _x_ is true
> - `[E]` is true if evaluated with a time span containing _x_
> ```
> po zvan gie be
> ```
> For all time span _ki_ that contains the context time span
> ```
> mae
>   vie ki be varu
>     vie ki sae bla zvil
> ```
> It it either a time span that makes _gie_ true
> ```
>     fia vare
>       vie gie ki
> ```
> Or this time span is contained in a larger time span _ke_ that makes _gie_
> true
> ```
>       fia ma
>         vai bo ke sae bla ki
>         fai gie ke
> ```

Thanks to this predicate we're able to define:

> siun: It is necessary that `[E:()]` is met by the context time span.
> ```
> po siun gie be
> zvan
>   vie ki be siul
>     vie gie
> ```
> _ki_, which is provided by _zvan_, must contains the context span
> ```
>       vai ki sae bla zvil
> ```

Similarily, we can define many similar predicates :

- __sel/sen__: E is before C (context span)
- __sal/san__: E starts C  (they share the same start instant)
- __sol/son__: E contains C
- __sul/sun__: E is after C
- __siel/sien__: E meets C (end instant of E = first instant of C)
- __sial/sian__: E finishes C (they share the same end instant)
- __siol/sion__: E contained by C (there is no difference between both variants)
- __sil/sin__: E overlaps with C

> Their definition is omited here but is similar to the ones of __siul/siun__.

Aside from those relations with the context span, we can make a tense predicate
related to the present instant instead of the context time span.

> dan: `[E:()]` presently occurs.
> ```
> po dan gie be
> bla
>   ve kcei zai den bu
>   fa zvi gie
> ```

## Sentence wrapper

Now that we have tenses that interact with the context time span, we need to
actually setup this time span for all sentences. For that we allow to register
in the context a property describing one or multiple __initial time spans__.
> zve: `[E:kcin]` is the context after inserting the initial time spans `[A:(blu
> din)]`.
> ```
> po zve ke gia be
> kcar
>   via mue ke
>   fe zai zve kco gia bu
> ```

Then at the start of each sentence, we can use _zvi_ with a time span that
satisfy this registered property. (we also assign it to _epahigi_ so that it can
easily be composed with other future sentence wrappers).

> ```
> po eipahizve gie be
> zvi
>   via zvin zvi gie
>     vai pe bo gi
>       ve kcei zai zve
>     pei
>     fai zvin gi
>
> po epahigi eipahizve
> pahi epahigi
> ```

By default we'll set it to the present (since it's a property it can use the
context to always correspond to the current present instant)

> ```
> pae zve del
> ```

> It could also be set such that it can be any time span, which can be useful
> to express a reference event in some alternate or fictional universe, and
> then set this event time span as the initial time span.
> 
> ```
> pae zve mai
> ```

----

> A later chapter will introduce measurement of durations, which will greatly
> increase what can be done with tenses.