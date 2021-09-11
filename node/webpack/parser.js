export const { camxes } = require('../grammar/eberban');
const { remove_morphology, remove_spaces } = require('../src/util');
const { simplifyTree } = require('../src/simplify_tree');
export const { postprocessing } = require('../src/process_parse_tree');

const { dictionary_en: dictionary } = require('../src/dictionary');

const hideTitleList = [
	'paragraph',
	'paragraph unit',
	'sentence',
	'definition',
	'scope',
	'sequence item',
	'predicate',
	'chaining unit',
	'chaining negation',
	'VE-scope',
	'borrowing group',
	'erased'
];

const hideFamily = [
	'a',
	'e',
	'i',
	'o',
	'u',
	'freeform_content',
	'foreign quote content',
]

// List of types with their associated CSS classes.
const boxClassForTypeMap = new Map([
	// text
	[ 'paragraph', 'box box-paragraph' ],
	[ 'paragraph unit', 'box box-paragraph-unit' ],
	[ 'erased', 'erased' ],
	[ 'sentence', 'box box-sentence' ],
	[ 'definition', 'box box-sentence' ],
	[ 'arguments', 'box box-arguments' ],
	[ 'defined predicate', 'box box-arguments' ],

	// scope
	[ 'scope', 'box box-scope' ],
	[ 'sequence item', 'box box-scope-highlight' ],
	[ 'chaining unit', 'box box-chaining-unit' ],
	[ 'chaining negation', 'box box-chaining-neg' ],
	[ 'VE-scope', 'box box-va-scope' ],

	// units
	[ 'predicate', 'box box-predicate' ],
	[ 'quote', 'box box-predicate' ],
	[ 'word quote', 'box box-predicate' ],
	[ 'foreign quote', 'box box-borrowing foreign-quote' ],
	[ 'compound', 'box box-compound' ],
	[ 'number', 'box box-number' ],
	[ 'letters', 'box box-letters' ],
	[ 'subscope', 'box box-subscope' ],
	[ 'borrowing group', 'box box-borrowing' ],
	[ 'foreign quote content', 'box box-not-shown foreign-quote-content'],

	// free
	[ 'metadata', 'box box-note' ],
	[ 'interjection', 'box box-note' ],
	[ 'subscript', 'box box-note' ],
	[ 'parenthetical', 'box box-note' ],
	[ 'override', 'box box-note' ],
]);

function boxClassForType(parse) {
	let boxClass = boxClassForTypeMap.get(parse.type);
	return boxClass || 'box box-not-shown';
}

function escapeHtml(str) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	return p.innerHTML;
}

/**
 * Launches the parsing process by calling the parser with the data entered in the interface,
 * and processing the results.
 */
export function parse() {
	var textToParse = $('#input_textarea').val();
	$('#result-row').slideDown();
	try {
		var start = new Date().getTime();
		textToParse = ' ' + textToParse; // add initial space to help parser
		var parse = camxes.parse(textToParse);
		var end = new Date().getTime();
		$('#time-label').html('(parsing took ' + (end - start) + ' ms)');
		parse = remove_morphology(parse);
		parse = remove_spaces(parse);
		var simplified = simplifyTree(parse);

		if (parse) {
			var tokens = [];
			findTokens(parse, tokens);

			// var $parseResultHighlighted = $('#parse-result-highlighted');
			// showHighlighting(simplified[0], tokens, $parseResultHighlighted);

			var $parseResultRaw = $('#parse-result-raw');
			showRawTree(parse, $parseResultRaw);

			var $parseResultTree = $('#parse-result-tree');
			showParseTree(parse, $parseResultTree);

			var $parseResultSimplified = $('#parse-result-simplified');
			showSimplifiedTree(simplified, $parseResultSimplified);

			var $parseResultBoxes = $('#parse-result-boxes');
			showBoxes(simplified, $parseResultBoxes);

			var $parseResultGlossing = $('#parse-result-glossing');
			showGlossing(tokens, $parseResultGlossing);
		}
		// $('#parse-result-highlighted-tab').html('Highlighted');
		$('#parse-result-tree-tab').html('Parse tree');
		$('#parse-result-raw-tab').html('Raw tree');
		$('#parse-result-simplified-tab').html('Simplified tree');
		$('#parse-result-boxes-tab').html('Boxes');
		$('#parse-result-glossing-tab').html('Glosses');
	} catch (e) {
		if (e.name && e.name === 'SyntaxError') {
			// $('#parse-result-highlighted-tab').html('<span class="muted">Highlighted</span>');
			// showSyntaxError(e, textToParse, $('#parse-result-highlighted'));
			$('#parse-result-raw-tab').html('<span class="muted">Raw tree</span>');
			showSyntaxError(e, textToParse, $('#parse-result-raw'));
			$('#parse-result-simplified-tab').html('<span class="muted">Simplified tree</span>');
			showSyntaxError(e, textToParse, $('#parse-result-simplified'));
			$('#parse-result-tree-tab').html('<span class="muted">Parse tree</span>');
			showSyntaxError(e, textToParse, $('#parse-result-tree'));
			$('#parse-result-boxes-tab').html('<span class="muted">Boxes</span>');
			showSyntaxError(e, textToParse, $('#parse-result-boxes'));
			$('#parse-result-glossing-tab').html('<span class="muted">Glosses</span>');
			showSyntaxError(e, textToParse, $('#parse-result-glossing'));
		} else {
			throw e;
		}
	}
}

