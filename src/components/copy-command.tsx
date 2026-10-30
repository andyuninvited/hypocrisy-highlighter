"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={copy} className="flex w-full items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-left font-mono text-sm text-paper">
      <code className="overflow-x-auto">{command}</code>
      <span className="shrink-0 font-sans font-bold text-marker">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
