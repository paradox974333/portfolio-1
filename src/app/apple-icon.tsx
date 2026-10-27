import { ImageResponse } from "next/og";
import { C, loadOgFonts } from "@/lib/og";

// full-bleed square: iOS applies its own corner mask
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await loadOgFonts("ML", ["sans700"]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: C.text,
          color: C.film,
          fontFamily: "Geist",
          fontWeight: 700,
          fontSize: 76,
          letterSpacing: "-0.05em",
        }}
      >
        ML
      </div>
    ),
    { ...size, fonts }
  );
}
