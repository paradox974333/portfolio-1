"use client";

import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "./use-active-section";

const USERNAME = DATA.url.split("github.com/")[1];

const LINKS = [
  { href: "/#work", section: "work", label: "Work" },
  { href: "/#experience", section: "experience", label: "Experience" },
  { href: "/#stack", section: "stack", label: "Stack" },
  { href: "/blog", section: null, label: "Writing" },
];

// phones get the full list behind the Menu pill instead of the top bar
const MENU = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#connect", label: "Connect" },
  { href: "/#stack", label: "Stack" },
  { href: "/#github", label: "GitHub activity" },
  { href: "/blog", label: "Writing" },
];

const pill =
  "inline-flex h-7 items-center rounded-full border border-border bg-panel/90 px-3 text-[0.8125rem] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground";

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // focus moves into the menu; Escape closes it and hands focus back to the pill
    wrapper.current?.querySelector<HTMLElement>("#mobile-menu a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && (
        <div aria-hidden className="fixed inset-0 z-40 sm:hidden" onClick={() => setOpen(false)} />
      )}
      <div
        ref={wrapper}
        className="fixed bottom-4 left-4 z-50 sm:hidden"
        onBlur={(event) => {
          // tabbing out of the menu closes it
          if (open && !wrapper.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <nav
          id="mobile-menu"
          aria-label="Sections"
          hidden={!open}
          className="mb-2 w-52 rounded-xl border border-border bg-panel p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
        >
          {MENU.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground focus-visible:outline-offset-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="h-8 rounded-full bg-foreground px-4 text-xs font-semibold text-background shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const { active } = useActiveSection(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  const [repos, setRepos] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`https://api.github.com/users/${USERNAME}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (live && typeof user?.public_repos === "number") setRepos(user.public_repos);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const onBlog = pathname.startsWith("/blog");

  return (
    <>
      <header className="sticky top-0 z-40 bg-linear-to-b from-background via-background/85 to-transparent px-4 pb-5 pt-3 sm:px-6">
        <nav aria-label="Primary" className="flex items-center gap-1.5">
          <Link
            href="/"
            aria-label={`${DATA.name}, home`}
            className="mr-1 grid size-7 place-items-center rounded-md bg-foreground text-[0.6875rem] font-bold tracking-tight text-background"
          >
            {DATA.initials}
          </Link>
          {LINKS.map((link) => {
            const current = link.section
              ? pathname === "/" && active === link.section
              : onBlog;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  pill,
                  "hidden sm:inline-flex",
                  current && "border-signal/30 bg-signal/10 text-signal hover:text-signal"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5">
            <a
              href={DATA.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                repos === null
                  ? "GitHub profile"
                  : `GitHub profile, ${repos} public repositories`
              }
              className={cn(pill, "gap-1.5 px-2.5")}
            >
              <Icons.github className="size-3.5" />
              {repos !== null && <span className="tabular-nums">{repos}</span>}
            </a>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Switch between light and dark"
              className={cn(pill, "w-7 justify-center px-0")}
            >
              <SunIcon className="hidden size-3.5 dark:block" />
              <MoonIcon className="size-3.5 dark:hidden" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu />

      {/* content dissolves into the bottom edge instead of being cut off */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-14 bg-linear-to-t from-background to-transparent"
      />
    </>
  );
}
