"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-crimson-dark via-crimson to-navy-dark text-white py-16 sm:py-20 lg:py-24">
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern-light opacity-10 pointer-events-none" />

      <div className="container-main relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white mb-6 backdrop-blur-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Join 50,000+ Students Making Smarter Decisions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            Ready to find your ideal college and course?
          </h2>

          <p className="text-crimson-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop relying on hearsay. Get transparent placement stats, true tuition breakdowns, and verified alumni reviews side-by-side in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
            <Button
              asChild
              className="bg-white text-crimson hover:bg-slate-100 font-bold px-7 h-12 text-sm sm:text-base rounded-xl shadow-lg shadow-black/15 transition-all hover:shadow-xl touch-manipulation"
            >
              <Link href="/course-finder">
                Try Course Advisor Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-6 h-12 text-sm sm:text-base rounded-xl backdrop-blur-xs touch-manipulation"
            >
              <Link href="/colleges">
                <Building2 className="mr-2 h-4 w-4" />
                Browse 500+ Colleges
              </Link>
            </Button>
          </div>

          {/* Value Proof */}
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-crimson-100/90 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              No signup required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              100% Free & Neutral Data
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              NIRF & Placement Audited
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
