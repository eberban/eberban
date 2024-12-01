const { is_string } = require('./util');

// List of important types in eberban that we want to show up in the simplified
// tree.
const important_types = [
	// text
	[ 'text', 'text' ],
	[ 'paragraph', 'paragraph' ],
	[ 'sentence', 'sentence' ],
	[ 'sentence_erased_1', 'erased' ],
	[ 'sentence_erased_2', 'erased' ],
	[ 'sentence_a', 'A sentence' ],
	[ 'sentence_o', 'O sentence' ],
	[ 'sentence_ni', 'NI sentence' ],

	// scope
	[ 'inner_definition', 'inner definition' ],
	[ 'unit_enum', 'enum'],
	[ 'unit_enum_compact_item', 'compact enum item'],
	[ 'unit_enum_full_item', 'enum item'],
	[ 'chain', 'chain' ],
	[ 'chain_erased', 'erased' ],
	[ 'chain_step_negation', 'chain step negation' ],
	[ 'chain_step', 'chain step' ],
	[ 'explicit_bind_group', 'explicit bind group' ],
	[ 'explicit_bind_first', 'explicit bind' ],
	[ 'explicit_bind_additional', 'explicit bind' ],
	[ 'arguments_list', 'arguments' ],

	// predicates
	[ 'chain_unit', 'chain unit' ],
	[ 'chain_unit_adverb', 'adverb' ],
	[ 'unit_definable_namespaced', 'imported predicate' ],
	[ 'compound', 'compound' ],
	[ 'borrowing_group', 'borrowing group' ],
	[ 'borrowing', 'borrowing' ],
	[ 'freeform_variable', 'freeform variable'],
	[ 'grammatical_quote', 'quote' ],
	[ 'one_word_quote', 'word quote' ],
	[ 'foreign_quote', 'foreign quote' ],
	[ 'foreign_quote_content', 'foreign quote content' ],
	[ 'foreign_quote_simple_content', 'foreign quote content' ],
	[ 'foreign_quote_open', 'foreign quote delimiter' ],
	[ 'foreign_quote_close', 'foreign quote delimiter' ],
	[ 'unit_number', 'number' ],
	[ 'unit_scoped', 'scoped unit' ],

	// free
	[ 'free_metadata', 'metadata' ],
	[ 'free_interjection', 'interjection' ],
	[ 'free_parenthetical', 'parenthetical' ],
	[ 'free_subscript', 'subscript' ],
	[ 'spelling_quote', 'spelling' ],
	[ 'spelling_quote_unit_2', 'spelling unit' ],

	// morphology
	[ 'particle_form', 'particle' ],
	[ 'root_form', 'root' ]
];

// List of simplifying functions.
var simplifyFunctions = {};

// Fills the simplify functions list with important types.
for (let replace of important_types) {
	simplifyFunctions[replace[0]] = function(parse) {
		return {
			type: replace[1],
			children: simplifyArrayOfTrees(parse.slice(1))
		};
	};
}

simplifyFunctions['foreign_quote_content'] = function(parse) {
	let text = '';

	parse.slice(1).forEach(x => {
		text += x[0];
	})

	return {
		type: 'foreign quote content',
		word: text,
	}
}

simplifyFunctions['foreign_quote_simple_content'] = function(parse) {
	let text = '';

	parse.slice(1).forEach(x => {
		text += x[0];
	})

	return {
		type: 'foreign quote content',
		word: text,
	}
}

var importantTypesMap = {};

// Convert important types array to map.
for (let type of important_types) {
	importantTypesMap[type[0]] = type[1];
}


/**
 * This file contains functions that simplify the parse tree returned by camxes.js.
 *
 * The original parse tree has the following structure:
 * [
 *   "...",   // the type
 *   ...      // children as array elements
 * ]
 * Here, the first element of every array indicates the type of the object parsed, and the
 * next objects are the children of the element.
 *
 * The simplified parse tree has quite another structure:
 * [
 *   {
 *     type: "...",
 *     children: [ ... ],   // only one of children and word
 *     word: "...",
 *     ...: ...             // other optional elements
 *   }
 * ]
 * Here, type gives the type. For non-terminals, children is an array containing the children.
 * For terminals, word contains the actual word parsed. (Of course, one cannot have both
 * children and word.) Furthermore, there can be more elements added to this structure to add
 * additional information as needed.
 */

/**
 * Simplifies the given parse tree. Returns an array.
 */
function simplifyTree(parse) {
	// if it is a terminal, just return that
	if (parse.length == 2 && is_string(parse[0]) && is_string(parse[1])) {
		let type = parse[0];

		if (importantTypesMap[type] != undefined)
			type = importantTypesMap[type];

		return [
			{
				type: type,
				word: parse[1]
			}
		];
	}

	var f = simplifyFunctions[parse[0]];

	// if there is a simplification function, apply it
	if (f) {
		return [ f(parse) ];
	}

	// else, we recursively search the children for things we do have a simplification function for
	var result;
	if (is_string(parse[0])) {
		result = simplifyArrayOfTrees(parse.slice(1));
	} else {
		result = simplifyArrayOfTrees(parse);
	}

	return result;
}

/**
 * Simplifies an array of trees.
 */
function simplifyArrayOfTrees(parse) {
	var result = [];

	for (var i in parse) {
		result = result.concat(simplifyTree(parse[i]));
	}

	return result;
}

module.exports.simplifyTree = simplifyTree;