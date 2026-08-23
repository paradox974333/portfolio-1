"use client";

import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { useEffect, useState } from "react";

type Commit = {
  sha: string;
  message: string;
  repo: string;
  date: string;
};

const USERNAME = DATA.url.split("github.com/")[1];

function relativeTime(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function firstLine(message: string): string {
  return message.split("\n")[0].slice(0, 80);
}

export default function GitHubCommitBanner() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchCommits() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${USERNAME}/events/public?per_page=100`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!res.ok) return;
        const events = await res.json();
        const parsed: Commit[] = [];
        for (const event of events) {
          if (event.type !== "PushEvent") continue;
          for (const commit of event.payload.commits ?? []) {
            parsed.push({
              sha: commit.sha,
              message: commit.message,
              repo: event.repo.name,
              date: event.created_at,
            });
            if (parsed.length >= 5) break;
          }
          if (parsed.length >= 5) break;
        }
        if (active && parsed.length > 0) setCommits(parsed);
      } catch {
        // silently hide the banner
      }
    }

    fetchCommits();
    const refresh = setInterval(fetchCommits, 120000);

    return () => {
      active = false;
      clearInterval(refresh);
    };
  }, []);

  useEffect(() => {
    if (commits.length <= 1) return;
    const rotate = setInterval(
      () => setIndex((i) => (i + 1) % commits.length),
      5000
    );
    return () => clearInterval(rotate);
  }, [commits]);

  if (commits.length === 0) return null;

  const commit = commits[index];
  const commitUrl = `https://github.com/${commit.repo}/commit/${commit.sha}`;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center px-4">
      <a
        href={commitUrl}
        target="_blank"
        rel="noopener noreferrer"
        key={commit.sha}
        className="pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-500 flex items-center gap-2.5 max-w-full rounded-full border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5 pl-3 pr-4 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="relative flex size-2 flex-none">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        <Icons.github className="size-3.5 flex-none" />
        <span className="truncate">
          <span className="text-foreground font-medium">
            {firstLine(commit.message)}
          </span>
          <span className="hidden sm:inline">
            {" "}
            · {commit.repo.replace(`${USERNAME}/`, "")}
          </span>{" "}
          · {relativeTime(commit.date)}
        </span>
      </a>
    </div>
  );
}
