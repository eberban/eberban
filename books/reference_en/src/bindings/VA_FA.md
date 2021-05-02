# Explicit bindings (VA/FA)

| FA     | VA  | Definition                                                                                                      |
| ------ | --- | --------------------------------------------------------------------------------------------------------------- |
| fa     | va  | Binds `A` place (restrictive)                                                                                   |
| fe     | ve  | Binds `E` place (restrictive)                                                                                   |
| fi     | vi  | Binds `I` place (restrictive)                                                                                   |
| fo     | vo  | Binds `O` place (restrictive)                                                                                   |
| fu     | vu  | Binds `U` place (restrictive)                                                                                   |
| &nbsp; |     |                                                                                                                 |
| fwa    | vwa | Binds `A` place (non-restrictive)                                                                               |
| fwe    | vwe | Binds `E` place (non-restrictive)                                                                               |
| fwi    | vwi | Binds `I` place (non-restrictive)                                                                               |
| fwo    | vwo | Binds `O` place (non-restrictive)                                                                               |
| fwu    | vwu | Binds `U` place (non-restrictive)                                                                               |
| &nbsp; |     |                                                                                                                 |
| fya    | vya | Adverbial : Binds predicate unit (restrictive)                                                                  |
| fye    | vye | Adverbial : Binds predicate unit (non-restrictive)                                                              |
| fyi    | vyi | Adverbial : Binds predicate unit (subordinative)                                                                |
| &nbsp; |     |                                                                                                                 |
| fey    | vey | Which place should be bound to make the proposition true ?                                                      |

If you want to bind a unit to another place than the default one, or
perform multiple bindings on the unit, you can use **VA**, terminated by
**vay**, to provide another binding. It is placed between the unit and a
possible next sequential unit. Any additional binding to this same unit
will then be made using **FA**, as **VA** would create an inner explicit
binding.

> **Vocabulary :**
> 
> - jve: `(A) is a friend of [E].`
> - mi: `(A) is I/a speaker/author.`
> - pcaro: `(A) has area [E] (measure, meters^2 by default / object(s) with same area).`
> - pcani: `(A) is at a distance in space of [E] (mesure, meters by default / object with this length) from (I) (default: here).`
> - tca: `(A) is a town/city.`
> - tel: `(A) is a small number (subjective/contextual) in dimension/unit [E1].`
> - tol: `(A) is a large number (subjective/contextual) in dimension/unit [E1].`
> - vyer: `(A) visits [E] with guide (I).`
>
> -----
>
> **Sentence without VA/FA :**
> *mi vyer tca*  
> I visit a city.
> 
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 \exists i_2 [vyer(a_1, e_2, i_2) \wedge F_3] \\\\
> F_3 = tca(i_2)
> \\]
> 
> -----
>
> **Sentence with VA/FA :**
> 
> *mi vyer [ve mo vay] tca [\<va pcani tel> \<fa pcaro tol> vay]*  
> I visit (guided by you) a city (which is near (small in distance) and is large
> in size).
> 
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 \exists i_2 [vyer(a_1, \color{magenta}{e_2}, i_2)
>   \wedge \color{magenta}{F_{2:1}}
>   \wedge F_3] \\\\
> \color{magenta}{F_{2:1}} = [mo(\color{magenta}{e_2})] \\\\
> F_3 = [tca(\color{cyan}{i_2}) \wedge \color{cyan}{F_{3:1}} \wedge \color{cyan}{F_{3:3}}] \\\\
> \color{cyan}{F_{3:1}} = \exists e_{3:1} \exists i_{3:1} [pcani(\color{cyan}{i_2}, e_{3:1}, i_{3:1}) \wedge F_{3:2}] \\\\
> F_{3:2} = \exists e_{3:2} [tel(e_{3:1}, e_{3:2})] \\\\
> \color{cyan}{F_{3:3}} = \exists e_{3:3} \exists i_{3:3} [pcaro(\color{cyan}{i_2}, e_{3:3}, i_{3:3}) \wedge F_{3:4}] \\\\
> F_{3:4} = \exists e_{3:2} [tol(e_{3:3}, e_{3:4})] 
> \\]

**FA** and **VA** contains the same particles having the same usage, with the
only difference being that a **VA** is used for the first binding while a **FA**
is used for subsequent bindings.

**va/ve/vi/vo/vu** allow to choose which place is used in the binding.

