import scansJson from "@/data/scans.json";
import { ranked } from "./grade";
import type { Scan } from "./types";

export const SELF_SLUG = "andy-rosic";

const all = scansJson as Scan[];

export const classList: Scan[] = ranked(all.filter((s) => s.slug !== SELF_SLUG));
export const self: Scan | undefined = all.find((s) => s.slug === SELF_SLUG);
export const bySlug = (slug: string): Scan | undefined => all.find((s) => s.slug === slug);
export const allSlugs = (): string[] => all.map((s) => s.slug);
