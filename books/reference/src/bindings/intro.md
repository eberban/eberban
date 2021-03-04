# Predicate bindings

Each predicate unit has a **left chaining place** and a **right chaining place**,
which will define which of its variables will be bound with other predicate
units variables.

By default, both are the Ⓐ place. If a definition contains a place written in
brackets `[]`, this place becomes the **right chaining place**. The families
described in the following chapters allow to override this default behavior.

When predicates are chained after each other, for each pair of consecutive
units, the left unit right chaining place will be bound to the right unit left
chaining place.

However, if the left unit right chaining place expects a predicate, it will be
bound the right unit itself. The parameters of this predicate arguments will
be Ⓐ, Ⓔ, ... in order.

If we look again this previous sentence :

> mi don spi mo  
> *I like to talk to you.*
>
> **mi:** Ⓐ is me/a speaker/author.  
> **don:** Ⓐ likes that Ⓔ (default: Ⓔ) satisfies property [Ⓘ1].  
> **spi:** Ⓐ talks to [Ⓔ] about subject Ⓘ0.  
> **mo:** Ⓐ is you, a listener.
>
> We first define each statement/predicate :
>
> \\[
> P_1 = \exists a_1 \\: \text{mi}(a_1) \\\\
> P_2 = \exists a_2 \exists e_2 \exists I_2 \\: \text{don}(a_2,e_2,I_2) \\\\
> P_3(a_3) = \exists e_3 \exists I_3 \\: \text{spi}(a_3,e_3,I_3) \\\\
> P_4 = \exists a_4 \\: \text{mo}(a_4)
> \\]
>
> Then we state that some variables are bound together (shared between
> statements or predicates) :
>
> - \\(\\color{green}{a}_1 = a_2\\), because *mi* has no brackets place.
> - \\(\\color{green}{I}_2 = P_3\\), because *don* has a `[Ⓘ1]`  predicate place.
> - \\(\\color{green}{e}_3 = a_4\\), because *spi* has a `[Ⓔ]`  individual place.
>
> Finally we express the complete statement :
>
> \\[
> P_1 \wedge P_2 \wedge P_4
> \\]
>
> \\(P_3\\) is not included as it's not a complete statement and is embeded
> inside \\(P_2\\).