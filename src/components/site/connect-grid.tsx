"use client";

import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { ArrowUpRight, Check, Clock, Copy, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const USERNAME = DATA.url.split("github.com/")[1];
const CITY = DATA.location.split(",")[0];

const cell =
  "relative flex items-center gap-3 bg-background px-5 py-3.5 transition-colors hover:bg-panel has-[a:focus-visible]:bg-panel sm:px-8";
// the link stretches over its cell, so a keyboard focus ring outlines the whole cell
const label =
  "text-sm font-medium text-foreground focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-signal";
const detail = "truncate font-mono text-xs text-muted-foreground";

function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-IN", {
      timeZone: DATA.timezone,
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(format.format(new Date()));
    const frame = requestAnimationFrame(tick);
    const timer = setInterval(tick, 15_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);
  return time;
}

export function ConnectGrid() {
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DATA.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked: the mailto link still works
    }
  };

  return (
    <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2">
      <div className={cell}>
        <Icons.github className="size-4 flex-none text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <a
            href={DATA.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${label} after:absolute after:inset-0`}
          >
            GitHub
          </a>
          <p className={detail}>@{USERNAME}</p>
        </div>
        <ArrowUpRight aria-hidden className="size-3.5 flex-none text-muted-foreground" />
      </div>

      <div className={cell}>
        <Icons.email className="size-4 flex-none text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <a href={`mailto:${DATA.contact.email}`} className={`${label} after:absolute after:inset-0`}>
            Email
          </a>
          <p className={detail}>
            {copied ? <span className="text-signal">Copied to clipboard</span> : DATA.contact.email}
          </p>
          {/* announced to screen readers; the icon swap alone is silent */}
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={copyEmail}
          aria-label="Copy email address"
          className="relative z-10 grid size-7 flex-none place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-signal" /> : <Copy className="size-3.5" />}
        </button>
      </div>

      <div className={cell}>
        <PenLine className="size-4 flex-none text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <Link href="/blog" className={`${label} after:absolute after:inset-0`}>
            Writing
          </Link>
          <p className={detail}>notes on agents and harnesses</p>
        </div>
        <ArrowUpRight aria-hidden className="size-3.5 flex-none text-muted-foreground" />
      </div>

      <div className={cell}>
        <Clock className="size-4 flex-none text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className={label}>Local time</p>
          <p className={detail} suppressHydrationWarning>
            {time ? `${time} in ${CITY}, ${DATA.timezoneLabel}` : `${CITY}, ${DATA.timezoneLabel}`}
          </p>
        </div>
      </div>
    </div>
  );
}
