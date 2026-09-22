"use client";

import { Search, ArrowRight, Building2, BookOpen, Command, X } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar({ className = "", variant = "hero" }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("colleges");
  const [showResults, setShowResults] = useState(false);
  const [dbCourses, setDbCourses] = useState([]);
  const [dbColleges, setDbColleges] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Pre-fetch courses for client-side search
    fetch("/api/courses", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data.map(c => ({ ...c, id: c.slug })));
        }
      })
      .catch(err => console.error("Failed to prefetch courses for search", err));

    // Pre-fetch colleges for client-side search
    fetch("/api/colleges", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbColleges(data);
        }
      })
      .catch(err => console.error("Failed to prefetch colleges for search", err));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    if (activeTab === "colleges") {
      const q = query.toLowerCase();
      if (dbColleges.length > 0) {
        return dbColleges.filter(c =>
          c.name?.toLowerCase().includes(q) ||
          c.shortName?.toLowerCase().includes(q) ||
          c.location?.city?.toLowerCase().includes(q) ||
          c.location?.state?.toLowerCase().includes(q)
        ).slice(0, 5);
      }
      return [];
    }
    
    // Search courses locally
    const q = query.toLowerCase();
    return dbCourses.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.shortName?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, activeTab, dbCourses, dbColleges]);

  const isHero = variant === "hero";

  // Shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === "Escape") {
        setShowResults(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Outer Glow Wrapper */}
      <div
        className={`group relative rounded-2xl transition-all duration-300 ${
          isHero
            ? "p-[1px] bg-gradient-to-r from-slate-200 via-rose-200/60 to-slate-200 focus-within:from-crimson focus-within:via-rose-500 focus-within:to-crimson shadow-xl shadow-slate-200/50 focus-within:shadow-crimson/15"
            : "border border-slate-200 rounded-xl shadow-sm"
        }`}
      >
        <div className="relative flex items-center bg-white rounded-[15px] px-2 py-1.5 sm:px-3 sm:py-2">
          {/* Integrated Segmented Switch */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl shrink-0 mr-2 sm:mr-3 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab("colleges");
                inputRef.current?.focus();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "colleges"
                  ? "bg-white text-navy shadow-sm"
                  : "text-slate-500 hover:text-navy"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-crimson" />
              <span>Colleges</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("courses");
                inputRef.current?.focus();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "courses"
                  ? "bg-white text-navy shadow-sm"
                  : "text-slate-500 hover:text-navy"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>Courses</span>
            </button>
          </div>

          {/* Search Icon & Input */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1 mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder={
                activeTab === "colleges"
                  ? "Search colleges (e.g. Amity, LPU...)"
                  : "Search courses (e.g. MBA, B.Tech...)"
              }
              className="w-full min-w-0 bg-transparent outline-none text-navy text-sm placeholder:text-slate-400 py-1.5 pr-1 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors mr-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Keyboard Shortcut cue */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-100 shrink-0">
            <kbd className="inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>
      </div>


      {/* Rich Dropdown Results */}
      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>{activeTab === "colleges" ? "Matching Colleges" : "Matching Courses"}</span>
                <span className="text-[10px] text-slate-400 lowercase">{results.length} found</span>
              </div>
              <ul className="space-y-1 mt-1">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={
                        activeTab === "colleges"
                          ? `/colleges/${item.id}`
                          : `/courses/${item.id}`
                      }
                      onClick={() => setShowResults(false)}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-navy font-bold text-xs group-hover:bg-crimson group-hover:text-white transition-colors shrink-0">
                          {activeTab === "colleges" ? (
                            <Building2 className="h-5 w-5" />
                          ) : (
                            <BookOpen className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy group-hover:text-crimson transition-colors">
                            {item.name || item.shortName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {activeTab === "colleges" && (
                              <>
                                <span>{item.location?.city}, {item.location?.state}</span>
                                {item.nirfRanking && (
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                                    NIRF #{item.nirfRanking}
                                  </span>
                                )}
                                {item.avgPackage && (
                                  <span className="text-emerald-600 font-semibold text-[11px]">
                                    Avg: {item.avgPackage} LPA
                                  </span>
                                )}
                              </>
                            )}
                            {activeTab === "courses" && (
                              <>
                                <span>{item.level}</span>
                                <span>&middot;</span>
                                <span>{item.duration}</span>
                                {item.averageStartingSalary && (
                                  <span className="text-emerald-600 font-semibold text-[11px]">
                                    Avg: {item.averageStartingSalary}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-crimson group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-medium text-navy">No {activeTab} found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;IIT&quot;, &quot;BITS&quot;, &quot;Computer Science&quot;, or &quot;MBA&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
