// GRAMMAR
// main rule
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

text = expr:(free_indicator* (paragraph+ / sentence*) spaces? EOF?) {return _node("text", expr);}

// paragraphs
paragraph = expr:(DA_clause+ sentence*) {return _node("paragraph", expr);}
// a sentence is either a predicate or a fragment
sentence = expr:(predicate / fragments) {return _node("sentence", expr);}
// fragments : allow to answer questions without making a complete predicate
fragments = expr:(DE_clause (predicate_place / FA_clause)* DEI_clause_elidible) {return _node("fragments", expr);}

// predicate afterthough connectives
predicate = expr:(predicate_1 (DE_clause_elidible relation_connective predicate_1)*) {return _node("predicate", expr);}
// pre-tail terms
predicate_1 = expr:(predicate_pre / DE_clause_elidible predicate_place* DO_clause_elidible predicate_tail DEI_clause_elidible) {return _node("predicate_1", expr);}
// forethough connected predicates
predicate_pre = expr:((pre_relation_connective DE_clause predicate (pre_connective_separator predicate)+ GAI_clause_elidible)) {return _node("predicate_pre", expr);}

// predicate-tail afterthough connectives
predicate_tail = expr:(predicate_tail_1 (predicate_tail_connective DO_clause_elidible predicate_tail_1 predicate_tail_terms )*) {return _node("predicate_tail", expr);}
// predicate-tail negation
predicate_tail_1 = expr:(KA_clause* predicate_tail_2) {return _node("predicate_tail_1", expr);}
// simple predicate-tail / forethough connected tails
predicate_tail_2 = expr:(relation predicate_tail_terms / predicate_tail_pre) {return _node("predicate_tail_2", expr);}

// forethough connected tails structure
predicate_tail_pre = expr:((pre_predicate_tail_connective DO_clause_elidible predicate_tail (pre_connective_separator DO_clause_elidible predicate_tail)+ GAI_clause_elidible) predicate_tail_terms) {return _node("predicate_tail_pre", expr);}

// terms followed by predicate-tail elidible terminator
predicate_tail_terms = expr:(predicate_place* DOI_clause_elidible) {return _node("predicate_tail_terms", expr);}
// place + term
predicate_place = expr:(predicate_place_tag predicate_term) {return _node("predicate_place", expr);}
// term afterthought connectives
predicate_term = expr:(predicate_term_1 (predicate_tail_connective !DO_clause predicate_term_1)*) {return _node("predicate_term", expr);}
// simple relation term / forethough connected terms
predicate_term_1 = expr:(relation / predicate_term_pre) {return _node("predicate_term_1", expr);}

// predicate place tags connectives
predicate_place_tag = expr:(predicate_place_tag_1 (CA_clause predicate_place_tag_1)*) {return _node("predicate_place_tag", expr);}
// basic predicate place tags
predicate_place_tag_1 = expr:(DU_clause relation_3 / FA_clause) {return _node("predicate_place_tag_1", expr);}

// forethough connected term structure
predicate_term_pre = expr:((pre_predicate_tail_connective !DO_clause predicate_term (pre_connective_separator !DO_clause predicate_term)+ GAI_clause_elidible)) {return _node("predicate_term_pre", expr);}

// relation compounds
relation = expr:(relation_2+) {return _node("relation", expr);}
// relation afterthough connectives
relation_2 = expr:(relation_3 (relation_connective !DA_clause relation_3)*) {return _node("relation_2", expr);}
// basic relations
relation_3 = expr:(relation_pre / flat_lexeme / grammatical_lexeme / borrowing / grammatical_quote / one_word_quote / ungrammatical_quote / foreign_quote / abstraction / relation_place_swap / scoped_relation / MA_clause / free_prefix* spaces? (root / string) free_post*) {return _node("relation_3", expr);}

// forethough connected relations
relation_pre = expr:((pre_relation_connective !DA_clause relation (pre_connective_separator relation)+ GAI_clause_elidible)) {return _node("relation_pre", expr);}

