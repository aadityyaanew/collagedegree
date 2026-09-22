"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/shared/SectionWrapper";
import CourseCard from "@/components/shared/CourseCard";

const CATEGORIES = [
  { id: "all", label: "All Programs" },
  { id: "mgmt", label: "Management & Business", filter: (c) => c.shortName?.includes("MBA") || c.shortName?.includes("BBA") },
  { id: "cse", label: "AI & Computer Science", filter: (c) => c.name?.toLowerCase().includes("computer") || c.name?.toLowerCase().includes("data") },
  { id: "pg", label: "Postgraduate", filter: (c) => c.level === "PG" },
];

export default function ExploreCoursesSection({ courseList = [] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCourses = courseList.filter((course) => {
    if (activeCategory === "all") return true;
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat?.filter ? cat.filter(course) : true;
  });

  return (
    <SectionWrapper className="section-padding bg-white relative">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Program Catalog</span>
            </div>
            <h2 className="heading-2 mb-2">Explore Popular Degrees & Programs</h2>
            <p className="text-body max-w-xl">
              Compare curriculums, durations, expected starting salaries, and top recruiting institutions across India.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto border-slate-200 hover:border-slate-300 text-slate-700 hover:text-navy bg-white shadow-xs font-semibold text-sm rounded-xl px-4 h-10"
          >
            <Link href="/courses">
              View All Courses
              <ChevronRight className="ml-1.5 h-4 w-4 text-slate-400" />
            </Link>
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${activeCategory === cat.id
                  ? "bg-navy text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredCourses.slice(0, 8).map((course) => (
            <div
              key={course.id}
              className="transform-gpu transition-all duration-200"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
