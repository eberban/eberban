/* CHARACTERS & SETS */

export const begin = "^";
export const end = "$";

export const ignore = (s) => "[^" + s + "]";


/* GROUPS */

export const non_capturing_group = (s) => "(?:" + s + ")";


/* QUANTIFIERS */

export const any_number_of = (s) => s + "*";
export const one_or_more = (s) => s + "+";
