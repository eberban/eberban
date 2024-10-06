# Numbers (TI/j-)

Numbers are important to communicate and serve many purposes. Eberban numbers
are expressed as a chain of __TI__ particles (any particles starting with _t-_),
which can optionally contain separators and a terminator starting with _j-_ to
make more advanced numbers.

## Digits

Numbers are mainly composed of digits (__TI__ family), which are chained one
after the other, starting from the highest significant one to the lowest, and is
by default expressed in base ten.

|     | -i | -e | -a | -o | -u  |
|:---:|:--:|:--:|:--:|:--:|:---:|
| t-  | 0  | 1  | 2  | 3  |  4  |
| ti- |    | 5  | 6  | 7  |  8  |
| te- | 9  |    | A  | B  |  C  |
| ta- | D  | E  |    | F  | ... |

__te ta__ thus means __12__ while __tei ti tu__ means __904__.

While it is normally not allowed to use a digit higher than the base, it is
allowed if only one digit is used since there is no ambiguity over its value.
__teo__ is thus __B/11__, while __teo ti__ is not allowed in base ten.

> The series described in the table is infinite and can be expanded if the
> speaker wants to use larger bases by iterating over the vowels in order and
> skipping cases where the same vowel appears multiple times in a row (since
> Eberban considers multiple identical letters the same as a single one)
>
> ti, ta, ..., tu\
> tie, tia, ..., tua, tuo\
> tiei, tiea, ..., tuoa, tuou

## Number syntax

Numbers follow the following syntax with some parts being optional:

_base_ __ju__ _integer-part_ __jo__ _fractional-part_ __ja__ _repeated-part_ __je__ _magnitude_

1. Optionaly the _base_ of the number can be expressed by a single __TI__
   followed by __ju__. This __TI__ is the last digit of the base used, thus
   __tei ju__ is base ten, __teo ju__ is base twelve, and __tao ju__ is
   hexadecimal. If absent it defaults to base ten (__tei ju__), unless the default
   base is overwritten in the context (TODO: Add word to set such default base).
2. The _integer part_ of the number, as a string of zero or more digits __TI__.
   If there are zero digits then a fractional part is mandatory, unless __je__ is used.
3. This integer part can then optionally be followed by __jo__ and a _fractional
   part_ which is also a string of zero or more digits __TI__. __joi__ can be used instead to also
   make the number negative.
4. If there is a fractional part, it can be followed by __ja__ and a _repeated part_ which is also a
   string of at least one digit __TI__. The number has these digits repeated indefinitely.
5. Regardless of the presence of a fractional part or integer part, the number can then contain
   __je__ followed by a _magnitude_, which is a string of at least one digit __TI__. The value
   expressed is the previous part multiplied by \\(\text{base}^{\text{magnitude}}\\). __jei__ can be
   used instead to express a negative magnitude. If only the magnitude is present then the integer
   part is considered to be equal __1__.

> Examples :
>
> - teo ju tie tia = \\(56_{12}\\)
> - tu ta = \\(42\\)
> - to jo te tu te tie tei = \\(3.14159\\)
> - to jo te ja to = \\(3.1\overline{3}\\), \\(3.1333\dots\\)
> - to jo ja to = \\(3.\overline{3}\\), \\(3.333\dots\\)
> - to joi = \\(-3\\)
> - tia jo ti ta ta je ta to = \\(6.022 \times 10^{23}\\)
> - tei jo te ti tei jei to te = \\(9.109 \times 10^{-31}\\)

## Various usage of numbers

Numbers have various usages which require different definitions and arguments.
The desired definition can be selected by ending the number with a particle of
family __JI__ (__jie__ is inferred if omitted). __jie__ is mandatory between
consecutive numbers to tell them apart. Particles other than __jie__ must follow
positive integer (no fractional part).

- __ji__: `[E:tce* a] is (a group of) [number] things satisfying [A:(tca a)].`\
  Speaks about a set of expressed cardinality.
- __jia__: `[E:tce* a] is (a group of) [number] things satisfying [A:(a)].`\
  Same but uses the raw property variant of set definitions.
- __jio__: `[E:tcu a] is (a group of) the only [number] things satisfying [A:(tca a)].`\
  These are the only things that satisfy the property. There is nothing that
  satisfies A which is not in the set.
- __jioa__: `[E:tcu a] is (a group of) the only [number] things satisfying [A:(a)].`\
  Same but uses the raw property variant of set definitions.
- __jiu__: `[E:tca a] is the [number]th member of sequence [A:blu a].`\
  Speaks about an element in an ordered list. Index follows zero-based numbering, such that
  the first element is the 0th.
- __jie__: `[E:tce gan] is the number [number] times [A:tce gan] (default: 1 unitless).`\
  `gan` is the word for a number, and both arguments are sets of numbers. These
  sets allow handling many numbers (ranges, approximations, or even arbitrarily
  constructed ones), and math operations are also defined using sets to
  distributively operate on each value of the set. The __A__ argument allows 
  multiplying this number with another number such as unit numbers ("1 meter",
  "1 kilogram", etc). The __A__ argument defaults to __1 unitless__.

Note that the _raw property of set definitions_ refers to the fact that sets
have two types of predicates: one where a member must satisfy argument `(a)` and
the other `(tca a)`. Many predicates expect their arguments to be sets, so the
latter is usually used. The former allows accessing raw members, an example use
case is dealing with nested sets.
