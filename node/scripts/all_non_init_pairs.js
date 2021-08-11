const { camxes } = require('../grammar/eberban');

const single = [ 'b', 'c', 'd', 'f', 'g', 'j', 'k', 'm', 'p', 's', 't', 'v', 'z', 'n', 'l', 'r' ];
const sonorants = [ 'n', 'l', 'r' ];

let pairs_initial = [];
let pairs_middle = [];
let pairs_middle_available = [
    'bd', 'bg', 'bm', 'bv', 'bn', 'db', 'dg', 'dm', 'dv', 'dn', 'dl', 'fc', 'fk', 'fm', 'fp', 'fs', 
    'ft', 'fn', 'gb', 'gd', 'gm', 'gv', 'gn', 'kf', 'km', 'kp', 'kt', 'kn', 'mb', 'mc', 'md', 'mf', 
    'mg', 'mj', 'mk', 'mp', 'ms', 'mt', 'mv', 'mz', 'mn', 'pf', 'pk', 'pm', 'pt', 'pn', 'tf', 'tk', 
    'tm', 'tp', 'tn', 'tl', 'vb', 'vd', 'vg', 'vj', 'vm', 'vz', 'vn', 'nl', 'nr', 'ln', 'lr', 'rn', 
    'rl'
];

single.forEach((first) =>
	single.forEach((second) => {
		try {
			camxes.parse(first + second + 'a');
			pairs_initial.push(first + second);
		} catch (e) {}
	})
);

console.log(`${pairs_initial.length} initial pairs :`);
console.log(pairs_initial.join(' '));
console.log(pairs_initial.map(pair => `'${pair}'`).join(', '));

single.forEach((first) =>
	single.forEach((second) => {
		try {
			camxes.parse('sa' + first + second + 'a');
			if (
                !pairs_initial.includes(first + second) &&
                !(sonorants.includes(first) && !sonorants.includes(second))
            ) {
				pairs_middle.push(first + second);
			}
		} catch (e) {}
	})
);

pairs_middle_available = pairs_middle_available.filter(pair => !pairs_middle.includes(pair));

console.log();
console.log(`${pairs_middle.length} middle pairs :`);
console.log(pairs_middle.join(' '));

console.log();
console.log(pairs_middle.map(pair => `sa${pair}o`).join(' '));
console.log(pairs_middle.map(pair => `'${pair}'`).join(', '));

console.log();
console.log(`Available ${pairs_middle_available.length} middle pairs :`);
console.log(pairs_middle_available.join(' '));