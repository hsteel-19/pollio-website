import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pollio - Turn your presentation into a conversation",
  description: "Interactive live polls and questions for meetings, workshops, and events. Engage your audience in real time.",
  keywords: ["live polls", "interactive presentations", "audience engagement", "Q&A", "workshops", "meetings", "Mentimeter alternative"],
  authors: [{ name: "Pollio" }],
  creator: "Pollio",
  metadataBase: new URL("https://pollio.se"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pollio.se",
    siteName: "Pollio",
    title: "Pollio - Turn your presentation into a conversation",
    description: "Interactive live polls and questions for meetings, workshops, and events. Engage your audience in real time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pollio - Interactive live presentations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pollio - Turn your presentation into a conversation",
    description: "Interactive live polls and questions for meetings, workshops, and events. Engage your audience in real time.",
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
