import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be]">
        {children}
      </body>
    </html>
  );
}


