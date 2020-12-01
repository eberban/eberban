// eberban PEG grammar - v0.12
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
parser_version = expr:(DI_clause (!parser_version_number borrowing_content (pause_char !pause_char !y)? parser_version_number? / parser_version_number)) {return _node("parser_version", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}
// main text rule
text_1 = expr:((free_indicator / free_predicate / free_parenthetical)* (paragraph+ / sentence*) spaces? EOF?) {return _node("text_1", expr);}

// paragraphs
paragraph = expr:(DA_clause+ sentence*) {return _node("paragraph", expr);}
// a sentence is either a proposition or a fragment
sentence = expr:(proposition / fragments) {return _node("sentence", expr);}
// fragments : allow to answer questions without making a complete proposition
fragments = expr:(DE_clause (proposition_place / FA_clause)* DEI_clause_elidible) {return _node("fragments", expr);}

// proposition afterthough connectives
proposition = expr:(proposition_jak_post / proposition_1) {return _node("proposition", expr);}
proposition_jak_post = expr:(proposition_1 (jak !DO_clause DE_clause_elidible proposition_1)+) {return _node("proposition_jak_post", expr);}
// pre-tail terms
proposition_1 = expr:(proposition_jak_pre / DE_clause_elidible proposition_1_terms DO_clause_elidible proposition_tail DEI_clause_elidible) {return _node("proposition_1", expr);}
proposition_1_terms = expr:(proposition_place*) {return _node("proposition_1_terms", expr);}
// forethough connected propositions
proposition_jak_pre = expr:((gajak !DO_clause DE_clause_elidible proposition (gik proposition)+ NAI_clause_elidible)) {return _node("proposition_jak_pre", expr);}

// main proposition tail rule
proposition_tail = expr:(proposition_tail_jak_post / proposition_tail_1) {return _node("proposition_tail", expr);}
// proposition-tail afterthough connectives
proposition_tail_jak_post = expr:(proposition_tail_1 (jak !DE_clause DO_clause_elidible proposition_tail_1 proposition_tail_jak_post_terms)+) {return _node("proposition_tail_jak_post", expr);}
proposition_tail_jak_post_terms = expr:(proposition_tail_terms) {return _node("proposition_tail_jak_post_terms", expr);}
// proposition-tail negation
proposition_tail_1 = expr:(KA_clause* proposition_tail_2) {return _node("proposition_tail_1", expr);}
// simple proposition-tail / forethough connected tails
proposition_tail_2 = expr:(predicate proposition_tail_terms / proposition_tail_jak_pre) {return _node("proposition_tail_2", expr);}
// forethough connected tails structure
proposition_tail_jak_pre = expr:((gajak !DE_clause DO_clause_elidible proposition_tail (gik DO_clause_elidible proposition_tail)+ NAI_clause_elidible) proposition_tail_jak_pre_terms) {return _node("proposition_tail_jak_pre", expr);}
proposition_tail_jak_pre_terms = expr:(proposition_tail_terms) {return _node("proposition_tail_jak_pre_terms", expr);}

// terms followed by proposition-tail elidible terminator
proposition_tail_terms = expr:(proposition_place* DOI_clause_elidible) {return _node("proposition_tail_terms", expr);}
// place + term
proposition_place = expr:(proposition_place_tag proposition_term) {return _node("proposition_place", expr);}

// proposition term connectives
proposition_term = expr:(proposition_term_jak_post / proposition_term_1) {return _node("proposition_term", expr);}
proposition_term_jak_post = expr:(proposition_term_1 (jak !DE_clause !DO_clause proposition_term_1)+) {return _node("proposition_term_jak_post", expr);}
proposition_term_1 = expr:(proposition_term_jaik_post / proposition_term_2) {return _node("proposition_term_1", expr);}
proposition_term_jaik_post = expr:(proposition_term_2 (jaik !DE_clause !DO_clause proposition_term_2)+) {return _node("proposition_term_jaik_post", expr);}
// simple predicate term / forethough connected terms
proposition_term_2 = expr:(proposition_term_jak_pre / proposition_term_group / predicate) {return _node("proposition_term_2", expr);}
// forethough connected term structure
proposition_term_jak_pre = expr:((gajak !DA_clause !DO_clause proposition_term (gik !DO_clause proposition_term)+ NAI_clause_elidible)) {return _node("proposition_term_jak_pre", expr);}
// proposition term group
proposition_term_group = expr:(NO_clause proposition_term NOI_clause_elidible) {return _node("proposition_term_group", expr);}

// proposition place tags connectives
proposition_place_tag = expr:(proposition_place_tag_jak_post / proposition_place_tag_1) {return _node("proposition_place_tag", expr);}
proposition_place_tag_jak_post = expr:(proposition_place_tag_1+) {return _node("proposition_place_tag_jak_post", expr);}
// proposition_place_tag_jak_post <- proposition_place_tag_1 (JA_clause proposition_place_tag_1)+

// basic proposition place tags
proposition_place_tag_1 = expr:(proposition_place_modal / FA_clause) {return _node("proposition_place_tag_1", expr);}
// proposition place modal
proposition_place_modal = expr:(DU_clause predicate_2) {return _node("proposition_place_modal", expr);}

// predicate chains, followed by links
predicate = expr:(predicate_1 predicate_link*) {return _node("predicate", expr);}
predicate_link = expr:(VA_clause predicate VAI_clause_elidible) {return _node("predicate_link", expr);}
// predicate afterthough connectives
predicate_1 = expr:((predicate_cak_post / predicate_2) predicate_1?) {return _node("predicate_1", expr);}
predicate_cak_post = expr:(predicate_2 (cak !DE_clause !DA_clause predicate_1)) {return _node("predicate_cak_post", expr);}
// core predicates
predicate_2 = expr:(predicate_cak_pre / compound free_post* / borrowing / grammatical_quote / one_word_quote / foreign_quote / abstraction / predicate_pre_transform / predicate_group / MA_clause / free_prefix* spaces? (root / string) free_post*) {return _node("predicate_2", expr);}
// forethough connected predicates
predicate_cak_pre = expr:((gacak !DE_clause !DA_clause predicate (gik predicate)+ NAI_clause_elidible)) {return _node("predicate_cak_pre", expr);}

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
borrowing_content = expr:((spaces? !coda / spaces &coda) foreign_word) {return _node("borrowing_content", expr);}

// quotes
grammatical_quote = expr:(ZE_clause text_1 ZEI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(ZI_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(ZU_clause (spaces?) foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// abstractions
abstraction = expr:(BA_clause proposition BAI_clause_elidible) {return _node("abstraction", expr);}

// predicate place swap
predicate_pre_transform = expr:(SA_clause predicate_2) {return _node("predicate_pre_transform", expr);}

// predicate group
predicate_group = expr:(NO_clause predicate NOI_clause_elidible) {return _node("predicate_group", expr);}

// string (numbers / literals)
string = expr:((number_string / letter_string) TAI_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BY_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BY_clause (TA_clause / BY_clause)*) {return _node("letter_string", expr);}

// afterthough connectives
jak = expr:(KA_clause? SA_clause? JA_clause KAI_clause? free_post*) {return _node("jak", expr);}
jaik = expr:(JAI_clause) {return _node("jaik", expr);}
cak = expr:(KA_clause? SA_clause? CA_clause KAI_clause? free_post*) {return _node("cak", expr);}

// forethough connectives
gajak = expr:(NA_clause SA_clause? JA_clause KAI_clause? free_post*) {return _node("gajak", expr);}
gacak = expr:(NA_clause SA_clause? CA_clause KAI_clause? free_post*) {return _node("gacak", expr);}
gik = expr:(NI_clause KAI_clause? free_post*) {return _node("gik", expr);}

// free prefix
free_prefix = expr:(LA_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(LAI_clause / free_indicator / free_predicate / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_indicator = expr:(XA_clause KAI_clause?) {return _node("free_indicator", expr);}
free_predicate = expr:(LE_clause predicate_2) {return _node("free_predicate", expr);}
free_parenthetical = expr:(LO_clause text_1 LOI_clause) {return _node("free_parenthetical", expr);}
free_subscript = expr:(LU_clause string) {return _node("free_subscript", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A) {return _node("A_clause", expr);}
BA_clause = expr:(free_prefix* spaces? BA) {return _node("BA_clause", expr);}
BAI_clause = expr:(free_prefix* spaces? BAI free_post*) {return _node("BAI_clause", expr);}
BAI_clause_elidible = expr:(BAI_clause?) {return (expr == "" || !expr) ? ["BAI"] : _node_empty("BAI_clause_elidible", expr);}
BY_clause = expr:(free_prefix* spaces? BY) {return _node("BY_clause", expr);}
CA_clause = expr:(free_prefix* spaces? CA free_post*) {return _node("CA_clause", expr);}
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);}
DE_clause = expr:(free_prefix* spaces? DE free_post*) {return _node("DE_clause", expr);}
DE_clause_elidible = expr:(DE_clause?) {return (expr == "" || !expr) ? ["DE"] : _node_empty("DE_clause_elidible", expr);}
DEI_clause = expr:(free_prefix* spaces? DEI free_post*) {return _node("DEI_clause", expr);}
DEI_clause_elidible = expr:(DEI_clause?) {return (expr == "" || !expr) ? ["DEI"] : _node_empty("DEI_clause_elidible", expr);}
DI_clause = expr:(spaces? DI) {return _node("DI_clause", expr);}
DO_clause = expr:(free_prefix* spaces? DO free_post*) {return _node("DO_clause", expr);}
DO_clause_elidible = expr:(DO_clause? ) {return (expr == "" || !expr) ? ["DO"] : _node_empty("DO_clause_elidible", expr);}
DOI_clause = expr:(free_prefix* spaces? DOI free_post*) {return _node("DOI_clause", expr);}
DOI_clause_elidible = expr:(DOI_clause?) {return (expr == "" || !expr) ? ["DOI"] : _node_empty("DOI_clause_elidible", expr);}
DU_clause = expr:(free_prefix* spaces? DU) {return _node("DU_clause", expr);}
E_clause = expr:(free_prefix* spaces? E) {return _node("E_clause", expr);}
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);}
I_clause = expr:(free_prefix* spaces? I) {return _node("I_clause", expr);}
JA_clause = expr:(free_prefix* spaces? JA free_post*) {return _node("JA_clause", expr);}
JAI_clause = expr:(free_prefix* spaces? JAI free_post*) {return _node("JAI_clause", expr);}
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);}
KAI_clause = expr:(free_prefix* spaces? KAI) {return _node("KAI_clause", expr);}
LA_clause = expr:(spaces? LA free_post*) {return _node("LA_clause", expr);}
LAI_clause = expr:(spaces? LAI) {return _node("LAI_clause", expr);}
LE_clause = expr:(free_prefix* spaces? LE) {return _node("LE_clause", expr);}
LO_clause = expr:(free_prefix* spaces? LO) {return _node("LO_clause", expr);}
LOI_clause = expr:(free_prefix* spaces? LOI) {return _node("LOI_clause", expr);}
LU_clause = expr:(free_prefix* spaces? LU) {return _node("LU_clause", expr);}
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);}
NA_clause = expr:(free_prefix* spaces? NA) {return _node("NA_clause", expr);}
NAI_clause = expr:(free_prefix* spaces? NAI free_post*) {return _node("NAI_clause", expr);}
NAI_clause_elidible = expr:(NAI_clause?) {return (expr == "" || !expr) ? ["NAI"] : _node_empty("NAI_clause_elidible", expr);}
NI_clause = expr:(free_prefix* spaces? NI) {return _node("NI_clause", expr);}
NO_clause = expr:(free_prefix* spaces? NO) {return _node("NO_clause", expr);}
NOI_clause = expr:(free_prefix* spaces? NOI free_post*) {return _node("NOI_clause", expr);}
NOI_clause_elidible = expr:(NOI_clause?) {return (expr == "" || !expr) ? ["NOI"] : _node_empty("NOI_clause_elidible", expr);}
O_clause = expr:(free_prefix* spaces? O) {return _node("O_clause", expr);}
SA_clause = expr:(free_prefix* spaces? SA) {return _node("SA_clause", expr);}
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);}
TAI_clause = expr:(free_prefix* spaces? TAI) {return _node("TAI_clause", expr);}
TAI_clause_elidible = expr:(TAI_clause?) {return (expr == "" || !expr) ? ["TAI"] : _node_empty("TAI_clause_elidible", expr);}
U_clause = expr:(free_prefix* spaces? U) {return _node("U_clause", expr);}
VA_clause = expr:(free_prefix* spaces? VA) {return _node("VA_clause", expr);}
VAI_clause = expr:(free_prefix* spaces? VAI) {return _node("VAI_clause", expr);}
VAI_clause_elidible = expr:(VAI_clause?) {return (expr == "" || !expr) ? ["VAI"] : _node_empty("VAI_clause_elidible", expr);}
XA_clause = expr:(free_prefix* spaces? XA) {return _node("XA_clause", expr);}
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);}
ZE_clause = expr:(free_prefix* spaces? ZE) {return _node("ZE_clause", expr);}
ZEI_clause = expr:(free_prefix* spaces? ZEI free_post*) {return _node("ZEI_clause", expr);}
ZI_clause = expr:(free_prefix* spaces? ZI) {return _node("ZI_clause", expr);}
ZU_clause = expr:(free_prefix* spaces? ZU) {return _node("ZU_clause", expr);}

