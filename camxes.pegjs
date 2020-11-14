// GRAMMAR
// main rule (used for tests, real text rule TODO)
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

text = expr:(predicate space? EOF?) {return _node("text", expr);}

// pre-tail terms
predicate = expr:(predicate_place* p_predicate_tail_open_elidible predicate_tail) {return _node("predicate", expr);}
// predicate-tail afterthough connectives
predicate_tail = expr:(predicate_tail_1 (predicate_connective p_predicate_tail_open_elidible predicate_tail_1 predicate_tail_terms )*) {return _node("predicate_tail", expr);}
// predicate-tail negation
predicate_tail_1 = expr:(p_neg_pre* predicate_tail_2) {return _node("predicate_tail_1", expr);}
// simple predicate-tail / forethough connected tails
predicate_tail_2 = expr:(relation predicate_tail_terms / predicate_tail_pre) {return _node("predicate_tail_2", expr);}

// forethough connected tails structure
predicate_tail_pre = expr:((pre_predicate_connective p_predicate_tail_open_elidible predicate_tail (pre_connective_separator p_predicate_tail_open_elidible predicate_tail)+ p_pre_connective_close_elidible) predicate_tail_terms) {return _node("predicate_tail_pre", expr);}

// terms followed by predicate-tail elidible terminator
predicate_tail_terms = expr:(predicate_place* p_predicate_tail_close_elidible) {return _node("predicate_tail_terms", expr);}
// place + term
predicate_place = expr:(p_predicate_place predicate_term) {return _node("predicate_place", expr);}
// term afterthought connectives
predicate_term = expr:(predicate_term_1 (predicate_connective !p_predicate_tail_open predicate_term_1)*) {return _node("predicate_term", expr);}
// simple relation term / forethough connected terms
predicate_term_1 = expr:(relation / predicate_term_pre) {return _node("predicate_term_1", expr);}

// forethough connected term structure
predicate_term_pre = expr:((pre_predicate_connective !p_predicate_tail_open predicate_term (pre_connective_separator !p_predicate_tail_open predicate_term)+ p_pre_connective_close_elidible)) {return _node("predicate_term_pre", expr);}

// relation compounds
relation = expr:(relation_2+) {return _node("relation", expr);}
// relation afterthough connectives
relation_2 = expr:(relation_3 (relation_connective relation_3)*) {return _node("relation_2", expr);}
// basic relations
relation_3 = expr:(relation_pre / lemma / borrowing / grammatical_quote / one_word_quote / ungrammatical_quote / foreign_quote / abstraction / relation_place_swap / scoped_relation / space? lexeme) {return _node("relation_3", expr);}

// forethough connected relations
relation_pre = expr:((pre_relation_connective relation (pre_connective_separator relation)+ p_pre_connective_close_elidible)) {return _node("relation_pre", expr);}

// lemma prefixes
lemma = expr:(lemma_1 / lemma_2 / lemma_3 / lemma_4 / lemma_n) {return _node("lemma", expr);}
lemma_1 = expr:(p_lemma_1 lemma_word) {return _node("lemma_1", expr);}
lemma_2 = expr:(p_lemma_2 lemma_word lemma_word) {return _node("lemma_2", expr);}
lemma_3 = expr:(p_lemma_3 lemma_word lemma_word lemma_word) {return _node("lemma_3", expr);}
lemma_4 = expr:(p_lemma_4 lemma_word lemma_word lemma_word lemma_word) {return _node("lemma_4", expr);}
lemma_n = expr:(p_lemma_n (!p_lemma_n word)+ p_lemma_n) {return _node("lemma_n", expr);}
lemma_word = expr:(initial_dot word) {return _node("lemma_word", expr);}

// borrowings
borrowing = expr:(p_borrowing_n_open borrowing_content dot? (space_char / EOF)) {return _node("borrowing", expr);}
borrowing_content = expr:(space_char initial_dot foreign_word (!space word)*) {return _node("borrowing_content", expr);}

// quotes
grammatical_quote = expr:(p_grammatical_quote_open text p_grammatical_quote_close) {return _node("grammatical_quote", expr);}
one_word_quote = expr:(p_one_word_quote space? word) {return _node("one_word_quote", expr);}
ungrammatical_quote = expr:(p_ungrammatical_quote_open (!p_ungrammatical_quote_close space? word) p_ungrammatical_quote_close) {return _node("ungrammatical_quote", expr);}
foreign_quote = expr:(p_foreign_quote (space?) foreign_quote_open space (foreign_quote_word space)* foreign_quote_close) {return _node("foreign_quote", expr);}

// abstractions
abstraction = expr:(p_abstraction_open predicate p_abstraction_close_elidible) {return _node("abstraction", expr);}

