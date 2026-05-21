import type { Metadata } from "next";
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
    default: "Swapnopuri Properties and Developments",
    template: "%s | Swapnopuri Properties and Developments",
  },

  description:
    "Swapnopuri Properties and Developments is a trusted real estate and property development company in Bangladesh, providing modern, luxurious, and affordable living solutions.",

  keywords: [
    "Swapnopuri Properties",
    "Real Estate Bangladesh",
    "Property Development",
    "Apartment in Comilla",
    "Land Development",
    "Luxury Apartment",
    "Bangladesh Real Estate",
    "Property Company",
    "Flat Sale in Comilla",
    "Real Estate Company",
  ],

  authors: [
    {
      name: "Swapnopuri Properties and Developments",
    },
  ],

  creator: "Swapnopuri Properties and Developments",

  publisher: "Swapnopuri Properties and Developments",

  applicationName: "Swapnopuri Properties and Developments",

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
    google: "rfDH2tHBngOGu1Hqsy2NrphAp82RMTcFgnQaGPYVRB4",
  },

  alternates: {
    canonical:
      "https://shwapnopuripropertiesanddevelopments.com",
  },

  openGraph: {
    title: "Swapnopuri Properties and Developments",
    description:
      "Trusted real estate and property development company in Bangladesh.",

    url: "https://shwapnopuripropertiesanddevelopments.com",

    siteName: "Swapnopuri Properties and Developments",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Swapnopuri Properties and Developments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Swapnopuri Properties and Developments",
    description:
      "Trusted real estate and property development company in Bangladesh.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}