/**
 * Finds all tokens in the resulting parse tree, and puts them in the tokens array.
 */
function findTokens(parse, tokens) {
	if (parse instanceof Array) {
		if (parse.length == 2 && isString(parse[0]) && isString(parse[1])) {
			tokens.push(parse[1]);
		} else {
			for (var child in parse) {
				findTokens(parse[child], tokens);
			}
		}
	}
}

/**
 * Shows the parse result in the interface.
 */
function showRawTree(parse, $element) {
	$element.html('<pre>' + JSON.stringify(parse, undefined, 2) + '</pre>');
}

/**
 * Shows the parse result in the interface.
 */
function showParseTree(parse, $element) {
	$element.html(constructParseTreeOutput(parse, 0));
}

function constructParseTreeOutput(parse, depth) {
	// precaution against infinite recursion; this should not actually happen of course
	if (depth > 50) {
		return '<b>too much recursion :-(</b>';
	}

	// if we get null, just print that
	if (parse === null) {
		return '<i>(none?)</i>';
	}

	// if we get undefined, just print that
	if (!parse) {
		return '<i>(undefined?)</i>';
	}

	if (parse instanceof Array) {
		if (parse.length == 0) {
			return '<i>(empty array?)</i>';
		}

		var output = '';

		// what is the type of parse[0]?
		if (isString(parse[0])) {
			// it is the type
			output += parse[0] + ':';

			if (isString(parse[1])) {
				// a literal
				output += ' <b>[' + parse[1] + ']</b>';
				if (dictionary[parse[1]]) {
					output += ' <span class="translation">' + dictionary[parse[1]].short + '</span>';
				}
				return output;
			}

			output += '<ul>';
			for (var child in parse) {
				if (child !== '0') {
					output += '<li>' + constructParseTreeOutput(parse[child], depth + 1) + '</li>';
				}
			}
			output += '</ul>';
			return output;
		} else {
			output += '<i>a list:</i>';
			output += '<ol>';
			for (var child in parse) {
				output += '<li>' + constructParseTreeOutput(parse[child], depth + 1) + '</li>';
			}
			output += '</ol>';
			return output;
		}
	}

	return '<i>(huh? ' + parse + ')</i>';
}

/**
 * Shows the simplified parse tree in the interface.
 */
function showSimplifiedTree(simplified, $element) {
	$element.html(constructSimplifiedTreeOutput(simplified[0], 0));
}

