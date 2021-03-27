# Numbers and string (TA/BQ)

The **TA** family represents digits or concepts to express numbers. On the other
hand, the **BQ** family represents various letters.

Multiple **TA** and **BQ** can be chained together, and the final chain acts as
one predicate.

## Numbers

If the first word of the chain is a **TA**, the chain is a number.

If it neither have a decimal part (**te**) or letters then it is a **cardinal**
with definition :

```eng
Ⓐ is (a set of) [number] things satisfying [Ⓔ1].
```

Otherwise its a **measure** with definition :

```eng
Ⓐ has a measure of [number] (unitless) multiplied by [E] (conversion value with unit).
```

Letters can be used to have measures composed of multiple parts designated by
the suffix letter. The value interpretation of the chain is context dependent,
often provided by another predicate it is used with.

> You can have a natural number **measure** by adding a final **te**, which will
> not change the value but count as a decimal part.

## Strings

If the first word of the chain is a **BQ**, the chain is a predicate about
something recognized by this sequence of letters. It could be a predicate chain
(explaned later) with these initials, or a contextual predicate associated with
these letters.

The meaning is thus ambiguous, and disambiguation might be necessary.

## Elidible terminator (BE)

Both types of chains (numbers and strings) can be terminated with the word
**be**, which is often elidable. In fact, it is only needed to separate 2
adjacent chains that **should not** merge into a single one.

**bey** can be used after a **cardinal** to transform it into an **ordinal**
with place structure :

```eng
Ⓐ is the [number]th member of ordered set [Ⓔ1].
```

## TA members

| Word | Definition                            | Word | Definition                            |
| ---- | ------------------------------------- | ---- | ------------------------------------- |
| tya  | 1                                     | tye  | 2                                     |
| tyi  | 3                                     | tyo  | 4                                     |
| tyu  | 5                                     | twa  | 6                                     |
| twe  | 7                                     | twi  | 8                                     |
| two  | 9                                     | twu  | A (10)                                |
| tway | B (11)                                | twey | C (12)                                |
| twiy | D (13)                                | twoy | E (14)                                |
| twuy | F (15)                                | ta   | 0                                     |
|      |                                       |      | &nbsp;                                |
| te   | decimal separator                     | teha | `<base . number>` separator           |
| tehe | `<precise . approximation>` separator | tehi | `<number . repeating part>` separator |
|      |                                       |      | &nbsp;                                |
| tey  | \\(10^3\\) (thousands) separator      | teya | \\(10^6\\) separator                  |
| teye | \\(10^9\\) separator                  | teyi | \\(10^{12}\\) separator               |
| teyo | \\(10^{15}\\) separator               | teyu | \\(10^{18}\\) separator               |
|      |                                       |      | &nbsp;                                |
| to   | negative sign                         | toy  | number/digit question                 |

> TODO : Explain multiple \\(10^n\\) separators.

## BQ members

| Letter     | Representation in eberban          |
| ---------- | ---------------------------------- |
| Vowels     | *ahq, ehq, ihq, ohq, uhq, qhq*     |
| Consonants | consonant + q (*bq, cq*, &hellip;) |
| y / w      | *yq* / *wq*                        |
| H          | *qha*                              |
| '          | *qhe*                              |
