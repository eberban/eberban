// EBERBAN GRAMMAR - v0.64

// Conventions:
// - E_ prefixed rules match forbidden patterns that should halt parsing and report
//   helpfull err. As the rule should not appear in a valid text, usage of err rules
//   in normal rules should be prefixed by `!`. The error reporting should be done as
//   `&{ return err("message") }`, which queues the error and make the rule match.
//   Queue error are processed in the top rules of the parser, but will be discarded
//   when using the sentence eraser RA (hense why it's more complex than just using peggy's error fn).
// - W_ prefixed rules match patterns that are accepted for convenience but that are not considered
//   correct. They don't halt parsing and instead registers warnings that are all returned alongside
//   the parsing output. As pattern can or cannot appear, usage of warning rules in normal rules
//   should be suffixed with `?`. The pattern must fully parse the accepted mistake for the rest of the
//   parsing to continue.
// - When combining multiple err/warning rules, keep the match "positive", do not use `!` or `?`.
//   Usage of `!` or `?` must be kept at call-site.
//
// Hints:
// - @ operator is called "pluck" operator. When used, only terms prefixed with @ will be returned from the
//   rule, and other terms will be matched but silenced. Only one @ returns the output as-is, while multiple
//   @ return an array.
// - `terms { JS code }` match terms, but override its output by what is returned by the code. Code has access
//   to named terms of the form `name:term`. This cannot be used alongside @ pluck operator in the same scope
//   (`()` scopes or whole rule if no `()` scopes)

// Per-parse initializer
{
	var warnings = [];
    var pending_error = null;
    
    function warn(msg) {
    	warnings.push({
        	message: msg,
            location: location()
        })
    }
    
    function recur_join(input, sep = "") {
    	var out = "";
        var first = true;
        
        for(const x of input) {
            if(first) {
                first = false;
            } else {
                out += sep;
            }

        	if(Array.isArray(x)) {
            	out += recur_join(x, sep);
            } else if(x != null) {
            	out += x;	
            }
        }
        
        return out
    }

    function stringify_word(word) {
        if(word.family == "Compound") {
            return `${word.prefix} ${word.list.map(stringify_word).join(" ")}`
        }

        if(word.family == "FFVariable") {
            if(word.content.startsWith("i")) {
                return `i.${word.content}`;
            }
            return `i${word.content}`;
        }

        if(word.family == "Borrowing") {
            if(word.content.startsWith("u")) {
                return `u.${word.content}`;
            }
            return `u${word.content}`;
        }

        if(word.family == "Root" || word.family == "Particle") {
            return word.word;
        }

        return "<unknown word type>"
    }

    function with_free(word, free_pre, free_post) {
        if(free_pre?.length) {
            word.free_pre = free_pre
        }

        if(free_post?.length) {
            word.free_post = free_post
        }

        return word
    }

    function elidible(maybe_word, def) {
        if(maybe_word != null && maybe_word != undefined) {
            return maybe_word
        }

        def.elided = true
        return def
    }

    function err(text) {
        pending_error = {
            message: text,
            location: location()
        };

        return false;
    }
}

// Actually report pending error if it has not been erased.
MainWithError = @MainWithWarnings &{
    if(pending_error) {
        error(pending_error.message, pending_error.location);
    } 
    return true
}
// Main rule, match flags, text prefixes, paragraphs, and include collected warnings
MainWithWarnings = main:Text { 
    if(warnings?.length > 0)
        main.warnings = warnings;
    return main
}
Text = flags: LanguageFlags pre:(FreePrefix)* para:Paragraphs? Spaces? EOF?
    { return { flags, pre, paragraphs: para } }
LanguageFlags = DO_Free*

// # Text structure ================================================

Paragraphs = head:Paragraph tail:(&PO_Free @Paragraph)* { return [head, ...tail] }
Paragraph = starter:PO_Free? head:Sentence tail:(&SentenceStarter @Sentence / SentenceErasedInvalid)* { return { starter, sentences: [head, ...tail]}}

// We want grammatical sentences that can be followed by RA to erase them, which means 
// SentenceErasedValid must appear first. While we want to erase ungrammatical text with RA, we don't
// want it to trigger inside a grammatical sentence, which can be possible with a foreign quote.
Sentence = SentenceErasedValid / SentenceChoice / SentenceErasedInvalid

// Ensure sentence ends because a new sentence/paragraph star, end of quote/text is reached or sentence
// eraser at the end of a valid sentence, instead of just failing to parse more. Necessary to make
// SentenceErasedInvalid work properly, as an invalid sentence starting valid would otherwise split into 2 sentences.
SentenceChoice = @(SentenceO / SentenceNI / SentenceA) !E_UnmatchedResume &PostSentence
PostSentence = Spaces? (SentenceStarter / PO_Free / CAI_Free / RA / EOF)
SentenceStarter = A_Free / O_Free / NI_Free

E_UnmatchedResume = PA_Free chain:ChainVerbAndBinds &{ return err(
`Failed to resume binding. Note that while leading SI can differ, anything following a ZI must match.`
)}

