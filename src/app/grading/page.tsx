import type { Metadata } from "next";
import { AGENT_LANDING_URL, REPO_URL } from "@/lib/site";

export const metadata: Metadata = { title: "How grading works", description: "What the scanner checks, how the grade is computed, and how to ask for a regrade." };

const SUBJECTS: [string, number, string][] = [
  ["robots.txt rules for AI agents", 15, "Can the common AI crawlers and assistants fetch the homepage?"],
  ["llms.txt", 15, "Is there a plain map of the product written for language models?"],
  ["Server-rendered HTML", 15, "Does the page say anything before JavaScript runs?"],
  ["Markdown versions", 10, "Can an agent get the page as markdown instead of layout soup?"],
  ["API docs", 10, "Can an agent find an OpenAPI spec or API docs?"],
  ["MCP", 10, "Does the product advertise an MCP server agents can connect to?"],
  ["Login walls", 10, "Is the useful content readable without signing in?"],
  ["Sitemap", 5, "Is there a sitemap that lists the pages?"],
  ["Structured data", 5, "Does the page describe itself with JSON-LD?"],
  ["Page weight", 5, "How many bytes does an agent pay to read the page?"],
];

export default function Grading() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">How grading works</h1>
      <p className="text-lg">
        Every grade comes from <a href={AGENT_LANDING_URL} className="underline">agent-landing</a>, an open-source scanner. It fetches each homepage once, plus robots.txt, llms.txt, the sitemap, and a few well-known paths. It honors robots.txt and identifies itself in its user agent. Nobody logs in, and nothing is guessed.
      </p>
      <p className="text-lg">
        Each subject gets a score from 0 to 100. The overall score is the weighted average, and the letter follows the usual school bands: A is 90 and up, B is 80, C is 70, D is 60, and anything lower is an F.
      </p>
      <ul className="flex flex-col divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink bg-white">
        {SUBJECTS.map(([name, weight, q]) => (
          <li key={name} className="flex gap-4 p-4">
            <span className="w-12 shrink-0 font-mono text-pen">{weight}%</span>
            <span className="flex flex-col">
              <span className="font-black">{name}</span>
              <span className="text-sm text-ink/70">{q}</span>
            </span>
          </li>
        ))}
      </ul>
      <p>
        If a site answers the scanner with a 403 or a bot challenge, the checks behind that door score zero and the report card says the robot was locked out. The site may well have an llms.txt in there. An agent that can&apos;t get in can&apos;t use it.
      </p>
      <h2 className="font-display text-2xl">Who made the list</h2>
      <p>Companies that sell AI agents or agent platforms and say so on their homepage. The list skips companies where I have an open job application, so nobody gets graded mid-interview.</p>
      <h2 className="font-display text-2xl">Regrades</h2>
      <p>
        Scores are reproducible. Run the same scan and you get the same answer. If you fixed your site or think a check got it wrong, <a href={`${REPO_URL}/issues`} className="underline">open an issue</a> and I&apos;ll rescan. The class gets rescanned every month, and who moved is the next post.
      </p>
    </main>
  );
}
