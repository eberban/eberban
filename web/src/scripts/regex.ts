/* GROUPS */

export const group = (s: string) => "(" + s + ")";
export const non_capturing_group = (s: string) => "(?:" + s + ")";


/* LOOKAROUNDS */

export const does_not_begin_with = (s: string) => "(?<!" + s + ")";


/* QUANTIFIERS & ALTERNATION */

export const any_of = (...strings: string[]) =>  strings.join("|");

export const any_number_of = (s: string) => s + "*";
export const one_or_more = (s: string) => s + "+";

export const fewest_positive_number_of = (s: string) => s + "+?";

export const optional = (s: string) => s + "?";

export const not_in_set = (...strings: string[]) => "[^" + strings.join("") + "]";
export const set = (...strings: string[]) => "[" + strings.join("") + "]";


/* CHARACTERS & SETS */

export const begin = "^";
export const end = "$";

export const backslash = "\\\\";

export const line_feed = non_capturing_group(any_of("\\\r\\\n", "\\\r", "\\\n"));
