import { ImageResponse } from "next/og";
import { C, loadOgFonts } from "@/lib/og";

// the "ML" monogram from the nav; 512px so the manifest can reuse it, browsers downscale
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 112,
          backgroundColor: C.text,
          color: C.film,
          fontFamily: "Geist",
          fontWeight: 700,
          fontSize: 236,
          letterSpacing: "-0.05em",
        }}
      >
        ML
      </div>
    ),
    { ...size, fonts }
  );
}
