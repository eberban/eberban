// Conventions:
// - E_ prefixed rules match forbidden patterns that should halt parsing and report
//   helpfull error. As the rule should not appear in a valid text, usage of error rules
//   in normal rules should be prefixed by `!`.
// - W_ prefixed rules match patterns that are accepted for convenience but that are not considered
//   correct. They don't halt parsing and instead registers warnings that are all returned alongside
//   the parsing output. As pattern can or cannot appear, usage of warning rules in normal rules
//   should be suffixed with `?`. The pattern must fully parse the accepted mistake for the rest of the
//   parsing to continue.
// - When combining multiple error/warning rules, keep the match "positive", do not use `!` or `?`.
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
	const warnings = [];
    
    function warn(msg) {
    	warnings.push({
        	message: msg,
            location: location()
        })
    }
    
    function recur_join(input) {
    	var out = "";
        
        for(const x of input) {
        	if(Array.isArray(x)) {
            	out += recur_join(x);
            } else if(x != null) {
            	out += x;	
            }
        }
        
        return out
    }
}

TextWithWarnings = output:Text { return { output, warnings } }
Text = Spaces? @(@NativeWord Spaces?)*

// # Native words
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
	@(N W_HyphenAfterInitial?/ &A / &O)
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
SonorantThenVhowels = HyphenOpt Sonorant !Sonorant W_HyphenAfterMedialSonorant? Vhowels
RootMedialThenVhowels = W_HyphenBeforeMedialOrTriplet? RootMedialOrTriplet W_HyphenAfterMedialOrTriplet? Vhowels
 
W_HyphenAfterInitial = &HyphenChar HyphenOpt { warn(
`Hyphen is not allowed after an initial pair or consonant.
If needed hyphen after the following vowel if the word is made of multiple syllables`
)}

W_HyphenBeforeMedialOrTriplet = &HyphenChar HyphenOpt &RootMedialOrTriplet { warn(
`Hyphen is not allowed before a medial pair XY or triplet XYZ.
If needed, try X-Y or X-YZ`
)}
W_HyphenAfterMedialOrTriplet = &HyphenChar HyphenOpt { warn(
`Hyphen is not allowed after a medial pair XY or triplet XYZ.
If needed, try X-Y or X-YZ`
)}
W_HyphenAfterMedialSonorant = &HyphenChar HyphenOpt { warn(
`Hyphen is not allowed after a medial sonorant.
If needed, hyphen before the sonorant`
)}
W_HyphenBeforeFinalSonorant = &HyphenChar HyphenOpt &Sonorant { warn(
`Hyphen is not allowed before final sonorant as the syllable ends after it.
If needed, hyphen before this syllable.`
)}

W_HyphenPreWord = &HyphenChar HyphenOpt { warn("Hyphen is not allowed at the start of a word" ) }
W_HyphenPostWord = &HyphenChar HyphenOpt { warn("Hyphen is not allowed at the end of a word" ) }

PostWord = !Sonorant &Consonant / Spaces

// # Vowels and Vhowels
Vhowels = x:Vowels y:(HyphenOpt @H W_HyphenAfterH? @Vowels )* { return recur_join([x, ...y]) }
Vowels = x:Vowel y:(HyphenOpt @Vowel)* { return [x, ...y].join("") }
W_HyphenAfterH = &HyphenChar HyphenOpt { warn("Hyphen should appear before H (where the syllable starts)") }

// # Triplets
RootMedialOrTriplet = !Sonorant TripletRoot / MedialPair

TripletFreeform = !E_TripletXYFreeform !E_TripletYZ tri:TripletMatch { return tri.join("") }
TripletRoot = !E_TripletXYRoot !E_TripletYZ tri:TripletMatch { return tri.join("") }
TripletMatch "triplet" = !E_Quadruplet @Consonant HyphenOpt @Consonant W_HyphenInInitialPairOfTriplet? @Consonant

W_HyphenInInitialPairOfTriplet = &HyphenChar HyphenOpt &Consonant { warn("In triplet, XY-Z is not allowed. If needed change to X-YZ") }
E_Quadruplet = Consonant|4|
	{ error(`Up to 3 consonants (triplet) can appear in a row`) }
E_TripletXYFreeform = !(MedialPair / Sonorant) x:Consonant HyphenOpt y:Consonant
	{ error(`In roots, triplets XYZ should have XY be a medial pair or X be a sonorant, but ${x}${y} isn't`) }
E_TripletXYRoot = !MedialPair x:Consonant HyphenOpt y:Consonant
	{ error(`In roots, triplets XYZ should have XY be a medial pair, but ${x}${y} isn't`) }
