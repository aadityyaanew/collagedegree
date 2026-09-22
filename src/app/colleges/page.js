import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import CollegesClient from "./CollegesClient";
import { getItemListSchema, getBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Top Colleges & Universities in India 2025 — Compare NIRF Rankings, Fees & Placements",
  description:
    "Explore and compare accredited colleges & universities across India. Review verified NIRF rankings, NAAC grades, placement statistics, course fees, and admission cutoffs.",
  keywords: [
    "top colleges in India",
    "best engineering colleges",
    "best management colleges",
    "NIRF ranking 2025",
    "NAAC accredited colleges",
    "college fees comparison",
    "highest placement colleges",
    "IITs NITs BITS India",
  ],
  alternates: {
    canonical: "/colleges",
  },
  openGraph: {
    title: "Top Colleges & Universities in India 2025 — Compare Rankings & Fees",
    description:
      "Explore and compare verified colleges & universities across India. Compare NIRF rankings, NAAC grades, placement packages, and total course fees.",
    url: `${SITE_URL}/colleges`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Top Colleges and Universities in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Colleges & Universities in India 2025",
    description:
      "Compare top Indian colleges, NIRF rankings, fees, and placement packages.",
    images: ["/heroimg.jpeg"],
  },
};

export default async function CollegesPage() {
  let initialColleges = [];
  try {
    await dbConnect();
    const dbColleges = await College.find({}).sort({ createdAt: -1 }).lean();
    if (dbColleges && dbColleges.length > 0) {
      initialColleges = dbColleges.map((c) => ({
        ...c,
        _id: c._id.toString(),
        id: c.id || c._id.toString(),
      }));
    }
  } catch (err) {
    console.error("Error loading colleges in Server Component:", err);
  }

  const itemListSchema = getItemListSchema(
    "Top Colleges and Universities in India",
    initialColleges.slice(0, 20).map((c) => ({
      name: c.name,
      url: `/colleges/${c.id}`,
    }))
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Colleges", url: "/colleges" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CollegesClient initialColleges={initialColleges} />
    </>
  );
}
