// eberban PEG grammar - v0.60
// =============================

// GRAMMAR
// main text rule
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

text = expr:(language_flags (free_suffix)* paragraphs? spaces? EOF?) {return _node("text", expr);}
language_flags = expr:(DO_clause*) {return _node("language_flags", expr);}

// text structure
paragraphs = expr:(paragraph (&PO_clause paragraph)*) {return _node("paragraphs", expr);}
paragraph = expr:(PO_clause? sentence (&sentence_starter sentence / sentence_erased_2)*) {return _node("paragraph", expr);}

sentence_starter = expr:(A_clause / O_clause / NI_clause) {return _node("sentence_starter", expr);}

// We want grammatical sentences that can be followed by RA to erase them, which means
// sentence_erased_1 must appear first. While we want to erase ungrammatical text with RA, we don't
// want it to trigger inside a grammatical sentence, which can be possible with a foreign quote.
sentence = expr:(sentence_erased_1 / sentence_1 / sentence_erased_2) {return _node("sentence", expr);}
sentence_1 = expr:((sentence_o / sentence_ni / sentence_a) PU_clause_elidible) {return _node("sentence_1", expr);}

sentence_erased_1 = expr:(sentence_1 sentence_eraser) {return _node("sentence_erased_1", expr);}
sentence_erased_2 = expr:(sentence_starter? (!(sentence_starter / sentence_eraser) .)* sentence_eraser) {return _node("sentence_erased_2", expr);}

arguments_list = expr:((KI_clause / GI_clause / BA_clause)* BE_clause) {return _node("arguments_list", expr);}

sentence_o = expr:(O_clause unit_definable inner_definition) {return _node("sentence_o", expr);}
sentence_a = expr:(A_clause_elidible inner_definition) {return _node("sentence_a", expr);}
sentence_ni = expr:(NI_clause unit_used_definable) {return _node("sentence_ni", expr);}

// chaining
inner_definition = expr:(arguments_list? chain_or_list) {return _node("inner_definition", expr);}

chain_or_list = expr:(list / chain) {return _node("chain_or_list", expr);}
list = expr:((list_item BU_clause)+ list_item?) {return _node("list", expr);}
list_item = expr:(chain) {return _node("list_item", expr);}

chain = expr:((chain_step_negation / chain_step)+) {return _node("chain", expr);}
chain_step_negation = expr:(BI_clause chain) {return _node("chain_step_negation", expr);}

chain_step = expr:(chain_unit explicit_bind_group*) {return _node("chain_step", expr);}
explicit_bind_group = expr:(explicit_bind_first explicit_bind_additional* VEI_clause_elidible) {return _node("explicit_bind_group", expr);}
explicit_bind_first = expr:(BI_clause? VI_clause inner_definition) {return _node("explicit_bind_first", expr);}
explicit_bind_additional = expr:(BI_clause? FI_clause inner_definition) {return _node("explicit_bind_additional", expr);}

chain_unit = expr:(chain_unit_1 free_suffix*) {return _node("chain_unit", expr);}
chain_unit_1 = expr:((SI_clause !SI_clause / ZI_clause)* chain_unit_2) {return _node("chain_unit_1", expr);}
chain_unit_2 = expr:(unit_used_definable / unit_inline_assignement / KI_clause / BA_clause / MI_clause / unit_quote / unit_scoped / unit_borrowing / unit_number) {return _node("chain_unit_2", expr);}
unit_inline_assignement = expr:(free_prefix* BO_clause (KI_clause / unit_definable)) {return _node("unit_inline_assignement", expr);}

unit_definable = expr:(!MI_clause unit_used_definable) {return _node("unit_definable", expr);}
unit_used_definable = expr:(unit_namespaced / unit_definable_2) {return _node("unit_used_definable", expr);}
unit_namespaced = expr:(((unit_definable_2 / MI_clause) PI_clause)+ unit_definable_2) {return _node("unit_namespaced", expr);}

unit_definable_2 = expr:(GI_clause / unit_freeform_variable / unit_compound / unit_root) {return _node("unit_definable_2", expr);}

