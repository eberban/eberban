function* generate_roots(get_random_root_fn, dictionary) {
    while (true) {
        const root = get_random_root_fn();
        if (!dictionary[root]) {
            yield root;
        }
    }
}

export default function get_random_roots(get_random_root_fn, dictionary, count = 10) {
    const roots = [];
    const generator = generate_roots(get_random_root_fn, dictionary);
    for (let i = 0; i < count; i++) {
        roots.push(generator.next().value);
    }
    return roots;
}
