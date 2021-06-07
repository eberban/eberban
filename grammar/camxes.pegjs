// eberban PEG grammar - v0.32
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
parser_version_long = expr:(spaces? borrowing parser_version_number?) {return _node("parser_version_long", expr);}
parser_version_short = expr:(parser_version_number) {return _node("parser_version_short", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_parenthetical)* paragraphs? spaces? EOF?) {return _node("text_1", expr);}

// text structure
paragraphs = expr:(paragraph (&PU_clause paragraph)*) {return _node("paragraphs", expr);}
paragraph = expr:(PU_clause? paragraph_unit (&(PA_clause / PO_clause) paragraph_unit)*) {return _node("paragraph", expr);}
paragraph_unit = expr:(definition / sentence) {return _node("paragraph_unit", expr);}

arguments_list = expr:((KA_clause / GA_clause)* PI_clause) {return _node("arguments_list", expr);}

definition = expr:(PO_clause definition_key arguments_list? scope POI_clause_elidible) {return _node("definition", expr);}
definition_key = expr:(GA_clause / unit_compound / unit_root) {return _node("definition_key", expr);}

sentence = expr:(PA_clause_elidible arguments_list? scope PAI_clause_elidible) {return _node("sentence", expr);}

subscope = expr:(arguments_list? definition* scope) {return _node("subscope", expr);}

// scope
scope = expr:(scope_1) {return _node("scope", expr);} // allow to find only the top-level scopes when using connectives

scope_1 = expr:(scope_connectives / scope_2) {return _node("scope_1", expr);}
scope_connectives = expr:(scope_2 (DA_clause scope_2)+) {return _node("scope_connectives", expr);}

scope_2 = expr:(scope_group / scope_3) {return _node("scope_2", expr);}
scope_group = expr:(PE_clause scope_1 PEI_clause_elidible) {return _node("scope_group", expr);}

scope_3 = expr:(scope_plural / scope_4) {return _node("scope_3", expr);}
scope_plural = expr:(scope_4 (BA_clause scope_4)+) {return _node("scope_plural", expr);}

scope_4 = expr:(sequential) {return _node("scope_4", expr);}

// bindings
sequential = expr:(sequential_neg / sequential_unit sequential?) {return _node("sequential", expr);}
sequential_neg = expr:(BI_clause sequential_unit+) {return _node("sequential_neg", expr);}
sequential_unit = expr:(unit explicit_binding?) {return _node("sequential_unit", expr);}
explicit_binding = expr:(explicit_binding_va explicit_binding_fa* VAI_clause_elidible) {return _node("explicit_binding", expr);}
explicit_binding_va = expr:(BI_clause? VA_clause subscope) {return _node("explicit_binding_va", expr);}
explicit_binding_fa = expr:(BI_clause? FA_clause subscope) {return _node("explicit_binding_fa", expr);}

// predicate unit
unit = expr:((SA_clause / ZA_clause)* unit_1) {return _node("unit", expr);}
unit_1 = expr:(quote / variable / unit_borrowing / unit_root / unit_number / unit_compound) {return _node("unit_1", expr);}
unit_root = expr:(free_prefix* spaces? root free_post*) {return _node("unit_root", expr);}
unit_number = expr:(free_prefix* spaces? number free_post*) {return _node("unit_number", expr);}
unit_compound = expr:(free_prefix* spaces? compound free_post*) {return _node("unit_compound", expr);}
unit_borrowing = expr:(free_prefix* (spaces? borrowing)+ BE_clause_elidible free_post*) {return _node("unit_borrowing", expr);}