unit_freeform_variable = expr:(free_prefix* spaces? freeform_variable) {return _node("unit_freeform_variable", expr);}
unit_root = expr:(free_prefix* spaces? root_word) {return _node("unit_root", expr);}
unit_number = expr:(free_prefix* spaces? number) {return _node("unit_number", expr);}
unit_compound = expr:(free_prefix* spaces? compound) {return _node("unit_compound", expr);}
unit_borrowing = expr:(free_prefix* borrowing_group) {return _node("unit_borrowing", expr);}
unit_scoped = expr:(PE_clause inner_definition PEI_clause_elidible) {return _node("unit_scoped", expr);}

// quotes
unit_quote = expr:(grammatical_quote / one_word_quote / foreign_quote / spelling_quote) {return _node("unit_quote", expr);}
grammatical_quote = expr:(CA_clause text CAI_clause) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(CI_clause spaces? (native_word / compound / borrowing)) {return _node("one_word_quote", expr);}

foreign_quote = expr:(COI_clause / foreign_quote_1) {return _node("foreign_quote", expr);}
foreign_quote_1 = expr:(CO_clause spaces? foreign_quote_open pause_char foreign_quote_content single_pause_char foreign_quote_close) {return _node("foreign_quote_1", expr);}

foreign_quote_content = expr:((!(single_pause_char foreign_quote_close) .)*) { return ["foreign_quote_content", _join(expr)]; }
foreign_quote_open = expr:(native_form ) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }// doesn't perform &post_word check
foreign_quote_word = expr:((!single_pause_char .)+) {return _node("foreign_quote_word", expr);}
foreign_quote_close = expr:(native_word ) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }// performs &post_word check

spelling_quote = expr:(CE_clause spelling_quote_unit+ CEI_clause) {return _node("spelling_quote", expr);}
spelling_quote_unit = expr:(spaces? spelling_quote_unit_2) {return _node("spelling_quote_unit", expr);}
spelling_quote_unit_2 = expr:(!CEI (initial_pair / consonant)? vhowels) {return _node("spelling_quote_unit_2", expr);}

// numbers
number = expr:(number_base? (number_1 number_fractional? / number_1? number_fractional) number_magnitude? JI_clause?) {return _node("number", expr);}
number_1 = expr:(TI_clause+) {return _node("number_1", expr);}
number_base = expr:(TI_clause JU_clause) {return _node("number_base", expr);}
number_fractional = expr:(JO_clause number_1? number_repeat? &number_fractional_constraint) {return _node("number_fractional", expr);}
// Having a fractional part prevents to use anything but math mode (jie or ellided)
number_fractional_constraint = expr:(number_magnitude? spaces? !(!(j i e &post_word) JI)) {return _node("number_fractional_constraint", expr);}
number_repeat = expr:(JA_clause number_1) {return _node("number_repeat", expr);}
number_magnitude = expr:(JE_clause number_1) {return _node("number_magnitude", expr);}

// borrowings
borrowing_group = expr:((spaces? borrowing)+ BE_clause_elidible) {return _node("borrowing_group", expr);}

// free affixes
free_prefix = expr:(free_metadata) {return _node("free_prefix", expr);}
free_metadata = expr:(DI_clause) {return _node("free_metadata", expr);}

free_suffix = expr:(free_parenthetical / free_interjection) {return _node("free_suffix", expr);}
free_interjection = expr:(DE_clause chain_unit_1) {return _node("free_interjection", expr);} // avoid nested free suffix
free_parenthetical = expr:(DA_clause text DAI_clause) {return _node("free_parenthetical", expr);}

// PARTICLES CLAUSES
A_clause = expr:(free_prefix* spaces? A free_suffix*) {return _node("A_clause", expr);} // A sentence starter
O_clause = expr:(free_prefix* spaces? O free_suffix*) {return _node("O_clause", expr);} // O sentence starter
NI_clause = expr:(spaces? NI) {return _node("NI_clause", expr);} // NI sentence starter

BI_clause = expr:(free_prefix* spaces? BI free_suffix*) {return _node("BI_clause", expr);} // wide-scope negation
BE_clause = expr:(spaces? BE) {return _node("BE_clause", expr);} // miscellaneous terminator
BA_clause = expr:(free_prefix* spaces? BA) {return _node("BA_clause", expr);} // inline argument
BO_clause = expr:(free_prefix* spaces? BO) {return _node("BO_clause", expr);} // variable assignement
BU_clause = expr:(free_prefix* spaces? BU) {return _node("BU_clause", expr);} // sequence separator
 //
