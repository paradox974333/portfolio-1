import { ImageResponse } from "next/og";
import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";
import {
  C,
  MonoLabel,
  OG_SIZE,
  OgFrame,
  formatOgDate,
  loadOgFonts,
  publicImage,
  readingMinutes,
} from "@/lib/og";

export const alt = `Blog post by ${DATA.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const slugOf = (post: (typeof allPosts)[number]) => post._meta.path.replace(/\.mdx$/, "");

// prerender one card per post at build time
export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: slugOf(post) }));
}

const ROLE = (() => {
  const current = DATA.work[0];
  return current ? `${current.title}, ${current.company}` : DATA.location;
})();

function titleSize(title: string): number {
  if (title.length <= 32) return 80;
  if (title.length <= 56) return 66;
  if (title.length <= 84) return 56;
  return 48;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => slugOf(p) === slug);

  const title = post?.title ?? "Writing";
  const summary = post?.summary ?? "Notes on building AI agents and the systems around them.";
  const author = post?.author ?? DATA.name;
  const meta = post
    ? `${formatOgDate(post.publishedAt)} · ${readingMinutes(post.content)} min read`
    : "";

  const [fonts, avatar] = await Promise.all([
    loadOgFonts([title, summary, author, ROLE, meta].join(" "), ["sans400", "sans600", "sans700", "mono500"]),
    publicImage("me.jpg"),
  ]);

  return new ImageResponse(
    (
      <OgFrame crumb="Writing">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 56px 28px",
          }}
        >
          {meta ? <MonoLabel>{meta}</MonoLabel> : null}
          <div
            style={{
              display: "block",
              marginTop: 22,
              fontSize: titleSize(title),
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              color: C.text,
              lineClamp: 3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "block",
              marginTop: 26,
              maxWidth: 880,
              fontSize: 26,
              lineHeight: 1.42,
              color: C.muted,
              lineClamp: 2,
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 112,
            flexShrink: 0,
            padding: "0 56px",
            backgroundColor: C.panel,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              width={52}
              height={52}
              alt=""
              style={{ borderRadius: 52, border: `2px solid ${C.rule}`, objectFit: "cover" }}
            />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", marginLeft: avatar ? 18 : 0 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: C.text }}>{author}</div>
            <div style={{ display: "flex", marginTop: 3, fontSize: 18, color: C.muted }}>{ROLE}</div>
          </div>
        </div>
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