// relation place swap
relation_place_swap = expr:(p_place_swap relation_3) {return _node("relation_place_swap", expr);}

// scoped relation
scoped_relation = expr:(p_scope_open relation p_scope_close_elidible) {return _node("scoped_relation", expr);}

// afterthough connectives
predicate_connective = expr:(p_neg_pre? p_place_swap? p_predicate_connective p_neg_post?) {return _node("predicate_connective", expr);}
relation_connective = expr:(p_neg_pre? p_place_swap? p_relation_connective p_neg_post?) {return _node("relation_connective", expr);}

// forethough connectives
pre_predicate_connective = expr:(p_pre_connective_open p_place_swap? p_predicate_connective p_neg_post?) {return _node("pre_predicate_connective", expr);}
pre_relation_connective = expr:(p_pre_connective_open p_place_swap? p_relation_connective p_neg_post?) {return _node("pre_relation_connective", expr);}
pre_connective_separator = expr:(p_pre_connective_separator p_neg_post?) {return _node("pre_connective_separator", expr);}

// PARTICLES
// - Lexicalized relation
//   A string of words (particles and/or relations) can be lexicalized to have a unique relation meaning.
//   Each word is stripped from its grammar while keeping its meaning.
//
//   The particle depends on how many words form the lexicalized relation.
//   More than 4 words requires a closing particle.
p_lemma_1 = expr:(space? (a)) {return _node("p_lemma_1", expr);}
p_lemma_2 = expr:(space? (e)) {return _node("p_lemma_2", expr);}
p_lemma_3 = expr:(space? (i)) {return _node("p_lemma_3", expr);}
p_lemma_4 = expr:(space? (o)) {return _node("p_lemma_4", expr);}
p_lemma_n = expr:(space? (u)) {return _node("p_lemma_n", expr);}

// - Abstractions
//   x1 is abstraction of [predicate] ...
p_abstraction_open = expr:(!p_abstraction_close space? (b (vowel / diphtong))) {return _node("p_abstraction_open", expr);}
p_abstraction_close_elidible = expr:(p_abstraction_close?) {return (expr == "" || !expr) ? ["p_abstraction_close"] : _node_empty("p_abstraction_close_elidible", expr);}
p_abstraction_close = expr:(space? (b a i)) {return _node("p_abstraction_close", expr);}

// - Foreign relation
//   A string of words used without their meaning to express some foreign concept.
//   x1 is [foreign concept].
//
//   The foreign relation stops after the first pause (ignoring initial pause due
//   to a first vowel word)
p_borrowing_n_open = expr:(space? (m a)) {return _node("p_borrowing_n_open", expr);}

// - Grammatical quotation
//   Quote a grammatical valid text
//   x1 is text [quoted text]
p_grammatical_quote_open = expr:(space? (m e)) {return _node("p_grammatical_quote_open", expr);}
p_grammatical_quote_close = expr:(space? (m e i)) {return _node("p_grammatical_quote_close", expr);}

// - One word quote
//   x1 is text [quoted word]
p_one_word_quote = expr:(space? (m i)) {return _node("p_one_word_quote", expr);}

// - Unrammatical quotation
//   Quote an ungrammatical valid text
//   x1 is text [quoted text]
p_ungrammatical_quote_open = expr:(space? (m o)) {return _node("p_ungrammatical_quote_open", expr);}
p_ungrammatical_quote_close = expr:(space? (m o i)) {return _node("p_ungrammatical_quote_close", expr);}

// - Free quote
//   Quote any string with provided quote word.
//   x1 is text [quoted text]
p_foreign_quote = expr:(space? (m u)) {return _node("p_foreign_quote", expr);}

// - Relation place swaping
p_place_swap = expr:(space? (s (vowel / e i))) {return _node("p_place_swap", expr);} // name / 2 / 3 / 4 / 5 / question

// - Predicate numeral place tag
p_predicate_place = expr:(space? (f vowel / v i / v o)) {return _node("p_predicate_place", expr);} // 1..5 places / next numeral place / place question

// - Predicate tail
p_predicate_tail_open_elidible = expr:(p_predicate_tail_open? ) {return (expr == "" || !expr) ? ["p_predicate_tail_open"] : _node_empty("p_predicate_tail_open_elidible", expr);}
p_predicate_tail_open = expr:(space? (v e)) {return _node("p_predicate_tail_open", expr);}
p_predicate_tail_close_elidible = expr:((space? (v e i))?) {return (expr == "" || !expr) ? ["p_predicate_tail_close"] : _node_empty("p_predicate_tail_close_elidible", expr);}

