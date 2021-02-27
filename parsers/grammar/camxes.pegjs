// eberban PEG grammar - v0.16
// ===========================

// GRAMMAR
// main rule, allow language version/dialect annotation
{
  var _g_foreign_quote_delim;

  function _join(arg) {
    if (typeof(arg) == "string")
      return arg;
    else if (arg) {
      var ret = "";
      for (var v in arg) { if (arg[v]) ret += _join(arg[v]); }
      return ret;
    }
  }

  function _node_empty(label, arg) {
    var ret = [];
    if (label) ret.push(label);
    if (arg && typeof arg == "object" && typeof arg[0] == "string" && arg[0]) {
      ret.push( arg );
      return ret;
    }
    if (!arg)
    {
      return ret;
    }
    return _node_int(label, arg);
  }

  function _node_int(label, arg) {
    if (typeof arg == "string")
      return arg;
    if (!arg) arg = [];
    var ret = [];
    if (label) ret.push(label);
    for (var v in arg) {
      if (arg[v] && arg[v].length != 0)
        ret.push( _node_int( null, arg[v] ) );
    }
    return ret;
  }

  function _node2(label, arg1, arg2) {
    return [label].concat(_node_empty(arg1)).concat(_node_empty(arg2));
  }

  function _node(label, arg) {
    var _n = _node_empty(label, arg);
    return (_n.length == 1 && label) ? [] : _n;
  }
  var _node_nonempty = _node;

  // === Functions for faking left recursion === //

  function _flatten_node(a) {
    // Flatten nameless nodes
    // e.g. [Name1, [[Name2, X], [Name3, Y]]] --> [Name1, [Name2, X], [Name3, Y]]
    if (is_array(a)) {
      var i = 0;
      while (i < a.length) {
        if (!is_array(a[i])) i++;
        else if (a[i].length === 0) // Removing []s
          a = a.slice(0, i).concat(a.slice(i + 1));
        else if (is_array(a[i][0]))
          a = a.slice(0, i).concat(a[i], a.slice(i + 1));
        else i++;
      }
    }
    return a;
  }

  function _group_leftwise(arr) {
    if (!is_array(arr)) return [];
    else if (arr.length <= 2) return arr;
    else return [_group_leftwise(arr.slice(0, -1)), arr[arr.length - 1]];
  }

  // "_lg" for "Leftwise Grouping".
  function _node_lg(label, arg) {
    return _node(label, _group_leftwise(_flatten_node(arg)));
  }

  function _node_lg2(label, arg) {
    if (is_array(arg) && arg.length == 2)
      arg = arg[0].concat(arg[1]);
    return _node(label, _group_leftwise(arg));
  }

  // === Foreign words functions === //

  function _assign_foreign_quote_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: foreign_quote word is of type " + typeof w;
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    _g_foreign_quote_delim = w;
    return;
  }

  function _is_foreign_quote_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: foreign_quote word is of type " + typeof w;
    /* Keeping spaces in the parse tree seems to result in the absorbtion of
       spaces into the closing delimiter candidate, so we'll remove any space
       character from our input. */
    w = w.replace(/[.\t\n\r?!\u0020]/g, "");
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    return w === _g_foreign_quote_delim;
  }

  function join_expr(n) {
    if (!is_array(n) || n.length < 1) return "";
    var s = "";
    var i = is_array(n[0]) ? 0 : 1;
    while (i < n.length) {
      s += is_string(n[i]) ? n[i] : join_expr(n[i]);
      i++;
    }
    return s;
  }

  function is_string(v) {
    // return $.type(v) === "string";
    return Object.prototype.toString.call(v) === '[object String]';
  }

  function is_array(v) {
    // return $.type(v) === "array";
    return Object.prototype.toString.call(v) === '[object Array]';
  }
}

text = expr:(parser_version? text_1) {return _node("text", expr);}
parser_version = expr:(BU_clause (!parser_version_number borrowing_content (pause_char !pause_char !q)? parser_version_number? / parser_version_number)) {return _node("parser_version", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_discursive / free_parenthetical)* (paragraph+ / sentence*) spaces? EOF?) {return _node("text_1", expr);}

// sentences
paragraph = expr:(PU_clause+ sentence*) {return _node("paragraph", expr);}
sentence = expr:(proposition) {return _node("sentence", expr);}

proposition = expr:(proposition_1 (day proposition_1)*) {return _node("proposition", expr);}
proposition_1 = expr:(proposition_beday / PE_clause_elidible prenex? BA_clause* predicate_chaining PEY_clause_elidible) {return _node("proposition_1", expr);}
proposition_beday = expr:(beday proposition (bi proposition)+ BEY_clause_elidible) {return _node("proposition_beday", expr);}

