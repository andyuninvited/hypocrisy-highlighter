import { describe, expect, it } from "vitest";
import { average, comment, letterFor, ranked, teacherNote, worst } from "./grade";
import type { Check, Scan } from "./types";

const check = (id: string, status: Check["status"], score: number | null, weight = 10, reason = ""): Check => ({ id, title: id, weight, status, score, reason, fix: null });
const scan = (slug: string, overall: number, checks: Check[] = []): Scan => ({ slug, name: slug, url: `https://${slug}.com/`, category: "x", scannedAt: "", overall, checks });

describe("letterFor", () => {
  it("bands scores", () => {
    expect([95, 90, 85, 72, 61, 59, 0].map(letterFor)).toEqual(["A", "A", "B", "C", "D", "F", "F"]);
  });
});

describe("comment", () => {
  it("only comments on fail and warn", () => {
    expect(comment(check("llms-txt", "fail", 0))).toMatch(/see me after class/);
    expect(comment(check("llms-txt", "pass", 100))).toBeUndefined();
    expect(comment(check("unknown", "fail", 0))).toBeUndefined();
  });
});

describe("blocked scans", () => {
  it("says locked instead of claiming the file is missing", () => {
    expect(comment(check("llms-txt", "fail", 0, 15, "No /llms.txt (HTTP 403)."))).toMatch(/403 at the door/);
  });
  it("calls out a homepage that turns the scanner away", () => {
    const s = scan("a", 12, [check("auth-friction", "fail", 0, 10, "1 of 1 key page(s) put friction in front of an agent: / (HTTP 403, bot challenge page).")]);
    expect(teacherNote(s)).toMatch(/Turned ours away/);
  });
  it("does not treat a readable page with a challenge marker as turned away", () => {
    const s = scan("a", 43, [check("auth-friction", "fail", 30, 10, "1 of 1 key page(s) put friction in front of an agent: / (bot challenge page)."), check("llms-txt", "fail", 0, 15, "No /llms.txt (HTTP 404).")]);
    expect(teacherNote(s)).toMatch(/see me after class/);
  });
});

describe("worst", () => {
  it("picks the biggest weighted loss", () => {
    const s = scan("a", 50, [check("sitemap", "fail", 0, 5), check("llms-txt", "fail", 0, 15), check("mcp", "warn", 50, 10)]);
    expect(worst(s)?.id).toBe("llms-txt");
  });
  it("gives a gold star when nothing fails", () => {
    expect(teacherNote(scan("a", 100, [check("mcp", "pass", 100), check("api-docs", "skip", null)]))).toBe("Nothing to fix. Gold star.");
  });
});

describe("ranked and average", () => {
  it("sorts by score then name", () => {
    expect(ranked([scan("b", 50), scan("a", 50), scan("c", 90)]).map((s) => s.slug)).toEqual(["c", "a", "b"]);
  });
  it("rounds the average and handles empty", () => {
    expect(average([scan("a", 50), scan("b", 51)])).toBe(51);
    expect(average([])).toBe(0);
  });
});
