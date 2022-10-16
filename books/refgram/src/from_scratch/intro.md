# Eberban from scratch

One of the long term goal of Eberban is to have its vocabulary entirely defined
in Eberban itself, and not realy on external or _opaque_ predicates.

To achieve such goal Eberban is designed following the following principles:

- A subset of the complete Eberban grammar is called the __core grammar__, and
  provides only a basic logic framework on which can be built the rest of the
  language.
- Grammar out of the __core grammar__ is then defined as _syntaxic sugar_ over
  some predicates that must be defined only using the __core grammar__. Some
  parts of the complete grammar definitions can use non-core grammar only if
  there are no cyclic dependencies.
- Once the complete grammar is defined, more vocabulary can be added to
  model required for speech and speaking about wanted subjects.

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

All definable predicate words (root, compounds, i-variables) have by default
an unknown truth value (mui).