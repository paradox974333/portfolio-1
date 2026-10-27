import type { MetadataRoute } from "next";
import { DATA } from "@/data/resume";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DATA.name,
    short_name: DATA.name,
    description: DATA.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0c0f",
    theme_color: "#0a0c0f",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
