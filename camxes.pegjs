// GRAMMAR
{
  var _g_zoi_delim;

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

  // === ZOI functions === //

  function _assign_zoi_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: ZOI word is of type " + typeof w;
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    _g_zoi_delim = w;
    return;
  }

  function _is_zoi_delim(w) {
    if (is_array(w)) w = join_expr(w);
    else if (!is_string(w)) throw "ERROR: ZOI word is of type " + typeof w;
    /* Keeping spaces in the parse tree seems to result in the absorbtion of
       spaces into the closing delimiter candidate, so we'll remove any space
       character from our input. */
    w = w.replace(/[.\t\n\r?!\u0020]/g, "");
    w = w.toLowerCase().replace(/,/gm,"").replace(/h/g, "'");
    return w === _g_zoi_delim;
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
predicate_tail_core = expr:(gw_predicate_tail_open? relation predicate_term* gw_predicate_tail_close?) {return _node("predicate_tail_core", expr);}
predicate_term = expr:(gw_predicate_place relation) {return _node("predicate_term", expr);}

relation = expr:(relation_negation) {return _node("relation", expr);}
relation_negation = expr:(gw_neg_pre* relation_compound) {return _node("relation_negation", expr);}
relation_compound = expr:(relation_core+) {return _node("relation_compound", expr);}
relation_core = expr:(lexicon_relation / relation_word) {return _node("relation_core", expr);}

lexicon_relation = expr:(gw_lexicon_open (space? word)+ space? gw_lexicon_close) {return _node("lexicon_relation", expr);} // lujvo equivalent
free_relation = expr:(gw_free_relation free_word) {return _node("free_relation", expr);} // non-native word / ze'ivla / cmevla

// GRAMMAR WORDS (tmp)
gw_abstraction_open = expr:(!gw_abstraction_close space? (b vowel / diphtong)) {return _node("gw_abstraction_open", expr);}
gw_abstraction_close = expr:(space? (b a i)) {return _node("gw_abstraction_close", expr);}

gw_scope_open = expr:(space? (k a)) {return _node("gw_scope_open", expr);}
gw_scope_close = expr:(space? (k a i)) {return _node("gw_scope_close", expr);}

gw_lexicon_open = expr:(space? (a)) {return _node("gw_lexicon_open", expr);}
gw_lexicon_close = expr:(space? (z a)) {return _node("gw_lexicon_close", expr);}

gw_free_relation = expr:(space? (o)) {return _node("gw_free_relation", expr);}

gw_predicate_place = expr:(space? (f vowel / f a i / c i)) {return _node("gw_predicate_place", expr);} // 1..5 places / place question / next numeral place
gw_predicate_tail_open = expr:(space? (c a)) {return _node("gw_predicate_tail_open", expr);}
gw_predicate_tail_close = expr:(space? (c a i)) {return _node("gw_predicate_tail_close", expr);}

gw_pre_connective_open = expr:(space? g vowel) {return _node("gw_pre_connective_open", expr);} // a/e/o/u + i question
gw_pre_connective_separator = expr:(space? g o i) {return _node("gw_pre_connective_separator", expr);}
gw_pre_connective_close = expr:(space? g a i) {return _node("gw_pre_connective_close", expr);}
gw_post_log_connective = expr:(space? j vowel) {return _node("gw_post_log_connective", expr);} // a/e/o/u + i question

gw_neg_pre = expr:(space? (n a)) {return _node("gw_neg_pre", expr);}
gw_neg_post = expr:(space? (n a i)) {return _node("gw_neg_post", expr);}

gw_letter = expr:(space? (consonant y / vowel_y h y / (i / u) y h y / y i h y )) {return _node("gw_letter", expr);} // consonant / vowel / semi-vowel / h


// MORPHOLOGY
// extern_quote <- extern_quote_begin extern_quote_part* extern_quote_end
// extern_quote_begin <- PUSH(word)
// extern_quote_part <- space !PEEK free_word
// extern_quote_end <- space POP

zoi_open = expr:(word) { _assign_zoi_delim(expr); return _node("zoi_open", expr); }
zoi_word = expr:(free_word) !{ return _is_zoi_delim(expr); } { return ["zoi_word", join_expr(expr)]; }
zoi_close = expr:(word) &{ return _is_zoi_delim(expr); } { return _node("zoi_close", expr); }

free_word = expr:((!space .)+) {return _node("free_word", expr);}
word = expr:(grammar_word / relation_word) {return _node("word", expr);}
grammar_word = expr:(space? consonant? vowel_tail) {return _node("grammar_word", expr);}
relation_word = expr:(space? consonant_pair vowel_tail) {return _node("relation_word", expr);}

vowel_tail = expr:((diphtong / vowel_y) (h (diphtong / vowel_y ))*) {return _node("vowel_tail", expr);}
diphtong = expr:((i / u) vowel_y / (a / e / o / y) i) {return _node("diphtong", expr);}
vowel_y = expr:(vowel / y) {return _node("vowel_y", expr);}
vowel = expr:(a / e / i / o / u) {return _node("vowel", expr);}
h = expr:(['h']) {return _node("h", expr);}
a = expr:([aA]) {return _node("a", expr);}
e = expr:([eE]) {return _node("e", expr);}
i = expr:([iI]) {return _node("i", expr);}
o = expr:([oO]) {return _node("o", expr);}
u = expr:([uU]) {return _node("u", expr);}
y = expr:([yY]) {return _node("y", expr);}

consonant_pair = expr:(consonant consonant) {return _node("consonant_pair", expr);}
consonant = expr:((voiced / unvoiced / syllabic)) {return _node("consonant", expr);}
affricate = expr:((t c / t s / d j / d z)) {return _node("affricate", expr);}
liquid = expr:((l / r)) {return _node("liquid", expr);}
other = expr:((p / t !l / k / f / x / b / d !l / g / v / m / n !liquid)) {return _node("other", expr);}
sibilant = expr:((c / s !x / (j / z) !n !liquid)) {return _node("sibilant", expr);}
syllabic = expr:((l / m / n / r)) {return _node("syllabic", expr);}
voiced = expr:((b / d / g / j / v / z)) {return _node("voiced", expr);}
unvoiced = expr:((c / f / k / p / s / t / x)) {return _node("unvoiced", expr);}
l = expr:([lL] !l) {return _node("l", expr);}
m = expr:([mM] !m) {return _node("m", expr);}
n = expr:([nN] !n !affricate) {return _node("n", expr);}
r = expr:([rR] !r) {return _node("r", expr);}
b = expr:([bB] !b !unvoiced) {return _node("b", expr);}
d = expr:([dD] !d !unvoiced) {return _node("d", expr);}
g = expr:([gG] !g !unvoiced) {return _node("g", expr);}
v = expr:([vV] !v !unvoiced) {return _node("v", expr);}
j = expr:([jJ] !j !z !unvoiced) {return _node("j", expr);}
z = expr:([zZ] !z !j !unvoiced) {return _node("z", expr);}
s = expr:([sS] !s !c !voiced) {return _node("s", expr);}
c = expr:([cC] !c !s !x !voiced) {return _node("c", expr);}
x = expr:([xX] !x !c !k !voiced) {return _node("x", expr);}
k = expr:([kK] !k !x !voiced) {return _node("k", expr);}
f = expr:([fF] !f !voiced) {return _node("f", expr);}
p = expr:([pP] !p !voiced) {return _node("p", expr);}
t = expr:([tT] !t !voiced) {return _node("t", expr);}

space = expr:((space_char / hesitation space_char)+) {return _node("space", expr);}
// space <- " "
hesitation = expr:(y+) {return _node("hesitation", expr);}

space_char = expr:([.\t\n\r?!\u0020]) {return _join(expr);}
EOF = expr:(!.) {return _node("EOF", expr);}