prenex = expr:((PO_clause prenex_term)+ POY_clause) {return _node("prenex", expr);}
prenex_term = expr:(predicate_term predicate_link*) {return _node("prenex_term", expr);}

predicate_chaining = expr:(predicate_filling (predicate_chaining_tag predicate_chaining)? / predicate_unit (predicate_chaining_tag? predicate_chaining)?) {return _node("predicate_chaining", expr);}
predicate_chaining_tag = expr:(VA_clause / predicate_chaining_import) {return _node("predicate_chaining_tag", expr);}
predicate_chaining_import = expr:(BOY_clause predicate_unit) {return _node("predicate_chaining_import", expr);}

predicate_filling = expr:(predicate_unit predicate_filled_place+) {return _node("predicate_filling", expr);}
predicate_filled_place = expr:(predicate_place_tag+ predicate_term predicate_link*) {return _node("predicate_filled_place", expr);}
predicate_link = expr:(CA_clause predicate_unit+) {return _node("predicate_link", expr);}

predicate_place_tag = expr:(FA_clause / predicate_place_import) {return _node("predicate_place_tag", expr);}
predicate_place_import = expr:(BO_clause predicate_unit) {return _node("predicate_place_import", expr);}

predicate_term = expr:(predicate_term_day / predicate_term_1) {return _node("predicate_term", expr);}
predicate_term_day = expr:(predicate_term_1 (day predicate_term_1)+) {return _node("predicate_term_day", expr);}
predicate_term_1 = expr:(predicate_term_da / predicate_term_2) {return _node("predicate_term_1", expr);}
predicate_term_da = expr:(predicate_term_2 (da predicate_term_2)+) {return _node("predicate_term_da", expr);}
predicate_term_2 = expr:(predicate_term_beday / predicate_unit+) {return _node("predicate_term_2", expr);}
predicate_term_beday = expr:(beday predicate_term (bi predicate_term)+ BEY_clause_elidible) {return _node("predicate_term_beday", expr);}

predicate_unit = expr:((SA_clause / ZA_clause)* predicate_unit_1) {return _node("predicate_unit", expr);}
predicate_unit_1 = expr:(compound free_post* / borrowing / grammatical_quote / one_word_quote / foreign_quote / abstraction / MA_clause / free_prefix* spaces? (root / string) free_post*) {return _node("predicate_unit_1", expr);}

// compound prefixes
compound = expr:((compound_1 / compound_2 / compound_3 / compound_4 / compound_n) &post_word) {return _node("compound", expr);}
compound_1 = expr:(A_clause compound_word) {return _node("compound_1", expr);}
compound_2 = expr:(E_clause compound_word compound_word) {return _node("compound_2", expr);}
compound_3 = expr:(I_clause compound_word compound_word compound_word) {return _node("compound_3", expr);}
compound_4 = expr:(O_clause compound_word compound_word compound_word compound_word) {return _node("compound_4", expr);}
compound_n = expr:(U_clause (!(pause_char? U) compound_word)+ (pause_char? U)) {return _node("compound_n", expr);}
compound_word = expr:(initial_pause native_word) {return _node("compound_word", expr);}

// borrowings
borrowing = expr:(XA_clause borrowing_content (pause_char / space_char / EOF) free_post*) {return _node("borrowing", expr);}
borrowing_content = expr:((spaces? !sonorant / spaces &sonorant) foreign_word) {return _node("borrowing_content", expr);}

