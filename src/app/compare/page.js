import CompareClient from "./CompareClient";
import { getBreadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Compare Colleges & Universities Side by Side — Fees, NIRF & Placements",
  description:
    "Compare up to 3 Indian colleges and universities side by side. Compare tuition fees, average and highest packages, NIRF rankings, NAAC grades, cutoff marks, campus facilities, and recruiters.",
  keywords: [
    "compare colleges India",
    "side by side college comparison",
    "compare college fees",
    "compare NIRF ranking",
    "college placement comparison",
    "IIT vs NIT",
    "engineering college comparison",
  ],
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Compare Colleges Side by Side — Fees, Placements & Rankings",
    description:
      "Select and compare colleges across fees, placements, rankings, cutoffs, and approvals with real-time comparison tables.",
    url: `${SITE_URL}/compare`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Compare Colleges Side by Side",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Colleges Side by Side — Compare Degree",
    description:
      "Interactive college comparison tool for fees, placements, and NIRF rankings.",
    images: ["/heroimg.jpeg"],
  },
};

export default function ComparePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Compare Colleges", url: "/compare" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CompareClient />
    </>
  );
}
