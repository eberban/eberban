# Second-order logic

Second-order logic adds predicate variables (in uppercase) in addition to
individual variables :

> mi don spi mo  
> *I like to talk to you.*
>
> **mi:** Ⓐ is me/a speaker/author.  
> **don:** Ⓐ likes that Ⓔ (default: Ⓔ) satisfies property [Ⓘ1].  
> **spi:** Ⓐ talks to [Ⓔ] about subject Ⓘ0.  
> **mo:** Ⓐ is you, a listener.

`Ⓘ1` means the I place expects a predicate with 1 argument.

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
> \\[
> a_1 = a_2 \\\\
> I_2 = P_3 \\\\
> e_3 = a_4
> \\]
>
> Finally we express the complete statement :
>
> \\[
> P_1 \wedge P_2 \wedge P_4
> \\]
>
> \\(P_3\\) is not included as it's not a complete statement and is embeded
> inside \\(P_2\\).