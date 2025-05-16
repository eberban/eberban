import type { JSX_Child } from "./types";
import markup_kits from "./kits";
import markup_to_jsx_child from "./to_jsx_child";
import { group, line_feed } from "../../scripts/regex";

export function markup_inline(text: string) {
    let output: JSX_Child = text;
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

export function markup_block(text: string) {
    return text
        .split(new RegExp(group(line_feed + line_feed), "g"))
        .map((content) => <p>{markup_inline(content)}</p>);    
}
