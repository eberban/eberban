# Core grammar

The core grammar is a subset of the complete grammar that gives a logical base
to define other concepts.

The core grammar contains the following particles:

- __BI__, __BE__, __BA__, and __BO__. __BU__ is not included as it allows to
  build lists which are not part of the logical framework itself, and itself
  will be build on top of it.
- __DI__, __DE__, __DA__, __DAI__ and __DU__ particles as they are only metadata
  and don't interact with the logical transcription. The full grammar and
  vocabulary is allowed inside __DA ... DAI__ to allow comments on the design
  choices in Eberban.
- __SI__: chaining selection
- __zi__, __ze__, __zei__, __zu__, __zoie__, __zoia__, __zoio__ and __zoiu__ as
  they are related to the logical framework. __za__ and __zai__ are related to
  names which require some predicates to define.
- __VI__, __FI__ and __VEI__ for explicit bindings
- __GI__ and __KI__ for variables
- __ma__, __mai__, __mae__, __mao__, __mui__, __mue__ and __mua__, as they are
  wrapper around the underlying logic. Discourse predicates are not included as
  we need to be able to model the discourse itself.
- __PE__ and __PEI__ as spoken brackets.
- __pae__ and __pahe__ to manipulate the context, and __pahi__ to register a
  sentence wrapper. __pa__ itself is not included as it is related to the
  discourse, and is an assertion about what the speaker thinks is true.
- __po__ to define new predicates. __poi__ is not included as it conveys the
  expectation of the speaker for a listener to answer a question.
  __poie__, __poia__, __poio__ and __poiu__ are also included to define defaults
  which is part of the logical framework.
- __PU__: axiom toggle, which is the key component allowing to define new
  concepts in the language.

Other particles are not allowed and will be syntaxic sugar on top of the __core
grammar__ and __core vocabulary__.