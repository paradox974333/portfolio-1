import { ImageResponse } from "next/og";
import { allPosts } from "content-collections";
import { C, MonoLabel, OG_SIZE, OgFrame, formatOgDate, loadOgFonts } from "@/lib/og";

export const alt = "Writing by Manoj L: notes on building AI agents and the systems around them";
export const size = OG_SIZE;
export const contentType = "image/png";

const LEDE = "Notes on building AI agents and the systems around them.";

export default async function Image() {
  const posts = [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const latest = posts.slice(0, 3);
  const count = `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;

  const fonts = await loadOgFonts(
    ["Writing", LEDE, count, ...latest.map((post) => post.title)].join(" "),
    ["sans400", "sans600", "sans700", "mono500", "serifItalic"]
  );

  return new ImageResponse(
    (
      <OgFrame crumb="Writing" aside={<MonoLabel color={C.muted}>{count}</MonoLabel>}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 56px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 128,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            Writing
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 32, color: C.muted, lineHeight: 1.35 }}>
            {LEDE}
          </div>
        </div>

        {latest.length ? (
          <div
            style={{
              display: "flex",
              height: 172,
              flexShrink: 0,
              backgroundColor: C.panel,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {latest.map((post, index) => (
              <div
                key={post._meta.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  padding: `30px 28px 0 ${index === 0 ? 56 : 32}px`,
                  borderLeft: index === 0 ? "none" : `1px solid ${C.border}`,
                }}
              >
                <MonoLabel style={{ fontSize: 15 }}>{formatOgDate(post.publishedAt)}</MonoLabel>
                <div
                  style={{
                    display: "block",
                    marginTop: 12,
                    fontSize: 24,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: C.text,
                    lineClamp: 3,
                  }}
                >
                  {post.title}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
