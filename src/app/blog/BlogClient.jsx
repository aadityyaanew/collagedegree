"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 9;

export default function BlogClient({ initialBlogs = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    initialBlogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialBlogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === "All" ||
        b.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTag =
        !selectedTag ||
        (Array.isArray(b.tags) && b.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase()));

      return matchesSearch && matchesCat && matchesTag;
    });
  }, [initialBlogs, searchTerm, selectedCategory, selectedTag]);

  // Reset to page 1 whenever filters change
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  // Spotlight post (first item if on page 1 and no search query)
  const isDefaultView = !searchTerm && selectedCategory === "All" && !selectedTag && currentPage === 1;
  const spotlightBlog = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const standardBlogs = isDefaultView ? paginatedBlogs.slice(1) : paginatedBlogs;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-slate-50 to-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
          
          <div className="container-main relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-crimson/10 border border-crimson/20 text-crimson text-xs font-bold uppercase tracking-wider">
              <span>Education Guides & Insights</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
              Compare Degree <span className="text-crimson">Knowledge Hub</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              In-depth college comparisons, entrance exam strategies, placement statistics, and actionable advice to help you choose the right degree with confidence.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-crimson/20 focus-within:border-crimson/40 transition-all">
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search colleges, degrees, cutoff comparisons, or topics..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-navy placeholder:text-slate-400 font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container-main py-10 sm:py-14 space-y-10">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-navy text-white shadow-md shadow-navy/20"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-navy">{filteredBlogs.length}</span> articles
            </div>
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Filtered by tag:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-crimson/10 text-crimson font-bold">
                #{selectedTag}
                <button
                  onClick={() => setSelectedTag(null)}
                  className="hover:text-crimson-dark cursor-pointer ml-1"
                >
                  &times;
                </button>
              </span>
            </div>
          )}

          {/* Featured Spotlight Article (Only on page 1 initial load) */}
          {spotlightBlog && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden hover:border-crimson/30 hover:shadow-[0_15px_40px_rgba(225,29,72,0.08)] transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[320px] overflow-hidden bg-slate-100">
                  <img
                    src={spotlightBlog.featuredImage || "/heroimg.jpeg"}
                    alt={spotlightBlog.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-crimson text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    Featured Spotlight
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-bold text-crimson uppercase tracking-wider text-[11px]">
                        {spotlightBlog.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {spotlightBlog.readTime || "5 min read"}
                      </span>
                    </div>

                    <Link href={`/blog/${spotlightBlog.slug}`}>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy group-hover:text-crimson transition-colors leading-tight">
                        {spotlightBlog.title}
                      </h2>
                    </Link>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {spotlightBlog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-bold text-xs">
                        {spotlightBlog.author?.name ? spotlightBlog.author.name.charAt(0) : "C"}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-navy block">
                          {spotlightBlog.author?.name || "Compare Degree Team"}
                        </span>
                        <span className="text-slate-400">
                          {spotlightBlog.author?.role || "Education Analyst"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${spotlightBlog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-crimson group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standard Blog Cards Grid */}
          {standardBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {standardBlogs.map((blog) => (
                <article
                  key={blog._id || blog.slug}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
                  >
                    <img
                      src={blog.featuredImage || "/heroimg.jpeg"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-navy text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-200/60">
                      {blog.category}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : new Date(blog.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.readTime || "4 min read"}
                        </span>
                      </div>

                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="font-bold text-navy text-base sm:text-lg group-hover:text-crimson transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>
                      </Link>

                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Footer / Read Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {blog.author?.name ? blog.author.name.charAt(0) : "C"}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                          {blog.author?.name || "Compare Degree"}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-crimson group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-xl mx-auto space-y-3">
              <div className="h-12 w-12 bg-rose-50 text-crimson rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-navy">No articles found</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                We couldn&apos;t find any articles matching your search criteria. Try selecting &quot;All&quot; categories or clearing the search bar.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTag(null);
                  setSearchTerm("");
                }}
                className="mt-2 bg-crimson hover:bg-crimson-dark text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-crimson text-white shadow-md shadow-crimson/20"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Interactive Counselling / Comparison CTA Banner */}
          <div className="bg-gradient-to-br from-navy via-[#111c42] to-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-rose-200">
                <UserCheck className="h-3.5 w-3.5" />
                <span>100% Free Higher Education Counselling</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Confused Between Two or More Colleges?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Compare fees, placements, NIRF rankings, and cutoffs side by side, or talk to an experienced education advisor today.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  className="bg-crimson hover:bg-crimson-dark text-white font-bold px-6 py-2.5 text-xs sm:text-sm rounded-xl shadow-lg shadow-crimson/30"
                >
                  <Link href="/compare">Compare Colleges Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold px-6 py-2.5 text-xs sm:text-sm rounded-xl"
                >
                  <Link href="/course-finder">Use Course Advisor</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
