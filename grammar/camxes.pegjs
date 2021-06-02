// eberban PEG grammar - v0.29
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
parser_version_long = expr:(borrowing_unit parser_version_number?) {return _node("parser_version_long", expr);}
parser_version_short = expr:(parser_version_number) {return _node("parser_version_short", expr);}
parser_version_number = expr:(spaces? (TA / BQ)+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_discursive / free_parenthetical)* paragraphs? spaces? EOF?) {return _node("text_1", expr);}

// text structure
paragraphs = expr:(paragraph (&PU_clause paragraph)*) {return _node("paragraphs", expr);}
paragraph = expr:(PU_clause? sentence (&(PA_clause / PO_clause) sentence)*) {return _node("paragraph", expr);}
sentence = expr:(function / sentence_scope / sentence_fragments) {return _node("sentence", expr);}

function = expr:(PO_clause function_name arguments_list? scope) {return _node("function", expr);}
function_name = expr:(GA_clause / unit_compound / unit_root) {return _node("function_name", expr);}
sentence_scope = expr:(PA_clause_elidible scope PAI_clause_elidible) {return _node("sentence_scope", expr);}

sentence_fragments = expr:(PA_clause_elidible fragment+ PAI_clause_elidible) {return _node("sentence_fragments", expr);}
fragment = expr:(DA_clause / FA_clause / VA_clause / SA_clause / ZA_clause) {return _node("fragment", expr);}

// scope
scope = expr:(scope_bind_connectives / scope_1) {return _node("scope", expr);}
scope_bind_connectives = expr:(scope_1 (DA_clause scope)) {return _node("scope_bind_connectives", expr);}

scope_1 = expr:(scope_plural / scope_2) {return _node("scope_1", expr);}
scope_plural = expr:(scope_2 (BA_clause scope_1)) {return _node("scope_plural", expr);}

scope_2 = expr:(sequential) {return _node("scope_2", expr);}

// bindings
sequential = expr:(sequential_neg / sequential_unit sequential?) {return _node("sequential", expr);}
sequential_neg = expr:(BI_clause sequential_unit+) {return _node("sequential_neg", expr);}
sequential_unit = expr:(unit explicit_binding?) {return _node("sequential_unit", expr);}
explicit_binding = expr:(explicit_binding_va explicit_binding_fa* VAI_clause_elidible) {return _node("explicit_binding", expr);}
explicit_binding_va = expr:(BI_clause? VA_clause scope) {return _node("explicit_binding_va", expr);}
explicit_binding_fa = expr:(BI_clause? FA_clause scope) {return _node("explicit_binding_fa", expr);}

// predicate unit
unit = expr:((SA_clause / ZA_clause)* unit_1) {return _node("unit", expr);}
unit_1 = expr:(borrowing / quote / subscope / variable / unit_root / unit_number_string / unit_compound) {return _node("unit_1", expr);}
unit_root = expr:(free_prefix* spaces? root free_post*) {return _node("unit_root", expr);}
unit_number_string = expr:(free_prefix* spaces? number_string free_post*) {return _node("unit_number_string", expr);}
unit_compound = expr:(free_prefix* spaces? compound free_post*) {return _node("unit_compound", expr);}

// borrowings
borrowing = expr:(free_prefix* (spaces? borrowing_unit)+ BE_clause_elidible free_post*) {return _node("borrowing", expr);}

