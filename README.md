# eberban

__Eberban__ is a [logical] [constructed language] aimed to satisfy the
following goals :

- __being simple :__ the Eberban grammar allows manipulating predicates with
  particles in a way that is close to the [higher-order logic] it
  translates into, while abstracting away the verbosity of explicitely
  providing variables as arguments of predicates.
- __being regular :__ valid sentences are syntaxicaly unambiguous. Most grammar
  rules rely on particles which are organised in families, each starting with
  a unique prefix. Many additional patterns are shared between particles and
  predicate words to help learning groups of related words.
- __being expressive :__ the grammar and core vocabulary focus on providing a
  simple framework, on top of which can be built abstractions, complex concepts
  and tools. Since those are built into Eberban itself, users can create their
  own tools and abstractions to express entirely new concepts.

__Eberban__ take inspirations from [Lojban] and other logical languages, but try
novel approaches to satisfy the above goals.

Most resources are hosted on [GitHub pages], such as :

- parsers, which transform text into a tree structure, that can also be
  visualized as nested boxes.
- a dictionnary allowing to search words and their definitions.
- learning resources to discover the language grammar and concepts.

If you would like to get involved, please also consider joining our
[Discord server].

[Lojban]: https://mw.lojban.org/papri/Lojban
[logical]: https://en.wikipedia.org/wiki/Engineered_language#Logical_languages
[constructed language]: https://en.wikipedia.org/wiki/Constructed_language
[higher-order logic]: https://en.wikipedia.org/wiki/Higher-order_logic
[GitHub pages]: https://eberban.github.io/eberban/
[Discord server]: https://discord.com/invite/KKB79RwWUc

-----

## How tos

### How to update a book

Books are made using [`mdbook`] and a few extensions which are written in [Rust].

[`mdbook`]: https://lib.rs/crates/mdbook

First, ensure you have [Rust] installed on your machine.

[Rust]: https://www.rust-lang.org/tools/install

1. Install the dependencies
  ```
  cargo install mdbook
  cargo install mdbook-linkcheck
  cargo install mdbook-regex-replacer
  ```
2. Open a terminal and navigate one of the books folders (e.g., `books/refgram`).
3. Run `mdbook serve`.

The dev server is now running. Copy the localhost address and paste it into your
browser to see your local copy of the website.

The dev server will update this local website after every change you make.

### How to add a new word to the dictionary

Ensure you have [Node.js and npm] installed on your machine.

1. Edit the dictionary YAML file (`dictionary/en.yaml`) and create a new entry for your word.
2. Set the `id` field to `INSERT_WORD_ID`.
3. Open a terminal and navigate to the dictionary folder (the one that contains `en.yaml`).
4. Run `npm run ids` (`INSERT_WORD_ID` has now been replaced with a random unique ID).

### How to update the website

Ensure you have [Node.js and npm] installed on your machine.

1. Open a terminal and navigate to the web folder.
2. Run `npm i`.
3. Run the dev server.
   - If you've made and/or are making changes to `web/src/grammar/eberban.peg`,
     run `npm run peg-dev`. You will need to re-run this after each change made.
   - Otherwise, run `npm run dev`.

The dev server is now running. Copy the localhost address and paste it into your
browser to see your local copy of the website.

The dev server will update this local website after every change
(except for the `eberban.peg`) you make.

> [!TIP]
> You can locally check that the website builds properly by running
> `npm run build` and then `npm run preview` to view the locally built website.

[Node.js and npm]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
