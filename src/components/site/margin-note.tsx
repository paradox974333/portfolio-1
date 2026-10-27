import { cn } from "@/lib/utils";

type MarginNoteProps = {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

// A pencilled aside in the gutter, with an arrow curling back toward the column.
export function MarginNote({ side = "right", className, children }: MarginNoteProps) {
  const right = side === "right";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-16 hidden w-40 select-none flex-col gap-1 text-muted-foreground xl:flex",
        right
          ? "left-[calc(100%+3rem)] items-start"
          : "right-[calc(100%+3rem)] items-end text-right",
        className
      )}
    >
      <p
        className={cn(
          "font-hand text-[1.3rem] leading-[1.05]",
          right ? "-rotate-3" : "rotate-3"
        )}
      >
        {children}
      </p>
      <svg
        viewBox="0 0 64 36"
        className={cn("h-9 w-16", !right && "-scale-x-100")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 3c4 14-6 24-32 27" />
        <path d="M15 23 7 30l9 4" />
      </svg>
    </div>
  );
}
