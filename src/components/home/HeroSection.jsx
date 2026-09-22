"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/SearchBar";
import HeroBookingWidget from "./HeroBookingWidget";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};
export default function HeroSection() {

  return (
    <section className="relative overflow-visible bg-white radial-glow-hero border-b border-slate-100 z-10">
      {/* Majestic University Building Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
        <Image
          src="/hero-campus-dome.jpg"
          alt="University Architecture Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-[center_28%] opacity-100 transition-opacity"
        />

        {/* Soft atmospheric radial & directional gradient overlays for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent lg:from-white/95 lg:via-white/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* Subtle Dot Pattern Overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

      <div className="container-main relative pt-6 pb-10 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-14">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">
          {/* Left: Copy (7 cols on lg) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="lg:col-span-7 flex flex-col justify-center min-w-0 w-full"
          >
            {/* Social Proof Pill with Real Avatars */}
            <motion.div variants={fadeUp} custom={0} className="mb-3 sm:mb-4">
              <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-sm backdrop-blur-sm">
                <div className="flex -space-x-2 items-center shrink-0">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <Image src="/avatars/avatar-1.jpg" alt="Student" fill sizes="24px" className="object-cover" />
                  </div>
                  <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <Image src="/avatars/avatar-2.jpg" alt="Student" fill sizes="24px" className="object-cover" />
                  </div>
                  <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <Image src="/avatars/avatar-3.jpg" alt="Student" fill sizes="24px" className="object-cover" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 truncate">
                  <div className="flex text-amber-400 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                  </div>
                  <span className="font-semibold text-navy shrink-0">4.9/5</span>
                  <span className="text-slate-400 shrink-0">&middot;</span>
                  <span className="text-slate-600 font-medium truncate">50,000+ Students</span>
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-navy leading-[1.14] mb-3 sm:mb-5"
            >
              Compare Degrees.
              <br />
              <span className="gradient-text-crimson">Choose Your Future.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-5 sm:mb-6 max-w-xl"
            >
              Unbiased side-by-side comparisons of <strong className="text-navy font-semibold">fees, verified placements, NIRF rankings, and ROI</strong> for top colleges across India. Stop guessing, start deciding.
            </motion.p>

            {/* Command-Bar Search */}
            <motion.div variants={fadeUp} custom={3} className="mb-5 sm:mb-6 max-w-xl">
              <SearchBar variant="hero" />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
            >
              <Button
                asChild
                className="bg-crimson hover:bg-crimson-dark text-white font-bold px-6 h-11 text-sm rounded-xl shadow-md shadow-crimson/20 transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-98 text-center justify-center"
              >
                <Link href="/course-finder">
                  <Compass className="mr-2 h-4 w-4 shrink-0" />
                  <span>Guide me for course and collage</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="font-semibold px-5 h-11 text-sm rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs active:scale-98 text-center justify-center"
              >
                <Link href="/compare">Compare Colleges</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Interactive Live Comparison Widget (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
            className="lg:col-span-5 relative overflow-hidden w-full max-w-full rounded-2xl sm:rounded-[2rem] transform-gpu mt-2 lg:mt-0"
          >
            {/* Ambient Lighting Gradients behind widget */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />

            <div className="h-full">
              <HeroBookingWidget />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
