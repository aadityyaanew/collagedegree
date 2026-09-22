import ScholarshipsClient from "./ScholarshipsClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBreadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Scholarships & Financial Aid for Higher Education — Compare Degree",
  description:
    "Explore merit-based scholarships, financial grants, fee waivers, and funding opportunities for undergraduate and postgraduate university degrees in India.",
  keywords: [
    "scholarships in India",
    "college fee grants",
    "university scholarships",
    "merit scholarship 2025",
    "engineering scholarships",
    "MBA scholarships",
  ],
  alternates: {
    canonical: "/scholarships",
  },
  openGraph: {
    title: "Scholarships & Grants for Degree Programs — Compare Degree",
    description:
      "Find and apply for scholarships to fund your higher education. Compare eligibility criteria and grant amounts.",
    url: `${SITE_URL}/scholarships`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Scholarships and Grants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholarships & Financial Aid — Compare Degree",
    description: "Explore scholarships, fee waivers, and financial grants for students.",
    images: ["/heroimg.jpeg"],
  },
};

export default function ScholarshipsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Scholarships", url: "/scholarships" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <ScholarshipsClient />
      <Footer />
    </>
  );
}
