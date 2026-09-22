import { Suspense } from "react";
import { Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import NavigationProgressBar from "@/components/layout/NavigationProgressBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import LeadPopupModal from "@/components/shared/LeadPopupModal";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata = {
  title: "Compare Degree — Smart Decisions, Brighter Futures",
  description:
    "Compare colleges, courses, fees, placements, rankings, and reviews side by side. India's most comprehensive higher education comparison platform.",
  keywords: [
    "college comparison",
    "compare colleges India",
    "engineering college ranking",
    "placement data",
    "college fees comparison",
    "NIRF ranking",
    "IIT",
    "NIT",
    "BITS",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Compare Degree",
  },
  formatDetection: {
    telephone: true,
  },
};

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
        <LeadPopupModal />
        <MobileBottomNav />
      </body>
    </html>
  );
}
