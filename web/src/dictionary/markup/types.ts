import { JSX } from "preact";

export type JSX_Child = string | JSX.Element;

export type Replacer = (...captures: (JSX_Child | undefined)[]) => JSX.Element;
