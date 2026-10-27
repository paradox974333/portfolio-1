/**
 * Shared pieces for the next/og images (Open Graph cards and app icons).
 *
 * Fonts: the site's own faces (Geist, Geist Mono, Instrument Serif italic) are pulled from the
 * Google Fonts CSS API as TTF, subset to the glyphs in use. These routes are prerendered at
 * build time, so the fetch normally happens once per deploy. If Google is unreachable, each
 * face falls back to a TTF bundled in public/fonts (read from disk, so Vercel's file tracing
 * ships it with the function), and if that also fails the image still renders with
 * next/og's built-in Noto Sans.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

// film and signal, matching the .dark tokens in globals.css
export const C = {
  film: "#0a0c0f",
  panel: "#101318",
  card: "#111419",
  border: "#1c2027",
  rule: "#252a32",
  dot: "#262b33",
  text: "#e9ebee",
  muted: "#8a919c",
  faint: "#5d6470",
  signal: "#4c8dff",
  amber: "#f2b441",
  amberBg: "#2a2110",
} as const;

type Weight = 400 | 500 | 600 | 700;
type Style = "normal" | "italic";

export type OgFont = { name: string; data: ArrayBuffer; weight: Weight; style: Style };

type FaceSpec = {
  name: string;
  weight: Weight;
  style: Style;
  query: string; // Google Fonts css2 `family` value
  fallback: string; // file in public/fonts
};

const FACES = {
  sans400: { name: "Geist", weight: 400, style: "normal", query: "Geist:wght@400", fallback: "CabinetGrotesk-Medium.ttf" },
  sans600: { name: "Geist", weight: 600, style: "normal", query: "Geist:wght@600", fallback: "ClashDisplay-Semibold.ttf" },
  sans700: { name: "Geist", weight: 700, style: "normal", query: "Geist:wght@700", fallback: "ClashDisplay-Semibold.ttf" },
  mono500: { name: "Geist Mono", weight: 500, style: "normal", query: "Geist+Mono:wght@500", fallback: "CabinetGrotesk-Medium.ttf" },
  serifItalic: { name: "Instrument Serif", weight: 400, style: "italic", query: "Instrument+Serif:ital@1", fallback: "CabinetGrotesk-Medium.ttf" },
} satisfies Record<string, FaceSpec>;

export type FaceKey = keyof typeof FACES;

// Printable ASCII plus the typographic marks the cards use. Keeping this fixed means every
// all-ASCII card shares one cached subset per face.
const BASE_GLYPHS =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  "·—–‘’“”…→↗•×";

function glyphsFor(text: string): string {
  const extra = [...new Set(Array.from(text))]
    .filter((ch) => ch.trim() && !BASE_GLYPHS.includes(ch))
    .sort()
    .join("");
  return BASE_GLYPHS + extra;
}

/**
 * Satori sizes each word as the sum of its glyph advances, then draws it with GPOS kerning and
 * GSUB substitutions applied, so heavily kerned words ("navigation", "Multi-agent") come out
 * narrower than the box reserved for them and leave a ragged gap before the next word.
 * Renaming those tables in the font's table directory hides them from the parser, which
 * keeps measured and drawn widths identical. The glyphs themselves are untouched.
 */
function withoutShaping(buffer: ArrayBuffer): ArrayBuffer {
  const bytes = new Uint8Array(buffer.slice(0));
  const view = new DataView(bytes.buffer);
  const numTables = view.getUint16(4);
  for (let i = 0; i < numTables; i++) {
    const at = 12 + i * 16;
    const tag = String.fromCharCode(bytes[at], bytes[at + 1], bytes[at + 2], bytes[at + 3]);
    if (tag === "GPOS" || tag === "GSUB" || tag === "kern") bytes[at] = 0x78; // "x"
  }
  return bytes.buffer;
}

const cache = new Map<string, Promise<ArrayBuffer | null>>();

