"use client";

import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import {
  CalibrationBoard,
  FilterCoffee,
  Polaroid,
  RingedPlanet,
  SallyCandles,
  TrackerTerminal,
  XrayFilm,
} from "./stickers";
import { useFinePointer } from "./use-fine-pointer";

// Positions are percentages of the desk, so the arrangement scales with the column.
const STICKERS = [
  { id: "xray", left: 1, top: 3, width: 19, rotate: -6, art: <XrayFilm /> },
  { id: "terminal", left: 21.5, top: 7, width: 37, rotate: 2.5, art: <TrackerTerminal /> },
  { id: "board", left: 59, top: 0, width: 19, rotate: -9, art: <CalibrationBoard /> },
  { id: "planet", left: 82, top: 1, width: 16, rotate: 0, art: <RingedPlanet /> },
  { id: "sally", left: 57, top: 40, width: 22, rotate: 4, art: <SallyCandles /> },
  { id: "coffee", left: 83, top: 42, width: 12.5, rotate: -5, art: <FilterCoffee /> },
  {
    id: "me",
    left: 23,
    top: 57,
    width: 14,
    rotate: -4,
    art: <Polaroid src={DATA.avatarUrl} caption={DATA.name.split(" ")[0].toLowerCase()} />,
  },
];

export function StickerDesk() {
  const desk = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [stack, setStack] = useState(() => STICKERS.map((s) => s.id));
  // dragging is for mice and pens; on touch it would hijack the page scroll
  const canDrag = useFinePointer();

  const raise = (id: string) =>
    setStack((order) => [...order.filter((item) => item !== id), id]);

  return (
    <div ref={desk} aria-hidden className="relative aspect-[720/330] w-full select-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter
            id="sticker-edge"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="grown" />
            <feFlood floodColor="#f5f5f2" />
            <feComposite in2="grown" operator="in" result="edge" />
            <feDropShadow
              in="edge"
              dx="0"
              dy="5"
              stdDeviation="5"
              floodColor="#000"
              floodOpacity="0.45"
              result="lifted"
            />
            <feMerge>
              <feMergeNode in="lifted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {STICKERS.map((sticker, index) => (
        <motion.div
          key={sticker.id}
          className={cn("absolute", canDrag && "cursor-grab active:cursor-grabbing")}
          style={{
            left: `${sticker.left}%`,
            top: `${sticker.top}%`,
            width: `${sticker.width}%`,
            zIndex: stack.indexOf(sticker.id) + 1,
          }}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 1.3, rotate: sticker.rotate - 14, y: -18 }
          }
          animate={{
            opacity: 1,
            scale: 1,
            rotate: sticker.rotate,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: 0.15 + index * 0.08,
            },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          drag={canDrag}
          dragConstraints={desk}
          dragElastic={0.1}
          dragTransition={{ power: 0.15, timeConstant: 180 }}
          onPointerDown={() => raise(sticker.id)}
          whileHover={canDrag ? { scale: 1.03 } : undefined}
          whileDrag={{ scale: 1.07, rotate: sticker.rotate + 3 }}
        >
          {sticker.art}
        </motion.div>
      ))}
    </div>
  );
}
