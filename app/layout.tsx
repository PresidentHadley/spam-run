import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPAMRUN - Beat the Spam Filter. Reach the Inbox.",
  description: "AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it.",
  keywords: "email deliverability, spam checker, email marketing, cold email, inbox placement",
  openGraph: {
    title: "SPAMRUN - Beat the Spam Filter",
    description: "AI-powered email analysis for better deliverability",
    url: "https://spamrun.com",
    siteName: "SPAMRUN",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPAMRUN - Beat the Spam Filter",
    description: "AI-powered email analysis for better deliverability",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

