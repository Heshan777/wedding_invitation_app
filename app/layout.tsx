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
  title: "You're Invited — Sandharu & Sanduni's Homecoming",
  description: "Join us as we celebrate the wonderful union of Sandharu & Sanduni.",
  openGraph: {
    title: "You're Invited — Sandharu & Sanduni's Homecoming",
    description: "Join us as we celebrate the wonderful union of Sandharu & Sanduni.",
    images: [
      {
        url: "/images/couple-share.png",
        width: 1200,
        height: 630,
        alt: "Sandharu & Sanduni's Homecoming Invitation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "You're Invited — Sandharu & Sanduni's Homecoming",
    description: "Join us as we celebrate the wonderful union of Sandharu & Sanduni.",
    images: ["/images/couple-share.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
