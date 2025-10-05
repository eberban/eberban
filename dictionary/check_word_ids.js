if (process.argv.length != 3) {
    console.log('usage : check_word_ids.js <file_path>');
    console.log("Script will check all word ids in dictionary YAML file are unique.")
    return;
}

const file_name = process.argv[2];

const fs = require("fs");
const YAML = require("yaml");

const dictionary_file = fs.readFileSync(file_name, "utf8");
const lineCounter = new YAML.LineCounter();
const dictionary = YAML
  .parseDocument(dictionary_file, { lineCounter })
  .contents;

const id_usages = new Map();

YAML.visit(
  dictionary,
  {
    Pair: (_, node, path) => {
      if (node.key.value === "id") {
        // path is structured like so:
        // [YAMLMap, ancestor_node, YAMLMap, ancestor_node..., YAMLMap]
        // so the parent node is second to last.
        const word = path[path.length - 2].key.value;
        const id = node.value.value;
        const id_line_data = lineCounter.linePos(node.value.range[0]);
        const id_line = id_line_data.line;
        const id_col = id_line_data.col;
        const id_end_column = id_line_data.col + (id.length - 1);

        const usage = { word, id_line, id_col,id_end_column };

        if (id_usages.has(id)) {
          id_usages.get(id).push(usage);
        } else {
          id_usages.set(id, [usage]);
        }
      }
    }
  },
);

let duplicates_found = false;

for (const [id, all_usages] of id_usages) {
  if (all_usages.length > 1) {
    all_usages.forEach(({ word, id_line, id_col, id_end_column }) => {
      // Output GitHub Annotation error messages. These will show up in the PR
      // diff.
      console.log(`::error file=${file_name},line=${id_line},col=${id_col},endColumn=${id_end_column}::Duplicate ID ${id} in word ${word}`);
    })
    duplicates_found = true;
  }
}

if (duplicates_found) {
  console.log("❌ Duplicate IDs found.");
  process.exit(1);
}
console.log("✅ All IDs are unique.");
process.exit(0);


