import markup_to_jsx_child from "./markup_to_jsx_child";
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
    not_in_set,
    one_or_more,
    optional,
    set,
    space,
    word_char,
} from "../scripts/regex";


function DictLink({ children }) {
    return <a href={`#${children}`}>{children}</a>;
}


/* 
    Kit :: () -> { 
        keep_children_as_string: boolean?
        regex_string: string
        replacer: Replacer
    }

    Kits are how we extend markup syntax. They're written as functions for
    readability.
*/


function break_kit() {
    return {
        regex_string: group(backslash + line_feed),
        replacer: () => <br />,
    };
}

function bold_kit() {
    const bolded = (s) => "__" + s + "__";
    return {
        regex_string: bolded(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (_, content) => <strong>{content}</strong>,
    };
}

function italics_kit() {
    const in_italics = (s) => "_" + s + "_";
    return {
        regex_string: in_italics(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (_, content) => <em>{content}</em>,
    };
}

function definition_quote_kit() {
    const in_quote = (s) => "`" + s + "`";
    return {
        keep_children_as_string: true,
        regex_string: in_quote(group(fewest_positive_number_of(any))),
        replacer: (_, content) => <code>{content}</code>,
    };
}

function eberban_quote_kit() {
    const in_quote = (s) => "{" + s + "}";
    return {
        keep_children_as_string: true,
        regex_string: in_quote(group(fewest_positive_number_of(any))),
        replacer: (_, content) => {
            const { regex_string, replacer } = content_kit();
            let rendered_content = markup_to_jsx_child(content, regex_string, replacer);
            rendered_content = markup_to_jsx_child(rendered_content, "!", () => "");
            return <span class="ebb-quote">{rendered_content}</span>;
        },  
    };
    function content_kit() {
        const as_one_link = (s) => "<" + s + ">";
        const simple_word_link = group(
            does_not_begin_with("!" + any_number_of(word_char)) +
            one_or_more(word_char)
        );  
        const compound_word_link = as_one_link(group(
            fewest_positive_number_of(non_capturing_group(
                one_or_more(word_char) + optional(space)
            ))
        ));
        return {
            regex_string: any_of(simple_word_link, compound_word_link),
            replacer: (_, link) => <DictLink>{link}</DictLink>,
        };
    }
}

function place_kit() {
    const in_brackets = (s) => "\\[" + (s) + "\\]";
    const place = group(set("E", "A", "O", "U"));
    const arg = group(":" + fewest_positive_number_of(any));
    return {
        regex_string: in_brackets(place + optional(arg)),
        replacer: (_, place, arg) => {
            const { regex_string, replacer } = arg_kit();
            // arg is a capture group that's optional. It won't always show up
            // in the captured strings of replacer.
            const arg_with_links = markup_to_jsx_child(arg ?? "", regex_string, replacer);
            return (
                <span class="label label-info place">
                    <span class="hidden">{"["}</span>
                    {place}{arg_with_links}
                    <span class="hidden">{"]"}</span>
                </span>
            )
        }
    }
    function arg_kit() {
        return {
            regex_string: group(word_char + one_or_more(word_char)),
            replacer: (s) => <DictLink>{s}</DictLink>,
        };
    }
}


/* ENTRY */


export function markup_inline(text) {
    let output = text;
    const markup_kits = [
        break_kit,
        bold_kit,
        italics_kit,
        definition_quote_kit,
        eberban_quote_kit,
        place_kit,
    ];
    for (const kit of markup_kits) {
        const { keep_children_as_string, regex_string, replacer } = kit();
        output = markup_to_jsx_child(
            output,
            regex_string,
            replacer,
            keep_children_as_string
        );
    }
    return output;
}

export function markup_block(text) {
    return text
        .split(new RegExp(group(line_feed + line_feed), "g"))
        .map((content) => <p>{markup_inline(content)}</p>);    
}
