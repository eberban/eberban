const generators = {
	A: () => pick_random([ generate_CVCV(1, 0), generate_CCVCV(1, -1) ]),
	B: () => pick_random([ generate_CVCV(1, 1), generate_CVCV(2, 0), generate_CCVCV(1, 0), generate_CCVCV(2, -1) ]),
	C: () =>
		pick_random([
			generate_CVCV(1, 2),
			generate_CVCV(2, 1),
			generate_CVCV(3, 0),
			generate_CCVCV(1, 1),
			generate_CCVCV(2, 0)
		]),
	D: () =>
		pick_random([
			// bias towards CVCCV :p
			generate_CVCCV(1, 1),
			generate_CVCCV(1, 1),
			generate_CVCCV(1, 1),
			generate_CVhVC(),
			generate_CCVhV()
		])
};

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
	word += pick_random(initial_pair);
	word += generate_vowels(v1);

	if (v2 >= 0) {
		word += pick_random(sonorant);
	}

	word += generate_vowels(v2);

	return word;
}

function generate_CVCCV(v1, v2) {
	var word = '';
	word += pick_random(single);
	word += generate_vowels(v1);

	if (v2 >= 0) {
		word += pick_random(medial_pair);
	}

	word += generate_vowels(v2);

	return word;
}

function generate_CVhVC() {
	var word = '';
	word += pick_random(single);
	word += generate_vowels(1);
	word += 'h';
	word += generate_vowels(1);
	word += pick_random(sonorant);
	return word;
}

function generate_CCVhV() {
	var word = '';
	word += pick_random(initial_pair);
	word += generate_vowels(1);
	word += 'h';
	word += generate_vowels(1);
	return word;
}

const vowel = [ 'i', 'e', 'a', 'o', 'u' ];
const sonorant = [ 'n', 'r', 'l' ];
const single = [ 'b', 'c', 'd', 'f', 'g', 'j', 'k', 'm', 'p', 's', 't', 'v', 'z' ];
const initial_pair = [
	'bj',
	'bz',
	'bl',
	'br',
	'cf',
	'ck',
	'cm',
	'cp',
	'ct',
	'cn',
	'cl',
	'cr',
	'dj',
	'dz',
	'dr',
	'fc',
	'fs',
	'fn',
	'fl',
	'fr',
	'gj',
	'gz',
	'gn',
	'gl',
	'gr',
	'jb',
	'jd',
	'jg',
	'jm',
	'jv',
	'jn',
	'jl',
	'jr',
	'kc',
	'ks',
	'kn',
	'kl',
	'kr',
	'mn',
	'ml',
	'mr',
	'pc',
	'ps',
	'pl',
	'pr',
	'sf',
	'sk',
	'sm',
	'sp',
	'st',
	'sn',
	'sl',
	'sr',
	'tc',
	'ts',
	'tr',
	'vj',
	'vz',
	'vn',
	'vl',
	'vr',
	'zb',
	'zd',
	'zg',
	'zm',
	'zv',
	'zn',
	'zl',
	'zr'
];
const medial_pair = [
	'bd',
	'bg',
	'bm',
	'bv',
	'db',
	'dg',
	'dm',
	'dv',
	'fk',
	'fm',
	'fp',
	'ft',
	'gb',
	'gd',
	'gm',
	'gv',
	'kf',
	'km',
	'kp',
	'kt',
	'pf',
	'pk',
	'pm',
	'pt',
	'tf',
	'tk',
	'tm',
	'tp',
	'vb',
	'vd',
	'vg',
	'vm',
	'nl',
	'nr',
	'ln',
	'rn'
];

module.exports.generators = generators;
module.exports.repeat = repeat;
