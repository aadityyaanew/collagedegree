"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Users2, Trophy } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

const defaultStats = [
  {
    icon: Building2,
    value: "500+",
    label: "Top Colleges",
    subtext: "IITs, NITs, BITS & top universities",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: GraduationCap,
    value: "200+",
    label: "Degree Programs",
    subtext: "B.Tech, MBA, Medical, Law & more",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users2,
    value: "50,000+",
    label: "Students Helped",
    subtext: "Unbiased guidance for 2024 admissions",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Trophy,
    value: "100+",
    label: "Rankings Analyzed",
    subtext: "NIRF, NAAC, QS & alumni reports",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export default function StatsSection({ stats = defaultStats }) {
  return (
    <SectionWrapper className="bg-slate-50/80 border-b border-slate-200/80 relative">
      <div className="container-main py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
              className="glass-card rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 transform-gpu"
            >
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0 border border-slate-100`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-extrabold text-navy tracking-tight leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {stat.label}
                </p>
                <p className="hidden sm:block text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {stat.subtext}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
