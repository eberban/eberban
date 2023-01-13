# Pairs

An important building block is the ability to construct more complex objects
from simple ones. For this reason, we define the concept of a pair, which is an
atom that is associated with a left and right component.

Anything in Eberban can go inside a component. We'll use an axiom to state that
there exists a unique atom for every possible pair of left and right components.

<spoiler>

__kin:__ `[E:ma]` is a pair made of left component `[A:a]` and right component `[O:o]`. 
---
``` 
pou e kin pu be 
ma 
  vi boi kin 
```

__kin__ doesn't care about the context

```
  fi ke ka ko be varu
    vie ke kin
      va ka fo ko vei
    fia mae mua ke kin
      va ka fo ko vei
    vei
```

For every left and right components __ka__ and __ko__ 

``` 
  fi mae 
    ve ka be mae  
      ve ko be 
``` 

There exists an atom __ki__ which is a pair of __ka__ and __ko__. 

``` 
      ma 
       vi ki be ki ma kin  
         va ka 
         fo ko 
``` 

And it is false that there exists a different atom than __ki__ which is also a 
pair of __ka__ and __ko__ (thus, there is a unique symbol for each pair) 

``` 
         fi bi ma 
           ve bi ki 
           fe kin 
             va ka 
             fo ko 
``` 
</spoiler>

By convention, we prefer nesting pairs only in the right component.

Many structures, such as lists and maps, are defined using pairs. To distinguish
structures of the same type representing different concepts, we use the
left component as an identifier.

Identifiers are often made using __zai__, which will be defined in the next
chapter, and are defined themselves using pairs.