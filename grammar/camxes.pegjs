// eberban PEG grammar - v0.24
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
parser_version = expr:(BU_clause (parser_version_short / parser_version_long)) {return _node("parser_version", expr);}
parser_version_long = expr:(borrowing_part parser_version_number?) {return _node("parser_version_long", expr);}
parser_version_short = expr:(parser_version_number) {return _node("parser_version_short", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_discursive / free_parenthetical)* paragraphs? spaces? EOF?) {return _node("text_1", expr);}

// text structure
paragraphs = expr:(paragraph (&PU_clause paragraph)*) {return _node("paragraphs", expr);}
paragraph = expr:(PU_clause? sentence (&(PA_clause / PO_clause) sentence)*) {return _node("paragraph", expr);}
sentence = expr:(pred_var_declaration / scope / fragments_sentence) {return _node("sentence", expr);}
fragments_sentence = expr:(PA_clause_elidible fragment+ PAY_clause_elidible) {return _node("fragments_sentence", expr);}
fragment = expr:(DA_clause / FA_clause / VA_clause / SA_clause / ZA_clause) {return _node("fragment", expr);}
pred_var_declaration = expr:(PO_clause GAY_clause scope) {return _node("pred_var_declaration", expr);}

// pred scopes
scope = expr:(scope_1 (DA_clause scope_1)*) {return _node("scope", expr);}
scope_1 = expr:(PA_clause_elidible scope_2 PAY_clause_elidible) {return _node("scope_1", expr);}
scope_2 = expr:(sequential (DAY_clause sequential)*) {return _node("scope_2", expr);}

// sequential chaining
sequential = expr:(unit parallel (VA_clause sequential)? / unit (VA_clause? sequential)?) {return _node("sequential", expr);}

// parallel chaining
parallel = expr:(parallel_item+ BE_clause_elidible) {return _node("parallel", expr);}
parallel_item = expr:(FA_clause parallel_term) {return _node("parallel_item", expr);}

parallel_term = expr:(parallel_term_connective / parallel_term_1) {return _node("parallel_term", expr);}
parallel_term_connective = expr:(parallel_term_1 (DA_clause parallel_term_1)+) {return _node("parallel_term_connective", expr);}
parallel_term_1 = expr:(parallel_term_set / parallel_term_2) {return _node("parallel_term_1", expr);}
parallel_term_set = expr:(parallel_term_2 (DAY_clause parallel_term_2)+ BE_clause_elidible) {return _node("parallel_term_set", expr);}
parallel_term_2 = expr:(unit+) {return _node("parallel_term_2", expr);}

// predicate unit
unit = expr:((SA_clause / ZA_clause)* unit_1) {return _node("unit", expr);}
unit_1 = expr:(compound / borrowing / quote / subscope / variable / free_prefix* spaces? (root / string) free_post*) {return _node("unit_1", expr);}

// compounds
compound = expr:(free_prefix* spaces? (compound_1 / compound_2 / compound_3 / compound_n) &post_word free_post*) {return _node("compound", expr);}
compound_1 = expr:(a compound_word_1) {return _node("compound_1", expr);}
compound_2 = expr:(e compound_word_1 compound_word_n) {return _node("compound_2", expr);}
compound_3 = expr:(i compound_word_1 compound_word_n compound_word_n) {return _node("compound_3", expr);}
compound_n = expr:(o compound_word_1 (!compound_n_end compound_word_n)* compound_n_end) {return _node("compound_n", expr);}
compound_n_end = expr:(spaces? o &post_word) {return _node("compound_n_end", expr);}
compound_word_1 = expr:(y spaces? compound_word_foreign / !u compound_word_n) {return _node("compound_word_1", expr);}
compound_word_n = expr:(spaces? ((w &aeiouq / u) compound_word_foreign / native_word)) {return _node("compound_word_n", expr);}
compound_word_foreign = expr:(foreign_word (pause_char / space_char / EOF)) {return _node("compound_word_foreign", expr);}

