import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogDetailClient from "./BlogDetailClient";
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug, status: "published" }).lean();

    if (!blog) {
      return {
        title: "Article Not Found | Compare Degree",
        description: "The requested education guide could not be found.",
      };
    }

    const title = blog.seoTitle || `${blog.title} | Compare Degree`;
    const description =
      blog.seoDescription ||
      blog.excerpt ||
      "Read this higher education guide on Compare Degree.";
    const imageUrl = blog.featuredImage?.startsWith("http")
      ? blog.featuredImage
      : `${SITE_URL}${blog.featuredImage || "/heroimg.jpeg"}`;

    return {
      title,
      description,
      keywords: Array.isArray(blog.tags) ? blog.tags : ["college comparison", "education guide"],
      alternates: {
        canonical: `/blog/${blog.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/blog/${blog.slug}`,
        siteName: "Compare Degree",
        locale: "en_IN",
        type: "article",
        publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
        modifiedTime: new Date(blog.updatedAt || blog.createdAt).toISOString(),
        authors: [blog.author?.name || "Compare Degree Editorial Team"],
        tags: blog.tags,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    return {
      title: "Blog Guide | Compare Degree",
    };
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  await dbConnect();

  const blog = await Blog.findOne({ slug, status: "published" }).lean();

  if (!blog) {
    notFound();
  }

  // Fetch 3 related published articles in the same category or overall
  const relatedDb = await Blog.find({
    status: "published",
    slug: { $ne: slug },
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean();

  const serializedBlog = {
    ...blog,
    _id: blog._id.toString(),
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
    createdAt: blog.createdAt ? blog.createdAt.toISOString() : null,
    updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null,
  };

  const serializedRelated = relatedDb.map((r) => ({
    ...r,
    _id: r._id.toString(),
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
  }));

  const blogPostingSchema = getBlogPostingSchema(blog);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: blog.category, url: `/blog?category=${encodeURIComponent(blog.category)}` },
    { name: blog.title, url: `/blog/${blog.slug}` },
  ]);

  return (
    <>
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogDetailClient blog={serializedBlog} relatedBlogs={serializedRelated} />
    </>
  );
}
