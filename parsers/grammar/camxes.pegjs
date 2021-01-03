// eberban PEG grammar - v0.15
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
parser_version = expr:(KU_clause (!parser_version_number borrowing_content (pause_char !pause_char !q)? parser_version_number? / parser_version_number)) {return _node("parser_version", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_discursive / free_parenthetical)* (paragraph+ / sentence*) spaces? EOF?) {return _node("text_1", expr);}

// sentences
paragraph = expr:(DA_clause+ sentence*) {return _node("paragraph", expr);}
sentence = expr:(proposition) {return _node("sentence", expr);}

proposition = expr:(proposition_1 (ja proposition_1)*) {return _node("proposition", expr);}
proposition_1 = expr:(proposition_keja / DE_clause_elidible prenex? KA_clause* predicate_chaining DEY_clause_elidible) {return _node("proposition_1", expr);}
proposition_keja = expr:(keja proposition (ki proposition)+ KEY_clause_elidible) {return _node("proposition_keja", expr);}

prenex = expr:((DO_clause prenex_term)+ DOY_clause) {return _node("prenex", expr);}
prenex_term = expr:(predicate_term predicate_link*) {return _node("prenex_term", expr);}

predicate_chaining = expr:(predicate_filling (predicate_chaining_tag predicate_chaining)? / predicate_unit (predicate_chaining_tag? predicate_chaining)?) {return _node("predicate_chaining", expr);}
predicate_chaining_tag = expr:(CA_clause / predicate_chaining_import) {return _node("predicate_chaining_tag", expr);}
predicate_chaining_import = expr:(KOY_clause predicate_unit) {return _node("predicate_chaining_import", expr);}

predicate_filling = expr:(predicate_unit predicate_filled_place+) {return _node("predicate_filling", expr);}
predicate_filled_place = expr:(predicate_place_tag+ predicate_term predicate_link*) {return _node("predicate_filled_place", expr);}
predicate_link = expr:(VA_clause predicate_unit+) {return _node("predicate_link", expr);}

predicate_place_tag = expr:(FA_clause / predicate_place_import) {return _node("predicate_place_tag", expr);}
predicate_place_import = expr:(KO_clause predicate_unit) {return _node("predicate_place_import", expr);}

predicate_term = expr:(predicate_term_ja / predicate_term_1) {return _node("predicate_term", expr);}
predicate_term_ja = expr:(predicate_term_1 (ja predicate_term_1)+) {return _node("predicate_term_ja", expr);}
predicate_term_1 = expr:(predicate_term_jay / predicate_term_2) {return _node("predicate_term_1", expr);}
predicate_term_jay = expr:(predicate_term_2 (jay predicate_term_2)+) {return _node("predicate_term_jay", expr);}
predicate_term_2 = expr:(predicate_term_keja / predicate_unit+) {return _node("predicate_term_2", expr);}
predicate_term_keja = expr:(keja predicate_term (ki predicate_term)+ KEY_clause_elidible) {return _node("predicate_term_keja", expr);}

predicate_unit = expr:(SA_clause* predicate_unit_1) {return _node("predicate_unit", expr);}
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
borrowing = expr:(ZA_clause borrowing_content (pause_char / space_char / EOF) free_post*) {return _node("borrowing", expr);}
borrowing_content = expr:((spaces? !sonorant / spaces &sonorant) foreign_word) {return _node("borrowing_content", expr);}