function constructSimplifiedTreeOutput(parse, depth) {
	// precaution against infinite recursion; this should not actually happen of course
	if (depth > 50) {
		return '<b>too much recursion :-(</b>';
	}

	// if we get null, just print that
	if (parse === null) {
		return '<i>(none?)</i>';
	}

	// if we get undefined, just print that
	if (!parse) {
		return '<i>(undefined?)</i>';
	}

	var output = parse.type;

	if (parse.word) {
		// we have a terminal
		if (parse.type == 'foreign quote content') {
			output += ' <b>[<span class="foreign-quote-content">' + escapeHtml(parse.word) + '</span>]</b>';
		} else {
			output += ' <b>[' + parse.word + ']</b>';
		}
		if (dictionary[parse.word]) {
			output += ' <span class="translation">' + dictionary[parse.word].short + '</span>';
		}
	} else {
		// we have a non-terminal

		output += '<ul>';

		for (var child in parse.children) {
			output += '<li>';
			output += constructSimplifiedTreeOutput(parse.children[child], depth + 1);
			output += '</li>';
		}

		output += '</ul>';
	}

	return output;
}

/**
 * Shows the boxes in the interface.
 */
function showBoxes(simplified, $element) {
	var output = '';

	output += constructBoxesOutput(simplified[0], 0);

	/*output += "<p>Legend: ";
	var types = ["sentence", "prenex", "selbri", "sumti"];
	for (var type in types) {
		output += "<div class=\"" + boxClassForType({ type: types[type] }) + "\">" + types[type] + "</div>";
	}
	output += "</p>";*/

	$element.html(output);
}

function constructBoxesOutput(parse, depth) {
	// precaution against infinite recursion; this should not actually happen of course
	if (depth > 50) {
		return '<b>too much recursion :-(</b>';
	}

	// if we get null, just print that
	if (parse === null) {
		return '<i>(none?)</i>';
	}

	// if we get undefined, just print that
	if (!parse) {
		return '<i>(undefined?)</i>';
	}

	var output = '';

	if (parse.word) {
		output += '<div class="box box-terminal';
		
		if (parse.css_classes != undefined) {
			output += ` ${parse.css_classes}`;
		}

		if (parse.type == 'foreign quote content') {
			output += " foreign-quote-content";
		}
		
		output += '">';

		// we have a terminal
		output += '&nbsp;<div class="tip">' + escapeHtml(parse.word);

		if (hideFamily.includes(parse.type)) {
			output += '</div>&nbsp;<br></div>';
			return output;
		}

		if (dictionary[parse.word] && dictionary[parse.word].long) {
			output += '<div class="tiptext">' + escapeHtml(dictionary[parse.word].long) + '</div>';
		}

		output += '</div>&nbsp;<br>&nbsp;' + parse.type + '&nbsp;<br>';
		// escapeHtml(words[text[j]].long)

		if (dictionary[parse.word]) {
			let short = dictionary[parse.word].short;
			if (short) {
				output += '<span class="translation">&nbsp;' + escapeHtml(short) + '&nbsp;</span>';
			}
		} else if (['KE', 'GE', 'borrowing', "freeform variable"].includes(parse.type)) {
			output += '';
		} else {
			output += '...';
		}

		output += '</div>';
	} else {
		// we have a non-terminal

		output += '<div class="' + boxClassForType(parse);

		if (parse.css_classes != undefined) {
			output += ` ${parse.css_classes}`;
		}

		output += '">';

		// handle erased scope sequence elements
		if (parse.type === 'sequence')  {
			for (var child in parse.children) {
				if (parse.children[child].word == 'buhu') {
					parse.children[child].css_classes = 'erased';
					parse.children[child-1].css_classes = 'erased';
				}
			}
		}

		for (var child in parse.children) {
			output += constructBoxesOutput(parse.children[child], depth + 1);
		}

		if (boxClassForType(parse) !== 'box box-not-shown') {
			if (!hideTitleList.includes(parse.type)) {
				if (parse.type === 'compound') {
					let compound_text = [];
					let compound = '';

					for (var child in parse.children) {
						if (parse.children[child].word) {
							compound_text.push(parse.children[child].word);
						}
					}

					if (compound_text[0] == 'e') {
						compound = 'e' + extractCanonicalCompound(compound_text, 1, 2).compound;
					} else if (compound_text[0] == 'a') {
						compound += 'a' + extractCanonicalCompound(compound_text, 1, 3).compound;
					} else if (compound_text[0] == 'o') {
						compound += 'o' + extractCanonicalCompound(compound_text, 1, -1).compound;
					}

					output += '<br><b>' + compound + '</b>';

					if (dictionary[compound]) {
						output += ' = <div class="tip translation">' + dictionary[compound].short;

						if (dictionary[compound].long) {
							output += '<div class="tiptext">' + escapeHtml(dictionary[compound].long) + '</div>';
						}

						output += '&nbsp;</div>';
					} else {
						output += ' = <div class="tip translation">???</div>';
					}
				} else {
					output += '<br>' + parse.type;
				}
			}
		}

		output += '</div>';
	}

	return output;
}

