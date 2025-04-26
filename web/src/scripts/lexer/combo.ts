import {
    Alphabet_char,
    Consonant,
    is_consonant,
    is_sonorant,
    is_vowel,
    Vowel,
    Sonorant as Sonorant_Char,
} from "./types_and_preds";




interface Combo_Item {
    readonly type: string;
    readonly get_content: () => string;
}




class Sonorant implements Combo_Item {
    readonly type = "sonorant";
    private readonly value: Sonorant_Char;
    constructor(value: Sonorant_Char) {
        this.value = value;
    }
    get_content() {
        return this.value;
    }
}

function build_sonorant(sonorant: Sonorant_Char): Sonorant {
    return new Sonorant(sonorant);
}




class Mahul implements Combo_Item {
    readonly type = "mahul";
    private readonly value: (Vowel | "h")[] = [];
    constructor(value: (Vowel | "h")[]) {
        this.value = value;
    }
    get_content() {
        return this.value.join("");
    }
}

function build_mahul(letters: Alphabet_char[]):
{ mahul: Mahul, unbuilt: Alphabet_char[] }
{
    const mahul_letters: (Vowel | "h")[] = [];
    for (let index = 0; index < letters.length; index++) {
        const current_letter = letters[index];
        const next_letter: Alphabet_char | undefined = letters[index + 1];
        if (is_vowel(current_letter)) {
            mahul_letters.push(current_letter);
        }
        else if (current_letter === "h") {
            if (is_vowel(next_letter)) {
                mahul_letters.push(current_letter, next_letter);
                index++;
            } else {
                // todo error handling
                const mahul = new Mahul(mahul_letters);
                return { mahul, unbuilt: letters.slice(index) };
            }
        } else {
            // current_letter is a consonant. The mahul is built.
            const mahul = new Mahul(mahul_letters);
            return { mahul, unbuilt: letters.slice(index) };
        }
    }
    const mahul = new Mahul(mahul_letters);
    return { mahul, unbuilt: [] };
}




type Shyllable_Type = "non-sonorant-shyllable" | "sonorant-shyllable";

class Shyllable implements Combo_Item {
    readonly type: Shyllable_Type;
    private readonly consonants: Consonant[];
    private readonly mahul: Mahul;
    constructor(type: Shyllable_Type, consonants: Consonant[], mahul: Mahul) {
        this.type= type;
        this.consonants = consonants;
        this.mahul = mahul;
    }
    get_content() {
        return this.consonants.join("") + this.mahul.get_content();
    }
}

const build_consonants = (letters: Alphabet_char[]):
{ consonants: Consonant[], remaining_letters: Alphabet_char[] } =>
{
    const consonants: Consonant[] = [];
    let index = 0;
    while (true) {
        const letter = letters[index];
        if (!is_consonant(letter)) {
            break;
        }
        consonants.push(letter);
        index++;
    }
    return { consonants, remaining_letters: letters.slice(index) };
}

const get_shyllable_type = (consonants: Consonant[]): Shyllable_Type | null => {
    if (consonants.length === 1) {
        if (is_sonorant(consonants[0])) {
            return "sonorant-shyllable";
        } else {
            return "non-sonorant-shyllable";
        }
    }
    return null;
}

function build_shyllable(letters: Alphabet_char[]):
{ shyllable: Shyllable, unbuilt: Alphabet_char[] }
{
    const { consonants, remaining_letters } = build_consonants(letters);
    const shyllable_type = get_shyllable_type(consonants);
    if (shyllable_type === null) {
        // todo error handling
        const shyllable = new Shyllable("non-sonorant-shyllable", [], new Mahul([]));
        return { shyllable, unbuilt: [] }; 
    }
    const { mahul, unbuilt } = build_mahul(remaining_letters); // todo error handling from here
    const shyllable = new Shyllable(shyllable_type, consonants, mahul);
    return { shyllable, unbuilt };
}




/* ENTRY */
export default function build_combo(possible_word: Alphabet_char[]): Combo_Item[] {
    const combo: Combo_Item[] = [];
    let remaining_letters = possible_word;
    while (remaining_letters.length > 0) {
        const head = remaining_letters[0];
        if (is_vowel(head)) {
            const { mahul, unbuilt } = build_mahul(remaining_letters);
            // todo error handling
            combo.push(mahul);
            remaining_letters = unbuilt;
        } else if (is_consonant(head)) {
            if (is_sonorant(head) && remaining_letters.length === 1) {
                const sonorant = build_sonorant(head);
                combo.push(sonorant);
                remaining_letters = [];
            } else {
                const { shyllable, unbuilt } = build_shyllable(remaining_letters);
                // todo error handling
                combo.push(shyllable);
                remaining_letters = unbuilt;
            }
        } else {
            ; // TODO error handling, beginning with h or something else
        }
    }
    return combo;
}