// quotes
quote = expr:(grammatical_quote / one_word_quote / foreign_quote) {return _node("quote", expr);}
grammatical_quote = expr:(XA_clause text_1 XAI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(XE_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(XO_clause spaces? foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// sub-scopes
subscope = expr:(PE_clause arguments_list? function* scope PEI_clause_elidible) {return _node("subscope", expr);}
arguments_list = expr:((KA_clause / GA_clause)+ PI_clause) {return _node("arguments_list", expr);}

// string (numbers / literals)
number_string = expr:((TA_clause / BQ_clause)+ BE_clause_elidible) {return _node("number_string", expr);}

// variables
variable = expr:(MA_clause / BO_clause? KA_clause / BO_clause? GA_clause) {return _node("variable", expr);}

// free prefix
free_prefix = expr:(JE_clause / JU_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(JEI_clause / free_discursive / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_subscript = expr:(JA_clause number_string) {return _node("free_subscript", expr);}
free_discursive = expr:(JAI_clause unit) {return _node("free_discursive", expr);}
free_indicator = expr:(CA_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(JO_clause text_1 JOI_clause) {return _node("free_parenthetical", expr);}

// PARTICLES CLAUSES
BA_clause = expr:(spaces? BA) {return _node("BA_clause", expr);} // plural value builder (with)
BE_clause = expr:(spaces? BE) {return _node("BE_clause", expr);} // miscellaneous terminator
BE_clause_elidible = expr:(BE_clause?) {return (expr == "" || !expr) ? ["BE"] : _node_empty("BE_clause_elidible", expr);}
BI_clause = expr:(free_prefix* spaces? BI free_post*) {return _node("BI_clause", expr);} // wide-scope negation
BO_clause = expr:(spaces? BO) {return _node("BO_clause", expr);} // variable assignement
BU_clause = expr:(spaces? BU) {return _node("BU_clause", expr);} // parser version/dialect
BQ_clause = expr:(free_prefix* spaces? BQ) {return _node("BQ_clause", expr);} // letters
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);} // free suffix (indicator / marker)
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);} // binding logical connectives
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);} // continue explicit binding
GA_clause = expr:(free_prefix* spaces? GA free_post*) {return _node("GA_clause", expr);} // pred variables
JA_clause = expr:(free_prefix* spaces? JA) {return _node("JA_clause", expr);} // free subscript
JAI_clause = expr:(free_prefix* spaces? JAI) {return _node("JAI_clause", expr);} // free discursive (pred)
JE_clause = expr:(spaces? JE) {return _node("JE_clause", expr);} // free scope starter
JEI_clause = expr:(spaces? JEI) {return _node("JEI_clause", expr);} // free scope termiator
JO_clause = expr:(free_prefix* spaces? JO) {return _node("JO_clause", expr);} // free parenthetical started (text)
JOI_clause = expr:(free_prefix* spaces? JOI) {return _node("JOI_clause", expr);} // free parenthetical terminator
JU_clause = expr:(spaces? JU) {return _node("JU_clause", expr);} // free prefix / scope starter
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);} // individual variables
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // intrinsic variables (pronouns, ...)
PA_clause = expr:(free_prefix* spaces? PA free_post*) {return _node("PA_clause", expr);} // pred scope starter
PA_clause_elidible = expr:(PA_clause?) {return (expr == "" || !expr) ? ["PA"] : _node_empty("PA_clause_elidible", expr);}
PAI_clause = expr:(free_prefix* spaces? PAI free_post*) {return _node("PAI_clause", expr);} // pred scope terminator
PAI_clause_elidible = expr:(PAI_clause?) {return (expr == "" || !expr) ? ["PAI"] : _node_empty("PAI_clause_elidible", expr);}
PE_clause = expr:(free_prefix* spaces? PE free_post*) {return _node("PE_clause", expr);} // pred subscope starter
PEI_clause = expr:(free_prefix* spaces? PEI free_post*) {return _node("PEI_clause", expr);} // pred subscope terminator
PEI_clause_elidible = expr:(PEI_clause?) {return (expr == "" || !expr) ? ["PEI"] : _node_empty("PEI_clause_elidible", expr);}
PI_clause = expr:(free_prefix* spaces? PI free_post*) {return _node("PI_clause", expr);} // pred scope arguments terminator
PO_clause = expr:(spaces? PO) {return _node("PO_clause", expr);} // pred variable affectation
PU_clause = expr:(free_prefix* spaces? PU free_post*) {return _node("PU_clause", expr);} // paragraph marker
SA_clause = expr:(free_prefix* spaces? SA free_post*) {return _node("SA_clause", expr);} // place binding tag
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
VA_clause = expr:(free_prefix* spaces? VA free_post*) {return _node("VA_clause", expr);} // starts explicit binding clause
VAI_clause = expr:(free_prefix* spaces? VAI free_post*) {return _node("VAI_clause", expr);} // explicit binding clause terminator
VAI_clause_elidible = expr:(VAI_clause?) {return (expr == "" || !expr) ? ["VAI"] : _node_empty("VAI_clause_elidible", expr);}
XA_clause = expr:(free_prefix* spaces? XA) {return _node("XA_clause", expr);} // grammatical quote starter
XAI_clause = expr:(free_prefix* spaces? XAI free_post*) {return _node("XAI_clause", expr);} // grammatical quote terminator
XE_clause = expr:(free_prefix* spaces? XE) {return _node("XE_clause", expr);} // one word quote
XO_clause = expr:(free_prefix* spaces? XO) {return _node("XO_clause", expr);} // foreign quote
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);} // pred unit transformation

