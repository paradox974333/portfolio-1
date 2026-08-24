-- Engagement schema for the blog: views, likes, comments.
-- Apply with: pnpm db:setup   (requires DATABASE_URL)
-- Safe to re-run.

-- Running view counter per post. Incremented only on a first-of-day view.
create table if not exists post_stats (
  slug   text primary key,
  views  bigint not null default 0
);

-- Dedupe ledger: one row per visitor per post per day.
create table if not exists post_views (
  slug        text not null,
  visitor_id  text not null,
  viewed_on   date not null default current_date,
  primary key (slug, visitor_id, viewed_on)
);

-- One like per visitor per post. Toggling deletes the row.
create table if not exists post_likes (
  slug        text not null,
  visitor_id  text not null,
  created_at  timestamptz not null default now(),
  primary key (slug, visitor_id)
);

-- Comments land unapproved and stay hidden until moderated.
create table if not exists comments (
  id          bigint generated always as identity primary key,
  slug        text not null,
  author      text not null,
  body        text not null,
  approved    boolean not null default false,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists comments_slug_approved_idx
  on comments (slug, approved, created_at desc);

create index if not exists comments_pending_idx
  on comments (approved, created_at desc);

-- Supports the per-IP submission rate limit.
create index if not exists comments_ip_recent_idx
  on comments (ip_hash, created_at desc);
