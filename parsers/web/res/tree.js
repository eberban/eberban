// List of important types in eberban that we want to show up in the simplified
// tree.
// TODO : Update to latest eberban rules.
const important_types = [
	// text
	[ 'text', 'text' ],
	[ 'parser_version', 'parser version' ],
	[ 'paragraph', 'paragraph' ],
	[ 'sentence', 'sentence' ],
	[ 'predicate_scope_arguments', 'arguments' ],
	[ 'predicate_scope_1', 'scope' ],

	// predicate
	[ 'predicate_unit', 'predicate' ],
	[ 'predicate_term_jai', 'set' ],
	[ 'predicate_filled_place', 'place' ],
	[ 'predicate_place_import', 'import' ],
	[ 'predicate_chaining_import', 'chaining import' ],
	[ 'predicate_link', 'link' ],

	// predicate units
	[ 'compound', 'compound' ],
	[ 'borrowing', 'borrowing' ],
	[ 'foreign_word', 'foreign' ],
	[ 'grammatical_quote', 'quote' ],
	[ 'one_word_quote', 'word quote' ],
	[ 'foreign_quote', 'foreign quote' ],
	[ 'predicate_subscope', 'subscope' ],
	[ 'number_string', 'number' ],
	[ 'letter_string', 'letters' ],

	// free
	[ 'free_indicator', 'indicator' ],
	[ 'free_discursive', 'discursive' ],
	[ 'free_parenthetical', 'note' ],
	[ 'free_subscript', 'subscript' ],
	[ 'free_vocative', 'vocative' ],

	// scopes
	[ 'predicate_filling', 'scope' ]
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
	if (parse.length == 2 && isString(parse[0]) && isString(parse[1])) {
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
	if (isString(parse[0])) {
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

