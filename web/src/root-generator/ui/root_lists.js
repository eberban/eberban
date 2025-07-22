import store from "store2";

import get_random_roots from "../logic/generator";
import {
    get_random_three_letter_intransitive_root,
    get_random_four_letter_intransitive_root,
    get_random_five_letter_intransitive_root,
    get_random_six_letter_intransitive_root,
    get_random_three_letter_transitive_root,
    get_random_four_letter_transitive_root,
    get_random_five_letter_transitive_root,
    get_random_six_letter_transitive_root,
} from "../logic/random_root";

const match_get_random_root_fn = (root_list_id) => {
    switch (root_list_id) {
        case "transitive-short":    return get_random_three_letter_transitive_root;
        case "transitive-medium":   return get_random_four_letter_transitive_root;
        case "transitive-long":     return get_random_five_letter_transitive_root;
        case "transitive-longer":   return get_random_six_letter_transitive_root;
        case "intransitive-short":  return get_random_three_letter_intransitive_root;
        case "intransitive-medium": return get_random_four_letter_intransitive_root;
        case "intransitive-long":   return get_random_five_letter_intransitive_root;
        case "intransitive-longer": return get_random_six_letter_intransitive_root;
    }
}

const get_roots = (root_list_id) => {
    const get_random_root_fn = match_get_random_root_fn(root_list_id);
    return get_random_roots(get_random_root_fn);
}

const render_root_list = (root_list, roots) => {
    const rendered_roots = [];
    for (const root of roots) {
        const element = document.createElement("li");
        element.innerText = root;
        rendered_roots.push(element);
    }
    root_list.innerHTML = null;
    root_list.append(...rendered_roots);
}

export default function render() {
    for (const transitivity of ["transitive", "intransitive"]) {
        for (const root_length of ["short", "medium", "long", "longer"]) {
            const root_list_id = transitivity + "-" + root_length;
            const root_list = document.getElementById(root_list_id);
            const roots = get_roots(root_list_id);
            render_root_list(root_list, roots);    
        }
    }
}
