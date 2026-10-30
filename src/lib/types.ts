export type RosterEntry = { slug: string; name: string; url: string; category: string };

export type CheckStatus = "pass" | "warn" | "fail" | "skip";

export type Check = { id: string; title: string; weight: number; status: CheckStatus; score: number | null; reason: string; fix: string | null };

export type Snapshot = { scannedAt: string; overall: number; checks: Check[] };

export type Scan = RosterEntry & Snapshot & { before?: Snapshot };
