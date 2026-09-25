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
  },
  twitter: {
    card: "summary_large_image",
    title: "Noice UI - Beautiful React components",
    description:
      "Copy-paste React + Tailwind components you own, installable with one command.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <VisibilityGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
