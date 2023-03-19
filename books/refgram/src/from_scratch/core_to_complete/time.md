# Time

> __DRAFT__: Time-related concepts and vocabulary are a __work in progress__ and
> might change in the future.

Design a tense system that is easy to use at a high level but defined in
Eberban at a low level is a major challenge, and is the reason for the existence
of some parts of the grammar (even if those parts are more general-purpose and
don't depend on the tense system).

## Representing time

First, we want to represent time and the different states in which the universe
are alongside it. We also want a model that allows us to deal with multiple
possible futures or even parallel or fictional universes.

To do that we'll first define a __node__ in a __directed graph__ (also called
__digraph__), with (directed) __arcs__ representing a transition from a node to
another. Nodes will represent __time instants__, and arcs will represent which
possible state of the universe is immediately following this one.

> Even if nodes and digraphs can be used for more general purposes, we'll use
> time-related terminology to keep things easier to follow.

We'll define a node as a pair of an identifier (`zai din`) and set of nodes that
this node has arcs towards. Note that while sets can't be empty, we want to
support nodes with no arcs. This is done by using a sentinel value instead of
the set (`zai din` again).

<spoiler>

__din:__ `[E:ma]` is an instant (digraph node).
---
```
po din ke be
ke kin
  va zai din
  fo vare
    ve zai din
    fa tce din
```
</spoiler>

We can then define predicates to more easily speak about arcs and paths
(transitive arcs). We'll also call paths __time spans__.

<spoiler>

__dini:__ There exists an arc from node `[E:din]` to node `[A:din]`.
---
```
po dini ke ka be
ke din kin
  vo sae tci ka din
```
</spoiler>

<spoiler>

__dinu:__ There exists a path/span `[O:blu din]` from node `[E:din]` to node `[A:din]`.
---
```
po dinu ke ka ko be
```
We exclude the final node since we don't want to speak about an arc from itself
to another one (since said arc is the last one).
```
ko ble
  vo ka bu
```
The rest of the list contains nodes such that each node has an arc towards
the next node in the list, or the final node for the penultimate node in the
list.
```
  fa bla
    va ke
    fo ka
```
The item is the input carry and has an arc towards the output carry.
```
    fu kie kia kio be kie kio dini kia
```
</spoiler>

## Present

To represent the flow of time with the concept of "present", we store in the
context a node, and between sentences we update it (thanks to __pahe__) by
taking a node such that there exists a path between the old and the new one (the
new present is in the future of the old one).

<spoiler>

__den:__ `[E:()]` is evaluated with a more recent present.
---
```
po den gie be
kagvar
  va gia
  fe zai den kagvu dinu
```
</spoiler>

We'll define a predicate to help using predicates like __sin__ (with a single
proposition argument) with __pae__ and __pahe__.

<spoiler>

__pane:__ `[E:ma]` is the context exposed to a predicate when it evaluated by
`[A:(())]`.
---
```
po pane ke gia be
gia
  via be mue ke
```
</spoiler>

We can pick a first present node.

```
pae pane
  va gi be kagvar
    va gia
    fe zai den kagvo din
```

And set up the automatic present update. (we also assign it to _epahegi_ so that
it can easily be composed with other future transformations)

```
po epahegi pane den
pahe epahegi
```

We also make a predicate for the time span containing only the present, as it
will be useful later.

<spoiler>

__del:__ `[E:dinu]` is the present time span.
---
```
po del ke be
ke ve kagvei zai den bu
```
</spoiler>

## Events

Many predicates represent something that happens in some time span. To make
them composable, they interact with the context, and state that the time span in
the key `zai zvi` is part of their time span. This can also be seen as their own
path being a concatenation of a prefix span, `zai zvi` span and a suffix span
where the prefix and suffix can be empty. The predicate `zvi` can be used to
setup such entry in the context (and make it the longest possible).

> The provided proposition will be evaluated with a span _x_ such that there
> doesn't exist another span _y_ containing _x_ that also make the proposition
> true. There might, however, be multiple possible _x_'s that don't contain each
> other.

<spoiler>

__zvi:__ `[E:dinu]` is a time span shared by all events of `[A:()]`.
---
We define a first predicate to evaluate A with a span in the context.
```
po izvi ke gia be
kagvar
  va gia
  fe zai zvi kagvo ke bu
```
Then we really define `zvi` by ensuring this span cannot be made longer by
concatenation.
```
po zvi ke gia be
ma
  vi ke izvi gia
  fi bi ma
    ve pe ble
      va zi blur
      fo ble
        va ke
        fo zi blur
    pei fe izvi gia
```
</spoiler>

A predicate modeling an event can then use the following predicate to state that
the context span is contained in the provided span.

<spoiler>

