"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Tag,
  BookOpen,
  ArrowRight,
  UserCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function BlogDetailClient({ blog, relatedBlogs = [] }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
      // Increment view count
      fetch(`/api/blogs/${blog.slug}/view`, { method: "POST" }).catch(() => {});
    }
  }, [blog.slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(`${blog.title} — Compare Degree Guide`);
  const encodedUrl = encodeURIComponent(pageUrl);

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(blog.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Breadcrumbs & Header Bar */}
        <section className="bg-slate-50/70 border-b border-slate-100 py-4">
          <div className="container-main max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <nav className="flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-crimson transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <Link href="/blog" className="hover:text-crimson transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-crimson font-semibold truncate max-w-[200px] sm:max-w-xs">
                {blog.category}
              </span>
            </nav>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-navy font-semibold text-xs transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <article className="container-main max-w-3xl mx-auto pt-6 sm:pt-10">
          <div className="space-y-4 sm:space-y-5">
            {/* Category & Read Time */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-crimson/10 text-crimson border border-crimson/20">
                {blog.category}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="h-3 w-3 text-slate-400" />
                {blog.readTime || "4 min read"}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Calendar className="h-3 w-3 text-slate-400" />
                {formattedDate}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy tracking-tight leading-[1.2]">
              {blog.title}
            </h1>

            {/* Excerpt / Lead */}
            {blog.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {blog.excerpt}
              </p>
            )}

            {/* Author Bar & Social Share */}
            <div className="pt-4 pb-4 border-y border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-crimson to-crimson-dark text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-crimson/20">
                  {blog.author?.name ? blog.author.name.charAt(0) : "C"}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-navy">
                    {blog.author?.name || "Compare Degree Editorial Team"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500">
                    {blog.author?.role || "Higher Education Analyst"}
                  </div>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">
                  Share Guide:
                </span>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                  title="Share on WhatsApp"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.129-.533-1.638-.679-2.731-2.348-2.813-2.457-.082-.109-.66-8.775-.66-1.673 0-.898.472-1.341.64-1.52.168-.179.369-.224.492-.224.123 0 .247.001.354.006.113.006.265-.043.415.318.15.361.513 1.25.558 1.341.045.09.076.195.015.316-.06.12-.091.196-.181.301-.09.106-.19.236-.271.317-.091.091-.186.19-.08.372.106.182.471.776 1.01 1.256.696.619 1.282.811 1.464.901.181.09.288.075.394-.045.106-.12.454-.528.575-.709.121-.181.242-.151.408-.09.166.06 1.056.498 1.237.588.181.09.302.135.347.211.045.075.045.436-.099.841z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 w-7 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                  title="Share on LinkedIn"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 0 0-1.66 1.64c0 .9.74 1.63 1.66 1.63.92 0 1.65-.73 1.65-1.63 0-.9-.73-1.64-1.65-1.64" />
                  </svg>
                </a>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                  title="Copy Link to Clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Hero Image */}
            {blog.featuredImage && (
              <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80 aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Plain Text Content Body */}
            <div className="pt-4 text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {blog.content}
            </div>

            {/* Tags Cloud */}
            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="pt-8 pb-4 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                    <Tag className="h-3.5 w-3.5" />
                    Related Topics:
                  </span>
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-crimson hover:text-white text-slate-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Editorial Card */}
            <div className="p-6 sm:p-8 bg-slate-50/80 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-navy text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {blog.author?.name ? blog.author.name.charAt(0) : "C"}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crimson block mb-0.5">
                    Written by Editorial Board
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-navy">
                    {blog.author?.name || "Compare Degree Editorial Team"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mt-0.5">
                    {blog.author?.role || "Higher Education Analyst"} &bull; Focused on data integrity, NIRF statistics, and genuine student decision guidance.
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border-slate-200"
              >
                <Link href="/about">About Our Mission</Link>
              </Button>
            </div>

            {/* Bottom High-Impact Lead / Counselling Box */}
            <div className="bg-gradient-to-r from-crimson to-crimson-dark rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-xl space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <UserCheck className="h-3.5 w-3.5" />
                  Free Expert Guidance
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  Need Help Choosing Between Colleges?
                </h3>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                  Our certified higher education counselors analyze your academic scores, budget, and career goals to find the best-matched university.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    asChild
                    className="bg-white hover:bg-slate-100 text-crimson font-bold px-5 py-2 text-xs sm:text-sm rounded-xl shadow-md"
                  >
                    <Link href="/course-finder">Try Course Advisor</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-transparent hover:bg-white/10 border-white/40 text-white font-bold px-5 py-2 text-xs sm:text-sm rounded-xl"
                  >
                    <Link href="/compare">Compare Colleges Side by Side</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedBlogs.length > 0 && (
              <section className="pt-12 border-t border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-navy">
                      More Recommended Guides
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Continue exploring higher education insights from our analysts.
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-bold text-crimson hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((rel) => (
                    <article
                      key={rel._id || rel.slug}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all group"
                    >
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
                      >
                        <img
                          src={rel.featuredImage || "/heroimg.jpeg"}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[11px] font-bold text-crimson block mb-1">
                            {rel.category}
                          </span>
                          <Link href={`/blog/${rel.slug}`}>
                            <h4 className="font-bold text-navy text-sm group-hover:text-crimson transition-colors line-clamp-2 leading-snug">
                              {rel.title}
                            </h4>
                          </Link>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{rel.readTime || "4 min read"}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
