import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  // shown on the scroll ruler, and as the heading unless `title` is given
  label: string;
  title?: React.ReactNode;
  serif?: boolean;
  aside?: React.ReactNode;
  // handwritten margin note, only drawn where the gutters are wide enough
  note?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  label,
  title,
  serif,
  aside,
  note,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-ruler={label}
      aria-labelledby={`${id}-title`}
      className={cn("relative mt-14", className)}
    >
      <header className="flex items-baseline justify-between gap-4 border-y border-border bg-panel px-5 py-2.5 sm:px-8">
        <h2
          id={`${id}-title`}
          className={cn(
            serif
              ? "font-serif text-[1.375rem] italic leading-tight"
              : "text-[0.9375rem] font-semibold tracking-tight"
          )}
        >
          {title ?? label}
        </h2>
        {aside && (
          <div className="text-xs text-muted-foreground tabular-nums">
            {aside}
          </div>
        )}
      </header>
      {note}
      {children}
    </section>
  );
}