__zvin:__ Time span `[E:dinu]` contains context time span.
---
```
po zvin
sa bla ve kagvei zei zvi
```
</spoiler>

In some cases it can be useful to refer to the context time span itself.

<spoiler>

__zvil:__ `[E:dinu]` is the context time span.
---
```
po zvil
kagvei zei zvi
```
</spoiler>
## Tenses

Since our model of time allows multiple possible futures of an instant, we
must distinguish between time span relations that are __possible__ and
__necessary__. A relation is __possible__ if there exists a time line in which
the relation holds. A relation is __necessary__ if in all time lines the
relation holds. To make the tense composable with the context time span, they
express a relation between the context time span and the time span of the
provided proposition.

Let's first start with a simple one: the proposition time span is met by the
context time span, which means that the last instant of the context time
span is the first instant of the proposition time span.

<spoiler>

__sul:__ It is possible that `[E:()]` is met by time span `[A:dinu]`
(default: context time span).
---
```
po sul gie ka be
ma
```
_ke_ is a time span of events in _gie_
```
  vi bo ke zvi gie
```
_ki_ is the first instant of time span _ke_
```
  fi pe ke ble
    va bo ki bu
  pei
```
_ki_ is the last instant of _ka_
```
  fi ka ble
    vo ki bu

poia sul zvil
```
</spoiler>

To make the __necessary__ variant we need to check that for all time spans _x_
that contains the provided time span (often the context time span), either:
- _x_ contains the proposition time span
- _x_ is contained in a larger time span that itself contains the proposition
  time span

> This second case allows handling the time spans that would be "too short" to
> contain the proposition time span which will be "further away".

<spoiler>

__zvan:__ For all time spans _x_ that contain the time span `[A:dinu]`, either:
- `[E:(dinu)]` evaluated with _x_ is true
- `[E]` is true if evaluated with a time span containing _x_
---
```
po zvan gie ka be
```
For all time spans _ki_ that contain _ka_
```
mao
  vie ki be varu
    vie ki sae bla ka
```
It it either a time span that makes _gie_ true
```
    fia vare
      vie gie ki
```
Or this time span is contained in a larger time span _ke_ that makes _gie_
true
```
      fia ma
        vi bo ke sae bla ki
        fi gie ke
```
</spoiler>

Thanks to this predicate we're able to define:

<spoiler>

__sun:__ It is necessary that `[E:()]` is met by time span `[A:dinu]`
(default: context time span).
---
```
po sun gie ka be
zvan
  fa ka
  vie ki be sul
    vie gie
```
_ki_, which is provided by _zvan_, must contain the context span
```
      vi ki sae bla zvil
```
</spoiler>

We can define all the following predicates (with A always defaulting to the
context time span) :

- __sel/sen__: E meets A (end instant of E = first instant of A)
- __sal/san__: E starts A  (they share the same start instant)
- __sol/son__: E finishes A (they share the same end instant)
- __sul/sun__: E is met by A (end instant of A = first instant of E)
- __siel/sien__: E is before A
- __sial/sian__: E contains A
- __siol/sion__: E contained by A (there is no difference between both variants)
- __siul/siun__: E is after A
- __sil/sin__: E overlaps with A

> Their definition is omitted here but is similar to the ones of __sul/sun__.

Aside from these relations with the context span, we can make a tense predicate
related to the present instant instead of the context time span.

<spoiler>

__dan:__ `[E:()]` presently occurs.
---
```
po dan gie be
bla
  ve kagvei zai den bu
  fa zvi gie
```
</spoiler>

## Sentence wrapper

Now that we have tenses that interact with the context time span, we need to
actually set up this time span for all sentences. For that, we allow registering
in the context a property describing one or multiple __initial time spans__.

<spoiler>

zve: `[E:kagvin]` is the context after inserting the initial time spans `[A:(blu
din)]`.
---
```
po zve ke gia be
kagvar
  via mue ke
  fe zai zve kagvo gia bu
```
</spoiler>

Then at the start of each sentence, we can use _zvi_ with a time span that
satisfies this registered property (we also assign it to _epahigi_ so that it can
easily be composed with other future sentence wrappers).

```
po eipahizve gie be
zvi
  via zvin zvi gie
    zvin zu pe kagvei zai zve

po epahigi eipahizve
pahi epahigi
```

By default we'll set it to the present (since it's a property it can use the
context to always correspond to the current present instant)

```
pae zve del
```

> It could also be set such that it can be any time span, which can be useful
> to express a reference event in some alternate or fictional universe, and
> then set this event time span as the initial time span.
>
> ```
> pae zve mai
> ```

----

> A later chapter will introduce the measurement of durations, which will
> greatly increase what can be done with tenses.