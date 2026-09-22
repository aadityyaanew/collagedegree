"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, GraduationCap, IndianRupee, ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseCard({ course }) {
  const isUG = course.level === "UG";

  return (
    <Link href={`/courses/${course.id}`} className="group block h-full">
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 h-full flex flex-col justify-between">
        <div>
          {/* Course Thumbnail Image */}
          <div className="h-32 sm:h-36 relative overflow-hidden bg-slate-100">
            <Image
              src={course.image || "/courses/course-cse.jpg"}
              alt={course.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
            
            {/* Level Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs ${
                  isUG
                    ? "bg-blue-600 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                {course.level} Degree
              </span>
            </div>

            {/* Duration Tag */}
            <div className="absolute bottom-2.5 left-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <Clock className="h-3 w-3 text-slate-300" />
                {course.duration}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold text-navy leading-snug group-hover:text-crimson transition-colors mb-2 line-clamp-1">
              {course.shortName || course.name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {course.description}
            </p>

            {/* Careers Pill Preview */}
            {course.careers && course.careers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {course.careers.slice(0, 2).map((career) => (
                  <span
                    key={career}
                    className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    <Briefcase className="h-2.5 w-2.5 text-slate-400" />
                    {career}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 mb-2.5">
            <div className="text-[11px] font-medium text-slate-500">
              Avg Tuition
            </div>
            <div className="flex items-center gap-1 font-bold text-navy text-xs">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              {course.avgFees ? (course.avgFees / 100000).toFixed(1) + " L" : "Affordable"}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-crimson group-hover:text-crimson-dark pt-0.5">
            <span>Syllabus & Colleges</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
