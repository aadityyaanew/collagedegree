import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogClient from "./BlogClient";
import { getItemListSchema, getBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Higher Education Blog, College Guides & Degree Comparison Insights",
  description:
    "Read the latest college comparisons, degree evaluations, admission cutoffs, and career guidance written by education analysts at Compare Degree.",
  keywords: [
    "college comparison blog",
    "engineering college reviews",
    "MBA specializations India",
    "B.Tech admission guidance",
    "placement packages analysis",
    "NIRF ranking analysis",
    "higher education guide",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Compare Degree Blog — Smart Decisions, Brighter Futures",
    description:
      "In-depth college comparisons, entrance exam strategies, placement trends, and admission cutoffs in India.",
    url: `${SITE_URL}/blog`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Compare Degree Blog & Educational Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Higher Education Blog & Degree Comparison Guides",
    description:
      "Expert college comparisons, career scope, and admission insights from Compare Degree.",
    images: ["/heroimg.jpeg"],
  },
};

export default async function BlogPage() {
  let initialBlogs = [];

  try {
    await dbConnect();

    const dbBlogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    if (dbBlogs && dbBlogs.length > 0) {
      initialBlogs = dbBlogs.map((b) => ({
        ...b,
        _id: b._id.toString(),
        publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
        createdAt: b.createdAt ? b.createdAt.toISOString() : null,
        updatedAt: b.updatedAt ? b.updatedAt.toISOString() : null,
      }));
    }
  } catch (err) {
    console.error("Error loading blogs in Server Component:", err);
  }

  const itemListSchema = getItemListSchema(
    "Compare Degree Educational Guides & Articles",
    initialBlogs.slice(0, 15).map((b) => ({
      name: b.title,
      url: `/blog/${b.slug}`,
    }))
  );

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
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
      <BlogClient initialBlogs={initialBlogs} />
    </>
  );
}