SentenceErasedValid = s:SentenceChoice eraser:SentenceEraser { s.kind = `Erased ${s.kind}`; s.eraser = eraser; return s }
SentenceErasedInvalid = starter:SentenceStarter? rest:(!SentenceEraser @.)* eraser:SentenceEraser
    &{ pending_error = null; return true }
    { return { kind: "Erased Invalid", starter, rest: rest.join("").trim(), eraser }}

SentenceO = starter:O_Free defined:VerbDefinable definition:DefinitionWithArguments
    { return { kind: "O Sentence", starter, defined, definition }}
SentenceA = starter:A_Elidible definition:DefinitionWithArguments { return { kind: "A Sentence", starter, definition}}
SentenceNI = starter:NI_Free pred:VerbDefinable { return { kind: "NI Sentence", starter, pred }}

// # Chaining ========================================

DefinitionWithArguments = args: ArgumentsList? chain:Chain
    {
        if(args != null) return { args, chain }
        return chain
    }
ArgumentsList = list:(KI_Free / GI_Free / BA_Free)* end:BE_Free { return { list, end }}

Chain = erased:ChainErased* inner:ChainInner
    {
        if(erased?.length) inner.erased_before = erased;
        return inner
    }
ChainErased = chain:ChainInner eraser:ChainEraser { return { chain, eraser }}
ChainNegation = neg:BI_Free chain:Chain { return {wide_negation:neg, ...chain} }

ChainInner = ChainNegation
    / chain:ChainVerbAndBinds next:ChainInner? resume:(
        resume_start:PA_Free resume_chain:ChainVerbAndBinds
        &{ 
            // Can we do this without JSON.stringify?!
            return JSON.stringify(chain.verb) === JSON.stringify(resume_chain.verb)
        }
        resume_next:ChainInner?
        { 
            var res = { start: resume_start, chain: resume_chain };

            if(resume_next != null) res.next = resume_next;
            
            return res
        }
    )*
    { 
        if(next != null) chain.next = next;

        if(resume?.length == 1) chain.resume = resume[0];
        if(resume?.length > 1) chain.resume = resume;


        return chain
    }

ChainVerbAndBinds = select:SI_Free? verb:ChainVerb exp:ExplicitBindGroup*
    {
        var chain = { }

        if(select != null) chain.select = select;

        chain.verb = verb;
    
        if(exp?.length == 1) chain.explicit_binds = exp[0];
        else if(exp?.length > 1) chain.explicit_binds = exp;

        return chain;
    }

ExplicitBindGroup = first:ExplicitBindFirst next:ExplicitBindNext* end:VEI_Elidible
    {
        return {
            binds: [first, ...next].map(x => {
                var res = {};

                if(x[0] != null) res.wide_negation = x[0];

                res.start = x[1];
                res.inner = x[2];

                return res
            }),
            end
        }
    }
ExplicitBindFirst = BI_Free? VI_Free DefinitionWithArguments
ExplicitBindNext = BI_Free? FI_Free DefinitionWithArguments

ChainVerb = verb:(ChainVerbModified / ChainVerbSelect) post:FreePostfix*
    {
        if(post?.length)
            verb.post = post;
        return verb
    }
ChainVerbModified = modifier:ZI_Free select:SI_Free? verb:(ChainVerbModified / ChainVerbSelect)
    { 
        var res = { modifier }

        if(select != null) res.select = select;
        res.verb = verb;
        return res;
    }
ChainVerbSelect = VerbDefinableUsage / VerbInlineAssignment / KI_Free / BA_Free / MI_Free
    / VerbQuote / VerbEnum / BorrowingGroup / Number

// # Definable =======================================

VerbInlineAssignment = pre:FreePrefix* start:BO_Free verb:(KI_Free / VerbDefinable)
    { return { kind: "InlineAssignment", pre, start, verb }}
VerbDefinable = !MI_Free @VerbDefinableUsage
VerbDefinableUsage = namespace:VerbDefinableNamespace* verb:VerbDefinablePart
    {
        if(namespace?.length == 1)
            return { namespace: namespace[0], ...verb }
        if(namespace?.length > 1)
            return { namespace: namespace, ...verb }
        return verb
    }
VerbDefinableNamespace = parent:(VerbDefinablePart / MI_Free) sep:PI_Free
    { return { parent, sep }}
VerbDefinablePart = pre:FreePrefix* Spaces?
    word:(GI_Free / FreeformVariable / Compound / RootWord)
    {
        if(pre?.length)
            return { pre, ...word }
        return word
    }

// # Quotes =============================================

VerbQuote = GrammaticalQuote / SingleWordQuote / ForeignQuote / SpellingQuote

GrammaticalQuote = start:CA_Free text:Text end:CAI_Free
    { return { kind: "GrammaticalQuote", start, text, end }}

SingleWordQuote = start:CI_Free Spaces? word:(NativeWord / Compound / Borrowing)
    { return { kind: "SingleWordQuote", start, word }}

ForeignQuote = (ForeignQuoteElided / ForeignQuoteSimple / ForeignQuoteEscaped)
ForeignQuoteElided = start:COI_Free { return { kind: "Foreign Quote", particle: start}}
ForeignQuoteSimple = start:CO_Free
    (!QuoteMarkStart SpaceChar)*
    QuoteMarkStart content:(!QuoteMarkEnd @.)* end:QuoteMarkEnd
    { return { kind: "ForeignQuote", start, content: content.join("")}}
