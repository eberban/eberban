# Explicit bindings (VA/FA)

> This chapter use outdated definitions.

| FA     | VA  | Definition       |
| ------ | --- | ---------------- |
| fa     | va  | Binds `A` place  |
| fe     | ve  | Binds `E` place  |
| fi     | vi  | Binds `I` place  |
| fo     | vo  | Binds `O` place  |
| &nbsp; |     |                  |
| fua    |     | Binds same place |
| fue    |     | Binds next place |

If you want to bind a unit to another place than the default one, or perform
multiple bindings on the unit, you can use **VA**, terminated by **vai**, to
provide another binding. It is placed between the unit and a possible next
sequential unit. Any additional binding to this same unit will then be made
using **FA**, as **VA** would create an inner explicit binding.

> **Vocabulary :**
>
> - jven: `(A) is a friend of [E].`
> - mi: `(A) is I/a speaker/author.`
> - zono: `(A) has area [E] (measure, meters^2 by default / object(s) with same
>   area).`
> - vuno: `(A) is at a distance in space of [E] (mesure, meters by default /
>   object with this length) from (I) (default: here).`
> - peol: `(A) is a town/city.`
> - ter: `(A) is a small number (subjective/contextual) in dimension/unit [E1].`
> - tor: `(A) is a large number (subjective/contextual) in dimension/unit [E1].`
> - vier: `(A) visits [E] with guide (I).`
>
> -----
>
> **Sentence without VA/FA :** *mi vier peol*  
> I visit a city.
>
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 \exists i_2 [vier(a_1, e_2, i_2) \wedge F_3] \\\\
> F_3 = peol(e_2)
> \\]
>
> -----
>
> **Sentence with VA/FA :**
>
> *mi vier [vi mo vai] peol [\<va vuno ter> \<fa zono tor> vai]*  
> I visit (guided by you) a city (which is near (small in distance) and is large
> in size).
>
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 \exists i_2 [vier(a_1, \color{magenta}{e_2}, i_2) \wedge
>   \color{magenta}{F_{2:1}} \wedge F_3] \\\\
> \color{magenta}{F_{2:1}} = [mo(\color{magenta}{i_2})] \\\\
> F_3 = [peol(\color{cyan}{e_2}) \wedge \color{cyan}{F_{3:1}} \wedge
> \color{cyan}{F_{3:3}}] \\\\
> \color{cyan}{F_{3:1}} = \exists e_{3:1} \exists i_{3:1}
> [vuno(\color{cyan}{i_2}, e_{3:1}, i_{3:1}) \wedge F_{3:2}] \\\\
> F_{3:2} = \exists e_{3:2} [ter(e_{3:1}, e_{3:2})] \\\\
> \color{cyan}{F_{3:3}} = \exists e_{3:3} \exists i_{3:3}
> [zono(\color{cyan}{i_2}, e_{3:3}, i_{3:3}) \wedge F_{3:4}] \\\\
> F_{3:4} = \exists e_{3:2} [tor(e_{3:3}, e_{3:4})] 
> \\]

**FA** and **VA** contains the same particles having the same usage, with the
only difference being that a **VA** is used for the first binding while a **FA**
is used for subsequent bindings.

**va/ve/vi/vo** allow to choose which place is used in the binding.