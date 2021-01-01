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
parser_version = expr:(KU_clause (!parser_version_number borrowing_content (pause_char !pause_char !y)? parser_version_number? / parser_version_number)) {return _node("parser_version", expr);}
parser_version_number = expr:(spaces? TA+) {return _node("parser_version_number", expr);}

// main text rule
text_1 = expr:((free_indicator / free_discursive / free_parenthetical)* (paragraph+ / sentence*) spaces? EOF?) {return _node("text_1", expr);}

// sentences
paragraph = expr:(DA_clause+ sentence*) {return _node("paragraph", expr);}
sentence = expr:(proposition) {return _node("sentence", expr);}

proposition = expr:(proposition_1 (ja proposition_1)*) {return _node("proposition", expr);}
proposition_1 = expr:(proposition_keja / DE_clause_elidible prenex? KA_clause* predicate_chaining DEI_clause_elidible) {return _node("proposition_1", expr);}
proposition_keja = expr:(keja proposition (ki proposition)+ KEI_clause_elidible) {return _node("proposition_keja", expr);}

prenex = expr:((DO_clause prenex_term)+ DOI_clause) {return _node("prenex", expr);}
prenex_term = expr:(predicate_term predicate_link*) {return _node("prenex_term", expr);}

predicate_chaining = expr:(predicate_filling (predicate_chaining_tag predicate_chaining)? / predicate_unit (predicate_chaining_tag? predicate_chaining)?) {return _node("predicate_chaining", expr);}
predicate_chaining_tag = expr:(CA_clause / predicate_chaining_import) {return _node("predicate_chaining_tag", expr);}
predicate_chaining_import = expr:(KOI_clause predicate_unit) {return _node("predicate_chaining_import", expr);}

predicate_filling = expr:(predicate_unit predicate_filled_place+) {return _node("predicate_filling", expr);}
predicate_filled_place = expr:(predicate_place_tag+ predicate_term predicate_link*) {return _node("predicate_filled_place", expr);}
predicate_link = expr:(VA_clause predicate_unit+) {return _node("predicate_link", expr);}

predicate_place_tag = expr:(FA_clause / predicate_place_import) {return _node("predicate_place_tag", expr);}
predicate_place_import = expr:(KO_clause predicate_unit) {return _node("predicate_place_import", expr);}

