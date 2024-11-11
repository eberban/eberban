# Enumeration (PE/BU)

We've seen before particles __pe__ and __pei__ that are like spoken brackets. __pe__ is part of
family __PE__ which provide a more general feature called an _enumeration_. It allows to list
_items_ which are used differently depending on which __PE__ is used. Items separation is done using
__bu__ (only member of __BU__) in 2 possible mays:

- separator: __PE__ is followed by multiple chains, each separated by __bu__.
- prefix: __PE__ is immediatly followed by __bu__. Then each item is a single predicate, and items
  are not separated by __bu__.

__PE__ family contains the following members:

- __pe__: Simply exposes the slots of the items. If there are multiple items, it perform an AND
  operator between them.
  > Exemple: `mi [pe [bure] bu [dona] pei] meon` = I [eat and like] an apple.
- __pea__: Makes a set from one member of each listed sets.
  > Exemple: `mio [pehe bu [za ualis] [za ubob] (pei)]` = We are Alice and Bob.
- __peo__: Makes a set such that a generic/atom that satisfy each item is a member of the set.
  > Exemple: `[pea [tcu mian] bu [meon] (pei)]` = A set of {the set of all cats, a set of apples}.
- __peho__: Makes a set of predicates.
  > Exemple: `me vone [peha bu [mian] [meon] (pei)]` = This is [a cat OR an apple].
- __peu__: Makes a list such that a generic/atom that satisfy each item is  amember of the list (in
  order).
  > Exemple: `[peo bu [mian] [meon] pei] blua [peo [meon] bu [mian] (pei)]` = List [a cat, an apple]
  > is list [an apple, a cat] in reverse order.
- __pehu__: Makes a list of predicates.
  > No exemple as usages of predicates lists as they are mostly used by words with complex meanings.

An empty enum can be made with `PE bu PEI`. However Eberban doesn't consider the empty set exists,
while the empty list does. When used with __pe__, it makes an always true predicate.