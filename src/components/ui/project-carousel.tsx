/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowUpRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { cn } from "@/lib/utils";

export interface ProjectSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  /** Opens when the centre card is clicked; the sides just slide into focus. */
  href?: string;
  meta?: { label: string; value: string }[];
}

export interface ProjectCarouselProps {
  slides: ProjectSlide[];
  label?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
}

const css = `
  .project-swiper {
    --swiper-theme-color: var(--primary);
    --swiper-pagination-bullet-inactive-color: var(--muted-foreground);
    --swiper-pagination-bullet-inactive-opacity: 0.35;
    --swiper-pagination-bullet-size: 6px;
    --swiper-pagination-bullet-horizontal-gap: 4px;
    padding-bottom: 42px;
    overflow: visible;
  }
  .project-swiper .swiper-wrapper { align-items: center; }
  .project-swiper .swiper-slide {
    opacity: 0.45;
    filter: saturate(0.6);
    transition: opacity 0.35s ease, filter 0.35s ease;
  }
  .project-swiper .swiper-slide-active { opacity: 1; filter: none; }
  .project-swiper .swiper-pagination { bottom: 0; }
`;

export function ProjectCarousel({
  slides,
  label = "Projects",
  className,
  loop = true,
  autoplay = false,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
}: ProjectCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  if (slides.length === 0) return null;

  const current = slides[active] ?? slides[0];

  function openOrFocus(index: number, slide: ProjectSlide) {
    if (index !== active) {
      // a side card just walks into the centre first
      swiper?.slideToLoop(index);
      return;
    }
    if (slide.href) window.open(slide.href, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn("relative w-full", className)}
    >
      <style>{css}</style>

      <div className="overflow-hidden">
        <Swiper
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActive(instance.realIndex)}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={loop && slides.length > 2}
          spaceBetween={24}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 1.7, spaceBetween: 32 },
            1024: { slidesPerView: 2.3, spaceBetween: 40 },
          }}
          coverflowEffect={{
            rotate: 0,
            slideShadows: false,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          autoplay={autoplay ? { delay: 4000, disableOnInteraction: true } : false}
          pagination={showPagination ? { clickable: true } : false}
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          className="project-swiper"
          a11y={{ containerMessage: label }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={slide.src + index}
              className="!h-[200px] overflow-hidden rounded-xl border bg-muted sm:!h-[260px] lg:!h-[320px]"
            >
              <button
                type="button"
                onClick={() => openOrFocus(index, slide)}
                aria-label={
                  index === active && slide.href
                    ? `Open ${slide.title ?? slide.alt}`
                    : `Show ${slide.title ?? slide.alt}`
                }
                className="group relative block size-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  className="size-full object-cover"
                />
                {index === active && slide.href && (
                  <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showNavigation && (
        <>
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous project"
            className="absolute left-0 top-[100px] z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground sm:top-[130px] sm:flex lg:top-[160px]"
          >
            <ChevronLeftIcon className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next project"
            className="absolute right-0 top-[100px] z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground sm:top-[130px] sm:flex lg:top-[160px]"
          >
            <ChevronRightIcon className="size-5" aria-hidden />
          </button>
        </>
      )}

      {showCaption && (
        <div aria-live="polite" className="mt-4 flex flex-col items-center gap-1 text-center">
          <h3 className="text-base font-semibold tracking-tight">{current.title}</h3>
          {current.subtitle && (
            <p className="text-xs text-muted-foreground">{current.subtitle}</p>
          )}
          {current.meta?.map((entry) => (
            <p key={entry.label} className="text-xs text-muted-foreground">
              <span className="text-foreground/70">{entry.label}:</span> {entry.value}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