predicate_term = expr:(predicate_term_ja / predicate_term_1) {return _node("predicate_term", expr);}
predicate_term_ja = expr:(predicate_term_1 (ja predicate_term_1)+) {return _node("predicate_term_ja", expr);}
predicate_term_1 = expr:(predicate_term_jai / predicate_term_2) {return _node("predicate_term_1", expr);}
predicate_term_jai = expr:(predicate_term_2 (jai predicate_term_2)+) {return _node("predicate_term_jai", expr);}
predicate_term_2 = expr:(predicate_term_keja / predicate_unit) {return _node("predicate_term_2", expr);}
predicate_term_keja = expr:(keja predicate_term (ki predicate_term)+ KEI_clause_elidible) {return _node("predicate_term_keja", expr);}

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
grammatical_quote = expr:(ZE_clause text_1 ZEI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(ZI_clause spaces? native_word) {return _node("one_word_quote", expr);}
foreign_quote = expr:(ZU_clause (spaces?) foreign_quote_open spaces foreign_quote_content foreign_quote_close free_post*) {return _node("foreign_quote", expr);}
foreign_quote_content = expr:((foreign_quote_word spaces)*) {return _node("foreign_quote_content", expr);}

// abstractions
abstraction = expr:(BA_clause proposition BAI_clause_elidible) {return _node("abstraction", expr);}

// string (numbers / literals)
string = expr:((number_string / letter_string) TAI_clause_elidible) {return _node("string", expr);}
number_string = expr:(TA_clause (TA_clause / BY_clause)*) {return _node("number_string", expr);}
letter_string = expr:(BY_clause (TA_clause / BY_clause)*) {return _node("letter_string", expr);}

// afterthough connectives
ja = expr:(KA_clause? SA_clause? JA_clause KAI_clause? free_post*) {return _node("ja", expr);}
jai = expr:(JAI_clause) {return _node("jai", expr);}

// forethough connectives
keja = expr:(KE_clause SA_clause? JA_clause KAI_clause? free_post*) {return _node("keja", expr);}
ki = expr:(KI_clause KAI_clause? free_post*) {return _node("ki", expr);}

// free prefix
free_prefix = expr:(PA_clause) {return _node("free_prefix", expr);}

// free suffix
free_post = expr:(PAI_clause / free_discursive / free_indicator / free_parenthetical / free_subscript) {return _node("free_post", expr);}
free_discursive = expr:(PE_clause predicate_unit+) {return _node("free_discursive", expr);}
free_indicator = expr:(PI_clause) {return _node("free_indicator", expr);}
free_parenthetical = expr:(PO_clause text_1 POI_clause) {return _node("free_parenthetical", expr);}
free_subscript = expr:(PU_clause string) {return _node("free_subscript", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A) {return _node("A_clause", expr);} // 1-word compound
E_clause = expr:(free_prefix* spaces? E) {return _node("E_clause", expr);} // 2-words compound
I_clause = expr:(free_prefix* spaces? I) {return _node("I_clause", expr);} // 3-words compound
O_clause = expr:(free_prefix* spaces? O) {return _node("O_clause", expr);} // 4-words compound
U_clause = expr:(free_prefix* spaces? U) {return _node("U_clause", expr);} // n-words compound starter and terminator

BA_clause = expr:(free_prefix* spaces? BA) {return _node("BA_clause", expr);} // abstractors starter
BAI_clause = expr:(free_prefix* spaces? BAI free_post*) {return _node("BAI_clause", expr);} // abstractors terminator
BAI_clause_elidible = expr:(BAI_clause?) {return (expr == "" || !expr) ? ["BAI"] : _node_empty("BAI_clause_elidible", expr);}
BY_clause = expr:(free_prefix* spaces? BY) {return _node("BY_clause", expr);} // letters
CA_clause = expr:(free_prefix* spaces? CA free_post*) {return _node("CA_clause", expr);} // chaining tags
DA_clause = expr:(free_prefix* spaces? DA free_post*) {return _node("DA_clause", expr);} // paragraph marker
DE_clause = expr:(free_prefix* spaces? DE free_post*) {return _node("DE_clause", expr);} // proposition starter
DE_clause_elidible = expr:(DE_clause?) {return (expr == "" || !expr) ? ["DE"] : _node_empty("DE_clause_elidible", expr);}
DEI_clause = expr:(free_prefix* spaces? DEI free_post*) {return _node("DEI_clause", expr);} // proposition terminator
DEI_clause_elidible = expr:(DEI_clause?) {return (expr == "" || !expr) ? ["DEI"] : _node_empty("DEI_clause_elidible", expr);}
DO_clause = expr:(free_prefix* spaces? DO free_post*) {return _node("DO_clause", expr);} // prenex starter/separator
DOI_clause = expr:(free_prefix* spaces? DOI free_post*) {return _node("DOI_clause", expr);} // prenex terminator
FA_clause = expr:(free_prefix* spaces? FA free_post*) {return _node("FA_clause", expr);} // filling place tag
JA_clause = expr:(free_prefix* spaces? JA free_post*) {return _node("JA_clause", expr);} // logical connectives
JAI_clause = expr:(free_prefix* spaces? JAI free_post*) {return _node("JAI_clause", expr);} // set creator
KA_clause = expr:(free_prefix* spaces? KA free_post*) {return _node("KA_clause", expr);} // pre negation
KAI_clause = expr:(free_prefix* spaces? KAI) {return _node("KAI_clause", expr);} // post negation
KE_clause = expr:(free_prefix* spaces? KE) {return _node("KE_clause", expr);} // forethought connective starter
KEI_clause = expr:(free_prefix* spaces? KEI free_post*) {return _node("KEI_clause", expr);} // forethought connective terminator
KEI_clause_elidible = expr:(KEI_clause?) {return (expr == "" || !expr) ? ["KEI"] : _node_empty("KEI_clause_elidible", expr);}
KI_clause = expr:(free_prefix* spaces? KI) {return _node("KI_clause", expr);} // forethought connective separator
KO_clause = expr:(free_prefix* spaces? KO) {return _node("KO_clause", expr);} // filling place import
KOI_clause = expr:(free_prefix* spaces? KOI) {return _node("KOI_clause", expr);} // chaining place import
KU_clause = expr:(free_prefix* spaces? KU) {return _node("KU_clause", expr);} // parser version/dialect
MA_clause = expr:(free_prefix* spaces? MA free_post*) {return _node("MA_clause", expr);} // surrogate predicates (pronouns, ...)
PA_clause = expr:(spaces? PA) {return _node("PA_clause", expr);} // free scope started
PAI_clause = expr:(spaces? PAI) {return _node("PAI_clause", expr);} // free scope terminator
PE_clause = expr:(free_prefix* spaces? PE) {return _node("PE_clause", expr);} // free discursive (predicate)
PI_clause = expr:(free_prefix* spaces? PI) {return _node("PI_clause", expr);} // free indicator (marker)
PO_clause = expr:(free_prefix* spaces? PO) {return _node("PO_clause", expr);} // free parenthetical started (text)
POI_clause = expr:(free_prefix* spaces? POI) {return _node("POI_clause", expr);} // free parenthetical terminator
PU_clause = expr:(free_prefix* spaces? PU) {return _node("PU_clause", expr);} // free subscript
SA_clause = expr:(free_prefix* spaces? SA) {return _node("SA_clause", expr);} // predicate unit transformation
TA_clause = expr:(free_prefix* spaces? TA) {return _node("TA_clause", expr);} // numbers/digits
TAI_clause = expr:(free_prefix* spaces? TAI) {return _node("TAI_clause", expr);} // number / string terminator
TAI_clause_elidible = expr:(TAI_clause?) {return (expr == "" || !expr) ? ["TAI"] : _node_empty("TAI_clause_elidible", expr);}
VA_clause = expr:(free_prefix* spaces? VA) {return _node("VA_clause", expr);} // predicate link
ZA_clause = expr:(free_prefix* spaces? ZA) {return _node("ZA_clause", expr);} // borrowing
ZE_clause = expr:(free_prefix* spaces? ZE) {return _node("ZE_clause", expr);} // grammatical quote starter
ZEI_clause = expr:(free_prefix* spaces? ZEI free_post*) {return _node("ZEI_clause", expr);} // grammatical quote terminator
ZI_clause = expr:(free_prefix* spaces? ZI) {return _node("ZI_clause", expr);} // one word quote
ZU_clause = expr:(free_prefix* spaces? ZU) {return _node("ZU_clause", expr);} // foreign quote

// PARTICLE FAMILIES
A = expr:(&particle (a)) {return _node("A", expr);}
E = expr:(&particle (e)) {return _node("E", expr);}
I = expr:(&particle (i)) {return _node("I", expr);}
O = expr:(&particle (o)) {return _node("O", expr);}
U = expr:(&particle (u)) {return _node("U", expr);}

BA = expr:(&particle !(BAI &post_word) (b vowel_tail)) {return _node("BA", expr);}
BAI = expr:(&particle (b a i)) {return _node("BAI", expr);}
BY = expr:(&particle (consonant y / vowel_y h y / (i / u) (y / n y) / y h a / y h e)) {return _node("BY", expr);}
CA = expr:(&particle (c vowel_tail)) {return _node("CA", expr);}
DA = expr:(&particle (d a)) {return _node("DA", expr);}
DE = expr:(&particle (d e)) {return _node("DE", expr);}
DEI = expr:(&particle (d e i)) {return _node("DEI", expr);}
DO = expr:(&particle (d o)) {return _node("DO", expr);}
DOI = expr:(&particle (d o i)) {return _node("DOI", expr);}
FA = expr:(&particle (f vowel_tail)) {return _node("FA", expr);}
JA = expr:(&particle (j vowel)) {return _node("JA", expr);}
JAI = expr:(&particle !(JA &post_word) (j vowel_tail)) {return _node("JAI", expr);}
KA = expr:(&particle (k a)) {return _node("KA", expr);}
KAI = expr:(&particle (k a i)) {return _node("KAI", expr);}
KE = expr:(&particle (k e)) {return _node("KE", expr);}
KEI = expr:(&particle (k e i)) {return _node("KEI", expr);}
KI = expr:(&particle (k i)) {return _node("KI", expr);}
KO = expr:(&particle (k o)) {return _node("KO", expr);}
KOI = expr:(&particle (k o i)) {return _node("KOI", expr);}
KU = expr:(&particle (k u)) {return _node("KU", expr);}
MA = expr:(&particle (m vowel_tail)) {return _node("MA", expr);}
PA = expr:(&particle (p a vowel_tail_1?)) {return _node("PA", expr);}
PAI = expr:(&particle (p a i)) {return _node("PAI", expr);}
PE = expr:(&particle (p &e vowel_tail)) {return _node("PE", expr);}
PI = expr:(&particle (p &i vowel_tail)) {return _node("PI", expr);}
PO = expr:(&particle (p o)) {return _node("PO", expr);}
POI = expr:(&particle (p o i)) {return _node("POI", expr);}
PU = expr:(&particle (p u)) {return _node("PU", expr);}
SA = expr:(&particle (s vowel_tail)) {return _node("SA", expr);}
TA = expr:(&particle !(TAI &post_word) (t vowel_tail) / digit) {return _node("TA", expr);}
TAI = expr:(&particle (t a i)) {return _node("TAI", expr);}
VA = expr:(&particle (v vowel_tail)) {return _node("VA", expr);}
ZA = expr:(&particle (z &a vowel_tail)) {return _node("ZA", expr);}
ZE = expr:(&particle (z e)) {return _node("ZE", expr);}
ZEI = expr:(&particle (z e i)) {return _node("ZEI", expr);}
ZI = expr:(&particle (z &i vowel_tail)) {return _node("ZI", expr);}
ZU = expr:(&particle (z &u vowel_tail)) {return _node("ZU", expr);}

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(native_word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!spaces .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(native_word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((initial_consonant_pair / consonant)? vowel_tail_y (consonant_cluster vowel_tail_y)* consonant? consonant?) {return _node("foreign_word", expr);}
native_word = expr:(root / particle) {return _node("native_word", expr);}
particle = expr:(consonant? vowel_tail_y &post_word) {return _node("particle", expr);}
root = expr:(((initial_consonant_pair vowel_tail_y sonorant?) / ((initial_consonant_pair / consonant)? vowel_tail_y sonorant)) &post_word) {return _node("root", expr);}

// - Legal vowels and vowel tails
vowel_tail = expr:((diphthong / vowel) vowel_tail_1*) {return _node("vowel_tail", expr);}
vowel_tail_1 = expr:(separator (vi_diphthong / vowel )) {return _node("vowel_tail_1", expr);}

vowel_tail_y = expr:((diphthong_y / vowel_y) vowel_tail_y_1*) {return _node("vowel_tail_y", expr);}
vowel_tail_y_1 = expr:(separator (vi_diphthong_y / vowel_y )) {return _node("vowel_tail_y_1", expr);}

separator = expr:(h / sonorant) {return _node("separator", expr);}

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
consonant_cluster = expr:((!(sonorant sonorant sonorant) consonant consonant? consonant? !consonant)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:((&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
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
post_word = expr:((pause_char &(vowel_y / sonorant) / !sonorant &consonant / spaces)) {return _node("post_word", expr);}
initial_pause = expr:((pause_char &vowel_y / !pause_char &consonant)) {return _node("initial_pause", expr);}
spaces = expr:(initial_spaces (pause_char &(vowel_y / sonorant))? / pause_char &(vowel_y / sonorant) / EOF) {return _node("spaces", expr);}
initial_spaces = expr:((hesitation / space_char)+) {return ["initial_spaces", _join(expr)];}
hesitation = expr:((space_char+ pause_char? / pause_char) !(y h y) y+ !(pause_char pause_char) (pause_char? &space_char / &(pause_char y) / pause_char / EOF)) {return _node("hesitation", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}

// - Special characters
pause_char = expr:(([']) !pause_char) {return _node("pause_char", expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
digit = expr:([.0123456789]) {return ["digit", expr];} // <LEAF2>
