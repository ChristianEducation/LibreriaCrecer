import type { Metadata } from "next";
import { Castoro, DM_Sans, EB_Garamond, Geist_Mono, Inter } from "next/font/google";

import { ToastViewport } from "@/shared/ui";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const castoro = Castoro({
  variable: "--font-castoro",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl",
  ),
  title: {
    default: "Crecer Librería Cristiana — Antofagasta",
    template: "%s | Crecer Librería Cristiana",
  },
  description:
    "Librería cristiana en Antofagasta, Chile. Libros católicos, recursos espirituales y selección curada para el camino de fe. Compra online con despacho a todo Chile.",
  keywords: [
    "librería cristiana",
    "libros católicos",
    "Antofagasta",
    "libros religiosos Chile",
    "librería católica",
    "recursos espirituales",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Crecer Librería Cristiana",
    images: [
      {
        url: "/images/Logo-Crecer.png",
        alt: "Crecer Librería Cristiana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://crecerlibreria.cl";

  return (
    <html lang="es-CL">
      <body
        className={`${dmSans.variable} ${ebGaramond.variable} ${geistMono.variable} ${inter.variable} ${castoro.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  url: baseUrl,
                  name: "Crecer Librería Cristiana",
                  description:
                    "Librería cristiana en Antofagasta, Chile. Libros católicos y recursos espirituales.",
                  inLanguage: "es-CL",
                },
                {
                  "@type": "BookStore",
                  "@id": `${baseUrl}/#local`,
                  name: "Crecer Librería Cristiana",
                  url: baseUrl,
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Arturo Prat 470",
                    addressLocality: "Antofagasta",
                    addressRegion: "Antofagasta",
                    addressCountry: "CL",
                  },
                  openingHours: "Mo-Sa 09:00-19:00",
                  priceRange: "$$",
                  currenciesAccepted: "CLP",
                  paymentAccepted: "Credit Card, Debit Card",
                },
              ],
            }),
          }}
          type="application/ld+json"
        />
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