E_TripletYZ = Consonant !InitialPair x:Consonant HyphenOpt y:Consonant
	{ error(`Triplets XYZ should have YZ be an initial pair pair, but ${x}${y} isn't`) }

// # Medial pair
MedialPair "medial pair" = !Initial !E_InvalidPairs pair:MedialPatterns { return pair.join("") }
MedialPatterns = MedialN / MedialFV / MedialPlosive
MedialN = @Liquid HyphenOpt @N / @N HyphenOpt @Liquid
MedialFV = @(F / V) HyphenOpt @(Plosive / M)
MedialPlosive = @Plosive HyphenOpt @(F / V / Plosive / M)

// # Initial pair
W_HyphenInInitialPair = &(Consonant HyphenChar { warn("Hyphen is not allowed inside an initial pair") })
InitialPair "initial pair" =
	&Initial !E_InvalidPairs 
    pair:(@Consonant HyphenOpt @Consonant) // handle warning separatly for better error messages in triplets
    !Consonant { return pair.join("") }
Initial =
	@(Plosive / F / V) HyphenOpt @Sibilant
    / @Sibilant HyphenOpt @Other
    / @Sibilant HyphenOpt @Sonorant
    / !(Sonorant Sonorant) @Other HyphenOpt @Sonorant

E_InvalidPairs = E_PairVoiceness1 / E_PairVoiceness2 / E_SibilantPair / E_PB_N / E_TD_NL
E_PairVoiceness1 = x:Voiced HyphenOpt y:Unvoiced
	{ error(`${x}${y} is an invalid pair because consonants don't have the same voiceness`)}
E_PairVoiceness2 = x:Unvoiced HyphenOpt y:Voiced
	{ error(`${x}${y} is an invalid pair because consonants don't have the same voiceness`)}
E_SibilantPair = x:Sibilant HyphenOpt y:Sibilant
	{ error(`${x}${y} is an invalid pair because both consonants are sibilants (csjz)`)}
E_PB_N = x:(P / B) HyphenOpt y:N
	{ error(`${x}${y} is an invalid pair as P/B cannot be followed by N`)}
E_TD_NL = x:(T / D) HyphenOpt y:(N / L)
	{ error(`${x}${y} is an invalid pair as T/D cannot be followed by N/L`)}

// # Categories of letters
Other = P / B / T / D / V / F / K / G / M / N
Plosive = T / D / K / G / P / B
Sibilant = C / S / J / Z
Sonorant = N / R / L

Consonant = !E_OtherLatinLetters @(Voiced / Unvoiced / Liquid / Nasal)
Nasal = M / N
Liquid = L / R
Voiced = B / D / G / V / Z / J
Unvoiced = P / T / K / F / S / C

Vowel = !E_OtherLatinLetters @(I / E / A / O / U)

// # Eberban letters
I "I" = [iI]+ { return "i" }
E "E" = [eE]+ { return "e" }
A "A" = [aA]+ { return "a" }
O "O" = [oO]+ { return "o" }
U "U" = [uU]+ { return "u" }

H "H" = [hH]+ { return "h" }
N "N" = [nN]+ { return "n" }
R "R" = [rR]+ { return "r" }
L "L" = [lL]+ { return "l" }

M "M" = [mM]+ { return "m" }
P "P" = [pP]+ { return "p" }
B "B" = [bB]+ { return "b" }
F "F" = [fF]+ { return "f" }
V "V" = [vV]+ { return "v" }
T "T" = [tT]+ { return "t" }
D "D" = [dD]+ { return "d" }
S "S" = [sS]+ { return "s" }
Z "Z" = [zZ]+ { return "z" }
C "C" = [cC]+ { return "c" }
J "J" = [jJ]+ { return "j" }
G "G" = [gG]+ { return "g" }
K "K" = [kK]+ { return "k" }

E_OtherLatinLetters = x:[qwxy]i { error(`${x} is not an Eberban letter`) }

// # Special characters
Spaces = SpaceChar+ Hesitation? / EOF
SpaceChar = !(DigitSymbol / HyphenChar / [a-zA-Z]) .
Hesitation = (N (SpaceChar+ / EOF))+

HyphenOpt = (HyphenChar [\n\r]*)? // Optional hyphen with linebreak support
HyphenChar = [\u2010\u2014\u002D]

QuoteMarkStart = "["
QuoteMarkEnd = "]"

DigitSymbol = [0-9]

EOF = !.
Dummy = (. / !.) { return true }