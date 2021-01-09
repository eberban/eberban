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

// The simplification functions

var simplifyFunctions = {};

var map = [
	// text
	[ 'text', 'text' ],
	[ 'parser_version', 'parser version' ],
	[ 'paragraph', 'paragraph' ],
	[ 'sentence', 'sentence' ],
	[ 'proposition', 'proposition' ],

	// predicate
	[ 'predicate_unit', 'predicate' ],
	[ 'predicate_filled_place', 'place' ],
	[ 'predicate_place_import', 'import' ],
	[ 'predicate_link', 'link' ],

	// predicate units
	[ 'compound', 'compound' ],
	[ 'borrowing', 'borrowing' ],
	[ 'foreign_word', 'foreign' ],
	[ 'grammatical_quote', 'quote' ],
	[ 'one_word_quote', 'word quote' ],
	[ 'foreign_quote', 'foreign quote' ],
	[ 'abstraction', 'abstraction' ],
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

	// ===== OLD

	// [ 'text', 'text' ],
	// [ 'parser_version', 'parser version' ],
	// [ 'paragraph', 'paragraph' ],
	// [ 'sentence', 'sentence' ],
	// [ 'proposition_1', 'proposition' ],
	// [ 'proposition_tail', 'proposition tail' ],
	// [ 'proposition_place', 'place' ],
	// [ 'proposition_place_tag', 'tag' ],
	// [ 'proposition_place_modal', 'modal' ],
	// [ 'proposition_term', 'term' ],
	// [ 'compound', 'compound' ],
	// [ 'borrowing', 'borrowing' ],
	// [ 'foreign_word', 'foreign' ],
	// [ 'grammatical_quote', 'quote' ],
	// [ 'one_word_quote', 'word quote' ],
	// [ 'foreign_quote', 'foreign quote' ],
	// [ 'abstraction', 'abstraction' ],
	// [ 'number_string', 'number' ],
	// [ 'letter_string', 'letters' ],

	// // predicate
	// [ 'predicate', 'predicate' ],
	// [ 'predicate_link', 'link' ],
	// [ 'predicate_relative_clause', 'relative clause' ],

	// // free
	// [ 'free_indicator', 'indicator' ],
	// [ 'free_discursive', 'discursive' ],
	// [ 'free_parenthetical', 'note' ],
	// [ 'free_subscript', 'subscript' ],
	// [ 'free_vocative', 'vocative' ],

	// // SCOPES
	// // manual groups
	// [ 'predicate_group', 'scope' ],
	// [ 'proposition_term_group', 'scope' ],

	// // proposition jak
	// [ 'proposition_jak_pre', 'scope' ],
	// [ 'proposition_jak_post', 'scope' ],

	// // proposition terms
	// [ 'proposition_term_jak_post', 'scope' ],
	// [ 'proposition_term_jaik_post', 'scope' ],
	// [ 'proposition_term_jak_pre', 'scope' ],
	// [ 'proposition_place_tag_jak_pre', 'scope' ],

	// // show proposition-tail distributivity
	// // ["proposition_tail_jak_pre", "scope"],
	// [ 'proposition_tail_jak_pre_terms', 'scope' ],
	// [ 'proposition_tail_1', 'scope' ],
	// [ 'proposition_1_terms', 'scope' ],
	// [ 'proposition_tail_jak_post_terms', 'scope' ],

	// // predicates
	// // ["predicate_cak_post", "scope"],
	// [ 'predicate_cak_pre', 'scope' ]
];

for (let replace of map) {
	simplifyFunctions[replace[0]] = function(parse) {
		return {
			type: replace[1],
			children: simplifyArrayOfTrees(parse.slice(1))
		};
	};
}

