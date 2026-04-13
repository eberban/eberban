// ENTRY


if (process.argv.length != 3) {
    console.log('usage : checks.js <file_path>');
    console.log("Script will check all word ids in dictionary YAML file are unique.")
    return;
}


// FILE PARSING


const file_name = process.argv[2];

const fs = require("fs");
const YAML = require("yaml");

const dictionary_file = fs.readFileSync(file_name, "utf8");
const line_counter = new YAML.LineCounter();
const { dictionary_doc, dictionary } = (() => {
  const d = YAML.parseDocument(dictionary_file, { lineCounter: line_counter });
  return { dictionary_doc: d.contents.items, dictionary: d.toJS() };
})();


// CI FUNCTIONS


const words_with_missing_ids = [];

function record_word_with_missing_id(word) {
  const word_value = word.value;
  const word_line = word.line_data.line;
  const word_col = word.line_data.col;
  const word_end_column = word.line_data.col + (word_value.length - 1);
  words_with_missing_ids.push({ word_value, word_line, word_col, word_end_column });
}

const id_usages = new Map();

function record_id(word_value, id) {
  const id_value = id.value;
  const id_line = id.line_data.line;
  const id_col = id.line_data.col;
  const id_end_column = id.line_data.col + (id_value.length - 1);
  const usage = { word_value, id_line, id_col, id_end_column };
  if (id_usages.has(id_value)) {
    id_usages.get(id_value).push(usage);
  } else {
    id_usages.set(id_value, [usage]);
  }
}


// ITERATING


function* yaml_items_iterator(yaml_items, dictionary_lookup) {
  for (const {key: yaml_key, value: yaml_value} of yaml_items) {
    const items = yaml_value.items;
    const word = {
      value: yaml_key.value,
      line_data: line_counter.linePos(yaml_value.range[0]),
    };
    const id = {
      // optional chaining as we don't yet know whether the word has an id
      value: dictionary_lookup[word?.value]?.id,
      line_data: line_counter.linePos(items[0]?.value.range[0]),
    };
    yield { items, word, id };
  }
}

// dictionary_doc contains the line counter metadata. So we'll loop over this
// and lookup ids with the dictionary
for (const {word, id, items} of yaml_items_iterator(dictionary_doc, dictionary)) {
  // "_spelling" words
  if (word.value === "_spelling") {
    for (const { word: spelling_word, id: spelling_id } of yaml_items_iterator(items, dictionary["_spelling"])) {
      if (!spelling_id.value) {
        record_word_with_missing_id(spelling_word);
        continue; // No id, so we'll skip the other id checks
      }
      record_id(spelling_word.value, spelling_id);
    }
    // "_spelling" words completed, no need to check the string "_spelling".
    // Move to the next non-spelling word.
    continue; 
  }
  // non-"_spelling" words
  if (!id.value) {
    record_word_with_missing_id(word);
    continue; // No id, so we'll skip the other id checks
  }
  record_id(word.value, id);
}


// ERROR REPORTING (GitHub Annotation error messages. They'll show in PR diffs)


for (const {word_value, word_line, word_col, word_end_column} of words_with_missing_ids) {
  console.log(`::error file=${file_name},line=${word_line},col=${word_col},endColumn=${word_end_column}::Word ${word_value} is missing its ID`);
}
if (words_with_missing_ids.length > 0) {
  console.log("❌ Missing ID(s) found.")
}

let duplicates_found = false;
for (const [id, all_usages] of id_usages) {
  if (all_usages.length > 1) {
    all_usages.forEach(({ word_value, id_line, id_col, id_end_column }) => {
      console.log(`::error file=${file_name},line=${id_line},col=${id_col},endColumn=${id_end_column}::Duplicate ID ${id} in word ${word_value}`);
    })
    duplicates_found = true;
  }
}
if (duplicates_found) {
  console.log("❌ Duplicate IDs found.");
}

if (words_with_missing_ids.length > 1 || duplicates_found) {
  process.exit(1);
}

process.exit(0);