ForeignQuoteEscaped = start:CO_Free Spaces? mark_start:NativeForm QuoteMarkStart
    content:(
        !(QuoteMarkEnd mark_end:NativeWord &{ return mark_start == mark_end.word })
        @.
    )*
    QuoteMarkEnd mark_end:NativeWord &{ return mark_start == mark_end.word }
    { return { kind: "ForeignQuote", start, delim: mark_start, content: content.join("")}}

SpellingQuote = starter:CE_Free items:SpellingQuoteItem+ end:CEI_Free { kind: "Spelling Quote", starter, items, end}
SpellingQuoteItem = Spaces? !CEI x:(InitialPair / Consonant)? y:Vhowels { return recur_join([x, y]) }

// # Enum =============================================

VerbEnum = start:PE_Free inner:(VerbEnumCompact / VerbEnumFull) end:PEI_Elidible
    {
        var res = {start, ...inner}
        res.end = end
        return end
    }

VerbEnumCompact = sep:BU_Free items:(BI_Free? ChainVerbAndBinds)* !BU_Free
    { return { sep, items: items.map((x) => {
        if(x[0] != null)
            return { wide_negation:x[0], chain: x[1] }
        return { chain: x[1] }
    }) }}
VerbEnumFull = args:ArgumentsList? x:Chain y:(BU_Free Chain)*
    {
        var res = {}

        if(args != null) res.args = args;
        res.items = [
            {sep: null, chain:x},
            ...(y.map((x) => {
                return {sep: x[0], chain: x[1] }
            }))
        ];
        return res
    }

// # Numbers ==========================================

Number "number" = x:NumberFormat
    &{
        if(x.base == null && x.int == null && x.fract == null && x.repeat == null && x.magn == null) {
            if(x.end.elided) {
                return false; // matched nothing, can be anything else
            }

            return err("Cannot use JI alone, must be preceded by at least one digit");
        }

        if(x.fract == null && x.repeat != null) {
            return err("Repeating digits can only appear in a fractional part (started with JO)");
        }

        if(x.base != null && x.int == null && x.fract == null && x.magn == null) {
            return err(
                "Cannot specify a number with only the base part.\n" +
                "Provide an integer part, a fractional part (with JO) or a magnitude (with JE)"
            );
        }

        return true;
    }
    { return { family: "Number", value: x }}

NumberFormat =
    base:NumberBase? int:NumberDigits fract:NumberFractional? repeat:NumberRepeat? magn:NumberMagnitude? end:JI_Elidible
    { return { base, int, fract, repeat, magn, end} }
NumberBase = !E_NumberEmptyBase value:TI_Free sep:JU_Free { return { value, sep }}
NumberFractional = !E_NumberEmptyFractional sep:JO_Free value:NumberDigits { return { sep, value }}
NumberRepeat = !E_NumberEmptyRepeat sep:JA_Free value:NumberDigits { return { sep, value }}
NumberMagnitude = !E_NumberEmptyMagnitude sep:JE_Free value:NumberDigits { return { sep, value }}
NumberDigits = TI_Free+

E_NumberEmptyBase = JU_Free &{ return err("JU must be prefixed by at least one TI") }
E_NumberEmptyFractional = JO_Free !NumberDigits &{ return err("JO must be followed by at least one TI") }
E_NumberEmptyRepeat = JA_Free !NumberDigits &{ return err("JA must be followed by at least one TI") }
E_NumberEmptyMagnitude = JE_Free !NumberDigits &{ return err("JE must be followed by at least one TI") }

// # Borrowing groups =================================

BorrowingGroup = x:(Spaces? @Borrowing)+ y:BE_Elidible { return { family: "BorrowingGroup", group: x, end: y } }

// # Free pre/post ========================================

FreePrefix "free prefix" = FreeMetadata
FreePostfix "free postfix" = "?"

FreeMetadata = scope:FreeScope? meta:DI_Free {
    if(scope != null)
        return { scope, meta }
    return { meta }
}
FreeScope = DU_Free

// # Particle families with free pre/post ================

A_Free   = pre:FreePrefix* Spaces? w:A    post:FreePostfix*  { return with_free(w, pre, post) }
O_Free   = pre:FreePrefix* Spaces? w:O    post:FreePostfix*  { return with_free(w, pre, post) }
NI_Free  =                 Spaces? w:NI                      { return with_free(w, [], []) }

BI_Free  = pre:FreePrefix* Spaces? w:BI    post:FreePostfix* { return with_free(w, pre, post) }
BE_Free  =                 Spaces? w:BE                      { return with_free(w, [], []) }
BA_Free  = pre:FreePrefix* Spaces? w:BA                      { return with_free(w, pre, []) }
BO_Free  = pre:FreePrefix* Spaces? w:BO                      { return with_free(w, pre, []) }
BU_Free  = pre:FreePrefix* Spaces? w:BU                      { return with_free(w, pre, []) }

