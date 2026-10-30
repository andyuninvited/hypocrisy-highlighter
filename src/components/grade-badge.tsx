import { letterFor, type Letter } from "@/lib/grade";

const SIZES = { sm: "h-10 w-10 text-xl", lg: "h-28 w-28 text-6xl" } as const;

const TONES: Record<Letter, string> = {
  A: "border-chalk text-chalk",
  B: "border-chalk text-chalk",
  C: "border-orange text-orange",
  D: "border-pen text-pen",
  F: "border-pen bg-pen text-ink",
};

export function GradeBadge({ score, size = "sm" }: { score: number; size?: keyof typeof SIZES }) {
  const letter = letterFor(score);
  return (
    <span aria-label={`Grade ${letter}`} className={`font-display inline-flex shrink-0 -rotate-6 items-center justify-center rounded-full border-4 ${TONES[letter]} ${SIZES[size]}`}>
      {letter}
    </span>
  );
}