// borrowings
borrowing = expr:(free_prefix* borrowing_part+ BE_clause_elidible free_post*) {return _node("borrowing", expr);}
borrowing_part = expr:(spaces? borrowing_prefix borrowing_content borrowing_end) {return _node("borrowing_part", expr);}
borrowing_prefix = expr:((w &aeiouq / u)) {return _node("borrowing_prefix", expr);}
borrowing_content = expr:(foreign_word) {return _node("borrowing_content", expr);}
borrowing_end = expr:((pause_char / space_char / EOF)) {return _node("borrowing_end", expr);}

// quotes
quote = expr:(grammatical_quote / one_word_quote / foreign_quote) {return _node("quote", expr);}
grammatical_quote = expr:(XA_clause text_1 XAY_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(XE_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(XO_clause spaces? foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// sub-scopes
subscope = expr:(PE_clause subscope_arguments? pred_var_declaration* scope PEY_clause_elidible) {return _node("subscope", expr);}
subscope_arguments = expr:((KAY_clause / GAY_clause)+ PI_clause) {return _node("subscope_arguments", expr);}

// string (numbers / literals)
string = expr:((number_string / letter_string) BE_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BQ_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BQ_clause (TA_clause / BQ_clause)*) {return _node("letter_string", expr);}

// variables
variable = expr:(variable_intrinsic / variable_individual / variable_pred) {return _node("variable", expr);}
variable_intrinsic = expr:(MA_clause) {return _node("variable_intrinsic", expr);}
variable_individual = expr:(KAY_clause / KA_clause) {return _node("variable_individual", expr);}
variable_pred = expr:(GAY_clause / GA_clause) {return _node("variable_pred", expr);}

// free prefix
free_prefix = expr:(JU_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(JUY_clause / free_discursive / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_subscript = expr:(JA_clause string) {return _node("free_subscript", expr);}
free_discursive = expr:(JE_clause unit+) {return _node("free_discursive", expr);}
free_indicator = expr:(CA_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(JO_clause text_1 JOY_clause) {return _node("free_parenthetical", expr);}

// PARTICLES CLAUSES
BE_clause = expr:(spaces? BE) {return _node("BE_clause", expr);} // miscellaneous terminator
BE_clause_elidible = expr:(BE_clause?) {return (expr == "" || !expr) ? ["BE"] : _node_empty("BE_clause_elidible", expr);}
BQ_clause = expr:(free_prefix* spaces? BQ) {return _node("BQ_clause", expr);} // letters
BU_clause = expr:(spaces? BU) {return _node("BU_clause", expr);} // parser version/dialect
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);} // free suffix (indicator / marker)
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);} // logical connectives
DAY_clause = expr:(free_prefix* spaces? DAY free_post*) {return _node("DAY_clause", expr);} // set creator
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);} // filling place tag
GA_clause = expr:(free_prefix* spaces? GA free_post*) {return _node("GA_clause", expr);} // use pred variables
GAY_clause = expr:(free_prefix* spaces? GAY free_post*) {return _node("GAY_clause", expr);} // new pred variables
JA_clause = expr:(free_prefix* spaces? JA) {return _node("JA_clause", expr);} // free subscript
JE_clause = expr:(free_prefix* spaces? JE) {return _node("JE_clause", expr);} // free discursive (pred)
JO_clause = expr:(free_prefix* spaces? JO) {return _node("JO_clause", expr);} // free parenthetical started (text)
JOY_clause = expr:(free_prefix* spaces? JOY) {return _node("JOY_clause", expr);} // free parenthetical terminator
JU_clause = expr:(spaces? JU) {return _node("JU_clause", expr);} // free prefix / scope starter
JUY_clause = expr:(spaces? JUY) {return _node("JUY_clause", expr);} // free scope terminator
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);} // use individual variables
KAY_clause = expr:(free_prefix* spaces? KAY free_post*) {return _node("KAY_clause", expr);} // new individual variables
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // intrinsic variables (pronouns, ...)
PA_clause = expr:(free_prefix* spaces? PA free_post*) {return _node("PA_clause", expr);} // pred scope starter
PA_clause_elidible = expr:(PA_clause?) {return (expr == "" || !expr) ? ["PA"] : _node_empty("PA_clause_elidible", expr);}
PAY_clause = expr:(free_prefix* spaces? PAY free_post*) {return _node("PAY_clause", expr);} // pred scope terminator
PAY_clause_elidible = expr:(PAY_clause?) {return (expr == "" || !expr) ? ["PAY"] : _node_empty("PAY_clause_elidible", expr);}
PE_clause = expr:(free_prefix* spaces? PE free_post*) {return _node("PE_clause", expr);} // pred subscope starter
PEY_clause = expr:(free_prefix* spaces? PEY free_post*) {return _node("PEY_clause", expr);} // pred subscope terminator
PEY_clause_elidible = expr:(PEY_clause?) {return (expr == "" || !expr) ? ["PEY"] : _node_empty("PEY_clause_elidible", expr);}
PI_clause = expr:(free_prefix* spaces? PI free_post*) {return _node("PI_clause", expr);} // pred scope arguments terminator
PO_clause = expr:(spaces? PO) {return _node("PO_clause", expr);} // pred variable affectation
PU_clause = expr:(free_prefix* spaces? PU free_post*) {return _node("PU_clause", expr);} // paragraph marker
SA_clause = expr:(free_prefix* spaces? SA free_post*) {return _node("SA_clause", expr);} // place binding tag
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
VA_clause = expr:(free_prefix* spaces? VA free_post*) {return _node("VA_clause", expr);} // chaining tags
XA_clause = expr:(free_prefix* spaces? XA) {return _node("XA_clause", expr);} // grammatical quote starter
XAY_clause = expr:(free_prefix* spaces? XAY free_post*) {return _node("XAY_clause", expr);} // grammatical quote terminator
XE_clause = expr:(free_prefix* spaces? XE) {return _node("XE_clause", expr);} // one word quote
XO_clause = expr:(free_prefix* spaces? XO) {return _node("XO_clause", expr);} // foreign quote
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);} // pred unit transformation