DI_clause = expr:(spaces? DI) {return _node("DI_clause", expr);} // free metadata
DE_clause = expr:(spaces? DE) {return _node("DE_clause", expr);} // free interjection
DA_clause = expr:(spaces? DA) {return _node("DA_clause", expr);} // free parenthetical starter
DAI_clause = expr:(spaces? DAI) {return _node("DAI_clause", expr);} // free parenthetical terminator
DO_clause = expr:(spaces? DO) {return _node("DO_clause", expr);} // language flags
 //
SI_clause = expr:(free_prefix* spaces? SI) {return _node("SI_clause", expr);} // chain place selection
ZI_clause = expr:(free_prefix* spaces? ZI) {return _node("ZI_clause", expr);} // chain unit core transformation
VI_clause = expr:(free_prefix* spaces? VI free_suffix*) {return _node("VI_clause", expr);} // explicit bind + VI-scope
FI_clause = expr:(free_prefix* spaces? FI free_suffix*) {return _node("FI_clause", expr);} // next explicit bind
VEI_clause = expr:(spaces? VEI) {return _node("VEI_clause", expr);} // VI-scope terminator
 //
GI_clause = expr:(spaces? GI) {return _node("GI_clause", expr);} // predicate variables
KI_clause = expr:(spaces? KI) {return _node("KI_clause", expr);} // symbol/generic variables
MI_clause = expr:(free_prefix* spaces? MI) {return _node("MI_clause", expr);} // particle predicates
 //
PI_clause = expr:(spaces? PI) {return _node("PI_clause", expr);} // namespace separator
PE_clause = expr:(free_prefix* spaces? PE free_suffix*) {return _node("PE_clause", expr);} // scoped unit starter
PEI_clause = expr:(spaces? PEI) {return _node("PEI_clause", expr);} // scope unit elidible terminator
PO_clause = expr:(free_suffix* spaces? PO free_suffix*) {return _node("PO_clause", expr);} // paragraph marker
PU_clause = expr:(spaces? PU free_suffix*) {return _node("PU_clause", expr);} // sentence terminator
 //
TI_clause = expr:(spaces? TI) {return _node("TI_clause", expr);} // digits
 //
JI_clause = expr:(spaces? JI) {return _node("JI_clause", expr);} // number terminator
JE_clause = expr:(spaces? JE) {return _node("JE_clause", expr);} // number magnitude separator
JA_clause = expr:(spaces? JA) {return _node("JA_clause", expr);} // number repeating part separator
JO_clause = expr:(spaces? JO) {return _node("JO_clause", expr);} // number decimal separator
JU_clause = expr:(spaces? JU) {return _node("JU_clause", expr);} // number base separator
 //
CI_clause = expr:(free_prefix* spaces? CI) {return _node("CI_clause", expr);} // one word quote
CE_clause = expr:(free_prefix* spaces? CE) {return _node("CE_clause", expr);} // spelling quote starter
CEI_clause = expr:(free_prefix* spaces? CEI) {return _node("CEI_clause", expr);} // spelling quote terminator
CA_clause = expr:(free_prefix* spaces? CA) {return _node("CA_clause", expr);} // grammatical quote starter
CAI_clause = expr:(free_prefix* spaces? CAI) {return _node("CAI_clause", expr);} // grammatical quote terminator
CO_clause = expr:(free_prefix* spaces? CO) {return _node("CO_clause", expr);} // foreign quote
COI_clause = expr:(free_prefix* spaces? COI) {return _node("COI_clause", expr);} // skipped foreign quote

A_clause_elidible = expr:(A_clause?) {return (expr == "" || !expr) ? ["A"] : _node_empty("A_clause_elidible", expr);}
BE_clause_elidible = expr:(BE_clause?) {return (expr == "" || !expr) ? ["BE"] : _node_empty("BE_clause_elidible", expr);}
PU_clause_elidible = expr:(PU_clause?) {return (expr == "" || !expr) ? ["PU"] : _node_empty("PU_clause_elidible", expr);}
PEI_clause_elidible = expr:(PEI_clause?) {return (expr == "" || !expr) ? ["PEI"] : _node_empty("PEI_clause_elidible", expr);}
VEI_clause_elidible = expr:(VEI_clause?) {return (expr == "" || !expr) ? ["VEI"] : _node_empty("VEI_clause_elidible", expr);}

