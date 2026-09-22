"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { School, ChevronRight, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { useState, useEffect } from "react";

export default function PopularComparisonsSection({
  comparisons: initialComparisons = [],
}) {
  const [comparisons, setComparisons] = useState(initialComparisons);

  useEffect(() => {
    if (initialComparisons.length > 0) return;
    fetch("/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length >= 6) {
          setComparisons([
            { tag: "Top Online Battle", college1: data[0], college2: data[1] },
            { tag: "Premier Private", college1: data[2], college2: data[3] },
            { tag: "Trending Universities", college1: data[4], college2: data[5] },
          ]);
        }
      })
      .catch((err) => console.error("Failed to fetch comparisons", err));
  }, [initialComparisons]);

  return (
    <SectionWrapper className="section-padding bg-slate-50/60 relative">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-light text-crimson text-xs font-semibold mb-3 border border-crimson/10">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Popular Comparisons</span>
            </div>
            <h2 className="heading-2 mb-2">Head-to-Head College Battles</h2>
            <p className="text-body max-w-xl">
              See how top colleges stack up against each other across real placements, fees, and NIRF rankings.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto border-slate-200 hover:border-slate-300 text-slate-700 hover:text-navy bg-white shadow-xs font-semibold text-sm rounded-xl px-4 h-10"
          >
            <Link href="/compare">
              View All Comparisons
              <ChevronRight className="ml-1.5 h-4 w-4 text-slate-400" />
            </Link>
          </Button>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {comparisons.map(({ tag, college1, college2 }, i) => {
            if (!college1 || !college2) return null;

            const c1Pkg = college1.avgPackage || 0;
            const c2Pkg = college2.avgPackage || 0;
            const higherPkg = Math.max(c1Pkg, c2Pkg);

            return (
              <motion.div
                key={college1.id + "-vs-" + college2.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                className="transform-gpu"
              >
                <Link
                  href={`/compare?c1=${college1.id}&c2=${college2.id}`}
                  className="group block h-full"
                >
                  <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                      {/* Category Tag */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 border border-slate-200/60">
                          {tag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          NIRF 2024
                        </span>
                      </div>

                      {/* Colleges Head-to-Head */}
                      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        {/* College 1 */}
                        <div className="flex-1 text-center min-w-0">
                          <div className="relative h-11 w-11 mx-auto rounded-xl overflow-hidden border border-slate-200 mb-1.5 shadow-2xs">
                            <Image
                              src={college1.campus || "/campus-placeholder.jpg"}
                              alt={college1.shortName}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-xs font-bold text-navy truncate" title={college1.name}>
                            {college1.shortName}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] text-slate-400 font-medium">
                            #{college1.nirfRanking} NIRF
                          </span>
                        </div>

                        {/* VS Bubble */}
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-crimson/10 border border-crimson/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-crimson">
                            VS
                          </span>
                        </div>

                        {/* College 2 */}
                        <div className="flex-1 text-center min-w-0">
                          <div className="relative h-11 w-11 mx-auto rounded-xl overflow-hidden border border-slate-200 mb-1.5 shadow-2xs">
                            <Image
                              src={college2.campus || "/campus-placeholder.jpg"}
                              alt={college2.shortName}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-xs font-bold text-navy truncate" title={college2.name}>
                            {college2.shortName}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] text-slate-400 font-medium">
                            #{college2.nirfRanking} NIRF
                          </span>
                        </div>
                      </div>

                      {/* Metrics Comparison */}
                      <div className="space-y-3 pt-1">
                        {/* Avg Package */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className={`font-semibold ${c1Pkg === higherPkg ? "text-emerald-700 font-bold" : "text-slate-600"}`}>
                              {c1Pkg} LPA
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Avg Package
                            </span>
                            <span className={`font-semibold ${c2Pkg === higherPkg ? "text-emerald-700 font-bold" : "text-slate-600"}`}>
                              {c2Pkg} LPA
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className="bg-emerald-500 h-full rounded-l-full"
                              style={{ width: `${(c1Pkg / (c1Pkg + c2Pkg)) * 100}%` }}
                            />
                            <div
                              className="bg-blue-500 h-full rounded-r-full"
                              style={{ width: `${(c2Pkg / (c1Pkg + c2Pkg)) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Placement % */}
                        <div className="flex justify-between items-center text-xs py-1.5 border-t border-slate-100">
                          <span className="font-semibold text-navy">{college1.placementPercentage}%</span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase">Placement</span>
                          <span className="font-semibold text-navy">{college2.placementPercentage}%</span>
                        </div>

                        {/* B.Tech Fees */}
                        <div className="flex justify-between items-center text-xs py-1.5 border-t border-slate-100">
                          <span className="font-semibold text-navy">
                            {college1.fees?.btech ? (college1.fees.btech / 100000).toFixed(1) + " L" : "N/A"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase">Total Fees</span>
                          <span className="font-semibold text-navy">
                            {college2.fees?.btech ? (college2.fees.btech / 100000).toFixed(1) + " L" : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compare Button */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-crimson group-hover:text-crimson-dark">
                      <span>Full Side-by-Side Comparison</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