// PARTICLE FAMILIES
BE = expr:(&particle (b &e vtail)) {return _node("BE", expr);}
BQ = expr:(&particle (consonant q / yw q / aeiouq h q / q h a / q h e)) {return _node("BQ", expr);}
BU = expr:(&particle (b u)) {return _node("BU", expr);}
CA = expr:(&particle (c vtail)) {return _node("CA", expr);}
DA = expr:(&particle !(DAY &post_word) (d vtail)) {return _node("DA", expr);}
DAY = expr:(&particle (d aeiou y)) {return _node("DAY", expr);}
FA = expr:(&particle (f vtail)) {return _node("FA", expr);}
GA = expr:(&particle (g !y_terminated vtail)) {return _node("GA", expr);}
GAY = expr:(&particle (g &y_terminated vtail)) {return _node("GAY", expr);}
JA = expr:(&particle (j a)) {return _node("JA", expr);}
JE = expr:(&particle (j &e vtail)) {return _node("JE", expr);}
JO = expr:(&particle (j o)) {return _node("JO", expr);}
JOY = expr:(&particle (j o y)) {return _node("JOY", expr);}
JU = expr:(&particle !(JUY &post_word) (j &(u / w) vtail)) {return _node("JU", expr);}
JUY = expr:(&particle (j u y)) {return _node("JUY", expr);}
KA = expr:(&particle (k !y_terminated vtail)) {return _node("KA", expr);}
KAY = expr:(&particle (k &y_terminated vtail)) {return _node("KAY", expr);}
MA = expr:(&particle (m vtail)) {return _node("MA", expr);}
PA = expr:(&particle (p a)) {return _node("PA", expr);}
PAY = expr:(&particle (p a y)) {return _node("PAY", expr);}
PE = expr:(&particle (p e)) {return _node("PE", expr);}
PEY = expr:(&particle (p e y)) {return _node("PEY", expr);}
PI = expr:(&particle (p i)) {return _node("PI", expr);}
PO = expr:(&particle (p o)) {return _node("PO", expr);}
PU = expr:(&particle (p &(u / w) vtail)) {return _node("PU", expr);}
SA = expr:(&particle (s vtail)) {return _node("SA", expr);}
TA = expr:(&particle (t vtail) / digit) {return _node("TA", expr);}
VA = expr:(&particle (v vtail)) {return _node("VA", expr);}
XA = expr:(&particle !(XAY &post_word) (x &a vtail)) {return _node("XA", expr);}
XAY = expr:(&particle (x a y)) {return _node("XAY", expr);}
XE = expr:(&particle (x &e vtail)) {return _node("XE", expr);}
XO = expr:(&particle (x &o vtail)) {return _node("XO", expr);}
ZA = expr:(&particle (z vtail)) {return _node("ZA", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((initial_consonant_pair / consonant)? vtail_q (consonant_cluster vtail_q)* consonant? consonant?) {return _node("foreign_word", expr);}
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(consonant vtail_q &post_word) {return _node("particle", expr);}
root = expr:(((initial_consonant_pair vtail_q sonorant?) / ((initial_consonant_pair / consonant)? vtail_q sonorant)) &post_word) {return _node("root", expr);}

// - Vowel tails
vtail_q = expr:(vtail_q_unit vtail_q_1*) {return _node("vtail_q", expr);}
vtail_q_1 = expr:(separator vtail_q_unit) {return _node("vtail_q_1", expr);}
vtail_q_unit = expr:(yw? aeiouq (yw aeiouq)* y?) {return _node("vtail_q_unit", expr);}

vtail = expr:(vtail_unit vtail_1*) {return _node("vtail", expr);}
vtail_1 = expr:(separator vtail_unit) {return _node("vtail_1", expr);}
vtail_unit = expr:(yw? aeiou (yw aeiou)* y?) {return _node("vtail_unit", expr);}
y_terminated = expr:((aeiou / w / separator / y !post_word)+ y) {return _node("y_terminated", expr);}

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
initial_consonant_pair = expr:(!(!plosib consonant consonant yw) (&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
initial = expr:((plosib / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

plosib = expr:(plosive sibilant) {return _node("plosib", expr);}
consonant = expr:((voiced / unvoiced / liquid / m / n)) {return _node("consonant", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t / k / f / x / b / d / g / v / m / n !liquid)) {return _node("other", expr);}
plosive = expr:((t / d / k / g / p / b)) {return _node("plosive", expr);}
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
x = expr:([xX] !x !c !k !voiced !liquid) {return ["x", "x"];} // <LEAF>
k = expr:([kK] !k !x !voiced) {return ["k", "k"];} // <LEAF>
f = expr:([fF] !f !voiced) {return ["f", "f"];} // <LEAF>
p = expr:([pP] !p !voiced) {return ["p", "p"];} // <LEAF>
t = expr:([tT] !t !voiced) {return ["t", "t"];} // <LEAF>

// - Spaces / Pause
post_word = expr:((pause_char &(aeiouq / yw / sonorant) / !sonorant &consonant / spaces)) {return _node("post_word", expr);}
initial_pause = expr:((pause_char &(aeiouq / sonorant) / !pause_char !sonorant &consonant)) {return _node("initial_pause", expr);}
spaces = expr:(initial_spaces (pause_char &(aeiouq / yw / sonorant))? / pause_char &(aeiouq / yw / sonorant) / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ pause_char? / pause_char) !(q h q) q+ !(pause_char pause_char) (pause_char? &space_char / &(pause_char q) / pause_char / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
pause_char = expr:((['.]) !pause_char) {return _node("pause_char", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
digit = expr:([.0123456789]) {return ["digit", expr];} // <LEAF2>
