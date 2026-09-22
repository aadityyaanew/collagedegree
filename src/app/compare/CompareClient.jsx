"use client";

import React, { useState, useMemo, useCallback, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  X,
  Check,
  Minus,
  ChevronDown,
  GraduationCap,
  Trophy,
  IndianRupee,
  TrendingUp,
  Star,
  Building2,
  Award,
  RotateCcw,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatFees, formatPackage } from "@/lib/formatters";

function isEmptyValue(val, type = "text") {
  if (val === null || val === undefined || val === false || val === "") return true;
  if (type === "check") {
    return !val || val === "false" || val === 0 || val === "0";
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (
      trimmed === "" ||
      trimmed === "—" ||
      trimmed === "-" ||
      trimmed === "--" ||
      trimmed === "N/A" ||
      trimmed === "NA" ||
      trimmed === "n/a" ||
      trimmed === "null" ||
      trimmed === "undefined" ||
      trimmed === "None" ||
      trimmed === "#" ||
      trimmed === "#N/A" ||
      trimmed === "#undefined" ||
      trimmed === "undefined%" ||
      trimmed === "undefined/5" ||
      trimmed === "0%" ||
      trimmed === "0/5"
    ) {
      return true;
    }
  }
  return false;
}

const FEE_LABEL_MAP = {
  btech: "B.Tech Fees",
  mtech: "M.Tech Fees",
  mba: "MBA Fees",
  bba: "BBA Fees",
  bca: "BCA Fees",
  mca: "MCA Fees",
  bsc: "B.Sc Fees",
  msc: "M.Sc Fees",
  bcom: "B.Com Fees",
  mcom: "M.Com Fees",
  ba: "BA Fees",
  ma: "MA Fees",
  bed: "B.Ed Fees",
  llb: "LLB Fees",
  llm: "LLM Fees",
  mbbs: "MBBS Fees",
  bdes: "B.Des Fees",
  bpharm: "B.Pharm Fees",
  mpharm: "M.Pharm Fees",
  phd: "Ph.D Fees",
};

function getFeeLabel(key) {
  const lower = String(key).toLowerCase().replace(/[^a-z]/g, "");
  if (FEE_LABEL_MAP[lower]) return FEE_LABEL_MAP[lower];
  return `${key.toUpperCase()} Fees`;
}

