# Numbers (TA/BQ)

The **TA** family represents digits or concepts to express numbers. On the other
hand, the **BQ** family represents various letters.

Multiple **TA** and **BQ** can be chained together, and the final chain acts as
one predicate.

If it neither have a decimal part (**te**) or letters then it is a **cardinal**
with definition :

```eng
(A) is (a set of) [number] things satisfying [E1].
```

Otherwise its an **abstract number** with definition :

```eng
(A) is the (abstract) number [number] with dimension/unit [E1] (default:
contextual, usually explicited by another unit).
```

Letters can be used to have measures composed of multiple parts designated by
the suffix letter. The value interpretation of the chain is context dependent,
often provided by another predicate it is used with.

> You can have a natural abstract number by adding a final **te**, which will
> not change the value but count as a decimal part.

> Numbers (with letters) can also be used for acronyms with
> [**zo**](../bindings/SA_ZA.md).

## Elidible terminator (BE)

The chain be terminated with the word **be**, which is often elidable. In fact,
it is only needed to separate 2 adjacent chains that **should not** merge into a
single one.

**bei** can be used after a **cardinal** to transform it into an **ordinal**
with place structure :

```eng
(A) is the [number]th member of ordered set [E1].
```

## TA members

| Word | Digit | Word | Digit | Word | Digit  | Word | Digit |
| ---- | ----- | ---- | ----- | ---- | ------ | ---- | ----- |
| ta   | 0     | tia  | 4     | tai  | 8      | taia | C/12  |
| te   | 1     | tie  | 5     | tei  | 9      | taie | D/13  |
| to   | 2     | tio  | 6     | toi  | ↊/A/10 | taio | E/14  |
| tu   | 3     | tiu  | 7     | tui  | ↋/B/11 | taiu | F/15  |

&nbsp;

| Word  | Definition                            | Word  | Definition                            |
| ----- | ------------------------------------- | ----- | ------------------------------------- |
| ti    | decimal separator                     | tiha  | `<base . number>` separator           |
| tihe  | `<precise . approximation>` separator | tihi  | `<number . repeating part>` separator |
|       |                                       |       | &nbsp;                                |
| taha  | \\(10^3\\) separator (kilo)           | tahe  | \\(10^6\\) separator (mega)           |
| taho  | \\(10^9\\) separator (giga)           | tahu  | \\(10^{12}\\) separator (tera)        |
| tahia | \\(10^{15}\\) separator (peta)        | tahie | \\(10^{18}\\) separator (exa)         |
| tahio | \\(10^{21}\\) separator (zetta)       | tahiu | \\(10^{24}\\) separator (yotta)       |  |
|       |                                       |       | &nbsp;                                |
| tae   | negative sign                         | tao   | number/digit question                 |

> `tiha`'s base part is the highest digit of that base. Base 10 is thus `tei tiha`,
> base 6 ``

> TODO : Explain multiple \\(10^n\\) separators.

## BQ members

| Letter     | Representation in eberban          |
| ---------- | ---------------------------------- |
| Vowels     | *qha, qhe, qhi, qho, qhu, qhq*     |
| Sonorants  | *qnq*, *qrq*, *qlq*                |
| Consonants | consonant + q (*bq, cq*, &hellip;) |
| h          | *qna*                              |
| '          | *qne*                              |
