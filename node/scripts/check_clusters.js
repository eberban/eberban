const { camxes } = require('../grammar/eberban');
const { initial_pair, medial_pair, sonorant} = require('../src/root_generator');
const single = [ 'b', 'c', 'd', 'f', 'g', 'j', 'k', 'm', 'p', 's', 't', 'v', 'z', 'n', 'l', 'r' ];
const non_sonorant = single.slice(0, -3);

function isParsing(text) {
	try {
		camxes.parse(text);
		return true;
	} catch (e) {
		return false;
	}
}

function isValidCluster(c) {
	// cluster 1 rule
	if (medial_pair.includes(c.slice(0, 2))) {
		if (initial_pair.includes(c.slice(1, 3))) {
			return 1;
		}
	}

	// cluster 2 rule
	if (sonorant.includes(c[0])) {
		if (initial_pair.includes(c.slice(1))) {
			return 2;
		}

		if (non_sonorant.includes(c.slice(1))) {
			return 3;
		}
	}

	if (initial_pair.includes(c)) {
		return 4;
	}

	if (non_sonorant.includes(c)) {
		return 5;
	}

	if (sonorant.includes(c)) {
		return 6;
	}

	if (medial_pair.includes(c)) {
		return 7;
	}

	return 0; // false
}

function checkCluster(c) {
	let ruleValid = isValidCluster(c);
	let parserValid = isParsing(`upa${c}a`);

	if ((ruleValid == 0 && parserValid) || (ruleValid != 0 && !parserValid)) {
		console.log(`${c} : rule(${ruleValid}) != parser(${parserValid}), medial(${medial_pair.includes(c.slice(0, 2))})`);
	}
}

single.forEach(a => {
	checkCluster(a);
	single.forEach(b => {
		if (a == b) return;

		checkCluster(a + b);

		single.forEach(c => {
			if (b == c) return;

			checkCluster(a + b + c);
		})
	})
})