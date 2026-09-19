import type { Chain, Verb } from "../semantics/tree.ts";

export interface Slots {
    exposed: string;
    chain: { place: "E" | "A" | "O" | "U"; equiv: boolean } | null;
}

export const VOWELS: string;
export const CONSONANTS: string;
export function stepSlots(step: Chain, dictionary: Record<string, unknown> | undefined): Slots;
export function verbSlots(verb: Verb, dictionary: Record<string, unknown> | undefined): Slots;
export function verbTransitivity(verb: Verb, dictionary: Record<string, unknown> | undefined): { trans: boolean; equiv: boolean };
export function rootTransitivity(word: string): { trans: boolean; equiv: boolean };
export function parseSISlots(word: string): Slots;
export function chainAscii(chain: Slots["chain"]): string;
