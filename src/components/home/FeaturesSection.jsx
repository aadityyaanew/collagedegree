"use client";

import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Trophy, MessageSquare, ShieldCheck } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

const defaultFeatures = [
  {
    icon: IndianRupee,
    title: "No Cost EMI Support",
    description:
      "Flexible payment options with No Cost EMI support, making your course fees easier to manage without paying extra interest.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    icon: TrendingUp,
    title: "Verified Placements",
    description:
      "Official average packages, median salary stats, highest packages, and actual top recruiters.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: Trophy,
    title: "Consolidated Rankings",
    description:
      "NIRF, NAAC accreditation, and verified institutional standing unified in one clear view.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    icon: MessageSquare,
    title: "Unfiltered Reviews",
    description:
      "Real perspectives on campus life, labs, hostels, and culture from enrolled students and recent alumni.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
];

export default function FeaturesSection({ features = defaultFeatures }) {
  return (
    <SectionWrapper className="section-padding bg-white relative">
      <div className="container-main">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-crimson-light text-crimson text-xs font-semibold mb-3 border border-crimson/10">
            <ShieldCheck className="h-4 w-4" />
            <span>Built for Confident Decisions</span>
          </div>
          <h2 className="heading-2 mb-3">Why Thousands Trust Compare Degree</h2>
          <p className="text-body max-w-2xl mx-auto">
            Everything you need to evaluate, compare, and shortlist institutions without marketing hype.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 transform-gpu"
            >
              <div className={`h-12 w-12 rounded-xl ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-5 shadow-2xs`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
