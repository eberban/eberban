# Sets

Sets are one of the main building blocks of the vocabulary, and a powerful tool
to define other concepts.

It associates every property (along with the context it is evaluated with) with
a unique atom representing it and all arguments that makes the property true (the
members of the set). The core predicates modeling this are:

- tcui: `[E:ma]` is the (non-empty) set of all things that individualy satisfy
  `[A:(a)]`.
- tcie: `[E:a]` is a member of set `[A:tcui a]`.

## Axiom

Defining sets using only __po__ is however not possible, as __tcui__ and
__tcie__ depends on each other to be defined. Instead we need to define a
proposition stating that thoses predicates exists and satisfy the constraints of
sets and membership, and use __pu__ to make this proposition an __axiom__, which
is assumed to be true. We'll use the shorthand __pou__ to both define the
predicate and make it an axiom.

<spoiler>

Axiomatic definition of __tcui__ and __tcie__
---
We define the proposition of the axiom, which by convention is named
with a compound made from one of the defined predicates and the particle for
axioms __pu__.
```
pou e tcui pu be
```
We then state that predicates __tcui__ and __tcie__ exist:
```
ma
  vi boi tcui
  fi boi tcie
```
Then for every property __gi__ (we express it is a property by providing it
one generic argument (mai). However it means that __gi__ must be true for at
least one argument. Thus, there will be no concept of an empty set).
```
  fi mae
    ve gi be varu
      vie gi mai
```
Then for every context __ki__ (which is a atom)
```
      fia mae
        ve ki be varu
          vie ki ma
          fie ki mua
```
There exist a set __ke__ representing this property (with this context)
```
            ma
              vi bo ke tcui gi
```
And for all __ka__, __ka__ is a member of set __ke__ if and only if __ka__
satisfy __gi__
```
              fi mae
                ve ka be mai
                  vie ka tcie ke
                  fie ka gi
```
</spoiler>

## Subsets

We are now able to make sets from properties, and to speak about the members
of those sets. From those we can define a predicate for subsets.

<spoiler>
__tcia:__ `[E:tcui a]` is a subset of `[A:tcui a]`.

---
```  
po tcia ke ka be  
```  
 
All members of __ke__  
 
```  
mae  
  ve ki be varu   
    vie ki tcie ke  
```  
 
Also are members of __ka__  
 
```  
    fia ki tcie ka  
```  
</spoiler>

We can also define predicates for various kinds of subsets which can be useful
to define vocabulary.

<spoiler>

__tcei:__ `[E:tcui a]` is a (non-empty) set of some things that individualy satisfy `[A:(a)]`.
---
```
po tcie ke gia be 
``` 

__ke__ is a subset of the set of all things that satisfy __gia__ 

``` 
ke tcia tcui gia 
``` 
</spoiler>

<spoiler>

__tcai:__ `[E:tcui a]` is a set containing exactly one member which satisfy `[A:(a)]`.
---
```
po tcia ke gia be 
``` 

__ke__ is a subset of the set of all things that satisfy __gia__ 

``` 
ma 
  vi ke tcei gia 
``` 
 
And it false that there exist 2 distinct things that are members of __ke__  
 
``` 
  fi bi ma 
    vi bo ka tcie ke 
    fi bo ko bi ka 
    fi ko tcie ke 
``` 
</spoiler>

<spoiler>

__tcoi:__ `[E:tcui a]` is a set of at least 2 things that individualy satisfy `[A:(a)]`.
---
```
po tcia ke gia be 
``` 

__ke__ is a subset of the set of all things that satisfy __gia__ 

``` 
ma 
  vi ke tcei gia 
``` 
 
And there exist (at least) 2 distinct things that are members of __ke__  
 
``` 
  fi bo ka tcie ke 
  fi bo ko bi ka 
  fi ko tcie ke 
``` 
</spoiler>

## Improved composability

Most of the vocabulary use set arguments to handle distributive and collective
behavior. However the above predicates use a property over a generic argument
instead of a set, meaning that set-based predicates cannot be used in it
without wrapping this argument into a set. We'll thus define a serie of
predicates that performs this wrapping automatically.

<spoiler>

__tca:__ `[E:tcai a]` is a set containing exactly one member, and satisfy `[A:(tcai a)]`.
---
```
po tca ke gia be
ke se tcai gia
```
</spoiler>

<spoiler>

__tcu:__ `[E:tcui a]` is the (non-empty) set of all things that individualy satisfy `[A:(tca a)]`.
---
```
po tcu ke gia be 
``` 

__ke__ is the set of all things that are the only member a set satisfying __gia__. 

``` 
ke tcui 
  via be ba tcie tca gia 
``` 
</spoiler>

<spoiler>

__tce:__ `[E:tcei a]` is a (non-empty) set of some things that individualy satisfy `[A:(tca a)]`.
---
```
po tce ke gia be
ke tcei
  via be ba tcie tca gia
```
</spoiler>

<spoiler>

__tco:__ `[E:tcoi a]` is a set of at least 2 things that individualy satisfy `[A:(tca a)]`. 
---
``` 
po tco ke gia be 
ke tcoi 
  via be ba tcie tca gia 
``` 
</spoiler>

<spoiler>

__tci:__ `[E:tca a]` is a member of set `[A:tce a]`. 
---
``` 
po tci ke ka be 
ke tca tcie ka 
``` 
</spoiler>

It is thus recommanded to mostly use those "wrapped versions" unless accessing
to the unwrapped members is necessary, which is the case when speaking about
nested sets (sets of sets). 

## Locally largest/smallest

A very useful concept to define more complex vocabulary is that of a set that
satisfy some property such that there exist no superset that also satisfy the
property.

<spoiler>

__djo:__ `[E:tce a]` is a locally largest set that satisfy `[A:(tce a)]`.
---
```
po djo ke gia be
ma
  vi ke gia
  fi bi bo ka
    vi ka bi ke
    fi ka gia
    fi ke tcia ka
```
</spoiler>

We can define a similar word such that there exist no subset.

<spoiler>

__dju:__ `[E:tce a]` is a locally smallest set that satisfy `[A:(tce a)]`.
---
```
po dju ke gia be
ma
  vi ke gia
  fi bi bo ka
    vi ka bi ke
    fi ka gia
    fi ka tcia ke
```
</spoiler>