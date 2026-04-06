// ENTRY


if (process.argv.length != 3) {
    console.log('usage : check_word_ids.js <file_path>');
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


function check_word_has_id(word, dictionary) {
  const id = dictionary[word].id;
  return !!id;
}

const words_with_missing_ids = [];

function record_word_with_missing_id(word, word_line_data) {
  const word_line = word_line_data.line;
  const word_col = word_line_data.col;
  const word_end_column = word_line_data.col + (word.length - 1);
  words_with_missing_ids.push({ word, word_line, word_col, word_end_column });
}

const id_usages = new Map();

function record_id(word, id, id_line_data) {
  const id_line = id_line_data.line;
  const id_col = id_line_data.col;
  const id_end_column = id_line_data.col + (id.length - 1);
  const usage = { word, id_line, id_col, id_end_column };
  if (id_usages.has(id)) {
    id_usages.get(id).push(usage);
  } else {
    id_usages.set(id, [usage]);
  }
}


// ITERATING


// dictionary_doc contains the line counter metadata. So we'll loop over this
// and lookup ids with the dictionary
for (const {key, value } of dictionary_doc) {
  const word = key.value;
  if (word === "_spelling") {
    for (const { key: spelling_key, value: spelling_value } of value.items) {
      const spelling_word = spelling_key.value;
      const spelling_word_line_data = line_counter.linePos(spelling_value.range[0]);
      if (!check_word_has_id(spelling_word, dictionary["_spelling"])) {
        record_word_with_missing_id(spelling_word, spelling_word_line_data);
        continue; // No id, so we'll skip the other id checks
      }
      const id = dictionary["_spelling"][spelling_word].id;
      const id_line_data = line_counter.linePos(spelling_value.items[0].value.range[0]);
      record_id(spelling_word, id, id_line_data);
    }
    continue; // _spelling words completed, move to the next non-spelling word
  }
  const word_line_data = line_counter.linePos(value.range[0]);
  if (!check_word_has_id(word, dictionary)) {
    record_word_with_missing_id(word, word_line_data);
    continue; // No id, so we'll skip the other id checks
  }
  const id = dictionary[word].id;
  const id_line_data = line_counter.linePos(value.items[0].value.range[0]);
  record_id(word, id, id_line_data);
}


// ERROR REPORTING (GitHub Annotation error messages. They'll show in PR diffs)


for (const {word, word_line, word_col, word_end_column} of words_with_missing_ids) {
  console.log(`::error file=${file_name},line=${word_line},col=${word_col},endColumn=${word_end_column}::Word ${word} is missing its ID`);
}
if (words_with_missing_ids.length > 0) {
  console.log("❌ Missing ID(s) found.")
}

let duplicates_found = false;
for (const [id, all_usages] of id_usages) {
  if (all_usages.length > 1) {
    all_usages.forEach(({ word, id_line, id_col, id_end_column }) => {
      console.log(`::error file=${file_name},line=${id_line},col=${id_col},endColumn=${id_end_column}::Duplicate ID ${id} in word ${word}`);
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

