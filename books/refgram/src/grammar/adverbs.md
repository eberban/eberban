# Adverbs (PU)

__PU__ can be used to attach a predicate P1 as an adverb of another predicate P2. P2 will be
evaluated by P1 (by binding P2 to the A slot of P1), however the predicate resulting from the
combination of adverb P1 and P2 is a new predicate exposing all the slots of P1. It means explicit
bounds or chaining following P2 will interact with its slots, but will not be evaluated inside of
P1.

This is very useful where P1 is a context-modifying predicate, as it avoids further bindings to be
affected by that context modification.

For exemple, `sru` means `[A:()] will occur.` Usage with and without __pu__ are the following:

- `mi [pu sru bure] meon` = I will eat an apple (which exists now)
- `mi sru bure meon` = I will eat an apple (which will exist)

Explicit binds can be attached to the adverb with __VI+FI__, in which case __VEI__ must then be used
end the explicit binds and move on to P2.