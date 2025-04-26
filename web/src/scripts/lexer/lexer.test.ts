import { describe, expect, test } from "vitest";
import lex from "./index";


test(`A string is not lexed if it is empty`, () => {
    expect(lex(``)).toStrictEqual([]);
})


describe(`A single eberban space is lexed if the inputted string`, () => {
    describe(`comprises a single eberban space`, () => {
        test.for([
            `q`, `w`, `x`, `y`,
            ` `, `​`, `👀`, 
            `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `_`, `+`, `=`, `|`, 
            `(`, `)`,  `{`, `}`, `<`, `>`, `\\`, `/`,
            `'`, `"`, `\``,
            `:`, `;`, `,`, `.`, `?`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`comprises a single repeated eberban space`, () => {
        test.for([
            `qq`, `   `, `​​`, `👀👀👀👀👀`, `||||||`,
            `>>>>>>>`, `''''''''`, `:::::::::`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`begins with hyphen(s) and ends with eberban space(s)`, () => {
        test.for([`- `, `--: `, `---)...`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`begins with eberban space(s) and ends with hyphen(s)`, () => {
        test.for([`... ---`, `(--`, `👀-`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`comprises hyphen(s) surrounded by eberban space(s)`, () => {
        test.for([`:-)`, `;--;`, `\\-/`, `  ---  `])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`comprises square bracket characters`, () => {
        test.for([`[`, `]`, `[]`, `][`, `][][][`, `[[]][[]]]`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`comprises a mix of square bracket characters and eberban spaces`, () => {
        test.for([`[...]`, `[-]`, ` [ [  []  ] ] `])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
    describe(`comprises a multitude of eberban spaces`, () => {
        test.for([
            `qwwwwqqyyyxxx`, ` q q q q `, `~!@&^#%`, `(*&www👀*)`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{type: "Space", value: "" }]);
        });
    });
});


/*
  DEFINITIONS

  :: mahul ::
  
  One or more consecutive vowels, optionally including "h".
  Representation: V(h?V)*
 
  :: shyllable ::

  A single consonant or consonant cluster followed by a mahul.
  Representation: CC?C?[mahul]

  Examples:

  - sonorant-shyllable: sonorant followed by a mahul.
  - non-sonorant-shyllable: non-sonorant consonant followed by a mahul.
  - medial-pair-shyllable: medial pair followed by a mahul.

  Etc. 
*/


describe(`An eberban particle is lexed if it`, () => {
    describe(`comprises a single non-sonorant-shyllable`, () => {
        test.for([`zi`, `mio`, `tiho`, `saeoi`, `paoieheha`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
        });
    });
    describe(`
        1. begins with a mahul
        2. follows with any number of sonorant-shyllables
        3. optionally ends with a sonorant
        `,
        () => {
            test.for([`a`, `ahu`, `al`, `anu`, `oie`, `oiu`, `uhieaho`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
    describe(`
        1. begins with one or more sonorant-shyllables
        2. optionally ends with a sonorant
        `,
        () => {
            test.for([`ni`, `ra`, `lu`, `nahinel`, `rihihihe`, `lulu`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
});


describe.skip(`An eberban root is lexed if it`, () => {
    describe(`
        1. begins with one non-sonorant-shyllable
        2. ends with a sonorant
        `,
        () => {
            test.for([`ber`, `mian`, `vahul`, `boiur`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Root`, value: input }]);
            });
        },
    );
    describe(`
        1. begins with one non-sonorant-shyllable
        2. follows with at least one of:
           a. sonorant-shyllable
           b. medial-pair-shyllable
           c. consonant-triplet-shyllable
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
        1. begins with one initial-pair-shyllable
        2. follows with any number of:
           a. sonorant-shyllable
           b. medial-pair-shyllable
           c. consonant-triplet-shyllable
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
