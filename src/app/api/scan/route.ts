import { scanConfigSchema } from "agent-landing/dist/config.js";
import { runScan } from "agent-landing/dist/scan/index.js";
import { parseTarget, rateLimiter, toLive } from "@/lib/live-scan";

export const runtime = "nodejs";
export const maxDuration = 60;

const allow = rateLimiter(5, 60_000);
const config = scanConfigSchema.parse({ keyPages: ["/"] });

const fail = (status: number, error: string) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return fail(429, "Too many scans from here. Give it a minute and try again.");
  const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
  const target = parseTarget(body?.url);
  if (!target) return fail(400, "That doesn't look like a website address. Try something like example.com.");
  try {
    const report = await runScan(target, config, { allowPrivate: false });
    return Response.json(toLive(report), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return fail(422, /private or reserved/.test(msg) ? "That address isn't on the public internet, so the robot can't visit it." : `The robot couldn't reach ${new URL(target).hostname}. Check the address and try again.`);
  }
}
