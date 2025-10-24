import type { JSX_Child, Replacer } from "./types";
import markup_to_jsx_child from "./to_jsx_child";
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
} from "../../scripts/regex";


function DictLink({ children }: { children: JSX_Child | undefined}) {
    return <a href={`#${children}`}>{children}</a>;
}


/* ENTRY */


// Kits are how we extend markup syntax. We write them as () => Kit for
// readability.
type Kit = {
    // If this is true, we cast the parameters of Replacer to string.
    keep_children_as_string?: boolean,
    regex_string: string,
    replacer: Replacer,
}

function break_kit(): Kit {
    return {
        regex_string: group(backslash + line_feed),
        replacer: () => <br />,
    };
}

// We're using preact-parser which suits our needs nearly perfectly. It's just
// that single newlines are swallowed by default. So instead, we're replacing
// them with spaces until this gets fixed:
// https://github.com/jahilldev/preact-parser/issues/7
function new_line_to_space_kit(): Kit {
    return {
        regex_string: group(line_feed),
        replacer: () => <>{" "}</>,
    }
}

function bold_kit(): Kit {
    const bolded = (s: string) => "__" + s + "__";
    return {
        regex_string: bolded(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (content) => <strong>{content}</strong>,
    };
}

function italics_kit(): Kit {
    const in_italics = (s: string) => "_" + s + "_";
    return {
        regex_string: in_italics(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (content) => <em>{content}</em>,
    };
}

function definition_quote_kit(): Kit {
    const in_quote = (s: string) => "`" + s + "`";
    return {
        keep_children_as_string: true,
        regex_string: in_quote(group(fewest_positive_number_of(any))),
        replacer: (content) => <code>{content}</code>,
    };
}

function eberban_quote_kit(): Kit {
    const in_quote = (s: string) => "{" + s + "}";
    return {
        keep_children_as_string: true,
        regex_string: in_quote(group(fewest_positive_number_of(any))),
        replacer: (content) => {
            const { regex_string, replacer } = content_kit();
            let rendered_content = markup_to_jsx_child(content as string, regex_string, replacer);
            rendered_content = markup_to_jsx_child(rendered_content, "!", () => <></>);
            return <span class="ebb-quote">{rendered_content}</span>;
        },  
    };
    function content_kit(): Kit {
        const simple_word_link = group(
            does_not_begin_with("!" + any_number_of(word_char)) +
            one_or_more(word_char)
        );  
        const as_one_link = (s: string) => "<" + s + ">";
        const compound_word_link = as_one_link(group(
            fewest_positive_number_of(non_capturing_group(
                one_or_more(word_char) + optional(space)
            ))
        ));
        return {
            regex_string: any_of(simple_word_link, compound_word_link),
            replacer: (simple_word_link, compound_word_link) => {
            // Only one of these will be defined.
            const link = simple_word_link ? simple_word_link : compound_word_link;
            return (<DictLink>{link}</DictLink>);
            },
        };
    }
}

function place_kit(): Kit {
    const in_brackets = (s: string) => "\\[" + (s) + "\\]";
    const place = group(set("E", "A", "O", "U"));
    const arg = group(":" + fewest_positive_number_of(any));
    return {
        regex_string: in_brackets(place + optional(arg)),
        replacer: (place, arg) => {
            const { regex_string, replacer } = arg_kit();
            // Sometimes there is no arg.
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
    function arg_kit(): Kit {
        return {
            regex_string: group(word_char + one_or_more(word_char)),
            replacer: (s) => <DictLink>{s as string}</DictLink>,
        };
    }
}


const markup_kits = [
        break_kit,
        new_line_to_space_kit,
        bold_kit,
        italics_kit,
        definition_quote_kit,
        eberban_quote_kit,
        place_kit,    
];
export default markup_kits;
