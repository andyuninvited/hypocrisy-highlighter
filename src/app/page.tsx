import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";
import { GradeBadge } from "@/components/grade-badge";
import { classList, self } from "@/lib/data";
import { average, letterFor, teacherNote } from "@/lib/grade";
import { AGENT_LANDING_URL, SCAN_COMMAND } from "@/lib/site";

const SAFETY: [string, string][] = [
  ["It only reads", "Every request is a plain GET, the same kind a browser sends. It fills in no forms, logs into nothing, and changes nothing on your site."],
  ["It's polite", "It honors your robots.txt, names itself in the user agent, stops at 40 requests, and gives up on any page after 10 seconds. Your servers won't notice."],
  ["It stays on your machine", "The scan runs locally on Node 20 or later. No account, no API key, and no LLM calls. The results go nowhere you don't send them."],
];

const RESULTS = [
  "A score from 0 to 100 and a letter grade for each of ten subjects.",
  "A plain reason behind every grade, so you know exactly what the robot saw.",
  "Fixes ranked by how many points each one is worth, so the first hour goes to the biggest gain.",
  "Markdown or JSON output with --md or --json, ready for a PR comment or a CI check.",
  "Your docs and pricing pages graded too, with --pages /,/docs,/pricing.",
];

const failing = classList.filter((s) => letterFor(s.overall) === "F").length;
const avg = average(classList);
const scannedOn = classList[0] ? new Date(classList[0].scannedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-4xl leading-tight sm:text-6xl">
          These companies sell AI agents. <span className="hl">Can an agent use their website?</span>
        </h1>
        <p className="max-w-3xl text-lg">
          Every company below says agents are the future of software. So I ran an open-source agent scanner on each homepage and graded what it found: llms.txt, readable HTML, markdown, API docs, MCP, robots rules, and login walls.
        </p>
        <div className="flex flex-wrap gap-4">
          <Stat value={String(classList.length)} label="companies graded" valueClass="text-ink" />
          <Stat value={`${avg}/100`} label="class average" />
          <Stat value={String(failing)} label="got an F" borderClass="border-pen" />
        </div>
      </header>

      {self && (
        <section className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-ink p-6 sm:flex-row sm:items-center sm:gap-6">
          <GradeBadge score={self.overall} />
          <p className="text-lg">
            <strong>I graded my own site first.</strong> andyrosic.com scored {self.overall}. {teacherNote(self)} Everyone in this class gets the same red pen, including me.{" "}
            <Link href={`/c/${self.slug}`} className="font-bold underline">
              See my report card
            </Link>
            .
          </p>
        </section>
      )}

      <section id="class" className="flex flex-col gap-4">
        <h2 className="font-display text-3xl">The class, ranked</h2>
        <p className="text-sm text-ink/70">Homepages scanned {scannedOn}. Click any company for its full report card.</p>
        <ol className="flex flex-col divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink bg-white">
          {classList.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/c/${s.slug}`} className="flex items-center gap-4 p-4 hover:bg-marker/40">
                <span className="w-8 text-right font-mono text-sm text-ink/50">{i + 1}</span>
                <GradeBadge score={s.overall} />
                <span className="flex flex-1 flex-col">
                  <span className="text-lg font-black">
                    {s.name} <span className="font-mono text-sm font-normal text-ink/60">{s.overall}/100</span>
                  </span>
                  <span className="text-sm italic text-ink/80">{teacherNote(s)}</span>
                </span>
                <span className="hidden text-xs text-ink/50 sm:block">{s.category}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section id="yours" className="flex flex-col gap-6 rounded-2xl bg-chalk p-6 text-paper sm:p-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-3xl">Grade your own site</h2>
          <p className="text-lg">
            Your next customer might be an agent shopping on someone&apos;s behalf. Find out what it sees on your site before it decides you&apos;re too much work. One command gets you the same report card the class got.
          </p>
        </div>
        <CopyCommand command={SCAN_COMMAND} />

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-xl text-marker">What happens when you run it</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {SAFETY.map(([title, body]) => (
              <div key={title} className="flex flex-col gap-1 rounded-xl bg-paper/10 p-4">
                <span className="font-black">{title}</span>
                <span className="text-sm">{body}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-xl text-marker">What you get back</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {RESULTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <p>
          Live in Claude Code? Install the plugin with <code className="rounded bg-paper/15 px-1 font-mono text-sm">/plugin install agent-landing --marketplace andyuninvited/agent-landing</code> and ask Claude to grade your site and fix the cheapest points first. After a launch, <code className="rounded bg-paper/15 px-1 font-mono text-sm">agent-landing score</code> reads your own telemetry and tells you whether the launch landed with agent users or only with people.
        </p>

        <a href={AGENT_LANDING_URL} className="font-bold text-marker underline">
          agent-landing on GitHub. Open source, MIT. Star it if it saved you a meeting.
        </a>
      </section>

      <section className="flex flex-col gap-2 rounded-2xl border-2 border-ink p-6">
        <h2 className="font-display text-2xl">Coming soon: the Robot Mystery Shopper</h2>
        <p>An agent tries to find pricing, read the docs, and sign up on famous sites, narrated like a nature documentary. Here we see the agent, lost in a cookie banner for the third time.</p>
      </section>
    </main>
  );
}

function Stat({ value, label, valueClass = "text-pen", borderClass = "border-ink" }: { value: string; label: string; valueClass?: string; borderClass?: string }) {
  return (
    <div className={`flex flex-col rounded-2xl border-2 bg-white px-5 py-3 ${borderClass}`}>
      <span className={`font-display text-3xl ${valueClass}`}>{value}</span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
