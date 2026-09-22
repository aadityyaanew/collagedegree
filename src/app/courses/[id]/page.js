import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import College from "@/models/College";
import CourseDetailClient from "./CourseDetailClient";
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

async function getCourseData(slug) {
  if (!slug) return null;
  try {
    await dbConnect();
    const course = await Course.findOne({
      $or: [{ slug: slug }, { slug: slug.toLowerCase() }],
    }).lean();

    if (!course) return null;

    // Fetch all colleges to match top colleges
    const colleges = await College.find({}).lean();
    const formattedColleges = colleges.map((c) => ({
      ...c,
      _id: c._id.toString(),
      id: c.id || c._id.toString(),
    }));

    return {
      course: {
        ...course,
        _id: course._id.toString(),
        id: course.slug,
      },
      colleges: formattedColleges,
    };
  } catch (error) {
    console.error("Error fetching course for SEO / page:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getCourseData(id);

  if (!data || !data.course) {
    return {
      title: "Course Not Found",
      description: "The requested degree course details could not be found.",
    };
  }

  const { course } = data;
  const title = `${course.name} (${course.shortName || course.name}) — Duration, Fees, Eligibility & Top Colleges`;
  const exams = course.eligibilityExams?.length
    ? `Exams: ${course.eligibilityExams.slice(0, 3).join(", ")}. `
    : "";
  const fees = course.avgFees
    ? `Avg fees ${(course.avgFees / 100000).toFixed(1)} Lakhs. `
    : "";
  const description = `${course.name} (${course.level} Degree): ${exams}${fees}Explore syllabus, top career pathways, and leading colleges offering ${course.shortName} in India.`;
  const canonicalUrl = `/courses/${course.slug || id}`;
  const ogImage = course.image?.startsWith("http")
    ? course.image
    : `${SITE_URL}${course.image || "/courses/course-cse.jpg"}`;

  return {
    title,
    description,
    keywords: [
      course.name,
      course.shortName,
      `${course.name} eligibility`,
      `${course.name} fees in India`,
      `${course.name} top colleges`,
      `${course.name} syllabus`,
      `${course.level} courses in India`,
      ...(course.careers || []),
      ...(course.eligibilityExams || []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalUrl}`,
      siteName: "Compare Degree",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${course.name} Degree Details`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { id } = await params;
  const data = await getCourseData(id);

  if (!data || !data.course) {
    notFound();
  }

  const { course, colleges } = data;
  const courseSchema = getCourseSchema(course);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: course.shortName || course.name, url: `/courses/${course.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CourseDetailClient initialCourse={course} initialColleges={colleges} />
    </>
  );
}
