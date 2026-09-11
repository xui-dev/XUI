import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xui.dev"),
  title: "XUI — Next-Gen UI Component Platform",
  description:
    "Highly customizable animated components & backgrounds that drop into your project and instantly make it stand out.",
  icons: {
    icon: "/XUI.png",
    shortcut: "/XUI.png",
    apple: "/XUI.png",
  },
  openGraph: {
    title: "XUI — Next-Gen UI Component Platform",
    description:
      "Highly customizable animated components & backgrounds that drop into your project and instantly make it stand out.",
    url: "https://xui.dev",
    siteName: "XUI",
    images: [
      {
        url: "/XUI.png",
        width: 1080,
        height: 1080,
        alt: "XUI Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XUI — Next-Gen UI Component Platform",
    description:
      "Highly customizable animated components for creative developers.",
    images: ["/XUI.png"],
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white m-0 p-0 overflow-x-hidden select-none">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
