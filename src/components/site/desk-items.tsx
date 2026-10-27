import { cn } from "@/lib/utils";
import Image from "next/image";

// Everything here sizes itself in container units, so a window keeps its
// proportions whether it is 120px wide on a phone or 300px on a desktop.

type ShotImage = {
  src: string;
  // the rendered width, so phones don't download desktop pixels and vice versa
  sizes?: string;
  // the hero's largest piece; preloaded so the desk lands with its pictures
  preload?: boolean;
  loading?: "eager" | "lazy";
  onLoad?: () => void;
};

type BrowserShotProps = ShotImage & {
  // shown in the address bar
  address: string;
  className?: string;
};

export function BrowserShot({
  src,
  address,
  sizes = "(min-width: 768px) 320px, 45vw",
  preload,
  loading,
  onLoad,
  className,
}: BrowserShotProps) {
  return (
    <div className={cn("[container-type:inline-size]", className)}>
      <div className="overflow-hidden rounded-[1.8cqw] bg-[#e9eaec] shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_22px_-6px_rgba(0,0,0,0.22),0_28px_56px_-18px_rgba(0,0,0,0.3)] ring-1 ring-black/10 dark:bg-[#1d2025] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_12px_26px_-6px_rgba(0,0,0,0.6),0_32px_64px_-18px_rgba(0,0,0,0.75)] dark:ring-white/10">
        <div className="flex h-[6.4cqw] items-center gap-[1.1cqw] border-b border-black/[0.07] px-[2.4cqw] dark:border-white/5">
          <span className="size-[1.7cqw] rounded-full bg-[#ff5f57]" />
          <span className="size-[1.7cqw] rounded-full bg-[#febc2e]" />
          <span className="size-[1.7cqw] rounded-full bg-[#28c840]" />
          <span className="mx-auto flex h-[4.1cqw] w-1/2 items-center justify-center truncate rounded-[1cqw] bg-black/[0.06] px-[2cqw] text-[2.4cqw] text-black/60 dark:bg-white/[0.07] dark:text-white/55">
            {address}
          </span>
          <span className="w-[6.3cqw]" />
        </div>
        <Image
          src={src}
          alt=""
          width={1280}
          height={800}
          preload={preload}
          loading={preload ? undefined : loading}
          onLoad={onLoad}
          draggable={false}
          sizes={sizes}
          className="block aspect-[16/10] w-full bg-black/5 object-cover object-top dark:bg-white/5"
        />
      </div>
    </div>
  );
}

type PolaroidProps = ShotImage & { caption: string };

export function Polaroid({ src, caption, sizes = "140px", loading, onLoad }: PolaroidProps) {
  return (
    <div className="[container-type:inline-size]">
      {/* the hairline ring keeps the paper's edge visible on the light page */}
      <div className="relative rounded-[1.5cqw] bg-[#f4f3ef] p-[6cqw] pb-[22cqw] shadow-[0_1px_2px_rgba(0,0,0,0.16),0_12px_24px_-8px_rgba(0,0,0,0.32)] ring-1 ring-black/[0.06] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_24px_-8px_rgba(0,0,0,0.45)] dark:ring-0">
        <Image
          src={src}
          alt=""
          width={512}
          height={512}
          loading={loading}
          onLoad={onLoad}
          draggable={false}
          sizes={sizes}
          className="block aspect-square w-full bg-black/5 object-cover"
        />
        <span className="absolute inset-x-0 bottom-[5cqw] text-center font-hand text-[11cqw] leading-none text-[#2b2b2b]">
          {caption}
        </span>
      </div>
    </div>
  );
}
