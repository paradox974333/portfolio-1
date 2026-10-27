"use client";

import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveSection } from "./use-active-section";

const USERNAME = DATA.url.split("github.com/")[1];

const LINKS = [
  { href: "/#work", section: "work", label: "Work" },
  { href: "/#experience", section: "experience", label: "Experience", wide: true },
  { href: "/#stack", section: "stack", label: "Stack" },
  { href: "/blog", section: null, label: "Writing" },
];

const pill =
  "inline-flex h-7 items-center rounded-full border border-border bg-panel/90 px-3 text-[0.8125rem] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground";

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
                link.wide && "hidden sm:inline-flex",
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
            {repos !== null && (
              <span className="hidden tabular-nums sm:inline">{repos}</span>
            )}
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
  );
}
