import reactStringReplace from "react-string-replace";
import {
    any,
    any_of,
    any_number_of,
    backslash,
    does_not_begin_with,
    fewest_positive_number_of,
    group,
    line_feed,
    non_capturing_group,
    one_or_more,
    optional,
    set,
    space,
    word_char,
} from "../scripts/regex";


/* HELPERS */


const remove_delimiters = (text) => text.substring(1, text.length - 1);

function DictLink({ children }) {
    return <a href={`#${children}`}>{children}</a>;
}


/* 
    Kit :: () -> { regex: RegExp(), replacer: string -> JSX }

    Kits are how we extend markup syntax. They're written as functions for
    readability.
*/


function break_kit() {
    return {
        regex: new RegExp(group(backslash + line_feed), "g"),
        replacer: () => <br />,
    };
}

function bold_kit() {
    const bolded = (s) => "__" + s + "__";
    return {
        regex: new RegExp(group(bolded(fewest_positive_number_of(any))), "g"),
        replacer: (s) => <strong>{remove_delimiters(remove_delimiters(s))}</strong>,
    };
}

function italics_kit() {
    const in_italics = (s) => "_" + s + "_";
    return {
        regex: new RegExp(group(in_italics(fewest_positive_number_of(any))), "g"),
        replacer: (s) => <em>{remove_delimiters(s)}</em>,
    };
}

function definition_quote_kit() {
    const in_quote = (s) => "`" + s + "`";
    return {
        regex: new RegExp(group(in_quote(fewest_positive_number_of(any))), "g"),
        replacer: (s) => <code>{remove_delimiters(s)}</code>,
    };
}

function eberban_quote_kit() {
    function whole() {
        const in_quote = (s) => "{" + s + "}";
        return {
            regex: new RegExp(group(in_quote(fewest_positive_number_of(any))), "g"),
            replacer: (string) => {
                const kit = content_kit();
                let content = remove_delimiters(string);
                content = reactStringReplace(content, kit.regex, kit.replacer);
                content = reactStringReplace(content, "!", () => "");
                return <span class="ebb-quote">{content}</span>;
            },
        };
    };
    function content_kit() {
        const as_one_link = (s) => "<" + s + ">";
        const simple_word_link = 
            does_not_begin_with("!" + any_number_of(word_char)) + one_or_more(word_char);
        const compound_word_link = as_one_link(non_capturing_group(
            fewest_positive_number_of(
                non_capturing_group(one_or_more(word_char) + optional(space)),
            ),
        ));
        return {
            regex: new RegExp(group(any_of(simple_word_link, compound_word_link)), "g"),
            replacer: (string) => {
                let output = string;
                if (new RegExp(compound_word_link).test(output)) {
                    output = remove_delimiters(output);
                }
                return <DictLink>{output}</DictLink>;
            }
        };
    };
    return whole();
}

function place_kit() {
    function whole() {
        const in_brackets = (s) => "\\[" + s + "\\]";
        const place = set("E", "A", "O", "U");
        const arg = non_capturing_group(":" + fewest_positive_number_of(any));
        return {
            regex: new RegExp(group(in_brackets(place + optional(arg))), "g"),
            replacer: (string) => {
                const [_, left_bracket, content, right_bracket] = string.match(
                    new RegExp(group("\\[") + group(one_or_more(any)) + group("\\]"))
                );
                const kit = content_kit();
                return (
                    <span class="label label-info place">
                        <span class="hidden">{left_bracket}</span>
                        {reactStringReplace(content, kit.regex, kit.replacer)}
                        <span class="hidden">{right_bracket}</span>
                    </span>
                );
            },
        };
    };
    function content_kit() {
        return {
            regex: new RegExp(group(word_char + one_or_more(word_char)), "g"),
            replacer: (s) => <DictLink>{s}</DictLink>,
        };
    };
    return whole();
}


/* ENTRY */


export function markup_inline(text) {
    let output = text;
    const markup_kits = [
        break_kit,
        bold_kit, // bold before italics otherwise ___s___ ->  _<em>{s}</em>_
        italics_kit,
        definition_quote_kit,
        eberban_quote_kit,
        place_kit,
    ];
    for (const kit of markup_kits) {
        const { regex, replacer } = kit();
        output = reactStringReplace(output, regex, replacer);
    }
    return output;
}

export function markup_block(text) {
    return text
        .split(new RegExp(group(line_feed + line_feed), "g"))
        .map((content) => <p>{markup_inline(content)}</p>);    
}