// lojban grammar ...
/*
simplifyFunctions["free"] = function(parse) {
    
    return {
        type: "free modifier",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["prenex"] = function(parse) {
    
    return {
        type: "prenex",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["bridi_tail"] = function(parse) {
    
    return {
        type: "bridi tail",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["selbri"] = function(parse) {
    
    return {
        type: "selbri",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["sumti"] = function(parse) {
    
    return {
        type: "sumti",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["sumti_6"] = function(parse) {
    
    // sumti-6 <- ZO-clause free* /
    //            ZOI-clause free* /
    //            LOhU-clause free* /
    //            lerfu-string !MOI-clause BOI-clause? free* /
    //            LU-clause text LIhU-clause? free* /
    //            (LAhE-clause free* / NAhE-clause BO-clause free*) relative-clauses? sumti LUhU-clause? free* /
    //            KOhA-clause free* /
    //            LA-clause free* relative-clauses? CMENE-clause+ free* /
    //            (LA-clause / LE-clause) free* sumti-tail KU-clause? free* /
    //            li-clause
    
    if (parse[1][0] === "ZO_clause") {
        return {
            type: "one-word quote",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "ZOI_clause") {
        return {
            type: "non-Lojban quote",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "LOhU_clause") {
        return {
            type: "ungrammatical quote",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "lerfu_string") {
        return {
            type: "letterals",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "LU_clause") {
        return {
            type: "grammatical quote",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] instanceof Array) {
        if (parse[1][0][0] === "LAhE_clause") {
            return {
                type: "reference sumti",
                children: simplifyArrayOfTrees(parse.slice(1))
            }
        }
        
        if (parse[1][0][0] === "NAhE_clause") {
            return {
                type: "negated sumti",
                children: simplifyArrayOfTrees(parse.slice(1))
            }
        }
    }
    
    if (parse[1][0] === "KOhA_clause") {
        return {
            type: "sumka'i",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "LA_clause") {
        return {
            type: "name or name description", // TODO how to disambiguate between those two?
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "LE_clause") {
        return {
            type: "description",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    if (parse[1][0] === "li_clause") {
        return {
            type: "number",
            children: simplifyArrayOfTrees(parse.slice(1))
        }
    }
    
    return {
        type: "unknown type sumti (bug?)",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

simplifyFunctions["relative_clause"] = function(parse) {
    
    return {
        type: "relative clause",
        children: simplifyArrayOfTrees(parse.slice(1))
    }
}

*/

// Additional functions to improve the resulting tree

/**
 * Numbers the placed sumti in the parse tree. That is, replaces the type "sumti" by either
 * "sumti x" if it is a normally placed sumti, or "modal sumti" if it is a modal sumti.
 * If it is a sumti in a vocative or something like that, which is not placed at all, it will
 * just leave "sumti".
 * 
 * For placed sumti, also an attribute sumtiPlace is added with the place number.
 */
function numberSumti(parse) {
	// if it is a terminal, do nothing
	if (parse.length == 2 && isString(parse[0]) && isString(parse[1])) {
		return parse;
	}

	// if it is a sentence, start searching through it
	// if (parse.type === "sentence") {
	if (parse.type === 'proposition') {
		numberSumtiInSentence(parse);
	}

	// and recursively search the children for things we can number as well
	for (var i in parse) {
		if (!isString(parse[i])) {
			numberSumti(parse[i]);
		}
	}

	return parse;
}

function numberSumtiInSentence(parse) {
	// first, for convenience, merge the bridi head and tail together in one array
	var sentenceElements = [];

	for (var i = 0; i < parse.children.length; i++) {
		var child = parse.children[i];

		if (child.type === 'proposition tail') {
			sentenceElements.push({ type: 'proposition tail start' });
			for (var j = 0; j < child.children.length; j++) {
				var subchild = child.children[j];
				sentenceElements.push(subchild);
			}
		} else {
			sentenceElements.push(child);
		}
	}

	// now walk through this array
	var sumtiCounter = 1;
	var bridiTailStartSumtiCounter = 1;
	var nextIsModal = false;

	for (var i = 0; i < sentenceElements.length; i++) {
		var child = sentenceElements[i];

		if (child.type === 'proposition tail start') {
			bridiTailStartSumtiCounter = sumtiCounter;
		}

		if (child.type === 'GIhA') {
			sumtiCounter = bridiTailStartSumtiCounter;
		}

		if (child.type === 'FA') {
			sumtiCounter = placeTagToPlace(child);
		}

		if (child.type === 'BAI' || child.type === 'FIhO' || child.type === 'PU') {
			nextIsModal = true;
		}

		if (child.type === 'sumti') {
			if (nextIsModal) {
				child.type = 'modal sumti';
				nextIsModal = false;
			} else {
				child.type = 'sumti x';
				child.sumtiPlace = sumtiCounter;
				sumtiCounter++;
			}
		}

		if (child.type === 'selbri' && sumtiCounter === 1) {
			sumtiCounter++;
		}
	}
}

function placeTagToPlace(tag) {
	if (tag.word === 'fa') {
		return 1;
	} else if (tag.word === 'fe') {
		return 2;
	} else if (tag.word === 'fi') {
		return 3;
	} else if (tag.word === 'fo') {
		return 4;
	} else if (tag.word === 'fu') {
		return 5;
	} else if (tag.word === 'fai') {
		return 'fai';
		/* Ilmen: Yeah that's an ugly lazy handling of "fai", but a cleaner 
         * handling will require more work. */
	}
}
