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


/* Helpers */


const is_intransitive = (s) => s === "intransitive";
const is_transitive = (s) => s === "transitive";
const is_valid = (s) => is_intransitive(s) || is_transitive(s);


/* Root Lists */


class Root_Lists {
    #root_lists;
    #transitivity;

    constructor() {
        this.#initialise_transitivity();
        this.#render_transitivity();
        this.#initialise_root_lists();
        this.#render_roots();
    }

    /* Roots */

    #initialise_root_lists() {
        if (store.has("root-lists")) {
            this.#root_lists = store.get("root-lists", (key, value) => {
                if (key === "fn") {
                    // JSON neither serialises nor parses functions.
                    // So, we look it up by name when we parse the root lists
                    // again.
                    return ({
                        get_random_three_letter_intransitive_root,
                        get_random_three_letter_transitive_root,
                        get_random_four_letter_intransitive_root,
                        get_random_four_letter_transitive_root,
                        get_random_five_letter_intransitive_root,
                        get_random_five_letter_transitive_root,
                        get_random_six_letter_intransitive_root,
                        get_random_six_letter_transitive_root,
                    })[value];
                }
                return value;
            });
            return;
        }
        this.#root_lists = [
            {
                id: "short-roots",
                intransitive: {
                    roots: [],
                    fn: get_random_three_letter_intransitive_root,
                },
                transitive: {
                    roots: [],
                    fn: get_random_three_letter_transitive_root,
                },
            },
            {
                id: "medium-roots",
                intransitive: {
                    roots: [],
                    fn: get_random_four_letter_intransitive_root,
                },
                transitive: {
                    roots: [],
                    fn: get_random_four_letter_transitive_root,
                },
            },
            {
                id: "long-roots",
                intransitive: {
                    roots: [],
                    fn: get_random_five_letter_intransitive_root,
                },
                transitive: {
                    roots: [],
                    fn: get_random_five_letter_transitive_root,
                },
            },
            {
                id: "longer-roots",
                intransitive: {
                    roots: [],
                    fn: get_random_six_letter_intransitive_root,
                },
                transitive: {
                    roots: [],
                    fn: get_random_six_letter_transitive_root,
                },
            },
        ];
        this.#update_roots("intransitive", "transitive");
    }

    refresh() {
        this.#update_roots(this.#transitivity);
        this.#render_roots();
    }

    #render_roots() {
        const format_root = (root) => {
            const element = document.createElement("LI");
            element.innerText = root;
            return element;
        }
        const render_column_element = (root_list_id, roots) => {
            const column_element = document.getElementById(root_list_id);
            column_element.innerHTML = null;
            column_element.append(...roots.map(format_root));
        }
        for (const root_list of this.#root_lists) {
            render_column_element(root_list.id, root_list[this.#transitivity].roots);
        } 
    }
    
    #update_roots(...transitivities) {
        for (const root_list of this.#root_lists) {
            for (const transitivity of transitivities) {
                root_list[transitivity].roots = get_random_roots(root_list[transitivity].fn);
            }
        }
        store.set("root-lists", this.#root_lists, (key, value) => {
            return key === "fn" ? value.name : value;
        });
    }

    /* Transitivity */

    #initialise_transitivity() {
        const transitivity_list = [
            store.get("transitivity"),
            "intransitive", // Default to intransitive.
        ];
        for (const transitivity of transitivity_list) {
            if (is_valid(transitivity)) {
                this.#transitivity = transitivity;
                return;
            }
        } 
    }

    #set_transitivity(new_transitivity) {
        this.#transitivity = new_transitivity;
        store.set("transitivity", new_transitivity);
    }

    switch_transitivity_to(new_transitivity) {
        this.#set_transitivity(new_transitivity);
        this.#render_transitivity();
        this.#render_roots();
    }

    #render_transitivity() {
        const intransitive_button = document.getElementById("intransitive");
        const transitive_button = document.getElementById("transitive");
        intransitive_button.disabled = is_intransitive(this.#transitivity);
        transitive_button.disabled = is_transitive(this.#transitivity);
    }
}


/* ENTRY */
const root_lists = new Root_Lists();
export default root_lists;
