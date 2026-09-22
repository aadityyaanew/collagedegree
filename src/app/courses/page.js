import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import CoursesClient from "./CoursesClient";
import { getItemListSchema, getBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Explore Top Degree Courses in India — UG, PG & Professional Degrees",
  description:
    "Discover 100+ undergraduate and postgraduate degree courses across Engineering, Management, Computer Applications, Science, and Arts. Compare course durations, average fees, eligibility, and top career pathways.",
  keywords: [
    "degree courses India",
    "UG courses list",
    "PG courses list",
    "B.Tech courses",
    "MBA specializations",
    "BCA MCA degree",
    "course eligibility and fees",
    "top career degrees",
  ],
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "Explore Degree Courses in India — UG & PG Programs",
    description:
      "Compare 100+ degrees across engineering, business, and tech. Review syllabus, eligibility criteria, fees, and career options.",
    url: `${SITE_URL}/courses`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/courses/course-cse.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Degree Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Degree Courses in India — Compare Degree",
    description:
      "Find top undergraduate and postgraduate degree courses with fees and career options.",
    images: ["/courses/course-cse.jpg"],
  },
};

export default async function CoursesPage() {
  let initialCourses = [];
  try {
    await dbConnect();
    const dbCourses = await Course.find({}).lean();
    if (dbCourses && dbCourses.length > 0) {
      initialCourses = dbCourses.map((c) => ({
        ...c,
        _id: c._id.toString(),
        id: c.slug,
      }));
    }
  } catch (err) {
    console.error("Error loading courses in Server Component:", err);
  }

  const itemListSchema = getItemListSchema(
    "Top Degree Courses in India",
    initialCourses.slice(0, 20).map((c) => ({
      name: c.name,
      url: `/courses/${c.slug || c.id}`,
    }))
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
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
      <CoursesClient initialCourses={initialCourses} />
    </>
  );
}
