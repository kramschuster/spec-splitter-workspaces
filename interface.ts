// MF-2001 shared interface. Types only. A rule written here would hide the ambiguity.

/** The phone number to store, or null if nothing is stored. */
export type SavePhone = (typed: string) => string | null;