DI_Free  =                 Spaces? w:DI                      { return with_free(w, [], []) }
DE_Free  =                 Spaces? w:DE                      { return with_free(w, [], []) }
DA_Free  =                 Spaces? w:DA                      { return with_free(w, [], []) }
DAI_Free =                 Spaces? w:DAI                     { return with_free(w, [], []) }
DO_Free  =                 Spaces? w:DO                      { return with_free(w, [], []) }
DU_Free  =                 Spaces? w:DU                      { return with_free(w, [], []) }

SI_Free  = pre:FreePrefix* Spaces? w:SI                      { return with_free(w, pre, []) }
ZI_Free  = pre:FreePrefix* Spaces? w:ZI                      { return with_free(w, pre, []) }
FI_Free  = pre:FreePrefix* Spaces? w:FI    post:FreePostfix* { return with_free(w, pre, post) }
VI_Free  = pre:FreePrefix* Spaces? w:VI    post:FreePostfix* { return with_free(w, pre, post) }
VEI_Free =                 Spaces? w:VEI                     { return with_free(w, [], []) }

GI_Free  =                 Spaces? w:GI                      { return with_free(w, [], []) }
KI_Free  =                 Spaces? w:KI                      { return with_free(w, [], []) }
MI_Free  = pre:FreePrefix* Spaces? w:MI                      { return with_free(w, pre, []) }

PI_Free  =                 Spaces? w:PI                      { return with_free(w, [], []) }
PE_Free  = pre:FreePrefix* Spaces? w:PE    post:FreePostfix* { return with_free(w, pre, post) }
PEI_Free =                 Spaces? w:PEI                     { return with_free(w, [], []) }
PA_Free  =                 Spaces? w:PA                      { return with_free(w, [], []) }
PO_Free  = pre:FreePrefix* Spaces? w:PO    post:FreePostfix* { return with_free(w, pre, post) }
PU_Free  =                 Spaces? w:PU                      { return with_free(w, [], []) }

TI_Free  =                 Spaces? w:TI                      { return with_free(w, [], []) }

JI_Free  =                 Spaces? w:JI                      { return with_free(w, [], []) }
JE_Free  =                 Spaces? w:JE                      { return with_free(w, [], []) }
JA_Free  =                 Spaces? w:JA                      { return with_free(w, [], []) }
JO_Free  =                 Spaces? w:JO                      { return with_free(w, [], []) }
JU_Free  =                 Spaces? w:JU                      { return with_free(w, [], []) }

CI_Free  = pre:FreePrefix* Spaces? w:CI                      { return with_free(w, pre, []) }
CE_Free  = pre:FreePrefix* Spaces? w:CE                      { return with_free(w, pre, []) }
CEI_Free = pre:FreePrefix* Spaces? w:CEI                     { return with_free(w, pre, []) }
CA_Free  = pre:FreePrefix* Spaces? w:CA                      { return with_free(w, pre, []) }
CAI_Free = pre:FreePrefix* Spaces? w:CAI                     { return with_free(w, pre, []) }
CO_Free  = pre:FreePrefix* Spaces? w:CO                      { return with_free(w, pre, []) }
COI_Free = pre:FreePrefix* Spaces? w:COI                     { return with_free(w, pre, []) }

A_Elidible   = x:A_Free?   { return elidible(x, { family: "A", word: "a" })}
BE_Elidible  = x:BE_Free?  { return elidible(x, { family: "BE", word: "be" })}
PEI_Elidible = x:PEI_Free? { return elidible(x, { family: "PEI", word: "pei" })}
VEI_Elidible = x:VEI_Free? { return elidible(x, { family: "PEI", word: "pei" })}
JI_Elidible  = x:JI_Free?  { return elidible(x, { family: "JI", word: "jie" })}

// # Particle families ==============================

ClassifiedParticle = A / O / NI
    / MI
    / PI / PE / PEI / PA / PO / PU
    / BI / BE / BA / BO / BU
    / FI / VI / VEI
    / TI
    / DI / DE / DA / DAI / DO / DU
    / SI / ZI
    / CI / CE / CEI / CA / CAI / CO / COI / CU
    / JI / JE / JA / JO / JU
    / KI / GI

A   = &ParticleWord        &(OH &a ParticleFormNAOX OH &PostWord)    x:ParticleWord { return { family:"A", word: x.word }}
O   = &ParticleWord        &(OH &o ParticleFormNAOX OH &PostWord)    x:ParticleWord { return { family:"O", word: x.word }}
NI  = &ParticleWord        &(OH &n ParticleFormNAOX OH &PostWord)    x:ParticleWord { return { family:"NI", word: x.word }}

MI  = &ParticleWord        &(OH m OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"MI", word: x.word }}

PI  = &ParticleWord        &(OH p OH &i Vhowels OH &PostWord)        x:ParticleWord { return { family:"PI", word: x.word }}
PE  = &ParticleWord !(PEI) &(OH p OH &e Vhowels OH &PostWord)        x:ParticleWord { return { family:"PE", word: x.word }}
PEI = &ParticleWord        &(OH p OH e OH i OH &PostWord)            x:ParticleWord { return { family:"PEI", word: x.word }}
PA  = &ParticleWord        &(OH p OH &a Vhowels OH &PostWord)        x:ParticleWord { return { family:"PA", word: x.word }}
PO  = &ParticleWord        &(OH p OH &o Vhowels OH &PostWord)        x:ParticleWord { return { family:"PO", word: x.word }}
PU  = &ParticleWord        &(OH p OH &u Vhowels OH &PostWord)        x:ParticleWord { return { family:"PU", word: x.word }}

