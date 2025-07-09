import dictionary from "../../../dictionary/en.yaml";
import { 
    get_random_three_letter_intransitive_root,
    get_random_four_letter_intransitive_root,
    get_random_five_letter_intransitive_root,
    get_random_six_letter_intransitive_root,
    get_random_three_letter_transitive_root,
    get_random_four_letter_transitive_root,
    get_random_five_letter_transitive_root,
    get_random_six_letter_transitive_root,
}  from "./random_root";

function* generate_roots(root_fn) {
    let counter = 0;
    while (counter < 10) {
        const word = root_fn();
        if (!dictionary[word]) {
            yield word;
            counter++;
        }
    }
}

function format_html_column(title, root_fn) {
    let content = "";
    for (const word of generate_roots(root_fn)) {
        content += `${word}<br/>`;
    }
    return `<div class="span3"><h3>${title}</h3>${content}</div>`;
}

export function format_html_generated_roots() {
    let output = "";

    output += `<h2>Transitive</h2><div class="row">`;
    output += format_html_column("Short", get_random_three_letter_transitive_root);
    output += format_html_column("Medium", get_random_four_letter_transitive_root);
    output += format_html_column("Long", get_random_five_letter_transitive_root);
    output += format_html_column("Longer", get_random_six_letter_transitive_root);
    output += `</div>`;

    output += `<h2>Intransitive</h2><div class="row">`;
    output += format_html_column("Short", get_random_three_letter_intransitive_root);
    output += format_html_column("Medium", get_random_four_letter_intransitive_root);
    output += format_html_column("Long", get_random_five_letter_intransitive_root);
    output += format_html_column("Longer", get_random_six_letter_intransitive_root);
    output += `</div>`;
    
    return output;
}
