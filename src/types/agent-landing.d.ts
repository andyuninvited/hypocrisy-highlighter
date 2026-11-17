declare module "agent-landing/dist/config.js" {
  export const scanConfigSchema: { parse: (raw: unknown) => ScanConfig };
  export type ScanConfig = { keyPages: string[]; timeoutMs: number; maxBytes: number; userAgent: string; [k: string]: unknown };
}

declare module "agent-landing/dist/scan/index.js" {
  import type { ScanConfig } from "agent-landing/dist/config.js";
  import type { Check } from "@/lib/types";
  export type ScanReport = { url: string; scannedAt: string; overall: number; checks: (Check & Record<string, unknown>)[] };
  export const runScan: (input: string, cfg: ScanConfig, opts?: { allowPrivate?: boolean; fetcher?: unknown; now?: () => Date }) => Promise<ScanReport>;
}
