import Image from "next/image";

export default function Banner() {
  return (
    // full-bleed on phones, where the crop already reads; from sm up it tracks the
    // content column so the 1199px artwork is never upscaled into mush
    <div className="mx-auto max-w-2xl sm:px-8 lg:max-w-4xl xl:max-w-5xl">
      <div className="relative h-36 w-full overflow-hidden border-b bg-muted sm:h-52 sm:rounded-2xl sm:border lg:h-60">
        <Image
          src="/banner.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 1024px, 100vw"
          // biased up from centre so the light streak stays inside the crop
          className="object-cover object-[center_38%]"
        />
        {/* eases the dark artwork into the page and behind the avatar */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/30" />
      </div>
    </div>
  );
}
