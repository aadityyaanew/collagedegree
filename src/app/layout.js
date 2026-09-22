import { Suspense } from "react";
import { Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import NavigationProgressBar from "@/components/layout/NavigationProgressBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import LeadPopupModal from "@/components/shared/LeadPopupModal";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
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
  themeColor: "#9E0927",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Compare Degree — Smart Decisions, Brighter Futures",
    template: "%s | Compare Degree",
  },
  description:
    "Compare colleges, courses, fees, placements, rankings, and reviews side by side. India's most comprehensive higher education comparison platform.",
  keywords: [
    "college comparison",
    "compare colleges India",
    "online degree comparison",
    "engineering college ranking",
    "MBA colleges ranking",
    "placement data",
    "college fees comparison",
    "NIRF ranking",
    "NAAC accredited colleges",
    "IIT",
    "NIT",
    "BITS",
    "admission counselling India",
  ],
  authors: [{ name: "Compare Degree", url: SITE_URL }],
  creator: "Compare Degree",
  publisher: "Compare Degree",
  category: "Education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Compare Degree — Smart Decisions, Brighter Futures",
    description:
      "Compare colleges, courses, fees, placements, rankings, and reviews side by side. India's most comprehensive higher education comparison platform.",
    url: SITE_URL,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Compare Degree — College & Course Comparison Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Degree — Smart Decisions, Brighter Futures",
    description:
      "Compare colleges, courses, fees, placements, rankings, and reviews side by side. India's premier higher education comparison portal.",
    images: ["/heroimg.jpeg"],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
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
