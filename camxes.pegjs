// GRAMMAR
{
  var _g_foreign_delim;

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

  function _assign_foreign_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: foreign word is of type " + typeof w;
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    _g_foreign_delim = w;
    return;
  }

  function _is_foreign_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: foreign word is of type " + typeof w;
    /* Keeping spaces in the parse tree seems to result in the absorbtion of
       spaces into the closing delimiter candidate, so we'll remove any space
       character from our input. */
    w = w.replace(/[.\t\n\r?!\u0020]/g, "");
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    return w === _g_foreign_delim;
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

text = expr:(predicate EOF?) {return _node("text", expr);}

predicate = expr:(predicate_term* predicate_tail) {return _node("predicate", expr);}
predicate_tail = expr:(predicate_tail_core) {return _node("predicate_tail", expr);}
predicate_tail_core = expr:(p_predicate_tail_open_elidible relation predicate_term* p_predicate_tail_close_elidible) {return _node("predicate_tail_core", expr);}
predicate_term = expr:(p_predicate_place relation) {return _node("predicate_term", expr);}

relation = expr:(relation_negation) {return _node("relation", expr);}
relation_negation = expr:(p_neg_pre* relation_compound) {return _node("relation_negation", expr);}
relation_compound = expr:(relation_core+) {return _node("relation_compound", expr);}
relation_core = expr:(lexicalized_relation / foreign_relation / free_quote / abstraction / relation_word) {return _node("relation_core", expr);}

lexicalized_relation = expr:(lexicalized_relation_1 / lexicalized_relation_2 / lexicalized_relation_3 / lexicalized_relation_4 / lexicalized_relation_5 / lexicalized_relation_n) {return _node("lexicalized_relation", expr);}
lexicalized_relation_1 = expr:(p_lexicalized_relation_1 word) {return _node("lexicalized_relation_1", expr);}
lexicalized_relation_2 = expr:(p_lexicalized_relation_2 word word) {return _node("lexicalized_relation_2", expr);}
lexicalized_relation_3 = expr:(p_lexicalized_relation_3 word word word) {return _node("lexicalized_relation_3", expr);}
lexicalized_relation_4 = expr:(p_lexicalized_relation_4 word word word word) {return _node("lexicalized_relation_4", expr);}
lexicalized_relation_5 = expr:(p_lexicalized_relation_5 word word word word word) {return _node("lexicalized_relation_5", expr);}
lexicalized_relation_n = expr:(p_lexicalized_relation_n_open (!p_lexicalized_relation_n_close word)+ p_lexicalized_relation_n_close) {return _node("lexicalized_relation_n", expr);}

foreign_relation = expr:(foreign_relation_1 / foreign_relation_2 / foreign_relation_3 / foreign_relation_4 / foreign_relation_5 / foreign_relation_n) {return _node("foreign_relation", expr);}
foreign_relation_1 = expr:(p_foreign_relation_1 word) {return _node("foreign_relation_1", expr);}
foreign_relation_2 = expr:(p_foreign_relation_2 word word) {return _node("foreign_relation_2", expr);}
foreign_relation_3 = expr:(p_foreign_relation_3 word word word) {return _node("foreign_relation_3", expr);}
foreign_relation_4 = expr:(p_foreign_relation_4 word word word word) {return _node("foreign_relation_4", expr);}
foreign_relation_5 = expr:(p_foreign_relation_5 word word word word word) {return _node("foreign_relation_5", expr);}
foreign_relation_n = expr:(p_foreign_relation_n_open (!p_foreign_relation_n_close word)+ p_foreign_relation_n_close) {return _node("foreign_relation_n", expr);}

free_quote = expr:(p_free_quote (space?) foreign_open space (foreign_word space)* foreign_close) {return _node("free_quote", expr);}

abstraction = expr:(p_abstraction_open predicate p_abstraction_close?) {return _node("abstraction", expr);}

// PARTICLES (tmp)
// - Abstractions
//   x1 is abstraction of [predicate] ...
p_abstraction_open = expr:(!p_abstraction_close space? (b vowel / diphtong)) {return _node("p_abstraction_open", expr);}
p_abstraction_close = expr:(space? (b a i)) {return _node("p_abstraction_close", expr);}

// - Scoping
p_scope_open = expr:(space? (k a)) {return _node("p_scope_open", expr);}
p_scope_close = expr:(space? (k a i)) {return _node("p_scope_close", expr);}

// - Lexicalized relation
//   A string of words (particle or relation) can be lexicalized to have a unique relation meaning.
//
//   The particle depends on how many words form the lexicalized relation.
//   More than 5 words requires a closing particle.
p_lexicalized_relation_1 = expr:(space? (a)) {return _node("p_lexicalized_relation_1", expr);}
p_lexicalized_relation_2 = expr:(space? (e)) {return _node("p_lexicalized_relation_2", expr);}
p_lexicalized_relation_3 = expr:(space? (i)) {return _node("p_lexicalized_relation_3", expr);}
p_lexicalized_relation_4 = expr:(space? (o)) {return _node("p_lexicalized_relation_4", expr);}
p_lexicalized_relation_5 = expr:(space? (u)) {return _node("p_lexicalized_relation_5", expr);}
p_lexicalized_relation_n_open = expr:(space? (l a)) {return _node("p_lexicalized_relation_n_open", expr);}
p_lexicalized_relation_n_close = expr:(space? (l a i)) {return _node("p_lexicalized_relation_n_close", expr);}