// - Forethought connectives
p_pre_connective_open = expr:(space? (g a)) {return _node("p_pre_connective_open", expr);}
p_pre_connective_separator = expr:(space? (g i)) {return _node("p_pre_connective_separator", expr);}
p_pre_connective_close_elidible = expr:(p_pre_connective_close?) {return (expr == "" || !expr) ? ["p_pre_connective_close"] : _node_empty("p_pre_connective_close_elidible", expr);}
p_pre_connective_close = expr:(space? (g a i)) {return _node("p_pre_connective_close", expr);}

// - Afterthought connectives
// todo : add mass/set predicate connectives
p_predicate_connective = expr:(space? (j vowel)) {return _node("p_predicate_connective", expr);} // a/e/o/u + i question
p_relation_connective = expr:(space? (c vowel)) {return _node("p_relation_connective", expr);} // a/e/o/u + i question

// - Negations
p_neg_pre = expr:(space? (n a)) {return _node("p_neg_pre", expr);}
p_neg_post = expr:(space? (n a i)) {return _node("p_neg_post", expr);}

// - Scoping
p_scope_open = expr:(space? (g o)) {return _node("p_scope_open", expr);}
p_scope_close_elidible = expr:((space? (g o i))?) {return (expr == "" || !expr) ? ["p_scope_close"] : _node_empty("p_scope_close_elidible", expr);}

// - Literals
p_letter = expr:(space? (consonant y / vowel_y h y / (i / u) y h y / vi_diphtong h y / y h y )) {return _node("p_letter", expr);} // consonant / vowel / semi-vowel / h

// MORPHOLOGY
// - Forein text quoting
foreign_quote_open = expr:(word) { _assign_foreign_quote_delim(expr); return _node("foreign_quote_open", expr); }
foreign_quote_word = expr:((!space .)+ ) !{ return _is_foreign_quote_delim(expr); } { return ["foreign_quote_word", join_expr(expr)]; }
foreign_quote_close = expr:(word) &{ return _is_foreign_quote_delim(expr); } { return _node("foreign_quote_close", expr); }

// - Legal words
foreign_word = expr:((consonant / initial_consonant_pair)? vowel_tail (consonant_cluster vowel_tail)* (consonant consonant)?) {return _node("foreign_word", expr);}
word = expr:(lexeme / particle) {return _node("word", expr);}
particle = expr:(consonant? vowel_tail) {return _node("particle", expr);}
lexeme = expr:((initial_consonant_pair vowel_tail coda?) / (!coda consonant vowel_tail coda)) {return _node("lexeme", expr);}

// - Legal vowels and vowel tails
vowel_tail = expr:((diphtong / vowel_y) (h (vi_diphtong / vowel_y ))*) {return _node("vowel_tail", expr);}

diphtong = expr:(iuv_diphtong / vi_diphtong) {return _node("diphtong", expr);}
iuv_diphtong = expr:((i / u) vowel_y) {return _node("iuv_diphtong", expr);}
vi_diphtong = expr:((a / e / o / y) i) {return _node("vi_diphtong", expr);}
vowel_y = expr:(vowel / y) {return _node("vowel_y", expr);}
vowel = expr:(a / e / i / o / u) {return _node("vowel", expr);}
h = expr:(['h]) {return ["h", "h"];} // <LEAF>
a = expr:([aA]) {return ["a", "a"];} // <LEAF>
e = expr:([eE]) {return ["e", "e"];} // <LEAF>
i = expr:([iI]) {return ["i", "i"];} // <LEAF>
o = expr:([oO]) {return ["o", "o"];} // <LEAF>
u = expr:([uU]) {return ["u", "u"];} // <LEAF>
y = expr:([yY]) {return ["y", "y"];} // <LEAF>

// - Legal consonant and consonant pairs
consonant_cluster = expr:((consonant consonant*)) {return _node("consonant_cluster", expr);}
initial_consonant_pair = expr:((&initial consonant consonant !consonant)) {return _node("initial_consonant_pair", expr);}
initial = expr:((affricate / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

consonant = expr:((voiced / unvoiced / coda)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t !l / k / f / x / b / d !l / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s !x / (j / z) !n !liquid)) {return _node("sibilant", expr);}
coda = expr:((l / m / n / r)) {return _node("coda", expr);}
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

// - Space / Pause
initial_dot = expr:((dot &vowel_y / !dot &consonant)) {return _node("initial_dot", expr);}
space = expr:(space_1+ (dot &vowel)? / dot &vowel / EOF) {return _node("space", expr);}
space_1 = expr:(space_char / hesitation space_char) {return _node("space_1", expr);}
hesitation = expr:(space_char+ dot? y+ dot? space_char+) {return _node("hesitation", expr);}

// - Special characters
dot = expr:('.') {return _node("dot", expr);}
space_char = expr:([\t\n\r?!\u0020]) {return _join(expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
