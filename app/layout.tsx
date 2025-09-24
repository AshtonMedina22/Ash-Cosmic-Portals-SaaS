import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DefaultNavbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cosmic Portals SaaS - NFC-Powered Engagement Platform",
  description: "Transform every scan, tap, and click into measurable insights. NFC-powered engagement for businesses, events, and communities.",
  keywords: ["NFC", "engagement", "analytics", "events", "business cards", "SaaS"],
  authors: [{ name: "Ashton Medina" }],
  openGraph: {
    title: "Cosmic Portals SaaS",
    description: "NFC-powered engagement platform for businesses, events, and communities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <DefaultNavbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
