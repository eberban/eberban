const { camxes } = require('../grammar/eberban');

const single = [ 'b', 'c', 'd', 'f', 'g', 'j', 'k', 'm', 'p', 's', 't', 'v', 'z', 'n', 'l', 'r' ];
const sonorants = [ 'n', 'l', 'r' ];

let pairs_initial = [];
let pairs_medial = [];
let pairs_medial_available = [
    'bd', 'bg', 'bm', 'bv', 'bn', 'db', 'dg', 'dm', 'dv', 'dn', 'dl', 'fc', 'fk', 'fm', 'fp', 'fs', 
    'ft', 'fn', 'gb', 'gd', 'gm', 'gv', 'gn', 'kf', 'km', 'kp', 'kt', 'kn', 'mb', 'mc', 'md', 'mf', 
    'mg', 'mj', 'mk', 'mp', 'ms', 'mt', 'mv', 'mz', 'mn', 'pf', 'pk', 'pm', 'pt', 'pn', 'tf', 'tk', 
    'tm', 'tp', 'tn', 'tl', 'vb', 'vd', 'vg', 'vj', 'vm', 'vz', 'vn', 'nl', 'nr', 'ln', 'lr', 'rn', 
    'rl'
];

single.forEach((first) =>
	single.forEach((second) => {
		if (first != second) {
			try {
				camxes.parse(first + second + 'a');
				pairs_initial.push(first + second);
			} catch (e) {}
		}
	})
);

console.log(`${pairs_initial.length} initial pairs :`);
console.log(pairs_initial.join(' '));
console.log(pairs_initial.map(pair => `'${pair}'`).join(', '));

single.forEach((first) =>
	single.forEach((second) => {
		if (first != second) {
			try {
				camxes.parse('sa' + first + second + 'a');
				if (
					!pairs_initial.includes(first + second) &&
					!(sonorants.includes(first) && !sonorants.includes(second))
				) {
					pairs_medial.push(first + second);
				}
			} catch (e) {}
		}
	})
);

pairs_medial_available = pairs_medial_available.filter(pair => !pairs_medial.includes(pair));

console.log();
console.log(`${pairs_medial.length} medial pairs :`);
console.log(pairs_medial.join(' '));

console.log();
console.log(pairs_medial.map(pair => `sa${pair}o`).join(' '));
console.log(pairs_medial.map(pair => `'${pair}'`).join(', '));

console.log();
console.log(`Available ${pairs_medial_available.length} medial pairs :`);
console.log(pairs_medial_available.join(' '));