const { is_string } = require('./util');

// List of important types in eberban that we want to show up in the simplified
// tree.
const important_types = [
	// text
	[ 'text', 'text' ],
	[ 'paragraph', 'paragraph' ],
	[ 'definition', 'definition' ],
	[ 'sentence', 'sentence' ],

	// scope	
	[ 'scope', 'scope' ],
	[ 'scope_list', 'list' ],
	[ 'scope_list_element', 'list element' ],
	[ 'sequential', 'sequential binding' ],
	[ 'sequential_neg', 'sequential negation' ],
	[ 'sequential_unit', 'sequential unit' ],
	[ 'explicit_binding', 'explicit binding' ],
	[ 'explicit_binding_va', 'first explicit binding' ],
	[ 'explicit_binding_fa', 'other explicit binding' ],
	[ 'arguments_list', 'arguments' ],
	[ 'definition_key', 'defined predicate'],

	// units
	[ 'unit', 'unit' ],
	[ 'compound', 'compound' ],
	[ 'unit_borrowing', 'borrowing unit' ],
	[ 'foreign_word', 'foreign' ],
	[ 'grammatical_quote', 'quote' ],
	[ 'one_word_quote', 'word quote' ],
	[ 'foreign_quote', 'foreign quote' ],
	[ 'unit_number', 'number' ],
	[ 'subscope', 'subscope' ],

	// free
	[ 'free_prefix', 'prefix' ],
	[ 'free_parenthetical', 'parenthetical' ],
	[ 'free_subscript', 'subscript' ],
	[ 'free_override', 'override' ],
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
		return [
			{
				type: parse[0],
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