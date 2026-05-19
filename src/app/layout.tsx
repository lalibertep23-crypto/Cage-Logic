import type { Metadata } from "next";
import { Anton, Barlow_Condensed, DM_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

// Display / stamped numbers — score, stats
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Panel labels, section headers, CTAs — aggressive condensed
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Labels, section headers, nav
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Data readouts, metadata, mono copy
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cage Logic",
  description: "Combat sports training OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${anton.variable} ${bebasNeue.variable} ${barlowCondensed.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
