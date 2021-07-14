#!/usr/bin/env python3
import sys

VALID_FIELDS = ["family", "_signature", "long", "short", "type", "switch"]

def is_valid_eberbanic_word_character(c):
    return str.isalpha(c) or str.isdigit(c) or c == "'" or c == "."

def is_valid_outermost_key(key):
    if key.startswith("OLD_"):
        key = key[4:]
    return all([is_valid_eberbanic_word_character(c) for c in key])

def is_valid_innermost_key(key):
    return key in VALID_FIELDS

class DefinitionAggregator:
    def __init__(self):
        self.current_word = None
        self.current_word_lines = []
        self.aggregated_contents = []
    def start_word(self, word):
        if self.current_word != None or self.current_word_lines != []:
            raise RuntimeError("Attempting to start a new word before finishing the previous one")
        self.current_word = word
        self.current_word_lines = []
    def push_continuing_line(self, line):
        if self.current_word is None:
            raise RuntimeError("Attempting to push a continuing line before starting a word -- %s" % line)
        self.current_word_lines.append(line)
    def finish_word(self):
        if self.current_word is not None:
            self.aggregated_contents.append((self.current_word, self.current_word_lines))
            self.current_word = None
            self.current_word_lines = []
    def aggregate(self):
        def get_sorting_key(word):
            if word.startswith("OLD_"):
                return (1, word)
            else:
                return (0, word)
        if self.current_word is not None or self.current_word_lines != []:
            raise RuntimeError("Attempting to produce output, but there is still a leftover word left in the buffer")
        output_lines = []
        for word, lines in sorted(self.aggregated_contents, key=lambda p: get_sorting_key(p[0])):
            output_lines.append(word + ":")
            output_lines += lines
        return output_lines

def main():
    aggregator = DefinitionAggregator()
    has_initial_triple_dash = False
    has_found_first_word = False
    for (lineno, line) in enumerate(sys.stdin.readlines()):
        # Strip "\n" from the end of the line
        assert line[-1] == '\n'
        line = line[:-1]
        # Handle "---" (only valid as the very first line)
        if line == "---":
            if lineno == 0:
                has_initial_triple_dash = True
                continue
            else:
                raise RuntimeError("A triple dash may only appear as the very first line")
        # Adjusts the line
        if line == "":
            raise RuntimeError("The YAML file is malformed: some line is empty: lineno=%d" % lineno)
        # Reads the next definition
        if line != line.lstrip(" "):
            # If the line starts with spaces, then it is an inner definition (of family, signature, etc) for some word
            if not has_found_first_word:
                raise RuntimeError("The YAML file is malformed: found a tabbed definition before a non-tabbed definition -- %s" % line)
            if line not in ["  " + line.lstrip(), "    " + line.lstrip()]:
                raise RuntimeError("Expected exactly two or four spaces before key in an inner definition, but found something different -- '%s'" % line)
            aggregator.push_continuing_line(line)
        else:
            # Otherwise, it is the outermost definition (i.e. the eberbanic word itself, followed by a colon)
            has_found_first_word = True
            if line != line.lstrip():
                raise RuntimeError("The YAML file is malformed: found a line for the outermost definition starting with invalid whitespace -- '%s'" % line)
            if line[-1] != ":":
                raise RuntimeError("The YAML file is malformed: found a line for the outermost definition not ending in ':' -- '%s'" % line)
            line = line[:-1]
            if line == "":
                raise RuntimeError("The YAML file is malformed: found a line for the outermost definition consisting solely of an ':'")
            if is_valid_outermost_key(line):
                aggregator.finish_word()
                aggregator.start_word(line)
            else:
                raise RuntimeError("Found an invalid word: %s" % line)

    # Produce output
    aggregator.finish_word()
    output_lines = aggregator.aggregate()
    if has_initial_triple_dash:
        print("---")
    print("\n".join(output_lines))

if __name__ == '__main__':
    main()
