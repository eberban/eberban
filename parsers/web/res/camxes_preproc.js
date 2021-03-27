function camxes_preprocessing(input) {
	if (!(typeof input.valueOf() === 'string')) return 'ERROR: Wrong input type.';
	
	// Insert whitespace at start to help parse empty text.
	// TODO : Handle that in PEG grammar.
	input = ' ' + input;
	return input;
}

if (typeof module !== 'undefined') module.exports.preprocessing = camxes_preprocessing;