BI  = &ParticleWord        &(OH b OH &i Vhowels OH &PostWord)        x:ParticleWord { return { family:"BI", word: x.word }}
BE  = &ParticleWord        &(OH b OH &e Vhowels OH &PostWord)        x:ParticleWord { return { family:"BE", word: x.word }}
BA  = &ParticleWord        &(OH b OH &a Vhowels OH &PostWord)        x:ParticleWord { return { family:"BA", word: x.word }}
BO  = &ParticleWord        &(OH b OH &o Vhowels OH &PostWord)        x:ParticleWord { return { family:"BO", word: x.word }}
BU  = &ParticleWord        &(OH b OH &u Vhowels OH &PostWord)        x:ParticleWord { return { family:"BU", word: x.word }}

FI  = &ParticleWord        &(OH f OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"FI", word: x.word }}
VI  = &ParticleWord !(VEI) &(OH v OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"VE", word: x.word }}
VEI = &ParticleWord        &(OH v OH e OH i OH &PostWord)            x:ParticleWord { return { family:"VEI", word: x.word }}

TI = W_TIMinusSymbol? @TI_Symbol W_TIMinusSymbol? W_TIMathSymbols? / TI_Word
TI_Word = &ParticleWord    &(OH t OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"TI", word: x.word }}
TI_Symbol = x:DigitSymbol                                                           { return { family:"TI", symbol: x }}

DI  = &ParticleWord        &(OH d OH &i Vhowels OH &PostWord)        x:ParticleWord { return { family:"DI", word: x.word }}
DE  = &ParticleWord        &(OH d OH &e Vhowels OH &PostWord)        x:ParticleWord { return { family:"DE", word: x.word }}
DA  = &ParticleWord !(DAI) &(OH d OH &a Vhowels OH &PostWord)        x:ParticleWord { return { family:"DA", word: x.word }}
DAI = &ParticleWord        &(OH d OH a OH i OH &PostWord)            x:ParticleWord { return { family:"DAI", word: x.word }}
DO  = &ParticleWord        &(OH d OH &o Vhowels OH &PostWord)        x:ParticleWord { return { family:"DO", word: x.word }}
DU  = &ParticleWord        &(OH d OH &u Vhowels OH &PostWord)        x:ParticleWord { return { family:"DU", word: x.word }}

SI  = &ParticleWord        &(OH s OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"SI", word: x.word }}
ZI  = &ParticleWord        &(OH z OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"ZI", word: x.word }}

CI  = &ParticleWord        &(OH c OH &i Vhowels OH &PostWord)        x:ParticleWord { return { family:"CI", word: x.word }}
CE  = &ParticleWord !(CEI) &(OH c OH &e Vhowels OH &PostWord)        x:ParticleWord { return { family:"CE", word: x.word }}
CEI = &ParticleWord        &(OH c OH e OH i OH &PostWord)            x:ParticleWord { return { family:"CEI", word: x.word }}
CA  = &ParticleWord !(CAI) &(OH c OH &a Vhowels OH &PostWord)        x:ParticleWord { return { family:"CA", word: x.word }}
CAI = &ParticleWord        &(OH c OH a OH i OH &PostWord)            x:ParticleWord { return { family:"CAI", word: x.word }}
CO  = &ParticleWord !(COI) &(OH c OH &o Vhowels OH &PostWord)        x:ParticleWord { return { family:"CO", word: x.word }}
COI = &ParticleWord        &(OH c OH o OH i OH &PostWord)            x:ParticleWord { return { family:"COI", word: x.word }}
CU  = &ParticleWord        &(OH c OH &u Vhowels OH &PostWord)        x:ParticleWord { return { family:"CU", word: x.word }}

JI  = &ParticleWord        &(OH j OH &i Vhowels OH &PostWord)        x:ParticleWord { return { family:"JI", word: x.word }}
JE  = &ParticleWord        &(OH j OH &e Vhowels OH &PostWord)        x:ParticleWord { return { family:"JE", word: x.word }}
JA  = &ParticleWord        &(OH j OH &a Vhowels OH &PostWord)        x:ParticleWord { return { family:"JA", word: x.word }}
JO  = &ParticleWord        &(OH j OH &o Vhowels OH &PostWord)        x:ParticleWord { return { family:"JO", word: x.word }}
JU  = &ParticleWord        &(OH j OH &u Vhowels OH &PostWord)        x:ParticleWord { return { family:"JU", word: x.word }}

KI  = &ParticleWord        &(OH k OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"KI", word: x.word }}
GI  = &ParticleWord        &(OH g OH Vhowels OH &PostWord)           x:ParticleWord { return { family:"GI", word: x.word }}

W_TIMinusSymbol = &HyphenChar OH { warn(
`Eberban doesn't support minus sign symbol and this is considered an hyphen, which is not allowed here.
Use particle "joi" to make a number negative, or use appropriate verb to perform substraction.`
)}
W_TIMathSymbols = &( " "* [/+*]) { warn(
`Eberban doesn't support math symbols, which are considered spaces.
Uuse appropriate verb to perform mathematical operation.`
)}

