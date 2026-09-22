"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  GraduationCap,
  Users,
  Star,
  Building2,
  IndianRupee,
  ExternalLink,
  ChevronRight,
  Check,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatFees, formatPackage } from "@/lib/formatters";

export default function CollegeDetailPage({ params }) {
  const { id } = use(params);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setCollege(data);
        } else {
          if (isMounted) setError(true);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCollege();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-slate-50 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-crimson animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !college) {
    notFound();
  }

  const typeColors = {
    IIT: "bg-amber-50 text-amber-700 border-amber-200",
    NIT: "bg-blue-50 text-blue-700 border-blue-200",
    Private: "bg-purple-50 text-purple-700 border-purple-200",
    Deemed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    State: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        {/* Campus Cover Banner */}
        <div className="relative min-h-[260px] sm:min-h-[300px] w-full bg-slate-900 overflow-hidden flex flex-col justify-between">
          <Image
            src={college.campus || "/campus-placeholder.jpg"}
            alt={college.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30" />

          {/* Breadcrumb over banner */}
          <div className="container-main pt-4 relative z-10">
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/colleges"
                className="hover:text-white transition-colors"
              >
                Colleges
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white font-medium">{college.shortName}</span>
            </div>
          </div>

          {/* Hero Header Content */}
          <div className="container-main pb-6 pt-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span
                    className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-md border shadow-xs ${
                      typeColors[college.type] || "bg-white/90 text-navy"
                    }`}
                  >
                    {college.type}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                    <Award className="h-3.5 w-3.5 text-amber-300" />
                    NIRF #{college.nirfRanking}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                    NAAC {college.naacGrade}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {college.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-crimson" />
                    {college.location?.city || "Online"}, {college.location?.state || "India"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    Est. {college.established}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto mt-4 md:mt-0">
                <Button
                  asChild
                  className="bg-crimson hover:bg-crimson-dark text-white font-bold px-5 h-10 sm:h-10 text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98"
                >
                  <Link href={`/compare?c1=${college.id}`}>
                    Compare This College
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="font-semibold px-4 h-10 sm:h-10 text-xs sm:text-sm rounded-xl bg-white/90 backdrop-blur-md text-navy hover:bg-white border-0 shadow-sm active:scale-98"
                >
                  <Link href="/course-finder">
                    Get Free Counselling
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border-b border-slate-200">
          <div className="container-main py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {[
                {
                  label: "NIRF Rank",
                  value: `#${college.nirfRanking}`,
                  icon: Trophy,
                  color: "text-amber-600",
                },
                {
                  label: "Avg Package",
                  value: formatPackage(college.avgPackage),
                  icon: IndianRupee,
                  color: "text-emerald-600",
                },
                {
                  label: "Highest Pkg",
                  value: formatPackage(college.highestPackage),
                  icon: TrendingUp,
                  color: "text-blue-600",
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-sm font-semibold text-navy">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container-main py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="bg-white border border-slate-200 rounded-xl p-1.5 h-auto flex flex-nowrap gap-1 w-max min-w-full justify-start">
                {[
                  "Overview",
                  "Courses & Fees",
                  "Placements",
                  "Rankings",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase().replace(/ & /g, "-")}
                    className="text-xs sm:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-crimson data-[state=active]:text-white rounded-lg px-3.5 sm:px-4 py-2 shrink-0 transition-all"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-navy mb-3">
                  About {college.shortName}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {college.about}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-navy mb-4">
                  Key Highlights
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Established",
                      value: college.established,
                    },
                    {
                      label: "NAAC Grade",
                      value: college.naacGrade,
                    },
                    {
                      label: "NIRF Ranking",
                      value: `#${college.nirfRanking}`,
                    },
                    {
                      label: "Type",
                      value: college.type,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-sm text-slate-500">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-navy">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Courses & Fees Tab */}
            <TabsContent value="courses-fees">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Course
                        </th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Total Fees
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(college.fees || {}).map(([course, fee]) => (
                        <tr
                          key={course}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-5 py-3.5 font-medium text-navy capitalize">
                            {course === "btech"
                              ? "B.Tech"
                              : course === "mtech"
                              ? "M.Tech"
                              : course.toUpperCase()}
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-600">
                            {formatFees(fee)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Placements Tab */}
            <TabsContent value="placements" className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Average Package",
                    value: formatPackage(college.avgPackage),
                  },
                  {
                    label: "Highest Package",
                    value: formatPackage(college.highestPackage),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-slate-200 rounded-xl p-5 text-center"
                  >
                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-navy">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-navy mb-4">
                  Top Recruiters
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(college.topRecruiters || []).map((recruiter) => (
                    <div
                      key={recruiter}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-navy font-medium"
                    >
                      {recruiter}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-600">NIRF Ranking</span>
                  <span className="text-lg font-bold text-navy">
                    #{college.nirfRanking}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-600">NAAC Grade</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {college.naacGrade}
                  </Badge>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 lg:hidden px-3 py-2 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-9.5 text-xs font-bold border-slate-300 text-slate-700 bg-white shadow-2xs rounded-xl active:scale-95"
          >
            <Link href={`/compare?c1=${college.id}`}>
              Compare
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 h-9.5 text-xs font-bold bg-crimson hover:bg-crimson-dark text-white shadow-md shadow-crimson/20 rounded-xl active:scale-95"
          >
            <Link href="/course-finder">
              Free Counselling
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Trophy(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
