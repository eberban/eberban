import { JSX } from "preact";

export type JSX_Child = string | JSX.Element;

export type Replacer = (whole: JSX_Child, ...captures: JSX_Child[]) => JSX.Element;
