# Adverbs and prepositions (voi/foi)

__voi/foi__ can be used to attach a single predicate P1 as an adverb of another predicate P2. P2
will be evaluated by P1 (by binding P2 to the A slot of P1), however the predicate resulting from
the combination of adverb P1 and P2 is a new predicate exposing all the slots of P1. It means
explicit bounds or chaining of P2 will interact with its slots, but will not be evaluated inside of
P1.

This is very useful where P1 is a context-modifying predicate, as it avoids further bindings to be
affected by that context modification.

For exemple, with `sra` meaning `[A:()] will occur`, usage with and without __voi__ differs in
meaning:

- `mi bure voi sra fa meon` = I will eat an apple (which exists now)
- `mi sra bure meon` = I will eat an apple (which will exist)


Any predicates present after the single predicate P1 form a chain C which will be bound to the E
slot of P1. This allows to have preposition-like clauses.

For exemple, with `pani` meaning `Inside of [E:tce pan], [A:()] occurs` and `sru` meaning `[A:()]
occured`:

- `mi bure voi pani spua fa meon sae duna voi sru fa mo`: I eat in the house an apple that you gave
  me (you're not necessarily in the house)
- `spua pani mi bure meon sae duna voi sru fa mo`: In the house: I eat an apple that you gave me
  (you were in the house and that's where you gave the apple to me)