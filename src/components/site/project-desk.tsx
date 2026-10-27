"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { cloneElement, isValidElement, useRef, useState } from "react";
import { BrowserShot, Polaroid } from "./desk-items";
import { useFinePointer } from "./use-fine-pointer";

type Spot = { left: number; top: number; width: number };

// The live sites, spread across the desk like printouts. Spots are percentages
// of the desk: `wide` from the sm breakpoint up, `narrow` on phones, where fewer
// and larger pieces read better (null leaves the piece off).
const ITEMS: {
  id: string;
  rotate: number;
  wide: Spot;
  narrow: Spot | null;
  art: React.ReactNode;
}[] = [
  {
    id: "sally",
    rotate: -3,
    wide: { left: 0, top: 5, width: 42 },
    narrow: { left: 0, top: 5, width: 58 },
    art: <BrowserShot src="/shots/imperialx.jpg" address="imperialx.io" />,
  },
  {
    id: "scalepath",
    rotate: 3.5,
    wide: { left: 59.5, top: 0, width: 38.5 },
    narrow: { left: 42, top: 0, width: 58 },
    art: <BrowserShot src="/shots/scalepath.jpg" address="scalepath.in" />,
  },
  {
    id: "vginnfra",
    rotate: -2,
    wide: { left: 66.5, top: 46, width: 33 },
    narrow: null,
    art: <BrowserShot src="/shots/vginnfra.jpg" address="vginnfra.com" />,
  },
  {
    id: "hyperorbs",
    rotate: 1.5,
    wide: { left: 30, top: 19, width: 42 },
    narrow: { left: 13, top: 29, width: 74 },
    art: <BrowserShot src="/shots/hyperorbs.jpg" address="hyperorbs.com" preload />,
  },
  {
    id: "lab",
    rotate: -5,
    wide: { left: 4, top: 53, width: 18.5 },
    narrow: { left: 72, top: 62, width: 26 },
    art: <Polaroid src="/projects/spine.jpg" caption="HTIC lab" />,
  },
  {
    id: "me",
    rotate: 4,
    wide: { left: 24.5, top: 63, width: 15 },
    narrow: { left: 2, top: 63, width: 26 },
    art: <Polaroid src={DATA.avatarUrl} caption={DATA.name.split(" ")[0].toLowerCase()} />,
  },
];

// the column tops out at 704px of desk; below sm the desk is the viewport minus gutters
const sizesFor = (item: (typeof ITEMS)[number]) =>
  `(min-width: 768px) ${Math.round(7.04 * item.wide.width)}px, (min-width: 640px) ${item.wide.width}vw, ${(item.narrow ?? item.wide).width}vw`;

const spotVars = (item: (typeof ITEMS)[number]) =>
  ({
    "--x": `${item.wide.left}%`,
    "--y": `${item.wide.top}%`,
    "--w": `${item.wide.width}%`,
    "--nx": `${(item.narrow ?? item.wide).left}%`,
    "--ny": `${(item.narrow ?? item.wide).top}%`,
    "--nw": `${(item.narrow ?? item.wide).width}%`,
  }) as React.CSSProperties;

export function ProjectDesk() {
  const desk = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [stack, setStack] = useState(() => ITEMS.map((item) => item.id));
  // dragging is for mice and pens; on touch it would hijack the page scroll
  const canDrag = useFinePointer();

  const raise = (id: string) =>
    setStack((order) => [...order.filter((item) => item !== id), id]);

  return (
    // reduced motion is handled by hand below, so motion's own switch stays off
    <MotionConfig reducedMotion="never">
    <div ref={desk} aria-hidden className="relative aspect-[5/4] w-full select-none sm:aspect-[2/1]">
      {ITEMS.map((item, index) => (
        <motion.div
          key={item.id}
          className={cn(
            "absolute left-(--nx) top-(--ny) w-(--nw) sm:left-(--x) sm:top-(--y) sm:w-(--w)",
            !item.narrow && "hidden sm:block",
            canDrag && "cursor-grab active:cursor-grabbing"
          )}
          style={{ ...spotVars(item), zIndex: stack.indexOf(item.id) + 1 }}
          // the same hidden start on the server and the client (branching on reduced
          // motion here caused a hydration mismatch that left the desk invisible);
          // reduced motion just lands the pieces instantly
          initial={{ opacity: 0, scale: 1.12, rotate: item.rotate - 6, y: -14 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: item.rotate,
            y: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                  delay: 0.1 + index * 0.07,
                  opacity: { duration: 0.35, ease: "easeOut", delay: 0.1 + index * 0.07 },
                },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          drag={canDrag}
          dragConstraints={desk}
          dragElastic={0.08}
          dragTransition={{ power: 0.15, timeConstant: 180 }}
          onPointerDown={() => raise(item.id)}
          whileHover={canDrag && !reduceMotion ? { scale: 1.02 } : undefined}
          whileDrag={reduceMotion ? undefined : { scale: 1.04, rotate: item.rotate + 1.5 }}
        >
          {isValidElement<{ sizes?: string; loading?: "eager" | "lazy" }>(item.art)
            ? cloneElement(item.art, {
                sizes: sizesFor(item),
                // the piece hidden on phones stays lazy so phones never fetch it
                loading: item.narrow ? "eager" : "lazy",
              })
            : item.art}
        </motion.div>
      ))}
    </div>
    </MotionConfig>
  );
}