function CollegeSelector({ selectedId, onSelect, excludeIds = [], collegeList = [], findCollege, index = 0 }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = (collegeList || []).filter((c) => !excludeIds.includes(c.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.shortName?.toLowerCase().includes(q) ||
          c.location?.city?.toLowerCase().includes(q) ||
          c.location?.state?.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 10);
  }, [query, excludeIds, collegeList]);

  const selected = selectedId && findCollege ? findCollege(selectedId) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full text-left p-0 border-0 bg-transparent outline-none">
        {selected ? (
          <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 hover:border-crimson/40 hover:shadow-xs transition-all group cursor-pointer">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-10 w-12 sm:h-12 sm:w-14 rounded-lg overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200/80">
                <Image
                  src={selected.campus || "/campus-placeholder.jpg"}
                  alt={selected.shortName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs sm:text-sm font-bold text-navy truncate">
                    {selected.shortName}
                  </p>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-crimson-light text-crimson font-semibold shrink-0">
                    Slot {index + 1}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                  {selected.location?.city || "Online"}, {selected.location?.state || "India"} &middot; #{selected.nirfRanking || "—"} NIRF
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            </div>
          </div>
        ) : (
          <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-3 sm:p-5 hover:border-crimson/50 hover:bg-crimson-50/40 transition-colors flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1.5 cursor-pointer bg-white/60">
            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-crimson shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {index === 2 ? "+ Add 3rd College" : `+ Select College ${index + 1}`}
            </p>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="w-[94vw] max-w-md p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="text-base sm:text-lg font-bold text-navy flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-crimson" />
            <span>Select College for Comparison</span>
          </DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or short name..."
            aria-label="Search college to compare"
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-crimson focus:ring-2 focus:ring-crimson/20 transition-all"
            autoFocus
          />
        </div>
        <div className="max-h-[55vh] sm:max-h-72 overflow-y-auto divide-y divide-slate-100 -mx-1 pr-1">
          {filtered.map((college) => (
            <button
              key={college.id}
              onClick={() => {
                onSelect(college.id);
                setOpen(false);
                setQuery("");
              }}
              className={`w-full flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                selectedId === college.id
                  ? "bg-crimson-light/80 text-crimson"
                  : "hover:bg-slate-50 text-slate-800"
              }`}
            >
              <div className="h-10 w-12 relative rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                <Image
                  src={college.campus || "/campus-placeholder.jpg"}
                  alt={college.shortName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-navy truncate">
                  {college.shortName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {college.location?.city || (typeof college.location === "string" ? college.location : "Online")} &middot; {college.type || "Private"} &middot; NIRF #
                  {college.nirfRanking || "N/A"}
                </p>
              </div>
              {selectedId === college.id && (
                <Check className="h-4 w-4 text-crimson shrink-0" />
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs sm:text-sm text-slate-400">No colleges match your search</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CompareRow({ label, values, type = "text", highlightBetter = null }) {
  if (!values || !Array.isArray(values) || values.length === 0 || values.every((v) => isEmptyValue(v, type))) {
    return null;
  }

  const getBetterIdx =
    highlightBetter === "higher"
      ? () => {
          const nums = values.map((v) => {
            if (isEmptyValue(v, type)) return -Infinity;
            if (typeof v === "number") return v;
            const parsed = parseFloat(String(v).replace(/[^0-9.]/g, ""));
            return isNaN(parsed) ? -Infinity : parsed;
          });
          const validNums = nums.filter((n) => n !== -Infinity);
          if (validNums.length === 0) return -1;
          const max = Math.max(...validNums);
          return nums.indexOf(max);
        }
      : highlightBetter === "lower"
      ? () => {
          const nums = values.map((v) => {
            if (isEmptyValue(v, type)) return Infinity;
            if (typeof v === "number") return v;
            const parsed = parseFloat(String(v).replace(/[^0-9.]/g, ""));
            return isNaN(parsed) || parsed <= 0 ? Infinity : parsed;
          });
          const validNums = nums.filter((n) => n !== Infinity);
          if (validNums.length === 0) return -1;
          const min = Math.min(...validNums);
          return nums.indexOf(min);
        }
      : null;

  const betterIdx = getBetterIdx ? getBetterIdx() : -1;
  const nonCount = values.filter((v) => !isEmptyValue(v, type)).length;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="px-2.5 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm text-slate-700 font-semibold bg-white sticky left-0 z-10 border-r border-slate-200/90 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] whitespace-normal w-28 sm:w-48 max-w-[110px] sm:max-w-none leading-tight break-words">
        {label}
      </td>
      {values.map((val, i) => {
        const empty = isEmptyValue(val, type);
        const isBetter = !empty && betterIdx === i && nonCount > 1;
        return (
          <td
            key={i}
            className={`px-2.5 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm text-center min-w-[125px] sm:min-w-[180px] max-w-[160px] sm:max-w-none break-words leading-tight ${
              i >= 2 ? "hidden sm:table-cell" : ""
            } ${
              isBetter
                ? "text-emerald-700 font-bold bg-emerald-50/50"
                : "text-navy font-medium"
            }`}
          >
            {type === "check" ? (
              val && !empty ? (
                <div className="inline-flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              ) : (
                <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 mx-auto" />
              )
            ) : empty ? (
              <span className="text-slate-300 font-normal">—</span>
            ) : (
              <span className={isBetter ? "inline-block px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 font-bold" : ""}>
                {val}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function CompareSection({ title, id, colSpan, children }) {
  const childrenArray = React.Children.toArray(children);
  const hasVisibleRows = childrenArray.some((child) => {
    if (!child || !child.props) return false;
    const { values, type } = child.props;
    if (!values || !Array.isArray(values)) return true;
    return !values.every((v) => isEmptyValue(v, type));
  });

  if (!hasVisibleRows) return null;

  return (
    <>
      <tr id={id} className="scroll-mt-32 sm:scroll-mt-36">
        <td
          colSpan={colSpan}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 bg-slate-100/90 text-[10px] sm:text-xs font-bold text-crimson uppercase tracking-wider border-y border-slate-200/80"
        >
          <div className="sticky left-2.5 sm:left-5 inline-flex items-center gap-1.5 font-bold">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-crimson inline-block shrink-0" />
            <span>{title}</span>
          </div>
        </td>
      </tr>
      {children}
    </>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const initialC1 = searchParams.get("c1") || "";
  const initialC2 = searchParams.get("c2") || "";

  const [selectedIds, setSelectedIds] = useState([
    initialC1,
    initialC2,
    "",
  ]);
  const [collegeList, setCollegeList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchColleges = async () => {
      try {
        const res = await fetch(`/api/colleges?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setCollegeList(data);
          }
        }
      } catch (err) {
        console.error("Failed to load colleges for comparison:", err);
      }
    };

    fetchColleges();

    const onFocus = () => fetchColleges();
    window.addEventListener("focus", onFocus);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchColleges();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let bc;
    try {
      bc = new BroadcastChannel("cc_college_updates");
      bc.onmessage = () => {
        fetchColleges();
      };
    } catch (e) {}

    const onStorage = (e) => {
      if (e.key === "cc_last_college_update") {
        fetchColleges();
      }
    };
    window.addEventListener("storage", onStorage);

    const interval = setInterval(fetchColleges, 8000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, []);

  const findCollege = useCallback((id) => {
    if (!id) return null;
    return collegeList.find(c => c.id === id || c.id?.toLowerCase() === id?.toLowerCase() || c._id === id);
  }, [collegeList]);

  const setCollegeAt = useCallback((index, id) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  }, []);

  const removeCollegeAt = useCallback((index) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  }, []);

  const selectedColleges = selectedIds
    .map((id) => findCollege(id))
    .filter(Boolean);

  const excludeIds = selectedIds.filter(Boolean);
  const hasComparison = selectedColleges.length >= 2;

  const allFeeKeys = useMemo(() => {
    const defaultKeys = ["btech", "mtech", "mba", "bba", "bca", "mca", "bsc", "bcom", "llb", "bpharm"];
    const set = new Set(defaultKeys);
    selectedColleges.forEach((c) => {
      if (c.fees && typeof c.fees === "object") {
        Object.keys(c.fees).forEach((k) => {
          if (c.fees[k] !== undefined && c.fees[k] !== null && c.fees[k] !== "") {
            set.add(k);
          }
        });
      }
    });
    return Array.from(set);
  }, [selectedColleges]);

  const allComparedCourses = useMemo(() => {
    const defaultCourses = [
      "B.Tech",
      "M.Tech",
      "MBA",
      "MCA",
      "B.Sc",
      "M.Sc",
      "B.Com",
      "BBA",
      "BCA",
      "B.Arch",
      "B.Pharm",
      "LLB",
      "MBBS",
      "Ph.D",
    ];
    const set = new Set(defaultCourses);
    selectedColleges.forEach((c) => {
      (c.coursesOffered || []).forEach((course) => {
        if (course && typeof course === "string") set.add(course.trim());
      });
    });
    return Array.from(set);
  }, [selectedColleges]);

  const allComparedFacilities = useMemo(() => {
    const defaultFacilities = [
      "Central Library",
      "Sports Complex",
      "Swimming Pool",
      "Hospital",
      "Wi-Fi Campus",
      "Hostels",
      "Research Labs",
      "Innovation Center",
      "Cafeteria",
      "Auditorium",
    ];
    const set = new Set(defaultFacilities);
    selectedColleges.forEach((c) => {
      (c.facilities || []).forEach((f) => {
        if (f && typeof f === "string") set.add(f.trim());
      });
    });
    return Array.from(set);
  }, [selectedColleges]);

  const quickSections = [
    { id: "sec-basic", label: "Basic Info", icon: Building2 },
    { id: "sec-fees", label: "Fees", icon: IndianRupee },
    { id: "sec-placements", label: "Placements", icon: TrendingUp },
    { id: "sec-rankings", label: "Rankings", icon: Trophy },
    { id: "sec-courses", label: "Courses", icon: GraduationCap },
    { id: "sec-eligibility", label: "Eligibility", icon: Award },
    { id: "sec-facilities", label: "Facilities", icon: Star },
  ];

  return (
    <main className="flex-1 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-main py-4 sm:py-6 px-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy tracking-tight mb-0.5 sm:mb-1">
                Compare Colleges
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Side-by-side comparison of fees, verified placements, NIRF rankings, and ROI.
              </p>
            </div>
            {hasComparison && (
              <button
                onClick={() => setSelectedIds(["", "", ""])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-crimson text-xs font-semibold shrink-0 transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-main py-4 sm:py-6 px-3 sm:px-4 pb-28 lg:pb-12">
        {/* College Selectors: 2 on mobile, 3 on sm/lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          {selectedIds.map((id, i) => (
            <div key={i} className={`relative ${i >= 2 ? "hidden sm:block" : ""}`}>
              <CollegeSelector
                selectedId={id}
                onSelect={(newId) => setCollegeAt(i, newId)}
                excludeIds={excludeIds.filter((eid) => eid !== id)}
                collegeList={collegeList}
                findCollege={findCollege}
                index={i}
              />
              {id && (
                <button
                  onClick={() => removeCollegeAt(i)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center transition-colors z-10 shadow-xs cursor-pointer"
                  title="Remove college"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {hasComparison ? (
          <div>
            {/* Quick Section Nav Bar for Mobile & Desktop */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2.5 px-0.5">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline mr-1">
                Jump to:
              </span>
              {quickSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-crimson hover:border-crimson/30 hover:bg-crimson-50/50 text-[11px] sm:text-xs font-medium shrink-0 transition-colors cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                >
                  <sec.icon className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile swipe helper text */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1 lg:hidden">
              <span className="inline-flex items-center gap-1 font-medium bg-white border border-slate-200 shadow-2xs px-2.5 py-1 rounded-lg text-slate-600 text-[10px] sm:text-xs">
                <span>👉 Side-by-side comparison (2 colleges)</span>
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  {/* Sticky Header with college names */}
                  <thead>
                    <tr className="bg-white border-b-2 border-slate-200">
                      <th className="px-2.5 sm:px-5 py-2.5 sm:py-4 text-left text-[11px] sm:text-xs font-bold text-slate-600 uppercase w-28 sm:w-48 bg-slate-50 sticky left-0 top-0 z-30 border-r border-slate-200 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                        Parameter
                      </th>
                      {selectedColleges.map((c, idx) => (
                        <th
                          key={c.id}
                          className={`px-2.5 sm:px-5 py-2.5 sm:py-4 text-center min-w-[125px] sm:min-w-[180px] bg-white sticky top-0 z-20 ${
                            idx >= 2 ? "hidden sm:table-cell" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="h-11 w-18 sm:h-16 sm:w-24 relative rounded-md sm:rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                              <Image
                                src={c.campus || "/campus-placeholder.jpg"}
                                alt={c.shortName}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-1.5 right-1 sm:right-1.5 flex justify-between items-center text-[8px] sm:text-[9px] text-white font-bold">
                                <span>#{c.nirfRanking || "N/A"} NIRF</span>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-navy leading-tight truncate max-w-[115px] sm:max-w-[160px]">
                              {c.shortName}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[115px] sm:max-w-[160px]">
                              {c.location?.city || "Online"} &middot; {c.type || "Private"}
                            </span>
                            <Link
                              href={`/colleges/${c.id}`}
                              className="inline-flex items-center gap-0.5 text-[10px] text-crimson hover:underline font-semibold mt-0.5"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Basic Info */}
                    <CompareSection id="sec-basic" title="Basic Information" colSpan={selectedColleges.length + 1}>
                      <CompareRow
                        label="Type"
                        values={selectedColleges.map((c) => c.type)}
                      />
                      <CompareRow
                        label="Established"
                        values={selectedColleges.map((c) => c.established)}
                      />
                      <CompareRow
                        label="Location"
                        values={selectedColleges.map((c) =>
                          c.location?.city
                            ? `${c.location.city}, ${c.location.state || "India"}`
                            : (typeof c.location === "string" && c.location ? c.location : "")
                        )}
                      />
                      <CompareRow
                        label="NAAC Grade"
                        values={selectedColleges.map((c) => c.naacGrade)}
                      />
                      <CompareRow
                        label="Total Students"
                        values={selectedColleges.map((c) =>
                          c.totalStudents ? c.totalStudents.toLocaleString() : ""
                        )}
                        highlightBetter="higher"
                      />
                    </CompareSection>

                    {/* Fees */}
                    <CompareSection id="sec-fees" title="Fees" colSpan={selectedColleges.length + 1}>
                      {allFeeKeys.map((key) => (
                        <CompareRow
                          key={key}
                          label={getFeeLabel(key)}
                          values={selectedColleges.map((c) => {
                            const feeVal =
                              c.fees && typeof c.fees === "object"
                                ? c.fees[key] || (c.fees.get ? c.fees.get(key) : undefined)
                                : undefined;
                            return feeVal ? formatFees(feeVal) : "";
                          })}
                          highlightBetter="lower"
                        />
                      ))}
                    </CompareSection>

                    {/* Placements */}
                    <CompareSection id="sec-placements" title="Placements" colSpan={selectedColleges.length + 1}>
                      <CompareRow
                        label="Avg Package"
                        values={selectedColleges.map((c) =>
                          c.avgPackage ? formatPackage(c.avgPackage) : ""
                        )}
                        highlightBetter="higher"
                      />
                      <CompareRow
                        label="Highest Package"
                        values={selectedColleges.map((c) =>
                          c.highestPackage ? formatPackage(c.highestPackage) : ""
                        )}
                        highlightBetter="higher"
                      />
                      <CompareRow
                        label="Placement %"
                        values={selectedColleges.map((c) =>
                          c.placementPercentage ? `${c.placementPercentage}%` : ""
                        )}
                        highlightBetter="higher"
                      />
                      <CompareRow
                        label="Top Recruiters"
                        values={selectedColleges.map((c) =>
                          Array.isArray(c.topRecruiters) && c.topRecruiters.length > 0
                            ? c.topRecruiters.slice(0, 4).join(", ")
                            : ""
                        )}
                      />
                    </CompareSection>

                    {/* Rankings */}
                    <CompareSection id="sec-rankings" title="Rankings & Ratings" colSpan={selectedColleges.length + 1}>
                      <CompareRow
                        label="NIRF Ranking"
                        values={selectedColleges.map((c) =>
                          c.nirfRanking ? `#${c.nirfRanking}` : ""
                        )}
                        highlightBetter="lower"
                      />
                      <CompareRow
                        label="Student Rating"
                        values={selectedColleges.map((c) =>
                          c.rating ? `${c.rating}/5` : ""
                        )}
                        highlightBetter="higher"
                      />
                      <CompareRow
                        label="Reviews"
                        values={selectedColleges.map((c) =>
                          c.reviewCount ? c.reviewCount.toLocaleString() : ""
                        )}
                        highlightBetter="higher"
                      />
                    </CompareSection>

                    {/* Courses */}
                    <CompareSection id="sec-courses" title="Courses Offered" colSpan={selectedColleges.length + 1}>
                      {allComparedCourses.map((course) => (
                        <CompareRow
                          key={course}
                          label={course}
                          values={selectedColleges.map((c) =>
                            (c.coursesOffered || []).some(
                              (co) =>
                                co &&
                                typeof co === "string" &&
                                co.toLowerCase().trim() === course.toLowerCase().trim()
                            )
                          )}
                          type="check"
                        />
                      ))}
                    </CompareSection>

                    {/* Eligibility */}
                    <CompareSection id="sec-eligibility" title="Eligibility & Cut-offs" colSpan={selectedColleges.length + 1}>
                      <CompareRow
                        label="Entrance Exams"
                        values={selectedColleges.map((c) =>
                          Array.isArray(c.entranceExams) && c.entranceExams.length > 0
                            ? c.entranceExams.join(", ")
                            : (c.cutoff && typeof c.cutoff === "object"
                                ? Object.entries(c.cutoff).map(([k, v]) => `${k}: ${v}`).join(", ")
                                : "")
                        )}
                      />
                    </CompareSection>

                    {/* Campus Facilities */}
                    <CompareSection id="sec-facilities" title="Campus Facilities" colSpan={selectedColleges.length + 1}>
                      {allComparedFacilities.map((facility) => (
                        <CompareRow
                          key={facility}
                          label={facility}
                          values={selectedColleges.map((c) =>
                            (c.facilities || []).some(
                              (f) =>
                                f &&
                                typeof f === "string" &&
                                f.toLowerCase().trim() === facility.toLowerCase().trim()
                            )
                          )}
                          type="check"
                        />
                      ))}
                    </CompareSection>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Prompt State */
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-12 text-center shadow-xs">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-crimson-light flex items-center justify-center mx-auto mb-3 sm:mb-4 text-crimson">
              <Layers className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-navy mb-1.5">
              Select Colleges to Compare
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Choose at least two colleges above to see a detailed side-by-side
              comparison of fees, placements, rankings, and more.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CompareClient() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="flex-1 bg-slate-50">
            <div className="container-main py-12 text-center">
              <p className="text-sm text-slate-500">Loading comparison...</p>
            </div>
          </main>
        }
      >
        <CompareContent />
      </Suspense>
      <Footer />
    </>
  );
}