-----

**vwa/vwe/vwi/vwo/vwu** are called **non-restrictive bindings**. Instead
of the binding being part of the current statement, it is part of its own
independent statement. It is used to add additionnal information which can be
false without changing the truth value of the main statement.

> *mi don tun myan zar*  
> I like all cats that are black.
> 
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 [don(a_1,e_2) \wedge F_3] \\\\
> F_3 = \exists E_3 [tun(e_2, E_3) \wedge F_4] \\\\
> F_4 = \forall a_4 (E_3(a_4) \leftrightarrow [myan(a_4) \color{magenta}{\wedge F_5}]) \\\\
> \color{magenta}{F_5} = zar(a_4)
> \\]
>
> *mi don tun myan vwa zar*  
> I like all cats. They are black.
> 
> \\[
> S_1 = \exists a_1 [mi(a_1) \wedge F_2] \\\\
> F_2 = \exists e_2 [don(a_1,e_2) \wedge F_3] \\\\
> F_3 = \exists E_3 [tun(e_2, E_3) \wedge F_4] \\\\
> F_4 = \forall a_4 (E_3(a_4) \leftrightarrow [myan(a_4)]) \\\\
> \color{magenta}{S_5} = zar(a_4)
> \\]
>

----

**vya/vye/vyi** are called **adverbials**. They allow to perform a bind on the
predicate itself.

**vya** performs a restrictive bind over the predicate itself.

> *jvin va tyi pre fya blan*  
> The fact/event of [3 persons dance] is true and is beautiful.  
> = 3 persons dance beautifully.  
> (They may be more persons dancing)
> 
> \\[
> \color{magenta}{S_1} = \exists \color{cyan}{Z_1} [\color{cyan}{Z_1} \wedge F_1^\prime \wedge \color{magenta}{F_{1:3}}] \\\\
> F_1^\prime = \color{cyan}{Z_1} \leftrightarrow (\exists a_1 [jvin(a_1) \wedge F_{1:1}]) \\\\
> F_{1:1} = \exists E_{1:1} [tyi(a_1,E_{1:1}) \wedge F_{1:2}] \\\\
> F_{1:2} = \forall a_{1:2} (E_{1:1}(a_{1:2}) \leftrightarrow [pre(a_{1:2})]) \\\\
> \color{magenta}{F_{1:3}} = blan(\color{cyan}{Z_1})
> \\]

**vye** performs a non-restrictive bind, which is stated in its own independant
statement.

> *jvin va tyi pre fye blan*  
> 3 persons dance. They're dancing beautifully.  
> (There are only 3 persons dancing, and they're all dancing beautifully)
> 
> \\[
> \color{magenta}{S_1} = \exists \color{cyan}{Z_1} [\color{cyan}{Z_1} \wedge F_1^\prime] \\\\
> F_1^\prime = \color{cyan}{Z_1} \leftrightarrow (\exists a_1 [jvin(a_1) \wedge F_{1:1}]) \\\\
> F_{1:1} = \exists E_{1:1} [tyi(a_1,E_{1:1}) \wedge F_{1:2}] \\\\
> F_{1:2} = \forall a_{1:2} (E_{1:1}(a_{1:2}) \leftrightarrow [pre(a_{1:2})]) \\\\
> \color{magenta}{S_{1:3}} = blan(\color{cyan}{Z_1})
> \\]

**vyi** performs a subordinative bind. This main sentence is not stated to
be true.

> *jvin va tyi pre fyi kca*
> It is possible that 3 persons dance.
> (It's only a possibility, we don't state that 3 persons are dancing)
> 
> \\[
> \color{magenta}{F_1} = \exists \color{cyan}{Z_1} [\color{cyan}{Z_1} \wedge F_1^\prime] \\\\
> F_1^\prime = \color{cyan}{Z_1} \leftrightarrow (\exists a_1 [jvin(a_1) \wedge F_{1:1}]) \\\\
> F_{1:1} = \exists E_{1:1} [tyi(a_1,E_{1:1}) \wedge F_{1:2}] \\\\
> F_{1:2} = \forall a_{1:2} (E_{1:1}(a_{1:2}) \leftrightarrow [pre(a_{1:2})]) \\\\
> \color{magenta}{S_{1:3}} = \color{magenta}{F_1} \wedge kca(\color{cyan}{Z_1})
> \\]