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

// Rhythm for every band on the page: a fixed 3rem gap above, a 44px header, and
// content that starts and ends about the same distance from its rules. Lists of
// rows sit flush under the header; free-form content pads itself with `pt-5 pb-4`.
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
      className={cn("relative mt-12", className)}
    >
      <header className="flex min-h-11 items-center justify-between gap-4 border-y border-border bg-panel px-5 py-2.5 sm:px-8">
        <h2
          id={`${id}-title`}
          className={cn(
            // the serif title keeps the sans title's line box so every band is the same height
            serif
              ? "font-serif text-[1.375rem] italic leading-[1.4rem]"
              : "text-[0.9375rem] font-semibold leading-[1.4rem] tracking-tight"
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
