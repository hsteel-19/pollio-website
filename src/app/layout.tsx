import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pollio - Interaktiva presentationer",
  description: "Skapa interaktiva omröstningar och frågor som din publik svarar på direkt från mobilen. Se resultaten uppdateras live.",
  keywords: ["live omröstningar", "interaktiva presentationer", "publikengagemang", "frågor och svar", "workshops", "möten", "Mentimeter alternativ"],
  authors: [{ name: "Pollio" }],
  creator: "Pollio",
  metadataBase: new URL("https://pollio.se"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://pollio.se",
    siteName: "Pollio",
    title: "Pollio - Interaktiva presentationer",
    description: "Skapa interaktiva omröstningar och frågor som din publik svarar på direkt från mobilen. Se resultaten uppdateras live.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pollio - Interaktiva presentationer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pollio - Interaktiva presentationer",
    description: "Skapa interaktiva omröstningar och frågor som din publik svarar på direkt från mobilen. Se resultaten uppdateras live.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