// quotes
grammatical_quote = expr:(ZE_clause text_1 ZEY_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(ZI_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(ZU_clause (spaces?) foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// abstractions
abstraction = expr:(BA_clause proposition BAY_clause_elidible) {return _node("abstraction", expr);}

// string (numbers / literals)
string = expr:((number_string / letter_string) TAY_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BQ_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BQ_clause (TA_clause / BQ_clause)*) {return _node("letter_string", expr);}

// afterthough connectives
ja = expr:(KA_clause? SA_clause? JA_clause KAY_clause? free_post*) {return _node("ja", expr);}
jay = expr:(JAY_clause) {return _node("jay", expr);}

// forethough connectives
keja = expr:(KE_clause SA_clause? JA_clause KAY_clause? free_post*) {return _node("keja", expr);}
ki = expr:(KI_clause KAY_clause? free_post*) {return _node("ki", expr);}

// free prefix
free_prefix = expr:(PA_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(PAY_clause / free_discursive / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_discursive = expr:(PE_clause predicate_unit+) {return _node("free_discursive", expr);}
free_indicator = expr:(PI_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(PO_clause text_1 POY_clause) {return _node("free_parenthetical", expr);}
free_subscript = expr:(PU_clause string) {return _node("free_subscript", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A) {return _node("A_clause", expr);} // 1-word compound
E_clause = expr:(free_prefix* spaces? E) {return _node("E_clause", expr);} // 2-words compound
I_clause = expr:(free_prefix* spaces? I) {return _node("I_clause", expr);} // 3-words compound
O_clause = expr:(free_prefix* spaces? O) {return _node("O_clause", expr);} // 4-words compound
U_clause = expr:(free_prefix* spaces? U) {return _node("U_clause", expr);} // n-words compound starter and terminator

BA_clause = expr:(free_prefix* spaces? BA) {return _node("BA_clause", expr);} // abstractors starter
BAY_clause = expr:(free_prefix* spaces? BAY free_post*) {return _node("BAY_clause", expr);} // abstractors terminator
BAY_clause_elidible = expr:(BAY_clause?) {return (expr == "" || !expr) ? ["BAY"] : _node_empty("BAY_clause_elidible", expr);}
BQ_clause = expr:(free_prefix* spaces? BQ) {return _node("BQ_clause", expr);} // letters
CA_clause = expr:(free_prefix* spaces? CA free_post*) {return _node("CA_clause", expr);} // chaining tags
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);} // paragraph marker
DE_clause = expr:(free_prefix* spaces? DE free_post*) {return _node("DE_clause", expr);} // proposition starter
DE_clause_elidible = expr:(DE_clause?) {return (expr == "" || !expr) ? ["DE"] : _node_empty("DE_clause_elidible", expr);}
DEY_clause = expr:(free_prefix* spaces? DEY free_post*) {return _node("DEY_clause", expr);} // proposition terminator
DEY_clause_elidible = expr:(DEY_clause?) {return (expr == "" || !expr) ? ["DEY"] : _node_empty("DEY_clause_elidible", expr);}
DO_clause = expr:(free_prefix* spaces? DO free_post*) {return _node("DO_clause", expr);} // prenex starter/separator
DOY_clause = expr:(free_prefix* spaces? DOY free_post*) {return _node("DOY_clause", expr);} // prenex terminator
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);} // filling place tag
JA_clause = expr:(free_prefix* spaces? JA free_post*) {return _node("JA_clause", expr);} // logical connectives
JAY_clause = expr:(free_prefix* spaces? JAY free_post*) {return _node("JAY_clause", expr);} // set creator
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);} // pre negation
KAY_clause = expr:(free_prefix* spaces? KAY) {return _node("KAY_clause", expr);} // post negation
KE_clause = expr:(free_prefix* spaces? KE) {return _node("KE_clause", expr);} // forethought connective starter
KEY_clause = expr:(free_prefix* spaces? KEY free_post*) {return _node("KEY_clause", expr);} // forethought connective terminator
KEY_clause_elidible = expr:(KEY_clause?) {return (expr == "" || !expr) ? ["KEY"] : _node_empty("KEY_clause_elidible", expr);}
KI_clause = expr:(free_prefix* spaces? KI) {return _node("KI_clause", expr);} // forethought connective separator
KO_clause = expr:(free_prefix* spaces? KO) {return _node("KO_clause", expr);} // filling place import
KOY_clause = expr:(free_prefix* spaces? KOY) {return _node("KOY_clause", expr);} // chaining place import
KU_clause = expr:(free_prefix* spaces? KU) {return _node("KU_clause", expr);} // parser version/dialect
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // surrogate predicates (pronouns, ...)
PA_clause = expr:(spaces? PA) {return _node("PA_clause", expr);} // free scope started
PAY_clause = expr:(spaces? PAY) {return _node("PAY_clause", expr);} // free scope terminator
PE_clause = expr:(free_prefix* spaces? PE) {return _node("PE_clause", expr);} // free discursive (predicate)
PI_clause = expr:(free_prefix* spaces? PI) {return _node("PI_clause", expr);} // free indicator (marker)
PO_clause = expr:(free_prefix* spaces? PO) {return _node("PO_clause", expr);} // free parenthetical started (text)
POY_clause = expr:(free_prefix* spaces? POY) {return _node("POY_clause", expr);} // free parenthetical terminator
PU_clause = expr:(free_prefix* spaces? PU) {return _node("PU_clause", expr);} // free subscript
SA_clause = expr:(free_prefix* spaces? SA) {return _node("SA_clause", expr);} // predicate unit transformation
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
TAY_clause = expr:(free_prefix* spaces? TAY) {return _node("TAY_clause", expr);} // number / string terminator
TAY_clause_elidible = expr:(TAY_clause?) {return (expr == "" || !expr) ? ["TAY"] : _node_empty("TAY_clause_elidible", expr);}
VA_clause = expr:(free_prefix* spaces? VA) {return _node("VA_clause", expr);} // predicate link
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);} // borrowing
ZE_clause = expr:(free_prefix* spaces? ZE) {return _node("ZE_clause", expr);} // grammatical quote starter
ZEY_clause = expr:(free_prefix* spaces? ZEY free_post*) {return _node("ZEY_clause", expr);} // grammatical quote terminator
ZI_clause = expr:(free_prefix* spaces? ZI) {return _node("ZI_clause", expr);} // one word quote
ZU_clause = expr:(free_prefix* spaces? ZU) {return _node("ZU_clause", expr);} // foreign quote

