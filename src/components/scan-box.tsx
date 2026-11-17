"use client";

import { useState, type FormEvent } from "react";
import { GradeBadge } from "@/components/grade-badge";
import { OVERALL, letterFor, teacherNote } from "@/lib/grade";
import { asScan, topFixes, type LiveResult } from "@/lib/live-scan";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; result: LiveResult };

export function ScanBox() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = (await res.json()) as LiveResult | { error: string };
      setState("error" in data ? { kind: "error", message: data.error } : { kind: "done", result: data });
    } catch {
      setState({ kind: "error", message: "Something went wrong on our end. Try again in a moment." });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="scan-url" className="sr-only">Your website address</label>
        <input
          id="scan-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yoursite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-1 rounded-xl bg-paper px-4 py-3 text-lg text-ink placeholder:text-ink/40"
        />
        <button type="submit" disabled={state.kind === "loading"} className="rounded-xl bg-marker px-6 py-3 text-lg font-black text-ink disabled:opacity-60">
          {state.kind === "loading" ? "Grading..." : "Grade my site"}
        </button>
      </form>

      <div aria-live="polite">
        {state.kind === "loading" && <p className="text-sm">The robot is reading your homepage. This takes 10 to 30 seconds.</p>}
        {state.kind === "error" && <p className="font-bold text-pen">{state.message}</p>}
        {state.kind === "done" && <Result result={state.result} />}
      </div>
    </div>
  );
}

function Result({ result }: { result: LiveResult }) {
  const scan = asScan(result);
  const fixes = topFixes(result.checks);
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-paper p-5 text-ink">
      <div className="flex items-center gap-5">
        <GradeBadge score={result.overall} size="lg" />
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black">
            {scan.name} <span className="font-mono text-base font-normal text-ink/60">{result.overall}/100</span>
          </span>
          <span className="font-bold">{OVERALL[letterFor(result.overall)]}</span>
          <span className="italic text-ink/80">{teacherNote(scan)}</span>
        </div>
      </div>
      {fixes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="font-black">Biggest fixes first</h4>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            {fixes.map((c) => (
              <li key={c.id}>
                <span className="font-bold">{c.title}.</span> {c.fix}
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="text-sm text-ink/70">This quick grade reads your homepage only. For your docs and pricing pages, every reason, and Markdown or JSON output, run the command below.</p>
    </div>
  );
}
