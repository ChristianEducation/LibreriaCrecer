import type { Metadata } from "next";
import { DM_Sans, EB_Garamond, Geist_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Crecer Libreria Cristiana",
  description: "Tienda online de Crecer Libreria Cristiana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${ebGaramond.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
