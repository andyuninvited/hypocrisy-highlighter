import type { Check, Scan } from "./types";

export type Letter = "A" | "B" | "C" | "D" | "F";

export const letterFor = (score: number): Letter =>
  score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

export const OVERALL: Record<Letter, string> = {
  A: "Top of the class. Practices what it sells.",
  B: "Solid work. A little homework left.",
  C: "Shows promise. Needs to apply itself.",
  D: "Sells agents. Hasn't met one.",
  F: "Says agents are the future. Its own agent can't read the homepage.",
};

const COMMENTS: Record<string, { fail: string; warn: string }> = {
  "robots-ai": { fail: "Sells agents, then blocks them at the door. Bold.", warn: "Lets some agents in and turns others away. Pick a lane." },
  "llms-txt": { fail: "No llms.txt. Please see me after class.", warn: "Started an llms.txt and stopped. Finish your homework." },
  sitemap: { fail: "No sitemap. The robot had to wander the halls alone.", warn: "Sitemap is thin. The robot got lost twice." },
  "ssr-readable": { fail: "The page is blank until JavaScript shows up. The robot is still waiting.", warn: "Half the page only appears after JavaScript runs. Show your work." },
  markdown: { fail: "Hands in every page as HTML soup. Markdown was on the syllabus.", warn: "Some markdown, some soup. Be consistent." },
  "structured-data": { fail: "No JSON-LD. Didn't even write its name on the paper.", warn: "Wrote its name on the paper, misspelled it." },
  "api-docs": { fail: "Couldn't find the API docs. Neither could the robot.", warn: "The API docs are hiding. Agents shouldn't need a treasure map." },
  mcp: { fail: "No MCP server in sight. Ironic, for an agent company.", warn: "Mentions MCP, never shows up with it." },
  "auth-friction": { fail: "Everything worth reading is behind a login wall.", warn: "Too many doors need a badge. Agents don't have one." },
  "page-weight": { fail: "This homepage weighs more than my car. Agents pay by the token.", warn: "A little heavy. Agents pay by the token." },
};

const LOCKED = "Couldn't check. The robot got a 403 at the door.";
const TURNED_AWAY = "Sells agents. Turned ours away at the front door.";

const loss = (c: Check): number => (c.score === null ? 0 : c.weight * (100 - c.score));

const locked = (c: Check): boolean => /HTTP 40[13]\b/.test(c.reason) && c.id !== "auth-friction" && c.id !== "robots-ai";

export const turnedAway = (s: Scan): boolean => s.checks.some((c) => c.id === "auth-friction" && c.status === "fail" && /\/ \(HTTP 40[13]/.test(c.reason));

export const comment = (c: Check): string | undefined =>
  c.status !== "fail" && c.status !== "warn" ? undefined : locked(c) ? LOCKED : COMMENTS[c.id]?.[c.status];

export const worst = (s: Scan): Check | undefined =>
  s.checks.filter((c) => comment(c)).toSorted((a, b) => loss(b) - loss(a))[0];

export const teacherNote = (s: Scan): string => {
  if (turnedAway(s)) return TURNED_AWAY;
  const w = worst(s);
  return w ? (comment(w) as string) : "Nothing to fix. Gold star.";
};

export const ranked = (scans: Scan[]): Scan[] => scans.toSorted((a, b) => b.overall - a.overall || a.name.localeCompare(b.name));

export const average = (scans: Scan[]): number =>
  scans.length ? Math.round(scans.reduce((n, s) => n + s.overall, 0) / scans.length) : 0;
