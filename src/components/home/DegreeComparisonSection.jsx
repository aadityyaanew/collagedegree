"use client";

import { Check, X, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function DegreeComparisonSection() {
  const features = [
    { name: "UGC / AICTE Recognition", online: true, distance: true, regular: true },
    { name: "Flexible Learning", online: true, distance: true, regular: false },
    { name: "Live + Recorded Classes", online: true, distance: false, regular: false },
    { name: "Work While Studying", online: true, distance: true, regular: false },
    { name: "Placement Support", online: true, distance: false, regular: true },
    { name: "Industry Relevant Curriculum", online: true, distance: false, regular: true },
    { name: "Global Exposure", online: true, distance: false, regular: true },
    { name: "Cost Effective", online: true, distance: true, regular: false },
  ];

  return (
    <SectionWrapper className="section-padding bg-slate-50/50 relative">
      <div className="container-main">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-crimson/10 text-crimson text-xs font-semibold mb-3 border border-crimson/10">
            <GraduationCap className="h-4 w-4" />
            <span>Format Comparison</span>
          </div>
          <h2 className="heading-2 mb-3">
            <span className="text-crimson">Online</span> vs Distance vs Regular Degree
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Evaluate your options and see how an <span className="font-semibold text-navy">Online Degree</span> provides the perfect balance of flexibility and career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Online Degree (Recommended) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white border-2 border-crimson/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-crimson/5 flex flex-col z-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-crimson text-white text-[11px] font-bold py-1.5 px-6 rounded-full tracking-wide uppercase shadow-md whitespace-nowrap">
              Most Popular
            </div>
            
            <div className="text-center mb-8 h-16 flex flex-col justify-end">
              <h3 className="text-2xl font-extrabold text-navy">Online Degree</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Best for modern learners</p>
            </div>
            
            <ul className="space-y-0.5 flex-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 group">
                  <span className="text-sm font-semibold text-navy group-hover:text-crimson transition-colors">{f.name}</span>
                  <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 ml-3 shrink-0">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Distance Degree */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col"
          >
            <div className="text-center mb-8 h-16 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-slate-700">Distance Degree</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">For self-paced study</p>
            </div>
            
            <ul className="space-y-0.5 flex-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600 font-medium">{f.name}</span>
                  {f.distance ? (
                    <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 ml-3 shrink-0">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-500 rounded-full p-1 ml-3 shrink-0">
                      <X className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Regular Degree */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col"
          >
            <div className="text-center mb-8 h-16 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-slate-700">Regular Degree</h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Traditional campus</p>
            </div>
            
            <ul className="space-y-0.5 flex-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600 font-medium">{f.name}</span>
                  {f.regular ? (
                    <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 ml-3 shrink-0">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-500 rounded-full p-1 ml-3 shrink-0">
                      <X className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