// - Foreign relation
//   A string of words (particle or relation) used without their meaning to express some foreign concept.
//   x1 is [foreign concept].
//
//   The particle depends on how many words form the foreign relation.
//   More than 5 words requires a closing particle.
p_foreign_relation_1 = expr:(space? (m a)) {return _node("p_foreign_relation_1", expr);}
p_foreign_relation_2 = expr:(space? (m e)) {return _node("p_foreign_relation_2", expr);}
p_foreign_relation_3 = expr:(space? (m i)) {return _node("p_foreign_relation_3", expr);}
p_foreign_relation_4 = expr:(space? (m o)) {return _node("p_foreign_relation_4", expr);}
p_foreign_relation_5 = expr:(space? (m u)) {return _node("p_foreign_relation_5", expr);}

p_foreign_relation_n_open = expr:(space? (l e)) {return _node("p_foreign_relation_n_open", expr);}
p_foreign_relation_n_close = expr:(space? (l e i)) {return _node("p_foreign_relation_n_close", expr);}

// - Free quote
//   Quote any string with provided quote word.
//   x1 is text [quoted text]
p_free_quote = expr:(space? (l i)) {return _node("p_free_quote", expr);}

// - Grammatical quotation
//   Quote a grammatical valid text
//   x1 is text [quoted text]
p_grammatical_quote_open = expr:(space? (l o)) {return _node("p_grammatical_quote_open", expr);}
p_grammatical_quote_close = expr:(space? (l o i)) {return _node("p_grammatical_quote_close", expr);}

// - Predicate numeral place tag
p_predicate_place = expr:(space? (f vowel / f a i / c e)) {return _node("p_predicate_place", expr);} // 1..5 places / place question / next numeral place

// - Predicate tail
p_predicate_tail_open_elidible = expr:((space? (c a))? ) {return (expr == "" || !expr) ? ["p_predicate_tail_open"] : _node_empty("p_predicate_tail_open_elidible", expr);}
p_predicate_tail_close_elidible = expr:((space? (c a i))?) {return (expr == "" || !expr) ? ["p_predicate_tail_close"] : _node_empty("p_predicate_tail_close_elidible", expr);}

// - Forethought connectives
p_pre_connective_open = expr:(space? g a) {return _node("p_pre_connective_open", expr);}
p_pre_connective_separator = expr:(space? g i) {return _node("p_pre_connective_separator", expr);}
p_pre_connective_close = expr:(space? g a i) {return _node("p_pre_connective_close", expr);}

// - Afterthought connectives
p_post_log_connective = expr:(space? j vowel) {return _node("p_post_log_connective", expr);} // a/e/o/u + i question

// - Negations
p_neg_pre = expr:(space? (n a)) {return _node("p_neg_pre", expr);}
p_neg_post = expr:(space? (n a i)) {return _node("p_neg_post", expr);}

// - Literals
p_letter = expr:(space? (consonant y / vowel_y h y / (i / u) y h y / y i h y )) {return _node("p_letter", expr);} // consonant / vowel / semi-vowel / h

// MORPHOLOGY
// - Forein text quoting
foreign_open = expr:(word) { _assign_foreign_delim(expr); return _node("foreign_open", expr); }
foreign_word = expr:((!space .)+ ) !{ return _is_foreign_delim(expr); } { return ["foreign_word", join_expr(expr)]; }
foreign_close = expr:(word) &{ return _is_foreign_delim(expr); } { return _node("foreign_close", expr); }

// - Legal words
word = expr:(particle_word / relation_word) {return _node("word", expr);}
particle_word = expr:(space? consonant? vowel_tail) {return _node("particle_word", expr);}
relation_word = expr:(space? consonant_pair vowel_tail) {return _node("relation_word", expr);}

// - Legal vowels and vowel tails
vowel_tail = expr:((diphtong / vowel_y) (h (diphtong / vowel_y ))*) {return _node("vowel_tail", expr);}
diphtong = expr:((i / u) vowel_y / (a / e / o / y) i) {return _node("diphtong", expr);}
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
consonant_pair = expr:((&initial consonant consonant !consonant)) {return _node("consonant_pair", expr);}
initial = expr:((affricate / sibilant? other? liquid?) !consonant) {return _node("initial", expr);}

consonant = expr:((voiced / unvoiced / syllabic)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t !l / k / f / x / b / d !l / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s !x / (j / z) !n !liquid)) {return _node("sibilant", expr);}
syllabic = expr:((l / m / n / r)) {return _node("syllabic", expr);}
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
space = expr:(space_1+ (dot &vowel)? / dot &vowel) {return _node("space", expr);}
space_1 = expr:(space_char / hesitation space_char) {return _node("space_1", expr);}
hesitation = expr:(space_char+ dot? y+ dot? space_char+) {return _node("hesitation", expr);}

// - Special characters
dot = expr:('.') {return _node("dot", expr);}
space_char = expr:([.\t\n\r?!\u0020]) {return _join(expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
