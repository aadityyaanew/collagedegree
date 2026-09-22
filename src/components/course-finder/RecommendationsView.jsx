"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Target,
  Trophy,
  MapPin,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Filter,
  DollarSign,
  Scale,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFees, formatPackage } from "@/lib/formatters";

const typeBadgeStyles = {
  IIT: "bg-amber-50 text-amber-800 border-amber-200",
  NIT: "bg-blue-50 text-blue-800 border-blue-200",
  Private: "bg-purple-50 text-purple-800 border-purple-200",
  Deemed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  State: "bg-cyan-50 text-cyan-800 border-cyan-200",
};

export default function RecommendationsView({
  recommendations,
  answers,
  onRetake,
}) {
  const counsellingRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");

  const { recommendedCourses = [], recommendedColleges = [], profileSummary = {} } =
    recommendations || {};

  // Filter colleges based on activeTab
  const filteredColleges = recommendedColleges.filter((c) => {
    if (activeTab === "top_nirf") return c.nirfRanking <= 10;
    if (activeTab === "high_ctc") return (c.avgPackage || 0) >= 15;
    if (activeTab === "scholarship") return c.type === "Private" || c.type === "Deemed" || (c.fees?.btech || 0) <= 800000;
    return true;
  });

  const topCourse = recommendedCourses[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Profile Summary Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-crimson bg-crimson-50 px-2.5 py-0.5 rounded-full border border-crimson-100">
                <Target className="h-3 w-3" />
                Tailored for Your Profile
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-semibold text-slate-600">
                {recommendedColleges.length} Verified College Matches Found
              </span>
            </div>

            {/* Profile Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Stream: {profileSummary.stream?.toUpperCase() || "Science"}
              </span>
              <span className="text-xs font-semibold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Target: {topCourse?.shortName || "B.Tech CSE"}
              </span>
              <span className="text-xs font-semibold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Region: {profileSummary.region === "all" ? "All India" : profileSummary.region?.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Level: {profileSummary.education?.toUpperCase() || "12TH"}
              </span>
            </div>
          </div>

          <Button
            onClick={onRetake}
            variant="outline"
            size="sm"
            className="text-xs font-semibold text-slate-600 hover:text-crimson border-slate-200 h-9 rounded-xl shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Edit Profile / Retake
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto space-y-8 items-start">
        {/* Recommendations */}
        <div className="space-y-8">
          {/* Section 1: Best-Fit Course Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
                  Recommended Course Programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Degrees that offer the highest career ROI matching your stream and ambitions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                        <Target className="h-3 w-3 text-emerald-600" />
                        {course.matchPercentage}% Fit
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {course.duration} &bull; {course.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy leading-snug">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Reasons */}
                    {course.reasons?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {course.reasons.map((reason, rIdx) => (
                          <div
                            key={rIdx}
                            className="flex items-center gap-1.5 text-[11px] text-slate-600"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Avg Starting CTC
                      </span>
                      <span className="font-bold text-navy text-sm">
                        ₹8 - ₹22 LPA
                      </span>
                    </div>
                    <Link
                      href={`/courses`}
                      className="text-crimson font-semibold hover:text-crimson-dark flex items-center gap-1 text-xs"
                    >
                      <span>Explore Syllabus</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Matched Colleges */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
                  Top Recommended Colleges
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ranked by NIRF reputation, placement packages, and admission compatibility
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
                {[
                  { id: "all", label: "All Matches" },
                  { id: "top_nirf", label: "Top NIRF" },
                  { id: "high_ctc", label: "Highest CTC" },
                  { id: "scholarship", label: "Scholarships" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white text-navy shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colleges List */}
            <div className="space-y-4">
              {filteredColleges.map((college, idx) => (
                <div
                  key={college.id}
                  className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      {/* Campus Thumbnail */}
                      <div className="h-28 w-full sm:w-36 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={college.campus || "/campus-placeholder.jpg"}
                          alt={college.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 150px"
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-xs ${
                              typeBadgeStyles[college.type] || typeBadgeStyles.Private
                            }`}
                          >
                            {college.type}
                          </span>
                        </div>
                      </div>

                      {/* Info & Stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-crimson bg-crimson-50 border border-crimson-100 px-2 py-0.5 rounded-md">
                            <Target className="h-3 w-3" />
                            {college.matchPercentage}% Compatibility
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            <Trophy className="h-3 w-3 text-amber-500" />
                            #{college.nirfRanking} NIRF
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {college.location.city}, {college.location.state}
                          </span>
                        </div>

                        <Link
                          href={`/colleges/${college.id}`}
                          className="group inline-block"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-navy group-hover:text-crimson transition-colors leading-snug">
                            {college.name}
                          </h3>
                        </Link>

                        {/* Match Reasons */}
                        {college.reasons?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {college.reasons.map((r, rIdx) => (
                              <span
                                key={rIdx}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                {r}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Avg Package
                            </span>
                            <span className="text-sm font-bold text-navy">
                              {formatPackage(college.avgPackage)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Highest Offer
                            </span>
                            <span className="text-sm font-bold text-emerald-700">
                              {formatPackage(college.highestPackage)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Tuition (approx)
                            </span>
                            <span className="text-sm font-bold text-navy">
                              {college.fees?.btech
                                ? (college.fees.btech / 100000).toFixed(1) + " L"
                                : "Affordable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* College Bottom Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-semibold text-navy">
                          {college.placementPercentage}%
                        </span>
                        <span>batch placed with top recruiters</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold text-slate-700 border-slate-200 rounded-lg hover:border-slate-300"
                        >
                          <Link href={`/compare?c1=${college.id}`}>
                            Compare College
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="h-8 text-xs font-bold bg-navy hover:bg-slate-800 text-white rounded-lg shadow-none"
                        >
                          <Link href={`/colleges/${college.id}`}>
                            View Cutoff & Seats
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