// PARTICLE FAMILIES
BA = expr:(&particle (b a)) {return _node("BA", expr);}
BE = expr:(&particle (b &e haeiou)) {return _node("BE", expr);}
BI = expr:(&particle (b i)) {return _node("BI", expr);}
BO = expr:(&particle (b o)) {return _node("BO", expr);}
BU = expr:(&particle (b u)) {return _node("BU", expr);}
BQ = expr:(&particle (consonant q / particle2 )) {return _node("BQ", expr);}
CA = expr:(&particle (c haeiou)) {return _node("CA", expr);}
DA = expr:(&particle (d aeiou)) {return _node("DA", expr);}
FA = expr:(&particle (f haeiou)) {return _node("FA", expr);}
GA = expr:(&particle (g haeiou)) {return _node("GA", expr);}
JA = expr:(&particle (j a)) {return _node("JA", expr);}
JAI = expr:(&particle (j a i)) {return _node("JAI", expr);}
JE = expr:(&particle (j e)) {return _node("JE", expr);}
JEI = expr:(&particle (j e i)) {return _node("JEI", expr);}
JO = expr:(&particle (j o)) {return _node("JO", expr);}
JOI = expr:(&particle (j o i)) {return _node("JOI", expr);}
JU = expr:(&particle (j &u haeiou)) {return _node("JU", expr);}
KA = expr:(&particle (k haeiou)) {return _node("KA", expr);}
MA = expr:(&particle (m haeiou)) {return _node("MA", expr);}
PA = expr:(&particle (p a)) {return _node("PA", expr);}
PAI = expr:(&particle (p a i)) {return _node("PAI", expr);}
PE = expr:(&particle (p e)) {return _node("PE", expr);}
PEI = expr:(&particle (p e i)) {return _node("PEI", expr);}
PI = expr:(&particle (p i)) {return _node("PI", expr);}
PO = expr:(&particle (p o)) {return _node("PO", expr);}
PU = expr:(&particle (p &u haeiou)) {return _node("PU", expr);}
SA = expr:(&particle (s haeiou)) {return _node("SA", expr);}
TA = expr:(&particle (t haeiou) / digit) {return _node("TA", expr);}
VA = expr:(&particle !(VAI &post_word) (v haeiou)) {return _node("VA", expr);}
VAI = expr:(&particle (v a i)) {return _node("VAI", expr);}
XA = expr:(&particle !(XAI &post_word) (x &a haeiou)) {return _node("XA", expr);}
XAI = expr:(&particle (x a i)) {return _node("XAI", expr);}
XE = expr:(&particle (x &e haeiou)) {return _node("XE", expr);}
XO = expr:(&particle (x &o haeiou)) {return _node("XO", expr);}
ZA = expr:(&particle (z haeiou)) {return _node("ZA", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Compounds
compound = expr:((compound_1 / compound_2 / compound_3 / compound_n) &post_word) {return _node("compound", expr);}
compound_1 = expr:(a compound_word) {return _node("compound_1", expr);}
compound_2 = expr:(e compound_word compound_word) {return _node("compound_2", expr);}
compound_3 = expr:(i compound_word compound_word compound_word) {return _node("compound_3", expr);}
compound_n = expr:(o compound_word (!compound_n_end compound_word)* compound_n_end) {return _node("compound_n", expr);}
compound_n_end = expr:(spaces? o &post_word) {return _node("compound_n_end", expr);}
compound_word = expr:(spaces? (borrowing_unit / native_word)) {return _node("compound_word", expr);}

// - Foreign words
borrowing_unit = expr:(u borrowing_content borrowing_end) {return _node("borrowing_unit", expr);}
borrowing_content = expr:(foreign_word) {return _node("borrowing_content", expr);}
borrowing_end = expr:((pause_char / space_char / EOF)) {return _node("borrowing_end", expr);}
foreign_word = expr:((initial_consonant_pair / consonant)? haeiouq (consonant_cluster haeiouq)* consonant? consonant?) {return _node("foreign_word", expr);}

// - Native words
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(!sonorant (particle1 / particle2) &post_word) {return _node("particle", expr);}
root = expr:(!sonorant (root1 / root2 / root3) &post_word) {return _node("root", expr);}

particle1 = expr:(consonant haeiouq) {return _node("particle1", expr);}
particle2 = expr:(&q haeiouq (sonorant haeiouq)*) {return _node("particle2", expr);}

root1 = expr:(consonant haeiouq (sonorant haeiouq)+ sonorant?) {return _node("root1", expr);}
root2 = expr:(consonant haeiouq sonorant) {return _node("root2", expr);}
root3 = expr:(initial_consonant_pair haeiouq (sonorant haeiouq)* sonorant?) {return _node("root3", expr);}

// - Legal clusters
haeiouq = expr:(aeiouq+ (h aeiouq+)*) {return _node("haeiouq", expr);}
haeiou = expr:(aeiou+ (h aeiou+)*) {return _node("haeiou", expr);}
aeiouq = expr:(aeiou / q !q) {return _node("aeiouq", expr);}
aeiou = expr:(a / e / i / o / u) {return _node("aeiou", expr);}

consonant_cluster = expr:((!(sonorant sonorant sonorant) consonant consonant? consonant? !consonant)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:(&initial consonant consonant !consonant) {return _node("initial_consonant_pair", expr);}
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

// Legal letters
a = expr:([aA] !a) {return ["a", "a"];} // <LEAF>
e = expr:([eE] !e) {return ["e", "e"];} // <LEAF>
i = expr:([iI] !i) {return ["i", "i"];} // <LEAF>
o = expr:([oO] !o) {return ["o", "o"];} // <LEAF>
u = expr:([uU] !u) {return ["u", "u"];} // <LEAF>
q = expr:([qQ]) {return ["q", "q"];} // <LEAF>

h = expr:([hH] !h) {return ["h", "h"];} // <LEAF>
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
post_word = expr:((pause_char &aeiouq) / !sonorant &consonant / spaces) {return _node("post_word", expr);}
spaces = expr:(initial_spaces (pause_char &aeiouq)? / pause_char &aeiouq / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ pause_char? / pause_char) !(q h q) q+ !(pause_char pause_char) (pause_char? &space_char / &(pause_char q) / pause_char / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
pause_char = expr:((['.]) !pause_char) {return _node("pause_char", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
digit = expr:([.0123456789]) {return ["digit", expr];} // <LEAF2>