// quotes
grammatical_quote = expr:(XE_clause text_1 XEY_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(XI_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(XU_clause (spaces?) foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// abstractions
abstraction = expr:(PA_clause proposition PAY_clause_elidible) {return _node("abstraction", expr);}

// string (numbers / literals)
string = expr:((number_string / letter_string) TAY_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BQ_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BQ_clause (TA_clause / BQ_clause)*) {return _node("letter_string", expr);}

// afterthough connectives
day = expr:(BA_clause? DAY_clause BAY_clause? free_post*) {return _node("day", expr);}
da = expr:(DA_clause) {return _node("da", expr);}

// forethough connectives
beday = expr:(BE_clause DAY_clause BAY_clause? free_post*) {return _node("beday", expr);}
bi = expr:(BI_clause BAY_clause? free_post*) {return _node("bi", expr);}

// free prefix
free_prefix = expr:(JU_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(JUY_clause / free_discursive / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_subscript = expr:(JA_clause string) {return _node("free_subscript", expr);}
free_discursive = expr:(JE_clause predicate_unit+) {return _node("free_discursive", expr);}
free_indicator = expr:(JI_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(JO_clause text_1 JOY_clause) {return _node("free_parenthetical", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A) {return _node("A_clause", expr);} // 1-word compound
E_clause = expr:(free_prefix* spaces? E) {return _node("E_clause", expr);} // 2-words compound
I_clause = expr:(free_prefix* spaces? I) {return _node("I_clause", expr);} // 3-words compound
O_clause = expr:(free_prefix* spaces? O) {return _node("O_clause", expr);} // 4-words compound
U_clause = expr:(free_prefix* spaces? U) {return _node("U_clause", expr);} // n-words compound starter and terminator

BA_clause = expr:(free_prefix* spaces? BA free_post*) {return _node("BA_clause", expr);} // pre negation
BAY_clause = expr:(free_prefix* spaces? BAY) {return _node("BAY_clause", expr);} // post negation
BE_clause = expr:(free_prefix* spaces? BE) {return _node("BE_clause", expr);} // forethought connective starter
BEY_clause = expr:(free_prefix* spaces? BEY free_post*) {return _node("BEY_clause", expr);} // forethought connective terminator
BEY_clause_elidible = expr:(BEY_clause?) {return (expr == "" || !expr) ? ["BEY"] : _node_empty("BEY_clause_elidible", expr);}
BI_clause = expr:(free_prefix* spaces? BI) {return _node("BI_clause", expr);} // forethought connective separator
BO_clause = expr:(free_prefix* spaces? BO) {return _node("BO_clause", expr);} // filling place import
BOY_clause = expr:(free_prefix* spaces? BOY) {return _node("BOY_clause", expr);} // chaining place import
BQ_clause = expr:(free_prefix* spaces? BQ) {return _node("BQ_clause", expr);} // letters
BU_clause = expr:(free_prefix* spaces? BU) {return _node("BU_clause", expr);} // parser version/dialect
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);} // predicate link
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);} // set creator
DAY_clause = expr:(free_prefix* spaces? DAY free_post*) {return _node("DAY_clause", expr);} // logical connectives
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);} // filling place tag
JA_clause = expr:(free_prefix* spaces? JA) {return _node("JA_clause", expr);} // free subscript
JE_clause = expr:(free_prefix* spaces? JE) {return _node("JE_clause", expr);} // free discursive (predicate)
JI_clause = expr:(free_prefix* spaces? JI) {return _node("JI_clause", expr);} // free suffix (indicator / marker)
JO_clause = expr:(free_prefix* spaces? JO) {return _node("JO_clause", expr);} // free parenthetical started (text)
JOY_clause = expr:(free_prefix* spaces? JOY) {return _node("JOY_clause", expr);} // free parenthetical terminator
JU_clause = expr:(spaces? JU) {return _node("JU_clause", expr);} // free prefix / scope starter
JUY_clause = expr:(spaces? JUY) {return _node("JUY_clause", expr);} // free scope terminator
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // surrogate predicates (pronouns, ...)
PA_clause = expr:(free_prefix* spaces? PA) {return _node("PA_clause", expr);} // abstractors starter
PAY_clause = expr:(free_prefix* spaces? PAY free_post*) {return _node("PAY_clause", expr);} // abstractors terminator
PAY_clause_elidible = expr:(PAY_clause?) {return (expr == "" || !expr) ? ["PAY"] : _node_empty("PAY_clause_elidible", expr);}
PE_clause = expr:(free_prefix* spaces? PE free_post*) {return _node("PE_clause", expr);} // proposition starter
PE_clause_elidible = expr:(PE_clause?) {return (expr == "" || !expr) ? ["PE"] : _node_empty("PE_clause_elidible", expr);}
PEY_clause = expr:(free_prefix* spaces? PEY free_post*) {return _node("PEY_clause", expr);} // proposition terminator
PEY_clause_elidible = expr:(PEY_clause?) {return (expr == "" || !expr) ? ["PEY"] : _node_empty("PEY_clause_elidible", expr);}
PO_clause = expr:(free_prefix* spaces? PO free_post*) {return _node("PO_clause", expr);} // prenex starter/separator
POY_clause = expr:(free_prefix* spaces? POY free_post*) {return _node("POY_clause", expr);} // prenex terminator
PU_clause = expr:(free_prefix* spaces? PU free_post*) {return _node("PU_clause", expr);} // paragraph marker
SA_clause = expr:(free_prefix* spaces? SA) {return _node("SA_clause", expr);} // place binding tag
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
TAY_clause = expr:(free_prefix* spaces? TAY) {return _node("TAY_clause", expr);} // number / string terminator
TAY_clause_elidible = expr:(TAY_clause?) {return (expr == "" || !expr) ? ["TAY"] : _node_empty("TAY_clause_elidible", expr);}
VA_clause = expr:(free_prefix* spaces? VA free_post*) {return _node("VA_clause", expr);} // chaining tags
XA_clause = expr:(free_prefix* spaces? XA) {return _node("XA_clause", expr);} // borrowing
XE_clause = expr:(free_prefix* spaces? XE) {return _node("XE_clause", expr);} // grammatical quote starter
XEY_clause = expr:(free_prefix* spaces? XEY free_post*) {return _node("XEY_clause", expr);} // grammatical quote terminator
XI_clause = expr:(free_prefix* spaces? XI) {return _node("XI_clause", expr);} // one word quote
XU_clause = expr:(free_prefix* spaces? XU) {return _node("XU_clause", expr);} // foreign quote
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);} // predicate unit transformation

