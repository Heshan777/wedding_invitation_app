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
  title: "WedLink.lk | Digital Wedding Invitations for Sri Lankan Weddings",
  description: "Your wedding invitation, delivered on WhatsApp. Beautiful digital wedding invitation websites with live RSVP, Poruwa schedules, seating, and personalized guest links. From Rs. 5,000.",
  keywords: [
    "WedLink.lk",
    "Digital Wedding Invitation Sri Lanka",
    "invitation.lk",
    "Wedding Invitation WhatsApp",
    "Poruwa Ceremony Invitation",
    "Sri Lanka Wedding Tech",
    "RSVP Wedding Dashboard",
    "Homecoming Invitation",
  ],
  icons: {
    icon: "/images/wedlink-logo.png",
    apple: "/images/wedlink-logo.png",
  },
  openGraph: {
    title: "WedLink.lk | Digital Wedding Invitations for Sri Lankan Weddings",
    description: "Your wedding invitation, delivered on WhatsApp. Personal guest links, live RSVP, countdown and seating. From Rs. 5,000.",
    images: [
      {
        url: "/images/wedlink-logo.png",
        width: 848,
        height: 170,
        alt: "WedLink.lk - Official Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WedLink.lk | Digital Wedding Invitations for Sri Lankan Weddings",
    description: "Your wedding invitation, delivered on WhatsApp. Personal guest links, live RSVP, countdown and seating. From Rs. 5,000.",
    images: ["/images/wedlink-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('royal-wedding-theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${playfair.variable} ${alex.variable} ${plusJakarta.variable} min-h-full flex flex-col bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be]`}
      >
        {children}
      </body>
    </html>
  );
}


