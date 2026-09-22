import CourseFinderClient from "./CourseFinderClient";
import { getBreadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "AI Course & College Finder — Personalized Degree Recommendations",
  description:
    "Find the best degree courses and top colleges tailored to your academic background, career interests, and budget with our AI-powered course finder wizard.",
  keywords: [
    "course finder India",
    "college predictor",
    "degree recommendations",
    "which course to choose after 12th",
    "which degree after graduation",
    "career counseling India",
    "college finder tool",
  ],
  alternates: {
    canonical: "/course-finder",
  },
  openGraph: {
    title: "AI Course & College Finder — Find Your Perfect Degree",
    description:
      "Answer 6 quick questions to discover your best-fit degree courses and verified college options based on real data.",
    url: `${SITE_URL}/course-finder`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Course & College Finder Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Course & College Finder — Compare Degree",
    description:
      "Get personalized degree and university recommendations in under 2 minutes.",
    images: ["/heroimg.jpeg"],
  },
};

export default function CourseFinderPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Course Finder", url: "/course-finder" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CourseFinderClient />
    </>
  );
}
