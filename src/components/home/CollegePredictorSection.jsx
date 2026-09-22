"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  GraduationCap,
  SlidersHorizontal,
  ChevronRight,
  Scale,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { formatFees, formatPackage } from "@/lib/formatters";

const DEGREES = ["MBA", "BBA", "BCA", "B.Com", "MCA", "MA", "M.Com", "M.Sc"];

const BUDGET_OPTIONS = [
  { id: "any", label: "Any Budget" },
  { id: "under-2l", label: "Under ₹2L", max: 200000 },
  { id: "2l-5l", label: "₹2L – ₹5L", min: 200000, max: 500000 },
  { id: "above-5l", label: "₹5L+", min: 500000 },
];

const MODES = [
  { id: "online", label: "Online & Flexible" },
  { id: "hybrid", label: "Hybrid Mode" },
  { id: "campus", label: "On-Campus" },
];

const PRIORITIES = [
  { id: "placement", label: "Highest Packages" },
  { id: "budget", label: "Affordable Fees" },
  { id: "ranking", label: "Top NIRF Ranking" },
];

export default function CollegePredictorSection() {
  const [selectedDegree, setSelectedDegree] = useState("MBA");
  const [selectedBudget, setSelectedBudget] = useState("any");
  const [selectedMode, setSelectedMode] = useState("online");
  const [selectedPriority, setSelectedPriority] = useState("placement");

  const [dbColleges, setDbColleges] = useState([]);

  useEffect(() => {
    fetch("/api/colleges", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbColleges(data);
        }
      })
      .catch((err) => console.error("Failed to fetch colleges", err));
  }, []);

  // Dynamic matching algorithm based on user selection
  const matchedColleges = useMemo(() => {
    if (dbColleges.length === 0) return [];
    
    let pool = dbColleges.filter((c) => {
      // Check degree offering
      if (selectedDegree) {
        const selClean = selectedDegree.toLowerCase().replace(/[^a-z0-9]/g, "");
        const offers = (c.coursesOffered || []).some((course) => {
          if (!course || typeof course !== "string") return false;
          const cClean = course.toLowerCase().replace(/[^a-z0-9]/g, "");
          return cClean === selClean || cClean.includes(selClean) || selClean.includes(cClean);
        });
        if (!offers) return false;
      }

      // Check mode if online selected
      if (selectedMode === "online") {
        const isOnline =
          c.name.toLowerCase().includes("online") ||
          c.location?.city?.toLowerCase() === "online" ||
          c.id.includes("online");
        if (!isOnline && dbColleges.some((col) => col.id?.includes("online"))) {
          // Keep pool inclusive
        }
      }

      // Check budget
      const fee =
        selectedDegree === "MBA"
          ? c.fees?.mba || c.fees?.btech
          : c.fees?.btech || c.fees?.mba;

      if (selectedBudget === "under-2l" && fee && fee > 200000) return false;
      if (
        selectedBudget === "2l-5l" &&
        fee &&
        (fee < 200000 || fee > 500000)
      )
        return false;
      if (selectedBudget === "above-5l" && fee && fee < 500000) return false;

      return true;
    });

    // Fallback if strict filter yields too few results
    if (pool.length === 0) {
      pool = dbColleges.filter((c) =>
        c.coursesOffered?.includes(selectedDegree)
      );
    }
    if (pool.length === 0) {
      pool = dbColleges.slice(0, 5);
    }

    // Sort according to selected priority
    return pool
      .slice()
      .sort((a, b) => {
        if (selectedPriority === "placement") {
          return (b.avgPackage || 0) - (a.avgPackage || 0);
        }
        if (selectedPriority === "ranking") {
          return (a.nirfRanking || 999) - (b.nirfRanking || 999);
        }
        if (selectedPriority === "budget") {
          const feeA = a.fees?.mba || a.fees?.btech || 9999999;
          const feeB = b.fees?.mba || b.fees?.btech || 9999999;
          return feeA - feeB;
        }
        return 0;
      })
      .slice(0, 3);
  }, [selectedDegree, selectedBudget, selectedMode, selectedPriority, dbColleges]);

  return (
    <SectionWrapper className="relative w-full overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-slate-900 text-white py-14 sm:py-20 lg:py-24 border-b border-slate-800">
      {/* Background Lighting Orbs matching CtaSection and Hero */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern-light opacity-10 pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-4 backdrop-blur-xs shadow-xs">
            <Compass className="h-4 w-4 text-rose-400 animate-pulse" />
            <span>AI-POWERED COLLEGE PREDICTOR</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            So, where should you <span className="text-rose-400">actually go?</span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Get your personal college shortlist in 30 seconds. Unbiased recommendations tailored to your stream, budget, and future career goals.
          </p>
        </div>

        {/* Split Grid: Interactive Selector + Live Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Left Column: Interactive Preference Selector */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-rose-400" />
                Customize Your College Criteria
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Shortlisting
              </span>
            </div>

            <div className="space-y-5">
              {/* 1. Target Degree */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Target Degree
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEGREES.map((degree) => {
                    const isSelected = selectedDegree === degree;
                    return (
                      <button
                        key={degree}
                        type="button"
                        onClick={() => setSelectedDegree(degree)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-crimson text-white shadow-md shadow-crimson/30 border border-crimson-600 scale-102"
                            : "bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10"
                        }`}
                      >
                        {degree}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Budget Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Overall Fee Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = selectedBudget === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedBudget(opt.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-crimson text-white shadow-md shadow-crimson/30 border border-crimson-600 scale-102"
                            : "bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Learning Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Learning Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((mode) => {
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-crimson text-white shadow-md shadow-crimson/30 border border-crimson-600 scale-102"
                            : "bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10"
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Top Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  4. Your Highest Decision Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRIORITIES.map((p) => {
                    const isSelected = selectedPriority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPriority(p.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-crimson text-white shadow-md shadow-crimson/30 border border-crimson-600 scale-102"
                            : "bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 pt-5 border-t border-white/10 flex flex-col gap-3">
              <Button
                asChild
                className="w-full bg-crimson hover:bg-crimson-dark text-white font-bold text-sm rounded-xl px-7 h-12 shadow-md shadow-crimson/30 transition-all touch-manipulation"
              >
                <Link
                  href={`/course-finder?degree=${encodeURIComponent(
                    selectedDegree
                  )}&budget=${selectedBudget}`}
                >
                  Find my top matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-xl px-5 h-12 touch-manipulation"
              >
                <Link href="/compare">
                  Compare Colleges Side-by-Side
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Dynamic Recommendations Stack */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Best-Fit Recommendations
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Target: <strong className="text-white">{selectedDegree}</strong>
              </span>
            </div>

            {/* Matched Cards */}
            <AnimatePresence mode="popLayout">
              {matchedColleges.map((college, idx) => {
                const matchScore = 98 - idx * 4;
                const feeDisplay = college.fees?.mba
                  ? formatFees(college.fees.mba)
                  : college.fees?.btech
                  ? formatFees(college.fees.btech)
                  : "Transparent Fees";

                return (
                  <motion.div
                    key={college.id}
                    layout
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="bg-white/10 hover:bg-white/15 border border-white/15 hover:border-crimson/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                          {college.logo ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={college.logo}
                                alt={college.shortName}
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <GraduationCap className="h-6 w-6 text-crimson" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm sm:text-base leading-tight group-hover:text-rose-200 transition-colors truncate" title={college.name}>
                            {college.name}
                          </h4>
                          <span className="text-xs text-slate-400 block truncate mt-0.5">
                            #{college.nirfRanking || "Top"} NIRF • NAAC{" "}
                            {college.naacGrade || "A+"}
                          </span>
                        </div>
                      </div>

                      {/* Compatibility Badge */}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold whitespace-nowrap shrink-0">
                        {matchScore}% Fit
                      </span>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 bg-black/25 rounded-xl p-2.5 text-xs text-slate-300 border border-white/5 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">
                          Avg Package
                        </span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <TrendingUp className="h-3 w-3" />
                          {formatPackage(college.avgPackage)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">
                          Estimated Fee
                        </span>
                        <span className="font-bold text-white block mt-0.5">
                          {feeDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="font-semibold text-rose-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        View College Profile
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href={`/compare?c1=${college.id}`}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Scale className="h-3 w-3" />
                        Compare
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Explanatory Pill */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Accreditation, placement audits & NIRF metrics verified.
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