// PARTICLE FAMILIES
A = expr:(&particle (a)) {return _node("A", expr);}
BA = expr:(&particle !(BAI post_word) (b vowel_tail)) {return _node("BA", expr);}
BAI = expr:(&particle (b a i)) {return _node("BAI", expr);}
BY = expr:(&particle (consonant y / vowel_y h y / (i / u) (y / n y) / y h a / y h e)) {return _node("BY", expr);}
CA = expr:(&particle (c vowel_tail)) {return _node("CA", expr);}
DA = expr:(&particle (d a)) {return _node("DA", expr);}
DE = expr:(&particle (d e)) {return _node("DE", expr);}
DEI = expr:(&particle (d e i)) {return _node("DEI", expr);}
DI = expr:(&particle (d i)) {return _node("DI", expr);}
DO = expr:(&particle (d o)) {return _node("DO", expr);}
DOI = expr:(&particle (d o i)) {return _node("DOI", expr);}
DU = expr:(&particle (d u)) {return _node("DU", expr);}
E = expr:(&particle (e)) {return _node("E", expr);}
FA = expr:(&particle (f vowel_tail)) {return _node("FA", expr);}
I = expr:(&particle (i)) {return _node("I", expr);}
JA = expr:(&particle (j vowel)) {return _node("JA", expr);}
JAI = expr:(&particle !(JA post_word) (j vowel_tail)) {return _node("JAI", expr);}
KA = expr:(&particle (k a)) {return _node("KA", expr);}
KAI = expr:(&particle (k a i)) {return _node("KAI", expr);}
LA = expr:(&particle (l a vowel_tail_1?)) {return _node("LA", expr);}
LAI = expr:(&particle (l a i)) {return _node("LAI", expr);}
LE = expr:(&particle (l e i?)) {return _node("LE", expr);}
LO = expr:(&particle (l o)) {return _node("LO", expr);}
LOI = expr:(&particle (l o i)) {return _node("LOI", expr);}
LU = expr:(&particle (l u)) {return _node("LU", expr);}
MA = expr:(&particle (m vowel_tail)) {return _node("MA", expr);}
NA = expr:(&particle (n a)) {return _node("NA", expr);}
NAI = expr:(&particle (n a i)) {return _node("NAI", expr);}
NI = expr:(&particle (n i)) {return _node("NI", expr);}
NO = expr:(&particle (n o)) {return _node("NO", expr);}
NOI = expr:(&particle (n o i)) {return _node("NOI", expr);}
O = expr:(&particle (o)) {return _node("O", expr);}
SA = expr:(&particle (s vowel_tail)) {return _node("SA", expr);}
TA = expr:(&particle !(TAI post_word) (t vowel_tail)) {return _node("TA", expr);}
TAI = expr:(&particle (t a i)) {return _node("TAI", expr);}
U = expr:(&particle (u)) {return _node("U", expr);}
VA = expr:(&particle !(VAI post_word) (v vowel_tail)) {return _node("VA", expr);}
VAI = expr:(&particle (v a i)) {return _node("VAI", expr);}
XA = expr:(&particle (x vowel_tail)) {return _node("XA", expr);}
ZA = expr:(&particle (z a i?)) {return _node("ZA", expr);}
ZE = expr:(&particle (z e)) {return _node("ZE", expr);}
ZEI = expr:(&particle (z e i)) {return _node("ZEI", expr);}
ZI = expr:(&particle (z i)) {return _node("ZI", expr);}
ZU = expr:(&particle (z u)) {return _node("ZU", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((initial_consonant_pair / consonant)? vowel_tail_y (consonant_cluster vowel_tail_y)* consonant? consonant?) {return _node("foreign_word", expr);}
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(consonant? vowel_tail_y &post_word) {return _node("particle", expr);}
root = expr:(((initial_consonant_pair vowel_tail_y coda?) / ((initial_consonant_pair / consonant)? vowel_tail_y coda)) &post_word) {return _node("root", expr);}

// - Legal vowels and vowel tails
vowel_tail = expr:((diphthong / vowel) vowel_tail_1*) {return _node("vowel_tail", expr);}
vowel_tail_1 = expr:(separator (vi_diphthong / vowel )) {return _node("vowel_tail_1", expr);}

vowel_tail_y = expr:((diphthong_y / vowel_y) vowel_tail_y_1*) {return _node("vowel_tail_y", expr);}
vowel_tail_y_1 = expr:(separator (vi_diphthong_y / vowel_y )) {return _node("vowel_tail_y_1", expr);}

separator = expr:(h / l / n / r) {return _node("separator", expr);}

diphthong_y = expr:(iuv_diphthong_y / vi_diphthong_y) {return _node("diphthong_y", expr);}
iuv_diphthong_y = expr:((i / u) vowel_y) {return _node("iuv_diphthong_y", expr);}
vi_diphthong_y = expr:((a / e / o / y) i) {return _node("vi_diphthong_y", expr);}
vowel_y = expr:(vowel / y) {return _node("vowel_y", expr);}

diphthong = expr:(iuv_diphthong / vi_diphthong) {return _node("diphthong", expr);}
iuv_diphthong = expr:((i / u) vowel) {return _node("iuv_diphthong", expr);}
vi_diphthong = expr:((a / e / o) i) {return _node("vi_diphthong", expr);}
vowel = expr:(a / e / i / o / u) {return _node("vowel", expr);}

h = expr:([hH]) {return ["h", "h"];} // <LEAF>
a = expr:([aA]) {return ["a", "a"];} // <LEAF>
e = expr:([eE]) {return ["e", "e"];} // <LEAF>
i = expr:([iI]) {return ["i", "i"];} // <LEAF>
o = expr:([oO]) {return ["o", "o"];} // <LEAF>
u = expr:([uU]) {return ["u", "u"];} // <LEAF>
y = expr:([yY]) {return ["y", "y"];} // <LEAF>

// - Legal consonant and consonant pairs
consonant_cluster = expr:((!(coda coda coda) consonant consonant? consonant? !consonant)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:((&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
initial = expr:((affricate / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

consonant = expr:((voiced / unvoiced / liquid / m / n)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t / k / f / x / b / d / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s / j / z)) {return _node("sibilant", expr);}
coda = expr:((l / n / r)) {return _node("coda", expr);}
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

post_word = expr:((pause_char &(vowel_y / coda) / &consonant / spaces)) {return _node("post_word", expr);}
initial_pause = expr:((pause_char &vowel_y / !pause_char &consonant)) {return _node("initial_pause", expr);}
spaces = expr:(initial_spaces (pause_char &(vowel_y / coda))? / pause_char &(vowel_y / coda) / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ pause_char? / pause_char) !(y h y) y+ !(pause_char pause_char) (pause_char? &space_char / &(pause_char y) / pause_char / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
pause_char = expr:(([']) !pause_char) {return _node("pause_char", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
