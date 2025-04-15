/* GROUPS */

export const group = (s) => "(" + s + ")";
export const non_capturing_group = (s) => "(?:" + s + ")";


/* LOOKAROUNDS */

export const does_not_begin_with = (s) => "(?<!" + s + ")";


/* QUANTIFIERS & ALTERNATION */

export const any_of = (...strings) =>  strings.join("|");

export const any_number_of = (s) => s + "*";
export const one_or_more = (s) => s + "+";

export const fewest_positive_number_of = (s) => s + "+?";

export const optional = (s) => s + "?";


/* CHARACTERS & SETS */

export const ignore = (s) => "[^" + s + "]";

export const begin = "^";
export const end = "$";

export const backslash = "\\\\";

export const line_feed = non_capturing_group(any_of("\\\r\\\n", "\\\r", "\\\n"));
