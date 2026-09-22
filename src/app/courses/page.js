"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/shared/CourseCard";

const categories = [
  { value: "all", label: "All Courses" },
  { value: "UG", label: "Undergraduate" },
  { value: "PG", label: "Postgraduate" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // Provide default IDs for routing if missing, maps to slug
          setCourses(data.map(c => ({ ...c, id: c.slug })));
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    let result = [...courses];
    if (level !== "all") {
      result = result.filter((c) => c.level === level);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.shortName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [query, level, courses]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-slate-50 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-crimson animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="container-main py-6">
            <h1 className="heading-2 mb-1">Explore Courses</h1>
            <p className="text-body-sm">
              Discover {courses.length}+ courses across engineering, management,
              science, and more.
            </p>
          </div>
        </div>

        <div className="container-main py-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all"
              />
            </div>
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setLevel(cat.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    level === cat.value
                      ? "bg-crimson text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <p className="text-xs text-slate-500 mb-4">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy mb-1">
                No courses found
              </p>
              <p className="text-xs text-slate-500">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
