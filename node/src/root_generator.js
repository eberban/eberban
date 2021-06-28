const generators = {
	A: () => pick_random([ generate_CVCV(1, 0), generate_CCVCV(1, -1) ]),
	B: () => pick_random([ generate_CVCV(1, 1), generate_CVCV(2, 0), generate_CCVCV(1, 0), generate_CCVCV(2, -1) ]),
    C: () => pick_random([ generate_CVCV(1, 2), generate_CVCV(2, 1), generate_CCVCV(1, 1), generate_CCVCV(2, 0) ])
};

const single = [ 'b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'p', 's', 't', 'v', 'z' ];

const pair = [
	'cp',
	'ct',
	'ck',
	'cf',
	'cm',
	'cn',
	'cl',
	'cr',
	'sp',
	'st',
	'sk',
	'sf',
	'sm',
	'sn',
	'sl',
	'sr',
	'jb',
	'jd',
	'jg',
	'jv',
	'jm',
	'jn',
	'jl',
	'jr',
	'zb',
	'zd',
	'zg',
	'zv',
	'zm',
	'zn',
	'zl',
	'zr',

	'pl',
	'pr',
	'tl',
	'tr',
	'kl',
	'kr',
	'fl',
	'fr',
	'bl',
	'br',
	'dl',
	'dr',
	'gl',
	'gr',
	'vl',
	'vr',
	'ml',
	'mr',

	'tc',
	'ts',
	'dj',
	'dz',
	'kc',
	'ks',
	'gj',
	'gz',
	'pc',
	'ps',
	'bj',
	'bz'
];

const vowel = [ 'a', 'e', 'o', 'i', 'u' ];

const sonorant = [ 'n', 'r' ];

function rand(upper) {
	return Math.floor(Math.random() * upper);
}

function pick_random(array) {
	return array[rand(array.length)];
}

function repeat(number, f) {
	for (let i = 0; i < number; i++) {
		f();
	}
}

function generate_vowels(amount) {
	if (amount <= 0) return '';

	var chain = pick_random(vowel);

	repeat(amount - 1, () => {
		while (true) {
			var v = pick_random(vowel);

			if (chain.slice(-1) != v) {
				chain += v;
				return;
			}
		}
	});

	return chain;
}

function generate_CVCV(v1, v2) {
	var word = '';
	word += pick_random(single);
	word += generate_vowels(v1);
	word += pick_random(sonorant);
	word += generate_vowels(v2);
	return word;
}

function generate_CCVCV(v1, v2) {
	var word = '';
	word += pick_random(pair);
	word += generate_vowels(v1);

	if (v2 >= 0) {
		word += pick_random(sonorant);
	}

	word += generate_vowels(v2);

	return word;
}

module.exports.generators = generators;
module.exports.repeat = repeat;