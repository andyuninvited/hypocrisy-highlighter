import { describe, expect, it } from "vitest";
import { asScan, parseTarget, rateLimiter, topFixes, toLive } from "./live-scan";
import type { Check } from "./types";

const check = (id: string, score: number | null, weight: number, fix: string | null = "do it"): Check => ({ id, title: id, weight, status: "fail", score, reason: "r", fix });

describe("parseTarget", () => {
  it("adds https and trims to the origin", () => {
    expect(parseTarget(" example.com/pricing?x=1 ")).toBe("https://example.com/");
    expect(parseTarget("http://example.com")).toBe("http://example.com/");
  });
  it("rejects junk, other protocols, credentials, and bare hosts", () => {
    for (const bad of [undefined, 42, "", "not a url", "ftp://example.com", "file:///etc/passwd", "https://u:p@example.com", "localhost", "x".repeat(3000) + ".com"]) {
      expect(parseTarget(bad)).toBeNull();
    }
  });
});

describe("topFixes", () => {
  it("ranks by points lost and skips passes, skips, and checks without a fix", () => {
    const out = topFixes([check("a", 50, 10), check("b", 0, 15), check("c", 100, 30), check("d", null, 30), check("e", 0, 30, null), check("f", 90, 5)]);
    expect(out.map((c) => c.id)).toEqual(["b", "a", "f"]);
  });
});

describe("toLive and asScan", () => {
  it("drops extra fields and names the scan by hostname", () => {
    const live = toLive({ url: "https://example.com/", scannedAt: "t", overall: 40, checks: [{ ...check("a", 0, 10), extra: 1 } as Check] });
    expect(Object.keys(live.checks[0])).not.toContain("extra");
    expect(asScan(live).name).toBe("example.com");
  });
});

describe("rateLimiter", () => {
  it("allows the limit per window, per key", () => {
    const allow = rateLimiter(2, 1000);
    expect([allow("a", 0), allow("a", 1), allow("a", 2), allow("b", 2), allow("a", 1001)]).toEqual([true, true, false, true, true]);
  });
});
