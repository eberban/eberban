import { JSX } from "preact";
import { parse } from "preact-parser";
import render_to_string from "preact-render-to-string";
import type { JSX_Child, Replacer } from "./types";

/* TYPES */


type Replacement = {
    begin_index: number,
    end_index: number,
    jsx: JSX.Element,
};

// string.matchAll() requires a global regex.
type Global_Regex = RegExp;


/* ENTRY */


export default function markup_to_jsx_child(
    input: JSX_Child,
    regex_string: string,
    replacer: Replacer,
    keep_children_as_string: boolean = false,
) {
    const string_input = typeof input === "string" ? input : render_to_string(input);

    // We use a separate regex to test whether we need to make_replacements().
    // This is because using regex.test() on a global regex advances its lastIndex
    // and that will produce inconsistent behaviour.
    if (!new RegExp(regex_string).test(string_input)) {
        return input;
    }
    const replacements = make_replacements(
        string_input,
        new RegExp(regex_string, "g"),
        replacer,
        keep_children_as_string
    );
    return replace_string_with_jsx(string_input, replacements);
}

function make_replacements(
    input: string,
    regex: Global_Regex,
    replacer: Replacer,
    keep_children_as_string: boolean
) {
    if (input.length === 0) {
        return [];
    }
    const replacements: Replacement[] = [];
    const matched = input.matchAll(regex);
    for (const match_array of matched) {
        const whole_string = match_array[0];
        const captured_strings: (string | undefined)[] = match_array.slice(1);
        const jsx = (() => {
            if (keep_children_as_string) {
                return replacer(...captured_strings);
            }
            return replacer(...captured_strings.map((s) => s ? parse(s) : s));
        })();
        replacements.push({
            begin_index: match_array.index,
            end_index: match_array.index + (whole_string.length - 1),
            jsx,
        });        
    }
    return replacements;
}

function replace_string_with_jsx(input: string, replacements: Replacement[]): JSX_Child {
    // Considered alternative: returning JSX_Child[].
    // This doesn't work because the spaces between string and JSX.Element are
    // ignored.
    let output = "";
    let last_index = 0;
    for (const replacement of replacements) {
        if (last_index < replacement.begin_index) {
            output += input.substring(last_index, replacement.begin_index);
        }
        output += render_to_string(replacement.jsx)
        last_index = replacement.end_index + 1;
    }
    if (last_index <= (input.length - 1)) {
        output += input.substring(last_index);
    }
    return parse(output);
}
