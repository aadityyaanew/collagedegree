"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollegeCard from "@/components/shared/CollegeCard";
const fallbackColleges = [];

const ALL_COURSES = [
  "BA",
  "BBA",
  "BCA",
  "B.Com",
  "B.Sc",
  "MA",
  "MBA",
  "MCA",
  "M.Com",
  "M.Sc",
  "Executive MBA",
];

const FEE_RANGES = [
  { label: "Any Fee", value: "All" },
  { label: "Under 2 Lakhs", value: "<2L" },
  { label: "2L - 5 Lakhs", value: "2L-5L" },
  { label: "5L - 10 Lakhs", value: "5L-10L" },
  { label: "Above 10 Lakhs", value: ">10L" },
];

const MIN_PACKAGES = [
  { label: "Any Package", value: "All" },
  { label: "3+ LPA", value: "3+" },
  { label: "5+ LPA", value: "5+" },
  { label: "8+ LPA", value: "8+" },
  { label: "10+ LPA", value: "10+" },
];

const sortOptions = [
  { value: "ranking", label: "NIRF Ranking" },
  { value: "fees-low", label: "Fees: Low to High" },
  { value: "fees-high", label: "Fees: High to Low" },
  { value: "package", label: "Avg Package" },
];

function FilterPanel({
  courseOptions = ALL_COURSES,
  selectedCourses,
  setSelectedCourses,
  feeRange,
  setFeeRange,
  minPackage,
  setMinPackage,
}) {
  const toggleCourse = (c) => {
    if (selectedCourses.includes(c)) {
      setSelectedCourses(selectedCourses.filter((course) => course !== c));
    } else {
      setSelectedCourses([...selectedCourses, c]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Programs Offered</h3>
        <div className="flex flex-wrap gap-2">
          {courseOptions.map((c) => {
            const isSelected = selectedCourses.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCourse(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-crimson text-white border-crimson shadow-xs font-semibold"
                    : "bg-white text-slate-600 border-slate-200 hover:border-crimson/50 hover:bg-crimson/5"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fee Range Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Total Program Fees</h3>
        <div className="space-y-2">
          {FEE_RANGES.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2.5 text-sm cursor-pointer group"
            >
              <input
                type="radio"
                name="feeRange"
                value={range.value}
                checked={feeRange === range.value}
                onChange={(e) => setFeeRange(e.target.value)}
                className="w-4 h-4 text-crimson focus:ring-crimson border-slate-300 accent-crimson cursor-pointer"
              />
              <span
                className={`text-xs transition-colors ${
                  feeRange === range.value
                    ? "text-crimson font-medium"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Min Package Filter */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-3">Min Avg Package</h3>
        <div className="space-y-2">
          {MIN_PACKAGES.map((pkg) => (
            <label
              key={pkg.value}
              className="flex items-center gap-2.5 text-sm cursor-pointer group"
            >
              <input
                type="radio"
                name="minPackage"
                value={pkg.value}
                checked={minPackage === pkg.value}
                onChange={(e) => setMinPackage(e.target.value)}
                className="w-4 h-4 text-crimson focus:ring-crimson border-slate-300 accent-crimson cursor-pointer"
              />
              <span
                className={`text-xs transition-colors ${
                  minPackage === pkg.value
                    ? "text-crimson font-medium"
                    : "text-slate-600 group-hover:text-slate-900"
                }`}
              >
                {pkg.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollegesClient({ initialColleges = [] }) {
  const [query, setQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [feeRange, setFeeRange] = useState("All");
  const [minPackage, setMinPackage] = useState("All");
  const [sort, setSort] = useState("ranking");
  const [availableCourses, setAvailableCourses] = useState(ALL_COURSES);
  const [collegeList, setCollegeList] = useState(
    initialColleges && initialColleges.length > 0 ? initialColleges : fallbackColleges
  );

  useEffect(() => {
    if (initialColleges && initialColleges.length > 0) {
      setCollegeList(initialColleges);
    }
  }, [initialColleges]);

  useEffect(() => {
    fetch("/api/courses", { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const names = Array.from(
            new Set(
              data
                .map((c) => c.shortName || c.name)
                .filter(Boolean)
            )
          );
          if (names.length > 0) {
            setAvailableCourses(names);
          }
        }
      })
      .catch((err) => console.error("Failed to load dynamic courses for filters:", err));
  }, []);

  useEffect(() => {
    fetch("/api/colleges", { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCollegeList(data);
        }
      })
      .catch((err) => console.error("Failed to load colleges dynamically:", err));
  }, []);

  const activeFilters = [];
  if (selectedCourses.length > 0)
    activeFilters.push({ key: "courses", label: `${selectedCourses.length} Programs` });
  if (feeRange !== "All")
    activeFilters.push({
      key: "feeRange",
      label: FEE_RANGES.find((r) => r.value === feeRange)?.label,
    });
  if (minPackage !== "All")
    activeFilters.push({
      key: "minPackage",
      label: MIN_PACKAGES.find((p) => p.value === minPackage)?.label,
    });

  const filtered = useMemo(() => {
    let result = [...collegeList];

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          (c.location?.city && c.location.city.toLowerCase().includes(q)) ||
          (c.location?.state && c.location.state.toLowerCase().includes(q))
      );
    }

    // Courses filter
    if (selectedCourses.length > 0) {
      result = result.filter((c) =>
        selectedCourses.some((sc) => {
          const scClean = sc.toLowerCase().replace(/[^a-z0-9]/g, "");
          return (c.coursesOffered || []).some((co) => {
            if (!co || typeof co !== "string") return false;
            const coClean = co.toLowerCase().replace(/[^a-z0-9]/g, "");
            return coClean === scClean || coClean.includes(scClean) || scClean.includes(coClean);
          });
        })
      );
    }

    // Fee range filter
    if (feeRange !== "All") {
      result = result.filter((c) => {
        const fee = c.fees?.btech || c.fees?.mba || c.fees?.bba || c.fees?.bca || c.fees?.bcom || 0;
        if (feeRange === "<2L") return fee > 0 && fee < 200000;
        if (feeRange === "2L-5L") return fee >= 200000 && fee <= 500000;
        if (feeRange === "5L-10L") return fee > 500000 && fee <= 1000000;
        if (feeRange === ">10L") return fee > 1000000;
        return true;
      });
    }

    // Minimum Package Filter
    if (minPackage !== "All") {
      result = result.filter((c) => {
        const pkg = c.avgPackage || 0;
        if (minPackage === "3+") return pkg >= 3;
        if (minPackage === "5+") return pkg >= 5;
        if (minPackage === "8+") return pkg >= 8;
        if (minPackage === "10+") return pkg >= 10;
        return true;
      });
    }

    // Sorting
    switch (sort) {
      case "ranking":
        result.sort((a, b) => (a.nirfRanking || 999) - (b.nirfRanking || 999));
        break;
      case "fees-low":
        result.sort((a, b) => (a.fees?.btech || a.fees?.mba || 9999999) - (b.fees?.btech || b.fees?.mba || 9999999));
        break;
      case "fees-high":
        result.sort((a, b) => (b.fees?.btech || b.fees?.mba || 0) - (a.fees?.btech || a.fees?.mba || 0));
        break;
      case "package":
        result.sort((a, b) => (b.avgPackage || 0) - (a.avgPackage || 0));
        break;
    }

    return result;
  }, [query, selectedCourses, feeRange, minPackage, sort, collegeList]);

  const clearAllFilters = () => {
    setSelectedCourses([]);
    setFeeRange("All");
    setMinPackage("All");
  };

  const removeFilter = (key) => {
    if (key === "courses") setSelectedCourses([]);
    if (key === "feeRange") setFeeRange("All");
    if (key === "minPackage") setMinPackage("All");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container-main py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-navy mb-1">
              Explore Online Universities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover {collegeList.length}+ top online colleges, compare fees, and check placements.
            </p>
          </div>
        </div>

        <div className="container-main py-4 sm:py-6">
          {/* Search & Sort & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities by name or city..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="flex-1 sm:flex-none text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 sm:py-2.5 outline-none focus:border-crimson/50 text-slate-700 shadow-2xs cursor-pointer font-medium"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>

              {/* Mobile filter bottom-sheet trigger */}
              <Sheet>
                <SheetTrigger className="lg:hidden flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs active:scale-95 transition-all">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-crimson" />
                  <span>Filters</span>
                  {activeFilters.length > 0 && (
                    <span className="h-5 min-w-5 px-1 rounded-full bg-crimson text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl p-0 overflow-hidden flex flex-col bg-white">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
                    <SheetTitle className="text-base font-bold text-navy flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-crimson" />
                      Filter Universities
                    </SheetTitle>
                    {activeFilters.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs font-semibold text-crimson hover:underline"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-5">
                    <FilterPanel
                      courseOptions={availableCourses}
                      selectedCourses={selectedCourses}
                      setSelectedCourses={setSelectedCourses}
                      feeRange={feeRange}
                      setFeeRange={setFeeRange}
                      minPackage={minPackage}
                      setMinPackage={setMinPackage}
                    />
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-white shadow-lg">
                    <SheetClose asChild>
                      <Button className="w-full h-11 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl shadow-md shadow-crimson/20 active:scale-98">
                        Show {filtered.length} {filtered.length === 1 ? "University" : "Universities"}
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((f) => (
                <Badge
                  key={f.key}
                  variant="secondary"
                  className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20"
                >
                  {f.label}
                  <button
                    onClick={() => removeFilter(f.key)}
                    className="hover:bg-crimson/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-crimson transition-colors font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-24 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-navy flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                    Filters
                  </h3>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-crimson hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <FilterPanel
                  courseOptions={availableCourses}
                  selectedCourses={selectedCourses}
                  setSelectedCourses={setSelectedCourses}
                  feeRange={feeRange}
                  setFeeRange={setFeeRange}
                  minPackage={minPackage}
                  setMinPackage={setMinPackage}
                />
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-4 font-medium">
                Showing {filtered.length} online {filtered.length === 1 ? "university" : "universities"}
              </p>
              {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((college) => (
                    <CollegeCard key={college._id || college.id} college={college} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-xs">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    No universities found
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters, selecting different courses, or clearing the search query to see more results.
                  </p>
                  {activeFilters.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="mt-6"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
