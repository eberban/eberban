# Calendar and time

Eberban time system aims to provide powerful and consistent tools to speak about durations and
calendars. However to provide that power and consistency they may not follow arbitrary conventions
found in other languages.

## Durations

Duration words allows to measure elpased time that may not be aligned to the calendar, such as the
duration of a piece of music (3 minutes and 32 seconds). Since some units of measurements are based
on calendar concepts that don't have consistent duration, the duration expressed by those word is
the set of acceptable values. Duration words also follow the number predicate structure (__E__ is X
times __A__) which allows to easily compose them with numbers or other units of measurement.

- __bire__: __E__ is 1 year (Gregorian Calendar) times __A__ (default: 1)
- __gare__: __E__ is 1 month (Gregorian Calendar) times __A__ (default: 1)
- __kora__: __E__ is 1 week (from Xday midnight to next Xday midnight) times __A__ (default: 1)
- __dena__: __E__ is 1 day times __A__ (default: 1)
- __sura__: __E__ is 1 hour times __A__ (default: 1)
- __jero__: __E__ is 1 minute times __A__ (default: 1)
- __vola__: __E__ is 1 second times __A__ (default: 1)

> To speak about milliseconds and smaller, use multiplication with __vola__.

__vulu__ can be used to speak about the duration __E__ of an event __A__.

## Hours, minutes and seconds

Words for hours, minutes and seconds have the following meanings:

- __suria__: __E__ is the hour __A__ of __O__ (default: day/__denia__).
- __jerio__: __E__ is the minute __A__ of __O__ (default: hour/__suria__).
- __volia__: __E__ is the second __A__ of __O__ (default: minute/__jerio__).

They are relative to the start of __O__, thus the "minute 0" is from the start of __O__ to 1 minute
(excluded) after. "Minute 15" is 15 minutes after the start of __O__ to 16 minutes (excluded). __A__
is a set of numbers that must all be consecutive integers, such as "Minutes 10 to 15" is an event
spanning from 10 minutes after the start of __O__ to 15 minutes. __A__ can container negative
numbers, such as "Minute -2" is from 2 minutes before the start of __O__ to 1 minute (excluded)
before the start of __O__.

## Calendar-aligned events

Concept of days, weeks, month and years are inherently speaking about events that are aligned with
the calendar. "The first day of the festival" speaks about a day starting from midnight to the next
midnight, even if the festival starts at 10.

Aside from this alignment detail, the following words works the same way as __suria/jerio/volia__;
which means the first day of the week/month/year is day 0, and the first month of the year is month
0. You should thus be careful when translating a date from and to Eberban.

- __birie__: __E__ is year __A__ of __O__ (default: Gregorian Calendar). Year 1 is 1 AD, but year 0
  is 1 BC and year -1 is 2 BC. This matches [Astronomical year numbering].
- __garie__: __E__ is month __A__ of __O__ (default: year/__birie__).
- __koria__: __E__ is week __A__ of __O__ (default: year/__birie__). Weeks starts on Monday and end on Sunday.
- __denia__: __E__ is the day __A__ of __O__ (default: month/__garie__).

[Astronomical year numbering]: https://en.wikipedia.org/wiki/Astronomical_year_numbering

Compounds of form *e TI denia* are defined for each day of the week, and have the same meaning as
__denia__ with this additional constraint that __E__ is the particular day of the week.

## Exemples

> **Telling the current time of the day:**\
> *a skin jerio vao [tie tu] suria [te tio]*\
> Is occuring now the minute 54 of the hour 17 (of a day)

> **Telling the current date:**\
> *a skin e tia denia vao [ti] garie [tiu]*\
> Is occuring now a Sunday, the day 0 of month 8 (September 1st)

> *a mi drie meon sri skin denia vao te skun srui mi bure ze meon*
> I buy an apple, and tomorrow I will eat it.