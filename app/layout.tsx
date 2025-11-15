import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://spamrun.com'),
  title: {
    default: "SPAMRUN - Beat the Spam Filter. Reach the Inbox.",
    template: "%s | SPAMRUN"
  },
  description: "AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it. Check spam score, get deliverability insights, and reach the inbox every time.",
  keywords: "email deliverability, spam checker, email marketing, cold email, inbox placement, spam score, email analysis, mailbox placement, sender reputation, email authentication",
  authors: [{ name: "SPAMRUN Team" }],
  creator: "SPAMRUN",
  publisher: "SPAMRUN",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spamrun.com",
    title: "SPAMRUN - Beat the Spam Filter. Reach the Inbox.",
    description: "AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it.",
    siteName: "SPAMRUN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPAMRUN - Beat the Spam Filter",
    description: "AI-powered email analysis for better deliverability",
    creator: "@spamrun",
  },
  verification: {
    google: 'your-google-verification-code', // Add when you set up Search Console
  },
  alternates: {
    canonical: 'https://spamrun.com',
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

