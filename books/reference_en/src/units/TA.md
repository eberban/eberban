# Numbers (TA)

The **TA** family represents digits or concepts to express numbers.  Multiple
**TA** can be chained together, and the final chain acts asone predicate.

By default number represent a unique scalar value. However *vector tags* can be
used to describe vectors composed of multiple scalar values. The meaning of each
part of the vector will be defined by the predicates it will be used with. Tag
is placed before the number it qualifies, and a number not starting with a tag
is considered to have an implicit **teha**.

If it doesn't have a decimal part (**te**), no vector tag and is positive then
it is a **cardinal** with definition :

```eng
(A) is (a set of) [number] things satisfying [E1].
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
| tahio | \\(10^{21}\\) separator (zetta)       | tahiu | \\(10^{24}\\) separator (yotta)       |
|       |                                       |       | &nbsp;                                |
| teha  | Vector tag 0                          | tehe  | Vector tag 4                          |
| teho  | Vector tag 1                          | tehu  | Vector tag 5                          |
| tehia | Vector tag 2                          | tehie | Vector tag 6                          |
| tehio | Vector tag 3                          | tehiu | Vector tag 7                          |
|       |                                       |       | &nbsp;                                |
| tae   | negative sign                         | tao   | number/digit question                 |

> `tiha` "base" is the highest digit possible in that base. Base 10 is thus `tei
> tiha ..`, base 6 is `tie tiha ..`, ..

> TODO : Explain multiple \\(10^n\\) separators.
