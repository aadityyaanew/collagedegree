"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IndianRupee,
  BookOpen,
  ChevronRight,
  Briefcase,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollegeCard from "@/components/shared/CollegeCard";

export default function CourseDetailClient({ initialCourse, initialColleges = [] }) {
  const [course] = useState(initialCourse);
  const [allColleges] = useState(initialColleges);

  const topColleges = (course.topColleges || [])
    .map((cid) => {
      const fromDb = allColleges.find(
        (c) =>
          c.id === cid ||
          c.id?.toLowerCase() === cid?.toLowerCase() ||
          c._id === cid
      );
      return fromDb;
    })
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        {/* Course Banner Hero */}
        <div className="relative min-h-[220px] sm:min-h-[260px] w-full bg-slate-950 overflow-hidden flex flex-col justify-between">
          <Image
            src={course.image || "/courses/course-cse.jpg"}
            alt={`${course.name} Course Overview`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/40" />

          {/* Breadcrumb */}
          <div className="container-main pt-4 relative z-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/courses"
                className="hover:text-white transition-colors"
              >
                Courses
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">{course.shortName}</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="container-main pb-6 pt-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      course.level === "UG"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {course.level === "UG"
                      ? "Undergraduate Degree"
                      : "Postgraduate Degree"}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white">
                    {course.duration}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {course.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 mt-2">
                  {course.avgFees && (
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                      {(course.avgFees / 100000).toFixed(1)} Lakhs avg fees
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-slate-300" />
                    {course.subjects?.length || 0} Core Subjects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main py-8 space-y-6">
          {/* About */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-navy mb-3">
              About {course.shortName}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Key Info Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-crimson" />
                <h3 className="text-sm font-semibold text-navy">
                  Entrance Exams
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(course.eligibilityExams || []).map((exam) => (
                  <Badge
                    key={exam}
                    variant="outline"
                    className="text-[10px] border-slate-200 text-slate-600"
                  >
                    {exam}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-crimson" />
                <h3 className="text-sm font-semibold text-navy">
                  Key Subjects
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(course.subjects || []).slice(0, 6).map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-crimson" />
                <h3 className="text-sm font-semibold text-navy">
                  Career Paths
                </h3>
              </div>
              <ul className="space-y-1.5">
                {(course.careers || []).map((career) => (
                  <li
                    key={career}
                    className="text-xs text-slate-600 flex items-center gap-1.5"
                  >
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Colleges */}
          {topColleges.length > 0 && (
            <div>
              <h2 className="heading-3 mb-4">
                Top Colleges for {course.shortName}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
