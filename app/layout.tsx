import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0B0E13",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nurgissa-portfolio.vercel.app"),
  title: {
    default: "Nurgissa Zhetkizgen — Software Engineer & Portfolio",
    template: "%s | Nurgissa Zhetkizgen",
  },
  description:
    "Interactive 2D Workshop & Software Engineering Portfolio of Nurgissa Zhetkizgen. Student at Astana IT University specializing in Python, Next.js, and Clean Architecture.",
  keywords: [
    "Nurgissa Zhetkizgen",
    "Astana IT University",
    "Software Engineer",
    "Python Developer",
    "FastAPI",
    "Next.js",
    "React",
    "Clean Architecture",
    "Kazakhstan",
    "Portfolio"
  ],
  authors: [{ name: "Nurgissa Zhetkizgen", url: "https://github.com/nurgissa-dev" }],
  creator: "Nurgissa Zhetkizgen",
  publisher: "Nurgissa Zhetkizgen",

  // Open Graph Meta (Telegram, WhatsApp, LinkedIn, Facebook, Slack)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nurgissa-portfolio.vercel.app",
    title: "Nurgissa Zhetkizgen — Software Engineer Portfolio",
    description: "Interactive Retro Developer Workshop Portfolio · Software Engineering Student at Astana IT University",
    siteName: "Nurgissa Zhetkizgen Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nurgissa Zhetkizgen Portfolio Preview Banner",
      },
    ],
  },

  // Twitter Card Meta Tags
  twitter: {
    card: "summary_large_image",
    title: "Nurgissa Zhetkizgen — Software Engineer Portfolio",
    description: "Interactive Retro Developer Workshop Portfolio · Software Engineering Student at Astana IT University",
    images: ["/og-image.png"],
    creator: "@trulondoner",
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