// PARTICLE FAMILIES
A = expr:(&particle_word (&a particle_form_2) &post_word) {return _node("A", expr);}
O = expr:(&particle_word (&o particle_form_2) &post_word) {return _node("O", expr);}
NI = expr:(&particle_word (&n particle_form_2) &post_word) {return _node("NI", expr);}

MI = expr:(&particle_word (m vhowels) &post_word) {return _node("MI", expr);}
PI = expr:(&particle_word (p &i vhowels) &post_word) {return _node("PI", expr);}
PE = expr:(&particle_word !(PEI &post_word) (p &e vhowels) &post_word) {return _node("PE", expr);}
PEI = expr:(&particle_word (p e i) &post_word) {return _node("PEI", expr);}
PO = expr:(&particle_word (p &o vhowels) &post_word) {return _node("PO", expr);}
PU = expr:(&particle_word (p &u vhowels) &post_word) {return _node("PU", expr);}
BI = expr:(&particle_word (b &i vhowels) &post_word) {return _node("BI", expr);}
BE = expr:(&particle_word (b &e vhowels) &post_word) {return _node("BE", expr);}
BA = expr:(&particle_word (b &a vhowels) &post_word) {return _node("BA", expr);}
BO = expr:(&particle_word (b &o vhowels) &post_word) {return _node("BO", expr);}
BU = expr:(&particle_word (b &u vhowels) &post_word) {return _node("BU", expr);}
FI = expr:(&particle_word (f vhowels) &post_word) {return _node("FI", expr);}
VI = expr:(&particle_word !(VEI &post_word) (v vhowels) &post_word) {return _node("VI", expr);}
VEI = expr:(&particle_word (v e i) &post_word) {return _node("VEI", expr);}
TI = expr:(&particle_word (t vhowels) &post_word / digit) {return _node("TI", expr);}
DI = expr:(&particle_word (d &i vhowels) &post_word) {return _node("DI", expr);}
DE = expr:(&particle_word (d &e vhowels) &post_word) {return _node("DE", expr);}
DA = expr:(&particle_word !(DAI &post_word) (d &a vhowels) &post_word) {return _node("DA", expr);}
DAI = expr:(&particle_word (d a i) &post_word) {return _node("DAI", expr);}
DO = expr:(&particle_word (d &o vhowels) &post_word) {return _node("DO", expr);}
SI = expr:(&particle_word (s vhowels) &post_word) {return _node("SI", expr);}
ZI = expr:(&particle_word (z vhowels) &post_word) {return _node("ZI", expr);}
CI = expr:(&particle_word (c &i vhowels) &post_word) {return _node("CI", expr);}
CE = expr:(&particle_word !(CEI &post_word) (c &e vhowels) &post_word) {return _node("CE", expr);}
CEI = expr:(&particle_word (c e i) &post_word) {return _node("CEI", expr);}
CA = expr:(&particle_word !(CAI &post_word) (c &a vhowels) &post_word) {return _node("CA", expr);}
CAI = expr:(&particle_word (c a i) &post_word) {return _node("CAI", expr);}
CO = expr:(&particle_word !(COI &post_word) (c &o vhowels) &post_word) {return _node("CO", expr);}
COI = expr:(&particle_word (c o i) &post_word) {return _node("COI", expr);}
JI = expr:(&particle_word (j &i vhowels) &post_word) {return _node("JI", expr);}
JE = expr:(&particle_word (j &e vhowels) &post_word) {return _node("JE", expr);}
JA = expr:(&particle_word (j &a vhowels) &post_word) {return _node("JA", expr);}
JO = expr:(&particle_word (j &o vhowels) &post_word) {return _node("JO", expr);}
JU = expr:(&particle_word (j &u vhowels) &post_word) {return _node("JU", expr);}
KI = expr:(&particle_word (k vhowels) &post_word) {return _node("KI", expr);}
GI = expr:(&particle_word (g vhowels) &post_word) {return _node("GI", expr);}

