/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface MediaContainerProps {
  src: string;
  alt?: string;
  type?: "image" | "video";
  caption?: string;
  className?: string;
}

export function MediaContainer({
  src,
  alt = "",
  type = "image",
  caption,
  className,
}: MediaContainerProps) {
  return (
    <figure className={cn("not-prose my-8", className)}>
      <div className="overflow-hidden rounded-lg border border-border bg-panel">
        {type === "image" ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
        ) : (
          <video src={src} className="block h-auto w-full" controls preload="metadata" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
