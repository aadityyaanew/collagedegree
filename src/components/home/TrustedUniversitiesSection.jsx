"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function TrustedUniversitiesSection() {
  const [showAll, setShowAll] = useState(false);
  const [univList, setUnivList] = useState([]);


  useEffect(() => {
    fetch("/api/colleges", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUnivList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Initial 12 cards match the 3 rows x 4 cols layout shown in reference
  const displayedUniversities = showAll
    ? univList
    : univList.slice(0, 12);

  return (
    <SectionWrapper className="section-padding bg-white relative overflow-hidden">
      <div className="container-main">
        {/* Section Header - matches reference UX with current brand theme */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 sm:mb-11">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[42px] font-bold tracking-tight text-navy leading-tight mb-2 sm:mb-3 font-heading sm:whitespace-nowrap">Your future, backed by <span className="gradient-text-crimson">certified excellence</span></h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl">
            The safer way to choose UGC-DEB recognized higher education.
          </p>
        </div>

        {/* 4-Column University Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence>
            {displayedUniversities.map((univ, idx) => {
              const collegeHref = univ.id ? `/colleges/${univ.id}` : "/colleges";

              return (
                <motion.div
                  key={univ.id || univ.name || idx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, delay: idx * 0.015 }}
                  className="relative group"
                >
                  <Link
                    href={collegeHref}
                    className="flex flex-col justify-between pt-4 pb-3.5 px-4 sm:px-5 rounded-2xl border border-[rgba(215,215,215,0.7)] bg-[#FFFDF9] hover:bg-white w-full h-full transition-all duration-200 group-hover:border-crimson/40 group-hover:shadow-[0_8px_20px_-4px_rgba(185,28,28,0.12)] group-hover:-translate-y-0.5 block cursor-pointer"
                  >
                    {/* Top Logo Container with horizontal branding */}
                    <div className="relative h-[4.5rem] w-full flex items-center justify-center overflow-hidden shrink-0 px-1 py-1">
                      {univ.logo ? (
                        <>
                          <img
                            src={univ.logo}
                            alt={univ.name}
                            loading="lazy"
                            className="max-h-[3.6rem] w-auto max-w-[92%] object-contain transition-transform duration-200 group-hover:scale-103"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <span className="hidden font-bold text-navy text-sm text-center">
                            {univ.name}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-navy text-sm text-center">
                          {univ.name}
                        </span>
                      )}
                    </div>

                    {/* Subtle Horizontal Divider */}
                    <div className="h-px w-full bg-[rgba(215,215,215,0.65)] my-3 shrink-0" />

                    {/* Bottom Info: Book Icon + Course Count + Arrow */}
                    <div className="flex items-center justify-between w-full shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Green book icon like reference */}
                        <span className="text-base select-none leading-none"></span>
                        <p className="font-medium text-[15px] leading-none text-slate-700 group-hover:text-navy transition-colors whitespace-nowrap">
                          View Course
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-crimson group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                    </div>
                  </Link>

                  {/* University Name Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-20 shadow-lg">
                    {univ.name}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Show Less Toggle Button */}
        {univList.length > 12 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-slate-300 hover:border-crimson text-slate-700 hover:text-crimson bg-white font-semibold text-sm rounded-xl px-6 h-11 shadow-xs transition-colors cursor-pointer"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="ml-1.5 h-4 w-4" />
                </>
              ) : (
                <>
                  View All {univList.length} Universities{" "}
                  <ChevronDown className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              asChild
              className="bg-crimson hover:bg-crimson-dark text-white font-bold text-sm rounded-xl px-6 h-11 shadow-md shadow-crimson/20 transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-98"
            >
              <Link href="/colleges">
                Explore Full Directory
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