// - Compounds
compound = expr:((compound_n / compound_3 / compound_2)) {return _node("compound", expr);}
compound_2 = expr:(e !(n / r) compound_word compound_word) {return _node("compound_2", expr);}
compound_3 = expr:(e n compound_word compound_word compound_word) {return _node("compound_3", expr);}
compound_n = expr:(e r (!compound_n_end compound_word)+ compound_n_end) {return _node("compound_n", expr);}
compound_n_end = expr:(spaces e spaces) {return _node("compound_n_end", expr);}
compound_word = expr:(spaces? (borrowing / native_word)) {return _node("compound_word", expr);}

// - Free-form words
freeform_variable = expr:(i (spaces &i / hyphen !i) freeform_content freeform_end) {return _node("freeform_variable", expr);}
borrowing = expr:(u (spaces &u / hyphen !u) freeform_content freeform_end) {return _node("borrowing", expr);}
freeform_content = expr:(freeform_consonants? vhowels (freeform_consonants vhowels)* consonant?) {return _node("freeform_content", expr);}
freeform_consonants = expr:(consonant_triplet / medial_pair / ((sonorant / m) hyphen consonant) / hyphen (initial_pair / consonant)) {return _node("freeform_consonants", expr);}
freeform_end = expr:((&sentence_eraser / single_pause_char / space_char / EOF)) {return _node("freeform_end", expr);}

// - Native words
native_word = expr:(root_word / particle_word) {return _node("native_word", expr);}
native_form = expr:(root_form / particle_form) {return _node("native_form", expr);}

particle_word = expr:(particle_form &post_word) {return _node("particle_word", expr);}
particle_form = expr:(particle_form_1 / particle_form_2) {return _node("particle_form", expr);}
particle_form_1 = expr:(!sonorant consonant vhowels !medial_pair) {return _node("particle_form_1", expr);}
particle_form_2 = expr:((n / &(a / o)) vhowels (hyphen sonorant (vhowels / !sonorant))* !medial_pair) {return _node("particle_form_2", expr);}

root_word = expr:(root_form &post_word) {return _node("root_word", expr);}
root_form = expr:(!sonorant (root_form_1 / root_form_2 / root_form_3)) {return _node("root_form", expr);}
root_form_1 = expr:(consonant vhowels ((medial_or_triplet / hyphen sonorant) vhowels)+ sonorant?) {return _node("root_form_1", expr);}
root_form_2 = expr:(consonant vhowels sonorant) {return _node("root_form_2", expr);}
root_form_3 = expr:(initial_pair vhowels ((medial_or_triplet / hyphen sonorant) vhowels)* sonorant?) {return _node("root_form_3", expr);}

// - Legal clusters
vhowels = expr:(vowels (hyphen h vowels)*) {return _node("vhowels", expr);}
vowels = expr:(vowel (hyphen vowel)*) {return _node("vowels", expr);}

medial_or_triplet = expr:(!sonorant consonant_triplet / medial_pair) {return _node("medial_or_triplet", expr);}

consonant_triplet = expr:((consonant_triplet_1 / consonant_triplet_2) !consonant) {return _node("consonant_triplet", expr);}
consonant_triplet_1 = expr:(&medial_pair !sonorant consonant hyphen initial_pair) {return _node("consonant_triplet_1", expr);}
consonant_triplet_2 = expr:(sonorant hyphen initial_pair) {return _node("consonant_triplet_2", expr);}

medial_pair = expr:(!initial medial_patterns) {return _node("medial_pair", expr);}
medial_patterns = expr:((medial_n / medial_fv / medial_plosive)) {return _node("medial_patterns", expr);}
medial_n = expr:(liquid hyphen n / n hyphen liquid) {return _node("medial_n", expr);}
medial_fv = expr:((f / v) hyphen (plosive / m)) {return _node("medial_fv", expr);}
medial_plosive = expr:(plosive hyphen (f / v / plosive / m)) {return _node("medial_plosive", expr);}

// initial pairs cannot contain an hyphen
initial_pair = expr:(&initial consonant consonant !consonant) {return _node("initial_pair", expr);}
// we need to support hyphenation to use `!initial` in `medial_pair`
initial = expr:(((plosive / f / v) hyphen sibilant / sibilant hyphen other / sibilant hyphen sonorant / other hyphen sonorant)) {return _node("initial", expr);}

