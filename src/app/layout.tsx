import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, Poppins } from "next/font/google";

import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://shwapnopuripropertiesanddevelopments.com"
  ),

  title: {
    default: "Shwapnopuri Properties & Developments",
    template: "%s | Shwapnopuri Properties & Developments",
  },

  description:
    "Shwapnopuri Properties & Developments is a trusted real estate and property development company in Bangladesh offering luxurious apartments, flats, land development, and modern living solutions.",

  keywords: [
    "Shwapnopuri Properties",
    "Shwapnopuri Developments",
    "Real Estate Bangladesh",
    "Property Development Company",
    "Apartment in Bangladesh",
    "Apartment in Comilla",
    "Flat Sale in Comilla",
    "Luxury Apartment",
    "Land Development",
    "Bangladesh Real Estate",
    "Property Company Bangladesh",
    "Real Estate Company",
    "Modern Apartments",
    "Comilla Flat",
    "Bangladesh Property",
    "Property Developer",
  ],

  authors: [
    {
      name: "Shwapnopuri Properties & Developments",
      url: "https://shwapnopuripropertiesanddevelopments.com",
    },
  ],

  creator: "Shwapnopuri Properties & Developments",

  publisher: "Shwapnopuri Properties & Developments",

  applicationName: "Shwapnopuri Properties & Developments",

  category: "Real Estate",

  robots: {
    index: true,
    follow: true,
    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "NLGkHX1fO8XSAqCrhx4sjWsQJVE8iYBzUlVIFroEuvk",
  },

  alternates: {
    canonical:
      "https://shwapnopuripropertiesanddevelopments.com",
  },

  openGraph: {
    title: "Shwapnopuri Properties & Developments",

    description:
      "Trusted real estate and property development company in Bangladesh.",

    url: "https://shwapnopuripropertiesanddevelopments.com",

    siteName: "Shwapnopuri Properties & Developments",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "https://shwapnopuripropertiesanddevelopments.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shwapnopuri Properties & Developments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Shwapnopuri Properties & Developments",

    description:
      "Trusted real estate and property development company in Bangladesh.",

    images: [
      "https://shwapnopuripropertiesanddevelopments.com/og-image.jpg",
    ],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="NLGkHX1fO8XSAqCrhx4sjWsQJVE8iYBzUlVIFroEuvk"
        />
      </head>

      <body
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "RealEstateAgent",

              name: "Shwapnopuri Properties & Developments",

              url: "https://shwapnopuripropertiesanddevelopments.com",

              logo:
                "https://shwapnopuripropertiesanddevelopments.com/og-image.jpg",

              image:
                "https://shwapnopuripropertiesanddevelopments.com/og-image.jpg",

              description:
                "Trusted real estate and property development company in Bangladesh.",

              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
              },

              sameAs: [
                "https://facebook.com/",
                "https://instagram.com/",
              ],
            }),
          }}
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}