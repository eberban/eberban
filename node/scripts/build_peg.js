var start_t = process.hrtime();
var fs = require("fs")
var pegjs = require("pegjs")
var src = (process.argv.length >= 3) ? process.argv[2] : "camxes.pegjs";
var dst = src.replace(/.js.peg$/g, ".pegjs").replace(/^(.*?)(\.[^\\\/]+)?$/g, "$1.js");
console.log("-> " + dst);
var peg = fs.readFileSync(src).toString();
try {
    var param = {
		cache: true,
		trace: false,
		output: "source",
		allowedStartRules: ["text"],
	}
    if (typeof pegjs.generate === 'function')
        var camxes = pegjs.generate(peg, param);
    else if (typeof pegjs.buildParser === 'function')
        var camxes = pegjs.buildParser(peg, param);
    else throw "ERROR: No parser generator method found in the PEGJS module.";
} catch (e) {
	console.log(JSON.stringify(e));
	throw e;
}
var fd = fs.openSync(dst, 'w+');
var buffer = new Buffer.from('var camxes = ');
fs.writeSync(fd, buffer, 0, buffer.length);
buffer = new Buffer.from(camxes);
fs.writeSync(fd, buffer, 0, buffer.length);

buffer = new Buffer.from(`
module.exports.camxes = camxes;
`);
fs.writeSync(fd, buffer, 0, buffer.length);
fs.closeSync(fd);
var diff_t = process.hrtime(start_t);
console.log(`Duration: ${diff_t[0] + diff_t[1] / 1e9} seconds`);

