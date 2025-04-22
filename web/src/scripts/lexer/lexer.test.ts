import { describe, expect, test } from "vitest";
import lex from "./index";


describe(`A string is not lexed if it`, () => {
    test(`is empty`, () => {
        expect(lex(``)).toStrictEqual([]);
    });
    describe(`comprises a single eberban space`, () => {
        test.for([
            `q`, `w`, `x`, `y`,
            ` `, `​`, `👀`, 
            `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `_`, `+`, `=`, `|`, 
            `(`, `)`,  `{`, `}`, `<`, `>`, `\\`, `/`,
            `'`, `"`, `\``,
            `:`, `;`, `,`, `.`, `?`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`comprises a single repeated eberban space`, () => {
        test.for([
            `qq`, `   `, `​​`, `👀👀👀👀👀`, `||||||`,
            `>>>>>>>`, `''''''''`, `:::::::::`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`begins with hyphen(s) and ends with eberban space(s)`, () => {
        test.for([`- `, `--: `, `---)...`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`begins with eberban space(s) and ends with hyphen(s)`, () => {
        test.for([`... ---`, `(--`, `👀-`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`comprises hyphen(s) surrounded by eberban space(s)`, () => {
        test.for([`:-)`, `;--;`, `\\-/`, `  ---  `])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`comprises square bracket characters`, () => {
        test.for([`[`, `]`, `[]`, `][`, `][][][`, `[[]][[]]]`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`comprises a mix of square bracket characters and eberban spaces`, () => {
        test.for([`[...]`, `[-]`, ` [ [  []  ] ] `])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`comprises a multitude of eberban spaces`, () => {
        test.for([
            `qwwwwqqyyyxxx`, ` q q q q `, `~!@&^#%`, `(*&www👀*)`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
});


/*
  DEFINITIONS

  :: vhowel ::
  
  A character from the set { h, i , e, a, o, u }. Note that `h` must be between
  two vowels.

  :: vunit ::

  A single consonant or consonant cluster followed by one or more vhowels. E.g.:

  - sonorant-vunit: sonorant followed by one or more vhowels.
  - non-sonorant-vunit: non-sonorant consonant followed by one or more vhowels.
  - medial-pair-vunit: medial pair followed by one or more vhowels.

  Etc.
*/


describe(`An eberban particle is lexed if it`, () => {
    describe(`comprises a single non-sonorant-vunit`, () => {
        test.for([`zi`, `mio`, `tiho`, `saeoi`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
        });
    });
    describe(`
        1. begins with at least one vhowel
        2. follows with any number of sonorant-vunits
        3. optionally ends with a sonorant
        `,
        () => {
            test.for([`a`, `ahu`, `al`, `anu`, `oie`, `oiu`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
    describe(`
        1. begins with one or more sonorant-vunits
        2. optionally ends with a sonorant
        `,
        () => {
            test.for([`ni`, `ra`, `lu`, `nahinel`, `lulu`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
});


describe(`An eberban root is lexed if it`, () => {
    describe(`
        1. begins with one non-sonorant-vunit
        2. ends with a sonorant
        `,
        () => {
            test.for([`ber`, `mian`, `vahul`, `boiur`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Root`, value: input }]);
            });
        },
    );
    describe(`
        1. begins with one non-sonorant-vunit
        2. follows with at least one of:
           a. sonorant-vunit
           b. medial-pair-vunit
           c. consonant-triplet-vunit
        3. optionally ends with a sonorant
        `,
        () => {
            test.for([
                `dona`, `kitmi`, `makfca`,
                `toril`, `kagvin`, `siftcen`,
            ])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Root`, value: input }]);
            });
        },
    );
    describe(`
        1. begins with one initial-pair-vunit
        2. follows with any number of:
           a. sonorant-vunit
           b. medial-pair-vunit
           c. consonant-triplet-vunit
        3. optionally ends with a sonorant
        `,
        () => {
            test.for([
                `vle`, `jveo`, `ctuhi`, `jbine`, `cfolna`, `vnifkre`,
                `jvin`, `spoul`, `zgehal`, `bjonil`, `stokman`, `kloptson`,
            ])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Root`, value: input }]);
            });
        },
    );
});
