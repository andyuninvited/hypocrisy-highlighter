import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import type { Check, RosterEntry, Scan } from "../src/lib/types";

const run = promisify(execFile);
const CLI = "node_modules/agent-landing/dist/cli.js";
const CONCURRENCY = 3;

type CliCheck = Check;
type CliReport = { url: string; scannedAt: string; overall: number; checks: CliCheck[] };

const scanOne = async (e: RosterEntry): Promise<Scan | { slug: string; error: string }> => {
  try {
    const { stdout } = await run("node", [CLI, "scan", e.url, "--json"], { timeout: 120_000, maxBuffer: 10_000_000 });
    const r = JSON.parse(stdout) as CliReport;
    return {
      ...e,
      scannedAt: r.scannedAt,
      overall: r.overall,
      checks: r.checks.map(({ id, title, weight, status, score, reason, fix }) => ({ id, title, weight, status, score, reason, fix })),
    };
  } catch (err) {
    return { slug: e.slug, error: err instanceof Error ? err.message.slice(0, 300) : String(err) };
  }
};

const main = async () => {
  const roster = JSON.parse(await readFile("src/data/roster.json", "utf8")) as RosterEntry[];
  const only = process.argv.slice(2);
  const todo = only.length ? roster.filter((e) => only.includes(e.slug)) : roster;
  const results: Awaited<ReturnType<typeof scanOne>>[] = [];
  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batch = await Promise.all(todo.slice(i, i + CONCURRENCY).map(scanOne));
    batch.forEach((b) => console.log("error" in b ? `FAIL ${b.slug}: ${b.error}` : `${b.overall}\t${b.slug}`));
    results.push(...batch);
  }
  const prev = JSON.parse(await readFile("src/data/scans.json", "utf8").catch(() => "[]")) as Scan[];
  const fresh = results.filter((r): r is Scan => !("error" in r));
  const merged = [...prev.filter((p) => !fresh.some((f) => f.slug === p.slug)), ...fresh].toSorted((a, b) => a.slug.localeCompare(b.slug));
  await writeFile("src/data/scans.json", JSON.stringify(merged, null, 2) + "\n");
  console.log(`${fresh.length} scanned, ${results.length - fresh.length} failed, ${merged.length} total`);
};

main();