// flat lexeme prefixes
flat_lexeme = expr:((flat_lexeme_1 / flat_lexeme_2 / flat_lexeme_3 / flat_lexeme_4 / flat_lexeme_n) free_post*) {return _node("flat_lexeme", expr);}
flat_lexeme_1 = expr:(A_clause flat_lexeme_word) {return _node("flat_lexeme_1", expr);}
flat_lexeme_2 = expr:(E_clause flat_lexeme_word flat_lexeme_word) {return _node("flat_lexeme_2", expr);}
flat_lexeme_3 = expr:(I_clause flat_lexeme_word flat_lexeme_word flat_lexeme_word) {return _node("flat_lexeme_3", expr);}
flat_lexeme_4 = expr:(O_clause flat_lexeme_word flat_lexeme_word flat_lexeme_word flat_lexeme_word) {return _node("flat_lexeme_4", expr);}
flat_lexeme_n = expr:(U_clause (!(dot? U) flat_lexeme_word)+ (dot? U)) {return _node("flat_lexeme_n", expr);}
flat_lexeme_word = expr:(initial_dot native_word) {return _node("flat_lexeme_word", expr);}

// grammatical lexeme
grammatical_lexeme = expr:(GE_clause relation GEI_clause) {return _node("grammatical_lexeme", expr);}

// borrowings
// borrowing <- ZA_clause borrowing_content dot? free_post*

borrowing = expr:(ZA_clause borrowing_content (dot !dot !y)? free_post*) {return _node("borrowing", expr);}
borrowing_content = expr:(spaces foreign_word (!spaces native_word)*) {return _node("borrowing_content", expr);}