/**
 * Shows a syntax error in the interface.
 */
function showSyntaxError(e, textToParse, $element) {
	var output =
		'<div class="alert">' +
		'<p><b>Syntax error</b> on line <b>' +
		e.line +
		'</b>, at column <b>' +
		e.column +
		'</b>: ' +
		e.message +
		'</p>' +
		'<p class="error-sentence">' +
		generateErrorPosition(e, textToParse) +
		'</p>' +
		generateFixes(e) +
		'</div>';

	$element.html(output);
}

/**
 * Generates the text sample that shows the error position.
 */
function generateErrorPosition(e, textToParse) {
	//"mi vau <span class=\"error-marker\">&#9652;</span> do cusku ..." +

	var before = textToParse.substring(e.offset - 20, e.offset);

	var after = textToParse.substring(e.offset + 0, e.offset + 20);

	if (e.offset > 20) {
		before = '...' + before;
	}
	if (e.offset < textToParse.length - 20) {
		after = after + '...';
	}

	return before + '<span class="error-marker">&#9652;</span>' + after;
}

function generateFixes(e) {
	if (!e.fix) {
		//return "<p><i>No quick fixes available.</i></p>";
		return '';
	}

	var fixes = '<p>Quick fixes:<ul>';

	for (var f in e.fix) {
		var fix = e.fix[f];
		fixes += '<li>';

		if (fix.fixFunction) {
			fixes += '<a>';
			fixes += fix.name;
			fixes += '</a>';
		} else {
			fixes += fix.name;
		}

		fixes += '</li>';
	}

	fixes += '</ul></p>';

	return fixes;
}

/**
 * Shows the highlighting in the interface.
 */
function showHighlighting(simplified, tokens, $element) {
	var output = '';

	var mode = 1;
	var classString = 'latin-highlighting';

	// if ($('#latin-button').hasClass('active')) {
	// 	var mode = 1;
	// 	var classString = 'latin-highlighting';
	// } else if ($('#cyrillic-button').hasClass('active')) {
	// 	var mode = 2;
	// 	var classString = 'cyrillic-highlighting';
	// } else if ($('#tengwar-button').hasClass('active')) {
	// 	var mode = 3;
	// 	var classString = 'tengwar-highlighting';
	// } else if ($('#hiragana-button').hasClass('active')) {
	// 	var mode = 4;
	// 	var classString = 'hiragana-highlighting';
	// }

	output += '<span class="highlighting ' + classString + '"><big>';
	output += markupHighlighting(simplified, mode);
	output += '</big></span>';

	$element.html(output);
}

