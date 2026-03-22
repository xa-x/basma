import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "بصمة — Create Your Brand",
  description: "AI-powered branding for the Middle East. Logos, packaging, mockups in minutes.",
  keywords: ["branding", "logo", "AI", "Middle East", "Saudi Arabia", "تصميم", "شعار"],
  authors: [{ name: "Abdullah" }],
  openGraph: {
    title: "بصمة — Create Your Brand",
    description: "AI-powered branding for the Middle East. Logos, packaging, mockups in minutes.",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "بصمة — Create Your Brand",
    description: "AI-powered branding for the Middle East",
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
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
