import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { TopNav } from "@/components/site/top-nav";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

// italic serif for the personal voice: greetings, years, the closing quote
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

// handwriting for the margin notes
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-caveat",
});

const TITLE = `${DATA.name} · Real-time C++ for surgical navigation, agentic AI`;
const DESCRIPTION =
  "Project Associate at HTIC, IIT Madras, writing real-time C++ for image-guided surgical navigation, and building agentic AI in production: HyperOrbs and Sally.";

export const viewport: Viewport = {
  // the site renders dark for every first visit (ThemeProvider defaultTheme="dark", system
  // preference not followed), so the browser chrome matches the film-black page
  themeColor: "#0a0c0f",
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${DATA.name}`,
  },
  description: DESCRIPTION,
  applicationName: DATA.name,
  authors: [{ name: DATA.name, url: SITE_URL }],
  creator: DATA.name,
  publisher: DATA.name,
  keywords: [
    "Manoj L",
    "HTIC IIT Madras",
    "image-guided surgical navigation",
    "real-time C++",
    "vertebra tracking",
    "computer vision",
    "agentic AI",
    "AI agents",
    "multi-agent systems",
    "Model Context Protocol",
    "HyperOrbs",
    "Sally AI trading",
    "Chennai",
  ],
  category: "technology",
  // "./" resolves against each page's own path, so children inherit a correct canonical
  alternates: { canonical: "./" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "./",
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  // set GOOGLE_SITE_VERIFICATION in Vercel to emit the Search Console tag
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

const current = DATA.work[0];
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: DATA.name,
      url: SITE_URL,
      image: `${SITE_URL}${DATA.avatarUrl}`,
      description: DATA.description,
      jobTitle: current?.title ?? "Project Associate",
      worksFor: {
        "@type": "Organization",
        name: "HTIC, IIT Madras",
        alternateName: "Healthcare Technology Innovation Centre, IIT Madras",
        url: current?.href ?? "https://www.hticiitm.org/",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      sameAs: [DATA.url],
      knowsAbout: [
        "C++",
        "Image-guided surgical navigation",
        "Computer vision",
        "Agentic AI",
        "Multi-agent systems",
        "Model Context Protocol",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: DATA.name,
      url: SITE_URL,
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
}).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen overflow-x-clip bg-background font-sans antialiased",
          geist.variable,
          geistMono.variable,
          instrumentSerif.variable,
          caveat.variable
        )}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider delayDuration={0}>
            {/* one ruled column over the dotted gutters */}
            <div className="relative mx-auto min-h-dvh max-w-3xl border-x border-border bg-background">
              <TopNav />
              <div className="page-pad px-5 pb-8 pt-4 sm:px-8">{children}</div>
              <SiteFooter />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
