"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp, Trophy, Star, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatFees, formatPackage } from "@/lib/formatters";

const typeColors = {
  IIT: "bg-amber-50 text-amber-700 border-amber-200",
  NIT: "bg-blue-50 text-blue-700 border-blue-200",
  Private: "bg-purple-50 text-purple-700 border-purple-200",
  Deemed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  State: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export default function CollegeCard({ college, compact = false }) {
  const [logoError, setLogoError] = useState(false);
  const [campusError, setCampusError] = useState(false);

  const campusSrc = campusError || !college.campus ? "/campus-placeholder.jpg" : college.campus;

  return (
    <Link href={`/colleges/${college.id}`} className="group block">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-crimson/30 hover:-translate-y-1 h-full flex flex-col">
        {/* Compact Mode: Horizontal with thumbnail */}
        {compact ? (
          <div className="p-3.5 flex items-center gap-3 h-full">
            <div className="h-16 w-16 relative rounded-lg overflow-hidden shrink-0 bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5">
              {!logoError && college.logo ? (
                <div className="relative w-full h-full">
                  <Image
                    src={college.logo}
                    alt={college.shortName}
                    fill
                    sizes="64px"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-md bg-slate-50 flex items-center justify-center font-bold text-navy text-xs">
                  {college.shortName?.slice(0, 2) || "CD"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded border ${
                    typeColors[college.type] || typeColors.Private
                  }`}
                >
                  {college.type}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  #{college.nirfRanking} NIRF
                </span>
              </div>
              <h3 className="text-sm font-semibold text-navy leading-snug group-hover:text-crimson transition-colors truncate">
                {college.shortName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {college.location?.city || "Online"}, {college.location?.state || "India"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Image / Header */}
            <div className="h-36 relative overflow-hidden bg-slate-100">
              <Image
                src={campusSrc}
                alt={college.shortName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setCampusError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* College Logo */}
              <div className="absolute bottom-3 left-4 h-14 w-14 bg-white rounded-lg shadow-sm border border-slate-100 p-1.5 flex items-center justify-center">
                {!logoError && college.logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={college.logo}
                      alt={`${college.shortName} Logo`}
                      fill
                      sizes="56px"
                      className="object-contain"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded bg-slate-50 flex items-center justify-center font-bold text-navy text-xs">
                    {college.shortName?.slice(0, 2) || "CD"}
                  </div>
                )}
              </div>
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border shadow-xs ${
                    typeColors[college.type] || typeColors.Private
                  }`}
                >
                  {college.type}
                </span>
              </div>
              {college.nirfRanking <= 10 && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-md px-2 py-0.5 flex items-center gap-1 shadow-xs">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-bold text-slate-700">
                    #{college.nirfRanking}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-navy leading-snug group-hover:text-crimson transition-colors line-clamp-2 mb-1">
                  {college.shortName}
                </h3>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {college.location?.city || "Online"}, {college.location?.state || "India"}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                    Rank
                  </p>
                  <p className="text-sm font-bold text-navy">
                    #{college.nirfRanking || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
                    Avg Pkg
                  </p>
                  <p className="text-sm font-bold text-navy">
                    {formatPackage(college.avgPackage)}
                  </p>
                </div>
              </div>

              {/* Mobile App Action Bar */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-crimson flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Programs &rsaquo;
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-crimson/10 hover:text-crimson px-2.5 py-1 rounded-lg transition-colors">
                  Compare &rarr;
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