// # Compounds ========================================

Compound "compound" = W_HyphenPreWord? @(CompoundN / Compound3 / Compound2)
Compound2 = e W_CompoundPrefixPostHyphen?
    list:CompoundWord|2| { return { family: "Compound", prefix: "e", content: list }}
Compound3 = e W_CompoundHyphenInPrefix? n W_CompoundPrefixPostHyphen?
    list:CompoundWord|3| { return { family: "Compound", prefix: "en", content: list }}
CompoundN = e W_CompoundHyphenInPrefix? r W_CompoundPrefixPostHyphen?
    list:(!CompoundNEnd @CompoundWord)* CompoundNEnd
    &{
        if (list.length == 0)
            return err(`Empty compounds are not allowed`)
    } {
        if (list.length == 1) {
            warn(`Don't use compounds of size 1, directly use the word "${stringify_word(list[0])}" instead`);
        } else if (list.length == 2) {
            warn(`Use fixed-size compound "e ${list.map(stringify_word).join(" ")}" instead`);
        } else if (list.length == 3) {
            warn(`Use fixed-size compound "en ${list.map(stringify_word).join(" ")}" instead`);
        }

        return { family: "Compound", prefix: "er", content: list }
    }
CompoundNEnd = Spaces W_HyphenPreWord? e W_HyphenPostWord? Spaces
CompoundWord = Spaces? !E_IncompleteCompound !E_NestedCompound @(Borrowing / NativeWord)

E_NestedCompound = e &{ return err(
`Compounds cannot be nested`
)}
E_IncompleteCompound = EOF &{ return err(
`Compound is incomplete. If compound contains a borrowing, be sure to end the borrowing with a space to mark its end`
)}
W_CompoundPrefixPostHyphen = &HyphenChar OH { warn(
`Hyphen is not allowed after the e/EN/ER prefix of a compound, you can use space instead`
)}
W_CompoundHyphenInPrefix = &HyphenChar OH &(n/r) { warn(
`Hyphen is not allowed inside the EN/ER prefix of a compound`
)}

// # Freeform words ==================================

FreeformVariable "freeform variable" =
    W_FreeformVariablePreHyphen? i
    (   Spaces W_FreeformVariablePrefixHyphen?
        / W_FreeformVariablePrefixHyphen? W_IInitialFreeformVariable?
    )
    x:FreeformContent W_HyphenPostWord? FreeformEnd
    { return { family:"FFVariable", content: recur_join(x) } }
Borrowing "borrowing" =
    W_BorrowingVariablePreHyphen? u
    (   Spaces W_BorrowingPrefixHyphen?
        / W_BorrowingPrefixHyphen? W_UInitialBorrowing?
    )
    x:FreeformContent W_HyphenPostWord? FreeformEnd
    { return { family:"Borrowing", content: recur_join(x) } }
FreeformContent =
    (FreeformConsonants W_HyphenAfterMedialOrTriplet?/ h W_FreeformHyphenAfterH?)?
    Vhowels
    (FreeformConsonants Vhowels)*
    W_HyphenBeforeFinalConsonant? !E_FreeformMultiConsonentsEnding Consonant?
FreeformConsonants = TripletFreeform
    / MedialPair
    / @(Sonorant / m) OH @Consonant
    / OH @(&InitialPair W_HyphenInInitialPair? InitialPair / Consonant) W_FreeformHyphenAfterInitial?
FreeformEnd = &(SentenceEraser / SpaceChar / EOF)

W_FreeformVariablePreHyphen = &HyphenChar OH &i { warn(
`Hyphen is not allowed before the i prefix of a freeform variable`
)}
W_BorrowingVariablePreHyphen = &HyphenChar OH &u { warn(
`Hyphen is not allowed before the u prefix of a borrowing`
)}

W_FreeformVariablePrefixHyphen = &HyphenChar OH { warn(
`Hyphen is not allowed after the i prefix of a freeform variable, you can use space instead`
)}
W_BorrowingPrefixHyphen = &HyphenChar OH { warn(
`Hyphen is not allowed after the u prefix of a borrowing, you can use space instead`
)}

W_IInitialFreeformVariable = OH &i { warn(
`Freeform variables with content starting with i are required to start with a space without hyphen ("i i...")`
)}
W_UInitialBorrowing = OH &u { warn(
`Borrowings with content starting with u are required to start with a space without hyphen ("u u...")`
)}

W_FreeformHyphenAfterH = &HyphenChar OH { warn(
`Hyphen cannot appear after h.
If needed and possible, hyphen at the end of this syllable`
)}
W_FreeformHyphenAfterInitial = &HyphenChar OH &Vowel { warn(
`Hyphen is not allowed after an initial pair or consonant.
If needed and possible, hyphen before the pair or consonant; or after the following vowel`
)}
W_HyphenBeforeFinalConsonant = &HyphenChar OH &Consonant { warn(
`Hyphen is not allowed before final consonant as the syllable ends after it.
If needed, hyphen before this syllable.`
)}
E_FreeformMultiConsonentsEnding = Consonant OH Consonant &{ return err(
`Borrowing/freeform can end with at most 1 consonant`
)}