// PARTICLE FAMILIES
A = expr:(&particle (a)) {return _node("A", expr);}
E = expr:(&particle (e)) {return _node("E", expr);}
I = expr:(&particle (i)) {return _node("I", expr);}
O = expr:(&particle (o)) {return _node("O", expr);}
U = expr:(&particle (u)) {return _node("U", expr);}

BA = expr:(&particle (b a)) {return _node("BA", expr);}
BAY = expr:(&particle (b a y)) {return _node("BAY", expr);}
BE = expr:(&particle (b e)) {return _node("BE", expr);}
BEY = expr:(&particle (b e y)) {return _node("BEY", expr);}
BI = expr:(&particle (b i)) {return _node("BI", expr);}
BO = expr:(&particle (b o)) {return _node("BO", expr);}
BOY = expr:(&particle (b o y)) {return _node("BOY", expr);}
BQ = expr:(&particle (consonant q / yw q / aeiouq h q / q h a / q h e)) {return _node("BQ", expr);}
BU = expr:(&particle (b u)) {return _node("BU", expr);}
CA = expr:(&particle (c vtail)) {return _node("CA", expr);}
DA = expr:(&particle (d aeiou)) {return _node("DA", expr);}
DAY = expr:(&particle (d aeiou y)) {return _node("DAY", expr);}
FA = expr:(&particle (f vtail)) {return _node("FA", expr);}
JA = expr:(&particle (j a)) {return _node("JA", expr);}
JE = expr:(&particle (j &e vtail)) {return _node("JE", expr);}
JI = expr:(&particle (j &(i / y) vtail)) {return _node("JI", expr);}
JO = expr:(&particle (j o)) {return _node("JO", expr);}
JOY = expr:(&particle (j o y)) {return _node("JOY", expr);}
JU = expr:(&particle !(JUY &post_word) (j &(u / w) vtail)) {return _node("JU", expr);}
JUY = expr:(&particle (j u y)) {return _node("JUY", expr);}
MA = expr:(&particle (m vtail)) {return _node("MA", expr);}
PA = expr:(&particle !(PAY &post_word) (p &a vtail)) {return _node("PA", expr);}
PAY = expr:(&particle (p a y)) {return _node("PAY", expr);}
PE = expr:(&particle (p e)) {return _node("PE", expr);}
PEY = expr:(&particle (p e y)) {return _node("PEY", expr);}
PO = expr:(&particle (p o)) {return _node("PO", expr);}
POY = expr:(&particle (p o y)) {return _node("POY", expr);}
PU = expr:(&particle (p u)) {return _node("PU", expr);}
SA = expr:(&particle (s vtail)) {return _node("SA", expr);}
TA = expr:(&particle !(TAY &post_word) (t vtail) / digit) {return _node("TA", expr);}
TAY = expr:(&particle (t a y)) {return _node("TAY", expr);}
VA = expr:(&particle (v vtail)) {return _node("VA", expr);}
XA = expr:(&particle (x &a vtail)) {return _node("XA", expr);}
XE = expr:(&particle (x e)) {return _node("XE", expr);}
XEY = expr:(&particle (x e y)) {return _node("XEY", expr);}
XI = expr:(&particle (x &(i / y) vtail)) {return _node("XI", expr);}
XU = expr:(&particle (x &(u / w) vtail)) {return _node("XU", expr);}
ZA = expr:(&particle (z vtail)) {return _node("ZA", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((initial_consonant_pair / consonant)? vtail_q (consonant_cluster vtail_q)* consonant? consonant?) {return _node("foreign_word", expr);}
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(consonant? vtail_q &post_word) {return _node("particle", expr);}
root = expr:(((initial_consonant_pair vtail_q sonorant?) / ((initial_consonant_pair / consonant)? vtail_q sonorant)) &post_word) {return _node("root", expr);}

// - Vowel tails
vtail_q = expr:(vtail_q_unit vtail_q_1*) {return _node("vtail_q", expr);}
vtail_q_1 = expr:(separator vtail_q_unit) {return _node("vtail_q_1", expr);}
vtail_q_unit = expr:(yw? aeiouq (yw aeiouq)* y?) {return _node("vtail_q_unit", expr);}

vtail = expr:(vtail_unit vtail_1*) {return _node("vtail", expr);}
vtail_1 = expr:(separator vtail_unit) {return _node("vtail_1", expr);}
vtail_unit = expr:(yw? aeiou (yw aeiou)* y?) {return _node("vtail_unit", expr);}

separator = expr:(h / sonorant) {return _node("separator", expr);}
aeiouq = expr:(a / e / i / o / u / q) {return _node("aeiouq", expr);}
aeiou = expr:(a / e / i / o / u) {return _node("aeiou", expr);}
yw = expr:(y / w) {return _node("yw", expr);}

h = expr:([hH]) {return ["h", "h"];} // <LEAF>
y = expr:([yY]) {return ["y", "y"];} // <LEAF>
w = expr:([wW]) {return ["w", "w"];} // <LEAF>
a = expr:([aA]) {return ["a", "a"];} // <LEAF>
e = expr:([eE]) {return ["e", "e"];} // <LEAF>
i = expr:([iI]) {return ["i", "i"];} // <LEAF>
o = expr:([oO]) {return ["o", "o"];} // <LEAF>
u = expr:([uU]) {return ["u", "u"];} // <LEAF>
q = expr:([qQ]) {return ["q", "q"];} // <LEAF>

// - Legal consonant and consonant pairs
consonant_cluster = expr:((!(sonorant sonorant sonorant) consonant consonant? consonant? !consonant)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:(!(!affricate yw) (&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
initial = expr:((affricate / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

consonant = expr:((voiced / unvoiced / liquid / m / n)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t / k / f / x / b / d / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s / j / z)) {return _node("sibilant", expr);}
sonorant = expr:((l / n / r)) {return _node("sonorant", expr);} // technically "alveolar sonorant" as "m" is not included
voiced = expr:((b / d / g / j / v / z)) {return _node("voiced", expr);}
unvoiced = expr:((c / f / k / p / s / t / x)) {return _node("unvoiced", expr);}

l = expr:([lL] !l) {return ["l", "l"];} // <LEAF>
m = expr:([mM] !m) {return ["m", "m"];} // <LEAF>
n = expr:([nN] !n) {return ["n", "n"];} // <LEAF>
r = expr:([rR] !r) {return ["r", "r"];} // <LEAF>
b = expr:([bB] !b !unvoiced) {return ["b", "b"];} // <LEAF>
d = expr:([dD] !d !unvoiced) {return ["d", "d"];} // <LEAF>
g = expr:([gG] !g !unvoiced) {return ["g", "g"];} // <LEAF>
v = expr:([vV] !v !unvoiced) {return ["v", "v"];} // <LEAF>
j = expr:([jJ] !j !z !unvoiced) {return ["j", "j"];} // <LEAF>
z = expr:([zZ] !z !j !unvoiced) {return ["z", "z"];} // <LEAF>
s = expr:([sS] !s !c !voiced) {return ["s", "s"];} // <LEAF>
c = expr:([cC] !c !s !x !voiced) {return ["c", "c"];} // <LEAF>
x = expr:([xX] !x !c !k !voiced) {return ["x", "x"];} // <LEAF>
k = expr:([kK] !k !x !voiced) {return ["k", "k"];} // <LEAF>
f = expr:([fF] !f !voiced) {return ["f", "f"];} // <LEAF>
p = expr:([pP] !p !voiced) {return ["p", "p"];} // <LEAF>
t = expr:([tT] !t !voiced) {return ["t", "t"];} // <LEAF>

// - Spaces / Pause
post_word = expr:((pause_char &(aeiouq / sonorant) / !sonorant &consonant / spaces)) {return _node("post_word", expr);}
initial_pause = expr:((pause_char &aeiouq / !pause_char &consonant)) {return _node("initial_pause", expr);}
spaces = expr:(initial_spaces (pause_char &(aeiouq / sonorant))? / pause_char &(aeiouq / sonorant) / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ pause_char? / pause_char) !(q h q) q+ !(pause_char pause_char) (pause_char? &space_char / &(pause_char q) / pause_char / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
pause_char = expr:(([']) !pause_char) {return _node("pause_char", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
digit = expr:([.0123456789]) {return ["digit", expr];} // <LEAF2>