// quotes
grammatical_quote = expr:(ZE_clause text ZEI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(ZI_clause spaces? native_word) {return _node("one_word_quote", expr);}
ungrammatical_quote = expr:(ZO_clause (!ZOI_clause spaces? native_word) ZOI_clause) {return _node("ungrammatical_quote", expr);}
foreign_quote = expr:(ZU_clause (spaces?) foreign_quote_open spaces (foreign_quote_word spaces)* foreign_quote_close free_post*) {return _node("foreign_quote", expr);}

// abstractions
abstraction = expr:(BA_clause predicate BAI_clause_elidible) {return _node("abstraction", expr);}

// relation place swap
relation_place_swap = expr:(SA_clause relation_3) {return _node("relation_place_swap", expr);}

// scoped relation
scoped_relation = expr:(GO_clause relation GOI_clause_elidible) {return _node("scoped_relation", expr);}

// string (numbers / literals)
// string <- (number_string / letter_string) TAI_clause_elidible
// number_string <- TA_clause (TA_clause / BY_clause)+
// letter_string <- BY_clause (TA_clause / BY_clause)+
string = expr:((number_string / letter_string) TAI_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BY_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BY_clause (TA_clause / BY_clause)*) {return _node("letter_string", expr);}

// afterthough connectives
predicate_tail_connective = expr:(KA_clause? SA_clause? JA_clause KAI_clause? free_post*) {return _node("predicate_tail_connective", expr);}
relation_connective = expr:(KA_clause? SA_clause? CA_clause KAI_clause? free_post*) {return _node("relation_connective", expr);}

// forethough connectives
pre_predicate_tail_connective = expr:(GA_clause SA_clause? JA_clause KAI_clause? free_post*) {return _node("pre_predicate_tail_connective", expr);}
pre_relation_connective = expr:(GA_clause SA_clause? CA_clause KAI_clause? free_post*) {return _node("pre_relation_connective", expr);}
pre_connective_separator = expr:(GI_clause KAI_clause? free_post*) {return _node("pre_connective_separator", expr);}

// free prefix
free_prefix = expr:(PA_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(PAI_clause / free_adverbial / free_indicator) {return _node("free_post", expr);}
free_adverbial = expr:(PE_clause relation PEI_clause_elidible) {return _node("free_adverbial", expr);}
free_indicator = expr:(XA_clause KAI_clause?) {return _node("free_indicator", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A) {return _node("A_clause", expr);}
XA_clause = expr:(free_prefix* spaces? XA) {return _node("XA_clause", expr);}
BA_clause = expr:(free_prefix* spaces? BA) {return _node("BA_clause", expr);}
BAI_clause = expr:(free_prefix* spaces? BAI free_post*) {return _node("BAI_clause", expr);}
BAI_clause_elidible = expr:(BAI_clause?) {return (expr == "" || !expr) ? ["BAI"] : _node_empty("BAI_clause_elidible", expr);}
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);}
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);}
DE_clause = expr:(free_prefix* spaces? DE free_post*) {return _node("DE_clause", expr);}
DE_clause_elidible = expr:(DE_clause?) {return (expr == "" || !expr) ? ["DE"] : _node_empty("DE_clause_elidible", expr);}
DEI_clause = expr:(free_prefix* spaces? DEI free_post*) {return _node("DEI_clause", expr);}
DEI_clause_elidible = expr:(DEI_clause?) {return (expr == "" || !expr) ? ["DEI"] : _node_empty("DEI_clause_elidible", expr);}
DO_clause = expr:(free_prefix* spaces? DO free_post*) {return _node("DO_clause", expr);}
DO_clause_elidible = expr:(DO_clause? ) {return (expr == "" || !expr) ? ["DO"] : _node_empty("DO_clause_elidible", expr);}
DOI_clause = expr:(free_prefix* spaces? DOI free_post*) {return _node("DOI_clause", expr);}
DOI_clause_elidible = expr:(DOI_clause?) {return (expr == "" || !expr) ? ["DOI"] : _node_empty("DOI_clause_elidible", expr);}
DU_clause = expr:(free_prefix* spaces? DU) {return _node("DU_clause", expr);}
E_clause = expr:(free_prefix* spaces? E) {return _node("E_clause", expr);}
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);}
GA_clause = expr:(free_prefix* spaces? GA) {return _node("GA_clause", expr);}
GAI_clause = expr:(free_prefix* spaces? GAI free_post*) {return _node("GAI_clause", expr);}
GAI_clause_elidible = expr:(GAI_clause?) {return (expr == "" || !expr) ? ["GAI"] : _node_empty("GAI_clause_elidible", expr);}
GE_clause = expr:(free_prefix* spaces? GE) {return _node("GE_clause", expr);}
GEI_clause = expr:(free_prefix* spaces? GEI free_post*) {return _node("GEI_clause", expr);}
GI_clause = expr:(free_prefix* spaces? GI) {return _node("GI_clause", expr);}
GO_clause = expr:(free_prefix* spaces? GO) {return _node("GO_clause", expr);}
GOI_clause = expr:(free_prefix* spaces? GOI free_post*) {return _node("GOI_clause", expr);}
GOI_clause_elidible = expr:(GOI_clause?) {return (expr == "" || !expr) ? ["GOI"] : _node_empty("GOI_clause_elidible", expr);}
I_clause = expr:(free_prefix* spaces? I) {return _node("I_clause", expr);}
JA_clause = expr:(free_prefix* spaces? JA) {return _node("JA_clause", expr);}
KA_clause = expr:(free_prefix* spaces? KA) {return _node("KA_clause", expr);}
KAI_clause = expr:(free_prefix* spaces? KAI) {return _node("KAI_clause", expr);}
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);}
O_clause = expr:(free_prefix* spaces? O) {return _node("O_clause", expr);}
PA_clause = expr:(spaces? PA free_post*) {return _node("PA_clause", expr);}
PAI_clause = expr:(spaces? PAI) {return _node("PAI_clause", expr);}
PE_clause = expr:(free_prefix* spaces? PE) {return _node("PE_clause", expr);}
PEI_clause = expr:(free_prefix* spaces? PEI) {return _node("PEI_clause", expr);}
PEI_clause_elidible = expr:(PEI_clause?) {return (expr == "" || !expr) ? ["PEI"] : _node_empty("PEI_clause_elidible", expr);}
SA_clause = expr:(free_prefix* spaces? SA) {return _node("SA_clause", expr);}
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);}
TAI_clause = expr:(free_prefix* spaces? TAI) {return _node("TAI_clause", expr);}
TAI_clause_elidible = expr:(TAI_clause?) {return (expr == "" || !expr) ? ["TAI"] : _node_empty("TAI_clause_elidible", expr);}
U_clause = expr:(free_prefix* spaces? U) {return _node("U_clause", expr);}
// VA is in FA
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);}
ZE_clause = expr:(free_prefix* spaces? ZE) {return _node("ZE_clause", expr);}
ZEI_clause = expr:(free_prefix* spaces? ZEI free_post*) {return _node("ZEI_clause", expr);}
ZI_clause = expr:(free_prefix* spaces? ZI) {return _node("ZI_clause", expr);}
ZO_clause = expr:(free_prefix* spaces? ZO) {return _node("ZO_clause", expr);}
ZOI_clause = expr:(free_prefix* spaces? ZOI free_post*) {return _node("ZOI_clause", expr);}
ZU_clause = expr:(free_prefix* spaces? ZU) {return _node("ZU_clause", expr);}