function markupHighlighting(simplified, mode) {
	var output = '';
	var beforeOutput = '';
	var afterOutput = ' ';

	if (simplified.type === 'selbri') {
		beforeOutput += '<span class="lojban-selbri">';
		afterOutput = '</span> ';
	} else if (simplified.type === 'modal sumti') {
		beforeOutput += '<span class="lojban-modal"><sup>m</sup>';
		afterOutput = '</span> ';
	} else if (simplified.type === 'sumti x') {
		if (simplified.sumtiPlace > 5) {
			beforeOutput += '<span class="lojban-sumti6"><sup>' + simplified.sumtiPlace + '</sup>';
			afterOutput = '</span> ';
		} else {
			beforeOutput +=
				'<span class="lojban-sumti' + simplified.sumtiPlace + '"><sup>' + simplified.sumtiPlace + '</sup>';
			afterOutput = '</span> ';
		}
	} else if (simplified.type === 'prenex') {
		beforeOutput += '<span class="lojban-prenex"><sup>p</sup>';
		afterOutput = '</span> ';
	} else if (simplified.type === 'free') {
		beforeOutput += '<span class="lojban-vocative"><sup>v</sup>';
		afterOutput = '</span> ';
	}

	if (simplified.word) {
		output += simplified.word;
	} else {
		if (beforeOutput === '') {
			for (child in simplified.children) {
				output += markupHighlighting(simplified.children[child], mode);
			}
		} else {
			output += '<span class="lojban-nesting">' + enumerateTokens(simplified, mode) + '</span>';
		}
	}

	return beforeOutput + output + afterOutput;
}

function enumerateTokens(simplified, mode) {
	var output = '';

	if (simplified.word) {
		output += simplified.word;
	} else {
		for (child in simplified.children) {
			var textToAdd = enumerateTokens(simplified.children[child], mode);
			if (textToAdd) {
				output += textToAdd + ' ';
			}
		}
	}

	if (endsWith(output, ' ')) {
		output = output.substring(0, output.length - 1);
	}

	return output;
}

/**
 * Shows the glossing in the interface.
 */
function showGlossing(text, $element) {
	var output = '<dl class="glosser-definition dl-horizontal">';

	let skip_compound = 0;
	var definitions = {};

	for (var j = 0; j < text.length; j++) {
		let word = text[j];

		if (skip_compound == 0) {
			let compound = '';

			if (word == 'e') {
				({ compound, skip_compound } = extractCanonicalCompound(text, j + 1, 2));
			} else if (word == 'a') {
				({ compound, skip_compound } = extractCanonicalCompound(text, j + 1, 3));
			} else if (word == 'o') {
				({ compound, skip_compound } = extractCanonicalCompound(text, j + 1, -1));
			}

			word += compound;
		} else {
			skip_compound--;
		}

		if (word == 'u') {
			// skip next word which is the borrowing content
			j++;
		} else if (word != 'o' && dictionary[word]) {
			if (!definitions[word]) {
				definitions[word] = [
					dictionary[word].family,
					dictionary[word].long ? escapeHtml(dictionary[word].long) : dictionary[word].short
				];
			}
		}
	}

	definitions = sortMapByKey(definitions);

	for (var key in definitions) {
		output += '<dt>' + key + '</dt>';
		output += '<dd><span class="gloss-family">' + definitions[key][0] + '</span>' + definitions[key][1] + '</dd>';
	}

	output += '</dl>';

	$element.html(output);
}

function sortMapByKey(map) {
	var tupleArray = [];
	for (var key in map) tupleArray.push([ key, map[key] ]);
	tupleArray.sort(function(a, b) {
		return a[0] > b[0];
	});
	var sortedMap = {};
	tupleArray.forEach(function(el) {
		sortedMap[el[0]] = el[1];
	});
	return sortedMap;
}

function extractCanonicalCompound(text, startIndex, length) {
	let offset = 0;
	let compound = '';

	while (length != 0) {
		let item = text[startIndex + offset];

		// o terminator
		if (item == 'o') {
			compound += ' o';
			break;
		}
		
		if (item == 'u') {
			compound += ' ' + item + text[startIndex + offset + 1];
			offset++;
		} else {
			compound += ' ' + item;
		}

		offset++;
		length--;
	}

	return { compound, offset };
}

/**
 * Shows the translation in the interface.
 */
function showTranslation(parse, text, $element) {
	var output =
		'<p class="muted">This translation feature tries to give an approximate translation of the Lojban text into English. However, it does only work for a few sentences as of now. (Try [mi gleki] or something simple like that...)</p>';

	//var translation = translate(parse);
	var translation = 'Sorry! Translation is switched off at the moment, to prevent crashes in the other parts :-(';
	output += '<center><big>' + translation + '</big></center>';

	$element.html(output);
}

// Auxiliary

function isString(s) {
	return typeof s === 'string' || s instanceof String;
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
