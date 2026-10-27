import { ImageResponse } from "next/og";
import { C, MonoLabel, OG_SIZE, OgFrame, Words, loadOgFonts, publicImage } from "@/lib/og";

export const alt =
  "Manoj L: real-time C++ for surgical navigation at HTIC, IIT Madras, and agentic AI in production";
export const size = OG_SIZE;
export const contentType = "image/png";

const GREETING = "Hello, I'm Manoj L";

const NOW = [
  { label: "Work", title: "HTIC, IIT Madras", note: "Surgical navigation in C++" },
  { label: "Building", title: "HyperOrbs", note: "Your agent + an AI team", live: true },
  { label: "In production", title: "Sally", note: "Multi-agent trading on MCP" },
];

export default async function Image() {
  const [fonts, photo] = await Promise.all([
    loadOgFonts(
      [GREETING, "real-time C++ surgical navigation agentic AI production", ...NOW.flatMap((n) => [n.label, n.title, n.note])].join(" "),
      ["sans400", "sans600", "sans700", "mono500", "serifItalic"]
    ),
    publicImage("me.jpg"),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        aside={
          <div style={{ display: "flex", alignItems: "center", fontSize: 19, color: C.muted }}>
            <div style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: C.amber, marginRight: 10 }} />
            Chennai, India
          </div>
        }
      >
        <div style={{ display: "flex", flex: 1, padding: "8px 56px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 32 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontSize: 50,
                color: C.text,
                lineHeight: 1,
              }}
            >
              {GREETING}
            </div>
            <Words
              parts={[
                "I write",
                { mark: "real-time C++" },
                "for surgical navigation and ship",
                { mark: "agentic AI" },
                "to production.",
              ]}
              style={{
                marginTop: 22,
                fontSize: 50,
                fontWeight: 600,
                lineHeight: 1.16,
                letterSpacing: "-0.025em",
                color: C.text,
              }}
            />
          </div>
          {photo ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 236,
                height: 282,
                marginTop: -6,
                padding: "12px 12px 0",
                backgroundColor: "#f4f2ee",
                borderRadius: 4,
                transform: "rotate(4deg)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.55)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} width={212} height={212} alt="" style={{ objectFit: "cover" }} />
              <div
                style={{
                  display: "flex",
                  marginTop: 12,
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: 30,
                  color: "#2a2d33",
                }}
              >
                manoj
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            height: 150,
            flexShrink: 0,
            backgroundColor: C.panel,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {NOW.map((item, index) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                padding: "0 32px 0 56px",
                paddingLeft: index === 0 ? 56 : 32,
                borderLeft: index === 0 ? "none" : `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MonoLabel style={{ fontSize: 15 }}>{item.label}</MonoLabel>
                {item.live ? (
                  <div
                    style={{
                      display: "flex",
                      marginLeft: 10,
                      padding: "2px 8px",
                      borderRadius: 5,
                      backgroundColor: C.amberBg,
                      color: C.amber,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    live
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", marginTop: 10, fontSize: 25, fontWeight: 600, color: C.text }}>
                {item.title}
              </div>
              <div style={{ display: "flex", marginTop: 6, fontSize: 18, color: C.muted }}>{item.note}</div>
            </div>
          ))}
        </div>
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
