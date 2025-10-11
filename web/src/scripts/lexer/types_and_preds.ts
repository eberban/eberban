import { all_non_sonorants, all_sonorants, all_vowels } from "../eberban_symbols";

export type Sonorant = typeof all_sonorants[number];

export type Consonant = typeof all_non_sonorants[number] | Sonorant;

export type Vowel = typeof all_vowels[number];

export type Alphabet_char = "h" | Consonant | Vowel;

export const is_alphabetical = (char: string): char is Alphabet_char => {
    const alphabet_array: string[] = [
        "h",
        ...all_non_sonorants.slice() as string[],
        ...all_sonorants.slice() as string[],
        ...all_vowels.slice() as string[],
    ];
    return alphabet_array.includes(char);
}

export const is_sonorant = (letter: Alphabet_char): letter is Sonorant => {
    return (all_sonorants.slice() as Alphabet_char[]).includes(letter);
}

export const is_consonant = (letter: Alphabet_char): letter is Consonant => {
    const is_non_sonorant = (all_non_sonorants.slice() as Alphabet_char[]).includes(letter);
    return is_sonorant(letter) || is_non_sonorant;
}

export const is_repeat = (char: string, last_char: string): boolean => {
    const both_are_identical = char === last_char;
    const both_are_spaces = [
        char !== "" && last_char !== "",
        !is_alphabetical(char) && !is_alphabetical(last_char),
    ].every((bool) => bool);
    return both_are_identical || both_are_spaces;
}

export const is_vowel = (letter: Alphabet_char): letter is Vowel => {
    return (all_vowels.slice() as Alphabet_char[]).includes(letter);
}