// # Native words ================================

NativeWord = RootWord / ParticleWord
NativeForm = RootForm / ParticleForm

ParticleWord "particle" = x:ParticleForm &PostWord { return { family:"Particle", word: x}}
ParticleForm = W_HyphenPreWord?
	x:(ParticleFormCV / ParticleFormNAOX)
    W_HyphenPostWord?
    { return recur_join(x) }

ParticleFormCV =
    !Sonorant @Consonant W_HyphenAfterInitial?
    @Vhowels
    !MedialPair

ParticleFormNAOX =
	@(n W_HyphenAfterInitial?/ &a / &o)
    @Vhowels
    @SonorantThenVhowels*
    W_HyphenBeforeFinalSonorant? @Sonorant?
    !MedialPair    

RootWord "root" = x:RootForm &PostWord { return { family:"Root", word: x}}
RootForm = !Sonorant W_HyphenPreWord?
	x:(RootFormCVX / RootFormCVS / RootFormCCVX)
    W_HyphenPostWord?
    { return recur_join(x) }

RootFormCVX =
	@Consonant W_HyphenAfterInitial?
    @Vhowels
    @RootMedialOrSonorantThenVowels+
    W_HyphenBeforeFinalSonorant? @Sonorant?
RootFormCVS =
	@Consonant W_HyphenAfterInitial?
    @Vhowels
    W_HyphenBeforeFinalSonorant? @Sonorant
RootFormCCVX =
    W_HyphenInInitialPair? @InitialPair W_HyphenAfterInitial?
    @Vhowels
    @RootMedialOrSonorantThenVowels*
    W_HyphenBeforeFinalSonorant? @Sonorant?
    
RootMedialOrSonorantThenVowels = RootMedialThenVhowels / SonorantThenVhowels
SonorantThenVhowels = OH Sonorant !Sonorant W_HyphenAfterMedialSonorant? Vhowels
RootMedialThenVhowels = W_HyphenBeforeMedialOrTriplet? RootMedialOrTriplet W_HyphenAfterMedialOrTriplet? Vhowels
 
W_HyphenAfterInitial = &HyphenChar OH { warn(
`Hyphen is not allowed after an initial pair or consonant.
If needed, hyphen after the following vowel if the word is made of multiple syllables`
)}

W_HyphenBeforeMedialOrTriplet = &HyphenChar OH &RootMedialOrTriplet { warn(
`Hyphen is not allowed before a medial pair XY or triplet XYZ.
If needed, try X-Y or X-YZ`
)}
W_HyphenAfterMedialOrTriplet = &HyphenChar OH { warn(
`Hyphen is not allowed after a medial pair XY or triplet XYZ.
If needed, try X-Y or X-YZ`
)}
W_HyphenAfterMedialSonorant = &HyphenChar OH &Vowel { warn(
`Hyphen is not allowed after a medial sonorant.
If needed, hyphen before the sonorant`
)}
W_HyphenBeforeFinalSonorant = &HyphenChar OH &Sonorant { warn(
`Hyphen is not allowed before final sonorant as the syllable ends after it.
If needed, hyphen before this syllable.`
)}

W_HyphenPreWord = &HyphenChar OH { warn("Hyphen is not allowed at the start of a word" ) }
W_HyphenPostWord = &HyphenChar OH { warn("Hyphen is not allowed at the end of a word" ) }

PostWord = !Sonorant &Consonant / DigitSymbol / Spaces

// # Vowels and Vhowels ================================

Vhowels = !E_NoVowelBeforeH x:Vowels y:(OH !E_NoVowelAfterH @h W_HyphenAfterH? @Vowels )* { return recur_join([x, ...y]) }
Vowels =
    x:Vowel
    y:(
        OH @Vowel
        
    )*
    &{
        if(y === [])
            return true;


        if(x === y[0]) {
            return err(`Hyphen cannot be used between 2 instances of the same vowel`)
        }

        for(var i = 1; i < y.length; i++) {
            if(y[i-1] === y[i]) {
                return err(`Hyphen cannot be used between 2 instances of the same vowel`)
            }
        }

        return true
    }
    { return [x, ...y].join("") }
W_HyphenAfterH = &HyphenChar OH { warn("Hyphen should appear before h (where the syllable starts)") }
E_NoVowelBeforeH = h &{ return err("h can only appear between vowels") }
E_NoVowelAfterH = h OH !Vowel &{ return err("h can only appear between vowels") }

// # Triplets ================================

FreeformMedialOrTriplet = RootMedialOrTriplet / @Sonorant OH @MedialPair
RootMedialOrTriplet = !Sonorant TripletRoot / MedialPair

TripletFreeform = &TripletMatch !E_TripletXYFreeform !E_TripletYZ tri:TripletMatch { return tri.join("") }
TripletRoot = &TripletMatch !E_TripletXYRoot !E_TripletYZ tri:TripletMatch { return tri.join("") }
TripletMatch "triplet" = !E_Quadruplet @Consonant OH @Consonant W_HyphenInInitialPairOfTriplet? @Consonant

