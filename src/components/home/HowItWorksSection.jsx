"use client";

import { motion } from "framer-motion";
import { Search, BarChart3, GraduationCap } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

const defaultSteps = [
  {
    number: "01",
    title: "Search",
    description:
      "Find any college or course from our database of 500+ institutions across India.",
    icon: Search,
  },
  {
    number: "02",
    title: "Compare",
    description:
      "Place colleges side by side and compare fees, placements, rankings, and facilities.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Decide",
    description:
      "Make a confident, data-driven decision about your higher education journey.",
    icon: GraduationCap,
  },
];

export default function HowItWorksSection({ steps = defaultSteps }) {
  return (
    <SectionWrapper className="section-padding bg-slate-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-3">How It Works</h2>
          <p className="text-body max-w-xl mx-auto">
            Three simple steps to find and compare the right college for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
              className="text-center transform-gpu"
            >
              <div className="relative inline-flex mb-5">
                <div className="h-14 w-14 rounded-2xl bg-crimson/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-crimson" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-crimson text-white text-xs font-bold flex items-center justify-center">
                  {step.number.replace("0", "")}
                </span>
              </div>
              <h3 className="text-base font-semibold text-navy mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
