import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { VisibilityGuard } from "@/components/visibility-guard";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Noice UI - Beautiful React components",
    template: "%s | Noice UI",
  },
  description:
    "Copy-paste React + Tailwind components. Install via CLI or let your AI agent do it through MCP.",
  applicationName: "Noice UI",
  keywords: [
    "noice ui",
    "react components",
    "tailwind css components",
    "shadcn registry",
    "animated ui components",
    "motion react",
    "free ui components",
    "copy paste components",
    "ui component library",
    "micro-interactions",
  ],
  openGraph: {
    title: "Noice UI - Beautiful React components",
    description:
      "Copy-paste React + Tailwind components. Install via CLI or let your AI agent do it through MCP.",
    url: "/",
    siteName: "Noice UI",
    type: "website",
    // A hand-made card, not a generated one. Set here rather than via a
    // file-based opengraph-image so component pages keep their own
    // generated cards, which this does not affect.
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Noice UI - copy-paste React components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noice UI - Beautiful React components",
    description:
      "Copy-paste React + Tailwind components you own, installable with one command.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Applies the stored theme before first paint. It lives in the
          document head rather than inside ThemeProvider, because React
          does not execute scripts produced during client render, and
          warns about them. Here it ships in the initial HTML and runs
          immediately, so there is no flash of the wrong theme.
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="theme",t=localStorage.getItem(k)||"system",d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches),r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider defaultTheme="system">
          <VisibilityGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