other = expr:((p / b) !n / (t / d) !n !l / v / f / k / g / m / n !liquid) {return _node("other", expr);}
plosive = expr:(t / d / k / g / p / b) {return _node("plosive", expr);}
sibilant = expr:(c / s / j / z) {return _node("sibilant", expr);}
sonorant = expr:(n / r / l) {return _node("sonorant", expr);}

consonant = expr:((voiced / unvoiced / liquid / nasal)) {return _node("consonant", expr);}
nasal = expr:(m / n) {return _node("nasal", expr);}
liquid = expr:(l / r) {return _node("liquid", expr);}
voiced = expr:(b / d / g / v / z / j) {return _node("voiced", expr);}
unvoiced = expr:(p / t / k / f / s / c) {return _node("unvoiced", expr);}

vowel = expr:(i / e / a / o / u) {return _node("vowel", expr);}

// Legal letters
i = expr:([iI]+) {return ["i", "i"];} // <LEAF>
e = expr:([eE]+) {return ["e", "e"];} // <LEAF>
a = expr:([aA]+) {return ["a", "a"];} // <LEAF>
o = expr:([oO]+) {return ["o", "o"];} // <LEAF>
u = expr:([uU]+) {return ["u", "u"];} // <LEAF>

h = expr:([hH]+) {return ["h", "h"];} // <LEAF>
n = expr:([nN]+) {return ["n", "n"];} // <LEAF>
r = expr:([rR]+) {return ["r", "r"];} // <LEAF>
l = expr:([lL]+) {return ["l", "l"];} // <LEAF>

m = expr:([mM]+) {return ["m", "m"];} // <LEAF>
p = expr:([pP]+ !voiced) {return ["p", "p"];} // <LEAF>
b = expr:([bB]+ !unvoiced) {return ["b", "b"];} // <LEAF>
f = expr:([fF]+ !voiced) {return ["f", "f"];} // <LEAF>
v = expr:([vV]+ !unvoiced) {return ["v", "v"];} // <LEAF>
t = expr:([tT]+ !voiced) {return ["t", "t"];} // <LEAF>
d = expr:([dD]+ !unvoiced) {return ["d", "d"];} // <LEAF>
s = expr:([sS]+ !c !voiced) {return ["s", "s"];} // <LEAF>
z = expr:([zZ]+ !j !unvoiced) {return ["z", "z"];} // <LEAF>
c = expr:([cC]+ !s !voiced) {return ["c", "c"];} // <LEAF>
j = expr:([jJ]+ !z !unvoiced) {return ["j", "j"];} // <LEAF>
g = expr:([gG]+ !unvoiced) {return ["g", "g"];} // <LEAF>
k = expr:([kK]+ !voiced) {return ["k", "k"];} // <LEAF>

// - Spaces / Pause
pause_start = expr:(vowel / sonorant) {return _node("pause_start", expr);}
post_word = expr:((single_pause_char &pause_start) / !sonorant &consonant / spaces) {return _node("post_word", expr);}
spaces = expr:(space_char+ hesitation? (single_pause_char &pause_start)? / single_pause_char &pause_start / EOF) {return _node("spaces", expr);}
hesitation = expr:((n (space_char+ / EOF))+) {return _node("hesitation", expr);}

sentence_eraser = expr:((spaces RA+)+ spaces) {return _node("sentence_eraser", expr);}
RA = expr:(r a) {return _node("RA", expr);}

// - Special characters
hyphen = expr:((hyphen_char [\n\r]*)?) {return _node("hyphen", expr);} // hyphens + line break support
hyphen_char = expr:([\u2010\u2014\u002D]) {return _node("hyphen_char", expr);}
single_pause_char = expr:(pause_char !pause_char) {return _node("single_pause_char", expr);}
pause_char = expr:((['’`])) {return _node("pause_char", expr);}
space_char = expr:(!(single_pause_char / digit / hyphen_char / [a-zA-Z]) .) {return _join(expr);}
digit = expr:([0-9]) {return ["digit", expr];} // <LEAF2>
EOF = expr:(!.) {return _node("EOF", expr);}