async function fetchGoogleFont(query: string, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${query}&text=${encodeURIComponent(text)}`;
  // no browser User-Agent, so the API answers with TrueType (satori cannot read woff2)
  const css = await fetch(cssUrl, { signal: AbortSignal.timeout(12_000) }).then((res) => {
    if (!res.ok) throw new Error(`fonts.googleapis.com ${res.status}`);
    return res.text();
  });
  const src = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(?:truetype|opentype)['"]?\)/)?.[1];
  if (!src) throw new Error(`no truetype source for ${query}`);
  const res = await fetch(src, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`font file ${res.status}`);
  return res.arrayBuffer();
}

async function readLocal(file: string): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "fonts", file));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch (error) {
    console.error(`[og] local font ${file} unavailable:`, error);
    return null;
  }
}

function loadFace(spec: FaceSpec, text: string): Promise<ArrayBuffer | null> {
  const glyphs = glyphsFor(text);
  const key = `${spec.query}|${glyphs}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = fetchGoogleFont(spec.query, glyphs)
      .catch((error) => {
        // don't let one failed fetch pin the fallback for the life of the server
        cache.delete(key);
        console.warn(`[og] ${spec.query} from Google Fonts failed, using ${spec.fallback}:`, error);
        return readLocal(spec.fallback);
      })
      .then((data) => (data ? withoutShaping(data) : null));
    cache.set(key, pending);
  }
  return pending;
}

/** Load the faces a card uses. `text` is every string drawn on it, for glyph subsetting. */
export async function loadOgFonts(
  text: string,
  faces: FaceKey[] = ["sans400", "sans600", "mono500", "serifItalic"]
): Promise<OgFont[] | undefined> {
  const loaded = await Promise.all(
    faces.map(async (key) => {
      const spec = FACES[key];
      const data = await loadFace(spec, text);
      return data ? { name: spec.name, data, weight: spec.weight, style: spec.style } : null;
    })
  );
  const fonts = loaded.filter((font): font is OgFont => font !== null);
  // undefined lets next/og use its bundled Noto Sans instead of failing
  return fonts.length ? fonts : undefined;
}

/** public/ file as a data URI, for <img> inside an ImageResponse. */
export async function publicImage(file: string, mime = "image/jpeg"): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", file));
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch (error) {
    console.error(`[og] image ${file} unavailable:`, error);
    return null;
  }
}

export function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ") // code blocks read faster than prose; don't count them
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function formatOgDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/* ---------- building blocks ---------- */

/**
 * Satori has no inline formatting context, so mixed-style text is laid out word by word in a
 * wrapping flex row. `{ mark: "..." }` parts stay unbroken and get the signal-blue underline
 * the site uses on its hero.
 */
export function Words({
  parts,
  style,
}: {
  parts: Array<string | { mark: string }>;
  style?: CSSProperties;
}) {
  const tokens = parts.flatMap((part) =>
    typeof part === "string"
      ? part.split(/\s+/).filter(Boolean).map((text) => ({ text, mark: false }))
      : [{ text: part.mark, mark: true }]
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
      {tokens.map((token, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            position: "relative",
            marginRight: index < tokens.length - 1 ? "0.22em" : 0,
          }}
        >
          {token.text}
          {token.mark ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "0.04em",
                height: 3,
                borderRadius: 2,
                backgroundColor: C.signal,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Monogram({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: C.text,
        color: C.film,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      }}
    >
      ML
    </div>
  );
}

export function MonoLabel({
  children,
  color = C.signal,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Geist Mono",
        fontWeight: 500,
        fontSize: 17,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The page as it looks on the site: a ruled film-black column over a dotted field,
 * a header row with the monogram, then whatever the card needs.
 */
export function OgFrame({
  crumb,
  aside,
  children,
}: {
  crumb?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: C.film,
        backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${C.dot} 1.5px, transparent 0)`,
        backgroundSize: "24px 24px",
        fontFamily: "Geist",
        color: C.text,
      }}
    >
      <div
        style={{
          width: 1040,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.film,
          borderLeft: `1px solid ${C.border}`,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 104,
            padding: "0 56px",
            flexShrink: 0,
          }}
        >
          <Monogram />
          <div style={{ display: "flex", alignItems: "center", marginLeft: 18, fontSize: 24 }}>
            <span style={{ fontWeight: 600, color: C.text }}>Manoj L</span>
            {crumb ? (
              <span style={{ display: "flex", color: C.faint, margin: "0 12px" }}>/</span>
            ) : null}
            {crumb ? <span style={{ color: C.muted }}>{crumb}</span> : null}
          </div>
          <div style={{ display: "flex", marginLeft: "auto", alignItems: "center" }}>{aside}</div>
        </div>
        {children}
      </div>
    </div>
  );
}
