import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/grade-badge";
import { Share } from "@/components/share";
import { allSlugs, bySlug } from "@/lib/data";
import { comment, letterFor, OVERALL, teacherNote } from "@/lib/grade";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => allSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = bySlug((await params).slug);
  if (!s) return {};
  const title = `${s.name} report card: ${letterFor(s.overall)}`;
  const description = `${s.name} scored ${s.overall}/100 for agent readiness. ${teacherNote(s)}`;
  return { title, description, openGraph: { title, description, images: [{ url: `/api/card/${s.slug}`, width: 1200, height: 630 }] } };
}

export default async function ReportCard({ params }: Props) {
  const s = bySlug((await params).slug);
  if (!s) notFound();
  const letter = letterFor(s.overall);
  const scanned = new Date(s.scannedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-6 rounded-2xl border-2 border-ink bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <GradeBadge score={s.overall} size="lg" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold uppercase tracking-wide text-ink/60">Report card · {s.category}</p>
          <h1 className="font-display text-4xl">{s.name}</h1>
          <p className="text-lg">
            <span className="font-mono">{s.overall}/100.</span> <span className="hl font-semibold">{OVERALL[letter]}</span>
          </p>
          <p className="text-sm text-ink/60">
            Scanned {s.url} on {scanned}.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">Subjects</h2>
        <ul className="flex flex-col divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink bg-white">
          {s.checks.map((c) => (
            <li key={c.id} className="flex gap-4 p-4">
              {c.score === null ? (
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold text-ink/40">N/A</span>
              ) : (
                <GradeBadge score={c.score} />
              )}
              <div className="flex flex-col gap-1">
                <span className="font-black">{c.title}</span>
                <span className="italic text-pen">{comment(c) ?? (c.score === null ? "Excused." : "Good work.")}</span>
                <span className="text-sm text-ink/70">{c.reason}</span>
                {c.fix && <span className="text-sm"><strong>Extra credit:</strong> {c.fix}</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Share url={`${SITE_URL}/c/${s.slug}`} text={`${s.name} got a ${letter} on the AI Hypocrisy Highlighter. ${teacherNote(s)}`} image={`/api/card/${s.slug}`} />

      <p className="text-sm text-ink/70">
        Think the grade is wrong? Fix the site and ask for a regrade, or run the scanner yourself. Scores are reproducible.{" "}
        <Link href="/grading" className="underline">
          How grading works
        </Link>
        .
      </p>
    </main>
  );
}