// quotes
quote = expr:(grammatical_quote / one_word_quote / foreign_quote) {return _node("quote", expr);}
grammatical_quote = expr:(LA_clause text_1 LAI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(LE_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(LO_clause spaces? foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// number
number = expr:(TA_clause+ BE_clause_elidible) {return _node("number", expr);}

// variables
variable = expr:(MA_clause / BO_clause? KA_clause / BO_clause? GA_clause) {return _node("variable", expr);}

// free prefix
free_prefix = expr:(JE_clause / JU_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(JEI_clause / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_subscript = expr:(JA_clause number) {return _node("free_subscript", expr);}
free_indicator = expr:(CA_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(JO_clause text_1 JOI_clause) {return _node("free_parenthetical", expr);}

// particle override
override = expr:(JI_clause (GA_clause / override_word)) {return _node("override", expr);}
override_word = expr:(spaces? (root / compound / &particle (m a))) {return _node("override_word", expr);}

// PARTICLES CLAUSES
BA_clause = expr:(spaces? BA) {return _node("BA_clause", expr);} // plural value builder (with)
BE_clause = expr:(spaces? BE) {return _node("BE_clause", expr);} // miscellaneous terminator
BE_clause_elidible = expr:(BE_clause? ) {return (expr == "" || !expr) ? ["BE"] : _node_empty("BE_clause_elidible", expr);}//
BI_clause = expr:(free_prefix* spaces? BI free_post*) {return _node("BI_clause", expr);} // wide-scope negation
BO_clause = expr:(spaces? BO) {return _node("BO_clause", expr);} // variable assignement
BU_clause = expr:(spaces? BU) {return _node("BU_clause", expr);} // parser version/dialect
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);} // free suffix (indicator / marker)
DA_clause = expr:(free_prefix* spaces? DA override? free_post*) {return _node("DA_clause", expr);} // logical connectives
FA_clause = expr:(free_prefix* spaces? FA override? free_post*) {return _node("FA_clause", expr);} // continue explicit binding
GA_clause = expr:(free_prefix* spaces? GA free_post*) {return _node("GA_clause", expr);} // pred variables
JA_clause = expr:(free_prefix* spaces? JA) {return _node("JA_clause", expr);} // free subscript
JE_clause = expr:(spaces? JE) {return _node("JE_clause", expr);} // free scope starter
JEI_clause = expr:(spaces? JEI) {return _node("JEI_clause", expr);} // free scope termiator
JI_clause = expr:(spaces? JI) {return _node("JI_clause", expr);} // particle override
JO_clause = expr:(free_prefix* spaces? JO) {return _node("JO_clause", expr);} // free parenthetical started (text)
JOI_clause = expr:(free_prefix* spaces? JOI) {return _node("JOI_clause", expr);} // free parenthetical terminator
JU_clause = expr:(spaces? JU) {return _node("JU_clause", expr);} // free prefix / scope starter
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);} // individual variables
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // intrinsic variables (pronouns, ...)
PA_clause = expr:(free_prefix* spaces? PA free_post*) {return _node("PA_clause", expr);} // pred scope starter
PA_clause_elidible = expr:(PA_clause? ) {return (expr == "" || !expr) ? ["PA"] : _node_empty("PA_clause_elidible", expr);}//
PAI_clause = expr:(free_prefix* spaces? PAI free_post*) {return _node("PAI_clause", expr);} // pred scope terminator
PAI_clause_elidible = expr:(PAI_clause? ) {return (expr == "" || !expr) ? ["PAI"] : _node_empty("PAI_clause_elidible", expr);}//
PE_clause = expr:(free_prefix* spaces? PE free_post*) {return _node("PE_clause", expr);} // scope grouping starter
PEI_clause = expr:(free_prefix* spaces? PEI free_post*) {return _node("PEI_clause", expr);} // scope grouping terminator
PEI_clause_elidible = expr:(PEI_clause? ) {return (expr == "" || !expr) ? ["PEI"] : _node_empty("PEI_clause_elidible", expr);}//
PI_clause = expr:(free_prefix* spaces? PI free_post*) {return _node("PI_clause", expr);} // pred scope arguments terminator
PO_clause = expr:(spaces? PO) {return _node("PO_clause", expr);} // definition starter
POI_clause = expr:(spaces? POI) {return _node("POI_clause", expr);} // definition terminator
POI_clause_elidible = expr:(POI_clause? ) {return (expr == "" || !expr) ? ["POI"] : _node_empty("POI_clause_elidible", expr);}//
PU_clause = expr:(free_prefix* spaces? PU free_post*) {return _node("PU_clause", expr);} // paragraph marker
SA_clause = expr:(free_prefix* spaces? SA override? free_post*) {return _node("SA_clause", expr);} // place binding tag
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
VA_clause = expr:(free_prefix* spaces? VA override? free_post*) {return _node("VA_clause", expr);} // starts explicit binding clause
VAI_clause = expr:(free_prefix* spaces? VAI free_post*) {return _node("VAI_clause", expr);} // explicit binding clause terminator
VAI_clause_elidible = expr:(VAI_clause? ) {return (expr == "" || !expr) ? ["VAI"] : _node_empty("VAI_clause_elidible", expr);}//
LA_clause = expr:(free_prefix* spaces? LA) {return _node("LA_clause", expr);} // grammatical quote starter
LAI_clause = expr:(free_prefix* spaces? LAI free_post*) {return _node("LAI_clause", expr);} // grammatical quote terminator
LE_clause = expr:(free_prefix* spaces? LE) {return _node("LE_clause", expr);} // one word quote
LO_clause = expr:(free_prefix* spaces? LO) {return _node("LO_clause", expr);} // foreign quote
ZA_clause = expr:(free_prefix* spaces? ZA override?) {return _node("ZA_clause", expr);} // pred unit transformation

// PARTICLE FAMILIES
BA = expr:(&particle (b a)) {return _node("BA", expr);}
BE = expr:(&particle (b &e haeiou)) {return _node("BE", expr);}
BI = expr:(&particle (b i)) {return _node("BI", expr);}
BO = expr:(&particle (b o)) {return _node("BO", expr);}
BU = expr:(&particle (b u)) {return _node("BU", expr);}
CA = expr:(&particle (c haeiou)) {return _node("CA", expr);}
DA = expr:(&particle (d aeiou)) {return _node("DA", expr);}
FA = expr:(&particle (f haeiou)) {return _node("FA", expr);}
GA = expr:(&particle (g haeiou)) {return _node("GA", expr);}
JA = expr:(&particle (j a)) {return _node("JA", expr);}
JE = expr:(&particle (j e)) {return _node("JE", expr);}
JEI = expr:(&particle (j e i)) {return _node("JEI", expr);}
JI = expr:(&particle (j i)) {return _node("JI", expr);}
JO = expr:(&particle (j o)) {return _node("JO", expr);}
JOI = expr:(&particle (j o i)) {return _node("JOI", expr);}
JU = expr:(&particle (j &u haeiou)) {return _node("JU", expr);}
KA = expr:(&particle (k haeiou)) {return _node("KA", expr);}
MA = expr:(&particle (m haeiou)) {return _node("MA", expr);}
PA = expr:(&particle !(PAI &post_word) (p &a haeiou)) {return _node("PA", expr);}
PAI = expr:(&particle (p a i)) {return _node("PAI", expr);}
PE = expr:(&particle (p e)) {return _node("PE", expr);}
PEI = expr:(&particle (p e i)) {return _node("PEI", expr);}
PI = expr:(&particle (p i)) {return _node("PI", expr);}
PO = expr:(&particle !(POI &post_word) (p &o haeiou)) {return _node("PO", expr);}
POI = expr:(&particle (p o i)) {return _node("POI", expr);}
PU = expr:(&particle (p &u haeiou)) {return _node("PU", expr);}
SA = expr:(&particle (s haeiou)) {return _node("SA", expr);}
TA = expr:(&particle (t haeiou) / digit) {return _node("TA", expr);}
VA = expr:(&particle !(VAI &post_word) (v haeiou)) {return _node("VA", expr);}
VAI = expr:(&particle (v a i)) {return _node("VAI", expr);}
LA = expr:(&particle !(LAI &post_word) (l &a haeiou)) {return _node("LA", expr);}
LAI = expr:(&particle (l a i)) {return _node("LAI", expr);}
LE = expr:(&particle (l &e haeiou)) {return _node("LE", expr);}
LO = expr:(&particle (l &o haeiou)) {return _node("LO", expr);}
ZA = expr:(&particle (z haeiou)) {return _node("ZA", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Compounds
compound = expr:((compound_2 / compound_3 / compound_4 / compound_n) &post_word) {return _node("compound", expr);}
compound_2 = expr:(e compound_word compound_word) {return _node("compound_2", expr);}
compound_3 = expr:(i compound_word compound_word compound_word) {return _node("compound_3", expr);}
compound_4 = expr:(o compound_word compound_word compound_word compound_word) {return _node("compound_4", expr);}
compound_n = expr:(a compound_word (!compound_n_end compound_word)* compound_n_end) {return _node("compound_n", expr);}
compound_n_end = expr:(spaces? a &post_word) {return _node("compound_n_end", expr);}
compound_word = expr:(spaces? (borrowing / native_word)) {return _node("compound_word", expr);}

// - Foreign words
borrowing = expr:(u (spaces &u / !u) borrowing_content borrowing_end) {return _node("borrowing", expr);}
borrowing_content = expr:(foreign_word) {return _node("borrowing_content", expr);}
borrowing_end = expr:((pause_char / space_char / EOF)) {return _node("borrowing_end", expr);}
foreign_word = expr:((initial_consonant_pair / consonant / h)? haeiou (consonant_cluster haeiou)* consonant? consonant?) {return _node("foreign_word", expr);}

// - Native words
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(!sonorant particle_1 &post_word) {return _node("particle", expr);}
root = expr:(!sonorant (root_1 / root_2 / root_3) &post_word) {return _node("root", expr);}

particle_1 = expr:(consonant haeiou) {return _node("particle_1", expr);}

root_1 = expr:(consonant haeiou (sonorant haeiou)+ sonorant?) {return _node("root_1", expr);}
root_2 = expr:(consonant haeiou sonorant) {return _node("root_2", expr);}
root_3 = expr:(initial_consonant_pair haeiou (sonorant haeiou)* sonorant?) {return _node("root_3", expr);}

// - Legal clusters
haeiou = expr:(aeiou+ (h aeiou+)*) {return _node("haeiou", expr);}
aeiou = expr:(a / e / i / o / u) {return _node("aeiou", expr);}

consonant_cluster = expr:((!(sonorant sonorant sonorant) consonant consonant? consonant? !consonant)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:(&initial consonant consonant !consonant) {return _node("initial_consonant_pair", expr);}
initial = expr:((plosib / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

plosib = expr:(plosive sibilant) {return _node("plosib", expr);}
consonant = expr:((voiced / unvoiced / liquid / m / n)) {return _node("consonant", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t / k / f / b / d / g / v / m / n !liquid)) {return _node("other", expr);}
plosive = expr:((t / d / k / g / p / b)) {return _node("plosive", expr);}
sibilant = expr:((c / s / j / z)) {return _node("sibilant", expr);}
// sonorant <- (l / n / r) # technically "alveolar sonorant" as "m" is not included
sonorant = expr:((n / r)) {return _node("sonorant", expr);}
voiced = expr:((b / d / g / j / v / z)) {return _node("voiced", expr);}
unvoiced = expr:((c / f / k / p / s / t)) {return _node("unvoiced", expr);}

// Legal letters
a = expr:([aA] !a) {return ["a", "a"];} // <LEAF>
e = expr:([eE] !e) {return ["e", "e"];} // <LEAF>
i = expr:([iI] !i) {return ["i", "i"];} // <LEAF>
o = expr:([oO] !o) {return ["o", "o"];} // <LEAF>
u = expr:([uU] !u) {return ["u", "u"];} // <LEAF>

h = expr:([hH] !h) {return ["h", "h"];} // <LEAF>
n = expr:([nN] !n) {return ["n", "n"];} // <LEAF>
r = expr:([rR] !r) {return ["r", "r"];} // <LEAF>

b = expr:([bB] !b !unvoiced) {return ["b", "b"];} // <LEAF>
d = expr:([dD] !d !unvoiced) {return ["d", "d"];} // <LEAF>
g = expr:([gG] !g !unvoiced) {return ["g", "g"];} // <LEAF>
v = expr:([vV] !v !unvoiced) {return ["v", "v"];} // <LEAF>
j = expr:([jJ] !j !z !unvoiced) {return ["j", "j"];} // <LEAF>
z = expr:([zZ] !z !j !unvoiced) {return ["z", "z"];} // <LEAF>
s = expr:([sS] !s !c !voiced) {return ["s", "s"];} // <LEAF>
c = expr:([cC] !c !s !voiced) {return ["c", "c"];} // <LEAF>
k = expr:([kK] !k !voiced) {return ["k", "k"];} // <LEAF>
f = expr:([fF] !f !voiced) {return ["f", "f"];} // <LEAF>
p = expr:([pP] !p !voiced) {return ["p", "p"];} // <LEAF>
t = expr:([tT] !t !voiced) {return ["t", "t"];} // <LEAF>
m = expr:([mM] !m) {return ["m", "m"];} // <LEAF>
l = expr:([lL] !l) {return ["l", "l"];} // <LEAF>

// - Spaces / Pause
post_word = expr:((pause_char &aeiou) / !sonorant &consonant / spaces) {return _node("post_word", expr);}
spaces = expr:(space_char+ (pause_char &aeiou)? / pause_char &aeiou / EOF) {return _node("spaces", expr);}


// - Special characters
pause_char = expr:((['.]) !pause_char) {return _node("pause_char", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}
digit = expr:([.0123456789]) {return ["digit", expr];} // <LEAF2>
EOF = expr:(!.) {return _node("EOF", expr);}
