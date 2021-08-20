# Numbers (TA)

The **TA** family represents digits or concepts to express numbers.  Multiple
**TA** can be chained together, and the final chain acts asone predicate.

By default number represent a unique scalar value. However *vector tags* can be
used to describe vectors composed of multiple scalar values. The meaning of each
part of the vector will be defined by the predicates it will be used with. Tag
is placed before the number it qualifies, and a number not starting with a tag
is considered to have an implicit **teha**.

If it doesn't have a decimal part (**ti**), no vector tag and is greater than 0
then it is a **cardinal** with definition :

```eng
(A) is (a group of) [number] things satisfying [E1].
```

Otherwise its an **abstract number** with definition :

```eng
(A) is the (abstract) number [number] with dimension/unit [E1] (default:
contextual, usually explicited by another unit).
```

> You can have a natural abstract number by adding a final **te**, which will
> not change the value but count as a decimal part.

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
| te   | 0     | tei  | 4     | tie  | 8      | teie | C/12  |
| ta   | 1     | tai  | 5     | tia  | 9      | teia | D/13  |
| to   | 2     | toi  | 6     | tio  | ↊/A/10 | teio | E/14  |
| tu   | 3     | tui  | 7     | tiu  | ↋/B/11 | teiu | F/15  |

&nbsp;

| Word  | Definition                            | Word  | Definition                            |
| ----- | ------------------------------------- | ----- | ------------------------------------- |
| ti    | decimal separator                     | tiha  | `<base digit. number>` separator      |
| tihe  | `<precise . approximation>` separator | tihi  | `<number . repeating part>` separator |
| tiho  | `<numerator . denominator>` separator |       |                                       |
|       |                                       |       | &nbsp;                                |
| tahe  | \\(base^3\\) separator (kilo)         | taha  | \\(base^6\\) separator (mega)         |
| taho  | \\(base^9\\) separator (giga)         | tahu  | \\(base^{12}\\) separator (tera)      |
| tahei | \\(base^{15}\\) separator (peta)      | tahai | \\(base^{18}\\) separator (exa)       |
| tahoi | \\(base^{21}\\) separator (zetta)     | tahui | \\(base^{24}\\) separator (yotta)     |
|       |                                       |       | &nbsp;                                |
| tehe  | Vector tag 0                          | teha  | Vector tag 1                          |
| teho  | Vector tag 2                          | tehu  | Vector tag 3                          |
| tehei | Vector tag 4                          | tehai | Vector tag 5                          |
| tehoi | Vector tag 6                          | tehui | Vector tag 7                          |
|       |                                       |       | &nbsp;                                |
| tea   | negative sign                         |       |                                       |

> `tiha` "base digit" is the highest digit possible in that base. Base 10 is
> thus `tia (9) tiha ..`, base 6 is `tai (5) tiha ..`, ..

> TODO : Explain multiple \\(base^n\\) separators.
