import { letterFor } from "@/lib/grade";

const SIZES = { sm: "h-10 w-10 text-xl", lg: "h-28 w-28 text-6xl" } as const;

export function GradeBadge({ score, size = "sm" }: { score: number; size?: keyof typeof SIZES }) {
  const letter = letterFor(score);
  const tone = letter === "A" || letter === "B" ? "border-chalk text-chalk" : "border-pen text-pen";
  return (
    <span aria-label={`Grade ${letter}`} className={`font-display inline-flex shrink-0 -rotate-6 items-center justify-center rounded-full border-4 ${tone} ${SIZES[size]}`}>
      {letter}
    </span>
  );
}