BY_clause = expr:(free_prefix* spaces? BY) {return _node("BY_clause", expr);}

// PARTICLE FAMILIES
A = expr:(&particle (a)) {return _node("A", expr);}
BY = expr:(&particle (consonant y / vowel_y h y / (i / u) y h y / vi_diphthong h y / y h a / y h e)) {return _node("BY", expr);}
XA = expr:(&particle (x vowel_tail / diphthong vowel_tail_1* / vowel vowel_tail_1+)) {return _node("XA", expr);}
BA = expr:(&particle !(BAI post_word) (b vowel_tail)) {return _node("BA", expr);}
BAI = expr:(&particle (b a i)) {return _node("BAI", expr);}
CA = expr:(&particle (c vowel)) {return _node("CA", expr);}
DA = expr:(&particle (d a)) {return _node("DA", expr);}
DE = expr:(&particle (d e)) {return _node("DE", expr);}
DEI = expr:(&particle (d e i)) {return _node("DEI", expr);}
DO = expr:(&particle (d o)) {return _node("DO", expr);}
DOI = expr:(&particle (d o i)) {return _node("DOI", expr);}
DU = expr:(&particle (d u)) {return _node("DU", expr);}
E = expr:(&particle (e)) {return _node("E", expr);}
FA = expr:(&particle (f vowel / v vowel)) {return _node("FA", expr);}
GA = expr:(&particle (g a)) {return _node("GA", expr);}
GAI = expr:(&particle (g a i)) {return _node("GAI", expr);}
GE = expr:(&particle (g e)) {return _node("GE", expr);}
GEI = expr:(&particle (g e i)) {return _node("GEI", expr);}
GI = expr:(&particle (g i)) {return _node("GI", expr);}
GO = expr:(&particle (g o)) {return _node("GO", expr);}
GOI = expr:(&particle (g o i)) {return _node("GOI", expr);}
I = expr:(&particle (i)) {return _node("I", expr);}
JA = expr:(&particle (j vowel_tail)) {return _node("JA", expr);}
KA = expr:(&particle (k a)) {return _node("KA", expr);}
KAI = expr:(&particle (k a i)) {return _node("KAI", expr);}
MA = expr:(&particle (m vowel_tail)) {return _node("MA", expr);}
O = expr:(&particle (o)) {return _node("O", expr);}
PA = expr:(&particle (p a vowel_tail_1)) {return _node("PA", expr);}
PAI = expr:(&particle (p a i)) {return _node("PAI", expr);}
PE = expr:(&particle !PA (p (diphthong / vowel))) {return _node("PE", expr);}
PEI = expr:(&particle (p e i)) {return _node("PEI", expr);}
SA = expr:(&particle (s vowel_tail)) {return _node("SA", expr);}
TA = expr:(&particle !(TAI post_word) (t vowel_tail)) {return _node("TA", expr);}
TAI = expr:(&particle (t a i)) {return _node("TAI", expr);}
U = expr:(&particle (u)) {return _node("U", expr);}
// VA is in FA
ZA = expr:(&particle (z a)) {return _node("ZA", expr);}
ZE = expr:(&particle (z e)) {return _node("ZE", expr);}
ZEI = expr:(&particle (z e i)) {return _node("ZEI", expr);}
ZI = expr:(&particle (z i)) {return _node("ZI", expr);}
ZO = expr:(&particle (z o)) {return _node("ZO", expr);}
ZOI = expr:(&particle (z o i)) {return _node("ZOI", expr);}
ZU = expr:(&particle (z u)) {return _node("ZU", expr);}


// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((initial_consonant_pair / consonant)? vowel_tail_y (consonant_cluster vowel_tail_y)* (consonant consonant / coda)?) {return _node("foreign_word", expr);}
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(!coda consonant? vowel_tail_y !coda &post_word) {return _node("particle", expr);}
root = expr:(((initial_consonant_pair vowel_tail_y) / (!coda consonant vowel_tail_y coda)) &post_word) {return _node("root", expr);}

// - Legal vowels and vowel tails
vowel_tail = expr:((diphthong / vowel) vowel_tail_1*) {return _node("vowel_tail", expr);}
vowel_tail_1 = expr:(h (vi_diphthong / vowel )) {return _node("vowel_tail_1", expr);}

vowel_tail_y = expr:((diphthong_y / vowel_y) vowel_tail_y_1*) {return _node("vowel_tail_y", expr);}
vowel_tail_y_1 = expr:(h (vi_diphthong_y / vowel_y )) {return _node("vowel_tail_y_1", expr);}

diphthong_y = expr:(iuv_diphthong_y / vi_diphthong_y) {return _node("diphthong_y", expr);}
iuv_diphthong_y = expr:((i / u) vowel_y) {return _node("iuv_diphthong_y", expr);}
vi_diphthong_y = expr:((a / e / o / y) i) {return _node("vi_diphthong_y", expr);}
vowel_y = expr:(vowel / y) {return _node("vowel_y", expr);}

diphthong = expr:(iuv_diphthong / vi_diphthong) {return _node("diphthong", expr);}
iuv_diphthong = expr:((i / u) vowel) {return _node("iuv_diphthong", expr);}
vi_diphthong = expr:((a / e / o) i) {return _node("vi_diphthong", expr);}
vowel = expr:(a / e / i / o / u) {return _node("vowel", expr);}

h = expr:(['h]) {return ["h", "h"];} // <LEAF>
a = expr:([aA]) {return ["a", "a"];} // <LEAF>
e = expr:([eE]) {return ["e", "e"];} // <LEAF>
i = expr:([iI]) {return ["i", "i"];} // <LEAF>
o = expr:([oO]) {return ["o", "o"];} // <LEAF>
u = expr:([uU]) {return ["u", "u"];} // <LEAF>
y = expr:([yY]) {return ["y", "y"];} // <LEAF>

// - Legal consonant and consonant pairs
consonant_cluster = expr:((!(coda coda coda) consonant consonant*)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:((&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
initial = expr:((affricate / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

consonant = expr:((voiced / unvoiced / liquid / m / n)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t !l / k / f / x / b / d !l / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s !x / (j / z) !n !liquid)) {return _node("sibilant", expr);}
coda = expr:((l / n / r)) {return _node("coda", expr);}
voiced = expr:((b / d / g / j / v / z)) {return _node("voiced", expr);}
unvoiced = expr:((c / f / k / p / s / t / x)) {return _node("unvoiced", expr);}
l = expr:([lL] !l) {return ["l", "l"];} // <LEAF>
m = expr:([mM] !m) {return ["m", "m"];} // <LEAF>
n = expr:([nN] !n !affricate) {return ["n", "n"];} // <LEAF>
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

post_word = expr:((dot &vowel_y / &consonant / spaces)) {return _node("post_word", expr);}
initial_dot = expr:((dot &vowel_y / !dot &consonant)) {return _node("initial_dot", expr);}
spaces = expr:(initial_spaces (dot &vowel_y)? / dot &vowel_y / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ dot? / dot) !(y h y) y+ !(dot dot) (dot? &space_char / &(dot y) / dot / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
dot = expr:('.') {return _node("dot", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
