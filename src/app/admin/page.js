"use client";

import { useEffect, useState } from "react";
import { Users, Building2, GraduationCap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    colleges: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Leads",
      value: stats.leads,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500/10 to-transparent",
      link: "/admin/leads",
      trend: "+12% this week"
    },
    {
      title: "Total Colleges",
      value: stats.colleges,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      gradient: "from-emerald-500/10 to-transparent",
      link: "/admin/colleges",
      trend: "+2 this month"
    },
    {
      title: "Total Courses",
      value: stats.courses,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      gradient: "from-purple-500/10 to-transparent",
      link: "/admin/courses",
      trend: "+5 this month"
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1.5">
          Welcome back. Here's what's happening with your platform today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="group relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 overflow-hidden flex flex-col justify-between h-full min-h-[180px]">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.gradient} rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110`} />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} shadow-inner`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">{stat.title}</h3>
              <div className="text-4xl font-bold text-navy mt-1 tracking-tight">
                {loading ? <span className="animate-pulse bg-slate-200 text-transparent rounded w-16 inline-block">00</span> : stat.value}
              </div>
            </div>

            <Link
              href={stat.link}
              className="inline-flex items-center text-sm text-crimson font-medium mt-6 group/link w-fit"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 flex flex-col min-h-[350px]">
          <h3 className="text-lg font-bold text-navy mb-6">Engagement Overview</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-500">Chart rendering will appear here.</p>
              <p className="text-xs text-slate-400 mt-1">Connect a chart library to visualize data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
