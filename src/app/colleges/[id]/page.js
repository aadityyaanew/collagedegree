import mongoose from "mongoose";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import CollegeDetailClient from "./CollegeDetailClient";
import { getCollegeSchema, getBreadcrumbSchema } from "@/lib/schema";
import { formatPackage } from "@/lib/formatters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

const normalizeCollege = (c) => {
  if (!c) return null;
  const loc =
    typeof c.location === "string"
      ? {
          city: c.location.split(",")[0]?.trim() || "Online",
          state: c.location.split(",")[1]?.trim() || "India",
        }
      : c.location?.city
      ? c.location
      : { city: "Online", state: "India" };

  return {
    ...c,
    _id: c._id ? c._id.toString() : undefined,
    id: c.id || (c._id ? c._id.toString() : ""),
    name: c.name,
    shortName: c.shortName || c.name,
    location: loc,
    type: c.type || "Private",
    established: c.established,
    nirfRanking: c.nirfRanking,
    naacGrade: c.naacGrade || "A",
    logo: c.logo || c.image || "",
    campus: c.campus || "/campus-placeholder.jpg",
    fees:
      c.fees && typeof c.fees === "object" && Object.keys(c.fees).length > 0
        ? typeof c.fees.toJSON === "function"
          ? c.fees.toJSON()
          : c.fees instanceof Map
          ? Object.fromEntries(c.fees)
          : c.fees
        : {},
    coursesOffered:
      Array.isArray(c.coursesOffered) && c.coursesOffered.length > 0
        ? c.coursesOffered
        : Array.isArray(c.courses) && c.courses.length > 0
        ? c.courses
        : [],
    avgPackage:
      typeof c.avgPackage === "number" && c.avgPackage > 0
        ? c.avgPackage
        : parseFloat(c.avgPackage || c.placements?.average || 0) || 0,
    highestPackage:
      typeof c.highestPackage === "number" && c.highestPackage > 0
        ? c.highestPackage
        : parseFloat(c.highestPackage || c.placements?.highest || 0) || 0,
    about: c.about || "",
    topRecruiters:
      Array.isArray(c.topRecruiters) && c.topRecruiters.length > 0
        ? c.topRecruiters
        : [],
  };
};

async function getCollegeData(id) {
  if (!id) return null;
  try {
    await dbConnect();
    const queries = [{ id: id }, { id: id.toLowerCase() }];
    if (mongoose.Types.ObjectId.isValid(id)) {
      queries.push({ _id: id });
    }
    const rawCollege = await College.findOne({ $or: queries }).lean();
    return normalizeCollege(rawCollege);
  } catch (err) {
    console.error("Error fetching college for SEO / page:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const college = await getCollegeData(id);

  if (!college) {
    return {
      title: "College Not Found",
      description: "The requested college profile could not be found.",
    };
  }

  const cityName = college.location?.city || "India";
  const title = `${college.name} (${college.shortName}) — Fees, Cutoffs, Placements & Ranking 2025`;
  const description = `${college.name} in ${cityName}: Check NIRF Rank #${college.nirfRanking || "Top Tier"}, NAAC Grade ${college.naacGrade || "A"}, avg package ${formatPackage(college.avgPackage)}, total fees, courses offered & admission cutoffs.`;
  const canonicalUrl = `/colleges/${college.id || id}`;
  const ogImage = college.campus?.startsWith("http")
    ? college.campus
    : `${SITE_URL}${college.campus || "/campus-placeholder.jpg"}`;

  return {
    title,
    description,
    keywords: [
      college.name,
      college.shortName,
      `${college.shortName} fees`,
      `${college.shortName} placements`,
      `${college.shortName} NIRF ranking`,
      `${college.shortName} cutoffs`,
      `colleges in ${cityName}`,
      `${college.type} universities in India`,
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
          alt: `${college.name} Campus`,
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

export default async function CollegeDetailPage({ params }) {
  const { id } = await params;
  const college = await getCollegeData(id);

  if (!college) {
    notFound();
  }

  const collegeSchema = getCollegeSchema(college);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Colleges", url: "/colleges" },
    { name: college.shortName || college.name, url: `/colleges/${college.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CollegeDetailClient initialCollege={college} />
    </>
  );
}
