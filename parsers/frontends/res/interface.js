$(document).ready(function() {
	$('label').popover();
});

function escapeHtml(str) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	return p.innerHTML;
}

/**
 * Launches the parsing process by calling the parser with the data entered in the interface,
 * and processing the results.
 */
function parse() {
	var textToParse = $('#lojban-text-area').val();
	$('#result-row').slideDown();
	try {
		var start = new Date().getTime();
		textToParse = camxes_preprocessing(textToParse);
		var parse = camxes.parse(textToParse);
		var end = new Date().getTime();
		$('#time-label').html('(parsing took ' + (end - start) + ' ms)');
		parse = remove_morphology(parse);
		parse = remove_spaces(parse);
		var simplified = simplifyTree(parse);
		numberSumti(simplified);

		if (parse) {
			tokens = [];
			findTokens(parse, tokens);

			var $parseResultHighlighted = $('#parse-result-highlighted');
			showHighlighting(simplified[0], tokens, $parseResultHighlighted);

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
		$('#parse-result-highlighted-tab').html('Highlighted');
		$('#parse-result-tree-tab').html('Parse tree');
		$('#parse-result-raw-tab').html('Raw tree');
		$('#parse-result-simplified-tab').html('Simplified tree');
		$('#parse-result-boxes-tab').html('Boxes');
		$('#parse-result-glossing-tab').html('Glosses');
	} catch (e) {
		if (e.name && e.name === 'SyntaxError') {
			$('#parse-result-highlighted-tab').html('<span class="muted">Highlighted</span>');
			showSyntaxError(e, textToParse, $('#parse-result-highlighted'));
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
			for (child in parse) {
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
				output += '<b> [' + getVlasiskuLink(parse[1]) + ']</b>';
				if (words[parse[1]]) {
					output += ' <span class="translation">' + words[parse[1]].eng_short + '</span>';
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

		return '<i>(huh 2?)</i>';
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
	if (parse.sumtiPlace) {
		output += parse.sumtiPlace;
	}

	if (parse.word) {
		// we have a terminal
		output += ' <b>[' + getVlasiskuLink(parse.word) + ']</b>';
		if (words[parse.word]) {
			output += ' <span class="translation">' + words[parse.word].eng_short + '</span>';
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
		output += '<div class="box box-terminal">';

		// we have a terminal
		output += '&nbsp;<div class="tip">' + parse.word;

		if (parse.type === 'foreign_word' || parse.type === 'foreign_quote_word') {
			output += '</div>&nbsp;<br></div>';
			return output;
		}

		if (words[parse.word] && words[parse.word].eng_long) {
			output += '<div class="tiptext">' + escapeHtml(words[parse.word].eng_long) + '</div>';
		}

		output += '</div>&nbsp;<br>&nbsp;' + parse.type + '&nbsp;<br>';
		// escapeHtml(words[text[j]].long)

		if (words[parse.word]) {
			output += '<span class="translation">&nbsp;' + words[parse.word].eng_short + '&nbsp;</span>';
		} else {
			output += '...';
		}

		output += '</div>';
	} else {
		// we have a non-terminal

		output += '<div class="' + boxClassForType(parse) + '">';

		for (var child in parse.children) {
			output += constructBoxesOutput(parse.children[child], depth + 1);
		}

		if (boxClassForType(parse) !== 'box box-not-shown') {
			if (parse.type !== 'scope') {
				output += '<br>' + parse.type;

				if (parse.type === 'compound') {
					compound = '';
					for (var child in parse.children) {
						if (parse.children[child].word) {
							compound += parse.children[child].word;
						}
					}

					if (words[compound]) {
						output += ' : <div class="tip translation">&nbsp;' + words[compound].eng_short;

						if (words[compound].eng_long) {
							output += '<div class="tiptext">' + escapeHtml(words[compound].eng_long) + '</div>';
						}

						output += '&nbsp;</div>';
					} else {
						output += ' : ...';
					}
				}

				// if (parse.sumtiPlace) {
				//     output += parse.sumtiPlace;
				// }
			}
		}

		output += '</div>';
	}

	return output;
}

function boxClassForType(parse) {
	// if (parse.type === "sentence") {
	//     return "box box-sentence";
	// }

	// if (parse.type === "sumti x") {
	//     if (parse.sumtiPlace > 5) {
	//         return "box box-sumti6";
	//     } else if (parse.sumtiPlace == "fai") {
	//         return "box box-sumti-fai";
	//     } else {
	//         return "box box-sumti" + parse.sumtiPlace;
	//     }
	// }

	// if (parse.type === "modal sumti") {
	//     return "box box-modal";
	// }

	// if (parse.type === "sumti") {
	//     return "box box-sumti";
	// }

	// if (parse.type === "selbri") {
	//     return "box box-selbri";
	// }

	// if (parse.type === "prenex") {
	//     return "box box-prenex";
	// }

	// return "box box-not-shown";

	if (parse.type === 'parser version') {
		return 'box box-parser';
	}

	if (parse.type === 'sentence') {
		return 'box box-sentence';
	}
	// if (parse.type === "proposition") { return "box box-proposition"; }
	if (parse.type === 'place') {
		return 'box box-place';
	}
	if (parse.type === 'import') {
		return 'box box-import';
	}

	if (parse.type === 'predicate') {
		return 'box box-predicate';
	}
	if (parse.type === 'link') {
		return 'box box-link';
	}

	if (parse.type === 'compound') {
		return 'box box-compound';
	}
	if (parse.type === 'number') {
		return 'box box-number';
	}
	if (parse.type === 'letters') {
		return 'box box-letters';
	}
	if (parse.type === 'scope') {
		return 'box box-scope';
	}
	if (parse.type === 'abstraction') {
		return 'box box-abstraction';
	}
	if (parse.type === 'borrowing') {
		return 'box box-borrowing';
	}
	if (parse.type === 'foreign quote') {
		return 'box box-borrowing';
	}

	if (parse.type === 'scope') {
		return 'box box-scope';
	}

	if (parse.type === 'indicator') {
		return 'box box-indicator';
	}
	if (parse.type === 'discursive') {
		return 'box box-note';
	}
	if (parse.type === 'note') {
		return 'box box-note';
	}
	if (parse.type === 'subscript') {
		return 'box box-note';
	}

	return 'box box-not-shown';
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

	if ($('#latin-button').hasClass('active')) {
		var mode = 1;
		var classString = 'latin-highlighting';
	} else if ($('#cyrillic-button').hasClass('active')) {
		var mode = 2;
		var classString = 'cyrillic-highlighting';
	} else if ($('#tengwar-button').hasClass('active')) {
		var mode = 3;
		var classString = 'tengwar-highlighting';
	} else if ($('#hiragana-button').hasClass('active')) {
		var mode = 4;
		var classString = 'hiragana-highlighting';
	}

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
		output += outputWord(simplified.word, mode);
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
		output += outputWord(simplified.word, mode);
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

function isModalSumti(sumti) {
	var tag = sumti[1][0];
	return tag === 'tag'; // TODO It would be much nicer to make some methods for walking the parse tree, and using them
}

function markupError(error, before, after) {
	// TODO
	before[error.position] = '<span class="lojban-error" title="' + error.message + '">' + before[error.position];
	after[error.position] = after[error.position] + '</span>';
}

/**
 * Shows the glossing in the interface.
 */
function showGlossing(text, $element) {
	var output = '<dl class="dl-horizontal">';

	for (var j = 0; j < text.length; j++) {
		// output += "<dt>" + getVlasiskuLink(text[j]) + "</dt>";
		output += '<dt>' + text[j] + '</dt>';

		if (words[text[j]]) {
			output +=
				'<dd><span class="gloss-family">' +
				words[text[j]]._family +
				'</span>' +
				(words[text[j]].eng_long ? escapeHtml(words[text[j]].eng_long) : words[text[j]].eng_short) +
				'</dd>';
		} else {
			output += '<dd><span class="muted">(?)</span></dd>';
		}
	}

	output += '</dl>';

	$element.html(output);
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

function getVlasiskuLink(word) {
	return '<a href="http://vlasisku.lojban.org/vlasisku/' + word + '">' + outputWord(word, getSelectedMode()) + '</a>';
}

function outputWord(word, mode) {
	if (mode === 1) {
		// Latin mode
		return addDotsToWord(word);
	} else if (mode === 2) {
		// Cyrillic mode
		return wordToCyrillic(addDotsToWord(word));
	} else if (mode === 3) {
		// Tengwar mode
		return wordToTengwar(addDotsToWord(word));
	} else if (mode === 4) {
		// Hiragana mode
		return wordToHiragana(addDotsToWord(word));
	}
}

function getSelectedMode() {
	if ($('#latin-button').hasClass('active')) {
		return 1;
	} else if ($('#cyrillic-button').hasClass('active')) {
		return 2;
	} else if ($('#tengwar-button').hasClass('active')) {
		return 3;
	} else if ($('#hiragana-button').hasClass('active')) {
		return 4;
	}
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
