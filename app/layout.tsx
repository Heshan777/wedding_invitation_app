import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Alex_Brush, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const alex = Alex_Brush({
  subsets: ["latin"],
  variable: "--font-alex",
  display: "swap",
  weight: ["400"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#580b1e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-invitation-app-silk.vercel.app"),
  title: "Royal Wedding & Homecoming Invitation | Sandharu & Sanduni",
  description: "Join us with joy and love as we celebrate the sacred union and homecoming of Sandharu & Sanduni.",
  keywords: ["Wedding Invitation", "Homecoming", "Sandharu & Sanduni", "Sri Lanka Wedding", "Royal Invitation"],
  openGraph: {
    title: "Sandharu & Sanduni's Wedding & Homecoming Invitation",
    description: "You are cordially invited to celebrate the homecoming of Sandharu & Sanduni.",
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
    title: "Sandharu & Sanduni's Wedding & Homecoming Invitation",
    description: "You are cordially invited to celebrate the homecoming of Sandharu & Sanduni.",
    images: ["/images/couple-share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${cinzel.variable} ${playfair.variable} ${alex.variable} ${plusJakarta.variable} min-h-full flex flex-col bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be]`}>
        {children}
      </body>
    </html>
  );
}


