import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { bySlug, classList } from "@/lib/data";
import { average, letterFor, teacherNote } from "@/lib/grade";
import { SCAN_COMMAND } from "@/lib/site";

const INK = "#1b1b1b";
const PAPER = "#fdfbf3";
const PEN = "#d7263d";
const MARKER = "#fff35c";
const CHALK = "#2f5d50";
const ORANGE = "#f08a24";

const TONES: Record<string, { ring: string; fill: string; text: string }> = {
  A: { ring: CHALK, fill: "transparent", text: CHALK },
  B: { ring: CHALK, fill: "transparent", text: CHALK },
  C: { ring: ORANGE, fill: "transparent", text: ORANGE },
  D: { ring: PEN, fill: "transparent", text: PEN },
  F: { ring: PEN, fill: PEN, text: INK },
};

const font = readFile(join(process.cwd(), "assets/fonts/ArchivoBlack-Regular.ttf"));

type Body = { kicker: string; letter: string; title: string; line: string; note: string };

const bodyFor = (slug: string): Body | undefined => {
  if (slug === "class") {
    const avg = average(classList);
    const f = classList.filter((s) => letterFor(s.overall) === "F").length;
    return { kicker: "CLASS REPORT", letter: letterFor(avg), title: `${classList.length} companies that sell AI agents`, line: `Class average ${avg}/100. ${f} got an F.`, note: "Can an agent use their website? Not very well." };
  }
  const s = bySlug(slug);
  if (!s) return undefined;
  return { kicker: `REPORT CARD · ${s.category.toUpperCase()}`, letter: letterFor(s.overall), title: s.name, line: `${s.overall}/100 for agent readiness`, note: teacherNote(s) };
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const b = bodyFor((await params).slug);
  if (!b) return new Response("Not found", { status: 404 });
  const tone = TONES[b.letter];
  const headers: Record<string, string> = { "Cache-Control": "public, max-age=86400" };
  if (new URL(request.url).searchParams.get("dl") === "1") headers["Content-Disposition"] = 'attachment; filename="report-card.png"';

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: PAPER, color: INK, padding: "52px 64px", borderLeft: `18px solid ${PEN}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, color: PEN }}>AI HYPOCRISY HIGHLIGHTER</div>
          <div style={{ display: "flex", fontSize: 20, color: "#777777" }}>{b.kicker}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 230, height: 230, borderRadius: 999, border: `12px solid ${tone.ring}`, background: tone.fill, color: tone.text, fontSize: 150, transform: "rotate(-8deg)" }}>{b.letter}</div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 14 }}>
            <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05 }}>{b.title}</div>
            <div style={{ display: "flex", fontSize: 32, color: "#444444" }}>{b.line}</div>
            <div style={{ display: "flex", fontSize: 32, background: MARKER, padding: "6px 12px", alignSelf: "flex-start" }}>{b.note}</div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#555555" }}>
          <span>Grade your own site:&nbsp;</span>
          <span style={{ color: CHALK }}>{SCAN_COMMAND}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers, fonts: [{ name: "Archivo Black", data: await font, weight: 400, style: "normal" }] },
  );
}
