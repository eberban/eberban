# Eberban from scratch

One of the long term goal of Eberban is to have its vocabulary entirely defined
in Eberban itself, and not realy on external or _opaque_ predicates.

To achieve such goal Eberban is designed following those 3 steps:

1. __Core grammar:__ subset of the complete grammar that is enough to define
   important concepts. It doesn't include some of the "syntaxic sugar" grammar
   that requires concepts from step 2.
2. __Core vocabulary:__ vocabulary defined using only the __core grammar__. It
   defines many useful concepts such as sets, maps, lists, and numbers. Once the
   necessary concepts are defined the grammar can be extended to reduce
   verbosity, up to being able to define the __full (extended) grammar__.
3. __Extended vocabulary:__ vocabulary that can use the __full grammar__, and
   makes what can be considered the "official" dictionary.