// PARTICLE FAMILIES
A = expr:(&particle (a)) {return _node("A", expr);}
E = expr:(&particle (e)) {return _node("E", expr);}
I = expr:(&particle (i)) {return _node("I", expr);}
O = expr:(&particle (o)) {return _node("O", expr);}
U = expr:(&particle (u)) {return _node("U", expr);}

BA = expr:(&particle !(BAY &post_word) (b vtail)) {return _node("BA", expr);}
BAY = expr:(&particle (b a y)) {return _node("BAY", expr);}
BQ = expr:(&particle (consonant q / yw q / aeiouq h q / q h a / q h e)) {return _node("BQ", expr);}
CA = expr:(&particle (c vtail)) {return _node("CA", expr);}
DA = expr:(&particle (d a)) {return _node("DA", expr);}
DE = expr:(&particle (d e)) {return _node("DE", expr);}
DEY = expr:(&particle (d e y)) {return _node("DEY", expr);}
DO = expr:(&particle (d o)) {return _node("DO", expr);}
DOY = expr:(&particle (d o y)) {return _node("DOY", expr);}
FA = expr:(&particle (f vtail)) {return _node("FA", expr);}
JA = expr:(&particle (j aeiou)) {return _node("JA", expr);}
JAY = expr:(&particle !(JA &post_word) (j vtail)) {return _node("JAY", expr);}
KA = expr:(&particle (k a)) {return _node("KA", expr);}
KAY = expr:(&particle (k a y)) {return _node("KAY", expr);}
KE = expr:(&particle (k e)) {return _node("KE", expr);}
KEY = expr:(&particle (k e y)) {return _node("KEY", expr);}
KI = expr:(&particle (k i)) {return _node("KI", expr);}
KO = expr:(&particle (k o)) {return _node("KO", expr);}
KOY = expr:(&particle (k o y)) {return _node("KOY", expr);}
KU = expr:(&particle (k u)) {return _node("KU", expr);}
MA = expr:(&particle (m vtail)) {return _node("MA", expr);}
PA = expr:(&particle (p a vtail_1?)) {return _node("PA", expr);}
PAY = expr:(&particle (p a y)) {return _node("PAY", expr);}
PE = expr:(&particle (p &e vtail)) {return _node("PE", expr);}
PI = expr:(&particle (p &(i / y) vtail)) {return _node("PI", expr);}
PO = expr:(&particle (p o)) {return _node("PO", expr);}
POY = expr:(&particle (p o y)) {return _node("POY", expr);}
PU = expr:(&particle (p u)) {return _node("PU", expr);}
SA = expr:(&particle (s vtail)) {return _node("SA", expr);}
TA = expr:(&particle !(TAY &post_word) (t vtail) / digit) {return _node("TA", expr);}
TAY = expr:(&particle (t a y)) {return _node("TAY", expr);}
VA = expr:(&particle (v vtail)) {return _node("VA", expr);}
ZA = expr:(&particle (z &a vtail)) {return _node("ZA", expr);}
ZE = expr:(&particle (z e)) {return _node("ZE", expr);}
ZEY = expr:(&particle (z e y)) {return _node("ZEY", expr);}
ZI = expr:(&particle (z &(i / y) vtail)) {return _node("ZI", expr);}
ZU = expr:(&particle (z &(u / w) vtail)) {return _node("ZU", expr);}

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