W_HyphenInInitialPairOfTriplet = &HyphenChar OH &Consonant { warn("In triplet, XY-Z is not allowed. If needed change to X-YZ") }
E_Quadruplet = Consonant|4|
	&{ return err(`Up to 3 consonants (triplet) can appear in a row`) }
E_TripletXYFreeform = !(MedialPair / Sonorant) x:Consonant OH y:Consonant
	&{ return err(`In roots, triplets XYZ should have XY be a medial pair or X be a sonorant, but ${x}${y} isn't`) }
E_TripletXYRoot = !MedialPair x:Consonant OH y:Consonant
	&{ return err(`In roots, triplets XYZ should have XY be a medial pair, but ${x}${y} isn't`) }
E_TripletYZ = Consonant !InitialPair x:Consonant OH y:Consonant
	&{ return err(`Triplets XYZ should have YZ be an initial pair pair, but ${x}${y} isn't`) }

// # Medial pair =================================

MedialPair "medial pair" = !Initial !E_InvalidPairs pair:MedialPatterns { return pair.join("") }
MedialPatterns = MedialN / MedialFV / MedialPlosive
MedialN = @Liquid OH @n / @n OH @Liquid
MedialFV = @(f / v) OH @(Plosive / m)
MedialPlosive = @Plosive OH @(f / v / Plosive / m)

// # Initial pair =================================

W_HyphenInInitialPair = &(Consonant HyphenChar &Consonant { warn("Hyphen is not allowed inside an initial pair") })
InitialPair "initial pair" =
	&Initial !E_InvalidPairs 
    pair:(@Consonant OH @Consonant) // handle warning separatly for better err messages in triplets
    !Consonant { return pair.join("") }
Initial =
	@(Plosive / f / v) OH @Sibilant
    / @Sibilant OH @Other
    / @Sibilant OH @Sonorant
    / !(Sonorant Sonorant) @Other OH @Sonorant

E_InvalidPairs = E_PairVoiceness1 / E_PairVoiceness2 / E_SibilantPair / E_PB_N / E_TD_NL
E_PairVoiceness1 = x:Voiced OH y:Unvoiced
	&{ return err(`${x}${y} is an invalid pair because consonants don't have the same voiceness`)}
E_PairVoiceness2 = x:Unvoiced OH y:Voiced
	&{ return err(`${x}${y} is an invalid pair because consonants don't have the same voiceness`)}
E_SibilantPair = x:Sibilant OH y:Sibilant
	&{ return err(`${x}${y} is an invalid pair because both consonants are sibilants (csjz)`)}
E_PB_N = x:(p / b) OH y:n
	&{ return err(`${x}${y} is an invalid pair as p/b cannot be followed by n`)}
E_TD_NL = x:(t / d) OH y:(n / l)
	&{ return err(`${x}${y} is an invalid pair as t/d cannot be followed by n/l`)}

// # Categories of letters ============================

Other = p / b / t / d / v / f / k / g / m / n
Plosive = t / d / k / g / p / b
Sibilant = c / s / j / z
Sonorant = n / r / l

Consonant = !E_OtherLatinLetters @(Voiced / Unvoiced / Liquid / Nasal)
Nasal = m / n
Liquid = l / r
Voiced = b / d / g / v / z / j
Unvoiced = p / t / k / f / s / c

Vowel = !E_OtherLatinLetters @(i / e / a / o / u)

// # Erasers ========================================

SentenceEraser = x:(Spaces @RA+)+ Spaces { return recur_join(x, " ") }
ChainEraser = Spaces RI Spaces
RA "ra" = r a { return "ra" }
RI "ri" = r i { return "ri" }

// # Eberban letters ===================================

i "i" = [iI]+ { return "i" }
e "e" = [eE]+ { return "e" }
a "a" = [aA]+ { return "a" }
o "o" = [oO]+ { return "o" }
u "u" = [uU]+ { return "u" }

h "h" = [hH]+ { return "h" }
n "n" = [nN]+ { return "n" }
r "r" = [rR]+ { return "r" }
l "l" = [lL]+ { return "l" }

m "m" = [mM]+ { return "m" }
p "p" = [pP]+ { return "p" }
b "b" = [bB]+ { return "b" }
f "f" = [fF]+ { return "f" }
v "v" = [vV]+ { return "v" }
t "t" = [tT]+ { return "t" }
d "d" = [dD]+ { return "d" }
s "s" = [sS]+ { return "s" }
z "z" = [zZ]+ { return "z" }
c "c" = [cC]+ { return "c" }
j "j" = [jJ]+ { return "j" }
g "g" = [gG]+ { return "g" }
k "k" = [kK]+ { return "k" }

E_OtherLatinLetters = x:[qwxy]i &{ return err(`${x} is not an Eberban letter`) }

// # Spaces / Pause ===========================================

Spaces = SpaceChar+ Hesitation? / EOF
SpaceChar = !(DigitSymbol / HyphenChar / [a-zA-Z]) .
Hesitation = (n (SpaceChar+ / EOF))+


// # Special characters ====================================

OH = (HyphenChar [\n\r]*)? // Optional Hyphen with linebreak support
HyphenChar = [\u2010\u2014\u002D]

QuoteMarkStart = "["
QuoteMarkEnd = "]"

DigitSymbol "digit" = [0-9]

EOF = !.