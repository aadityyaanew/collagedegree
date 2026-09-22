"use client";

import { useEffect, useState } from "react";
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

const BubblingBackground = () => {
  const [bubbles, setBubbles] = useState([]);
  
  useEffect(() => {
    const newBubbles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
      xOffset: Math.random() * 60 - 30
    }));
    setBubbles(newBubbles);
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bg-white/40 rounded-full blur-[0.5px]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            bottom: -50,
          }}
          animate={{
            y: [0, -800],
            x: [0, b.xOffset, 0, -b.xOffset, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "linear",
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE LAYOUT (< lg)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="lg:hidden relative overflow-hidden bg-[#F7F7F7] border-b border-slate-100 z-10">

        {/* ── Part 1: Hero Image (Complete Picture for Mobile) ── */}
        <div className="relative w-full aspect-[1363/1154] overflow-hidden">
          {/* Background image */}
          <Image
            src="/heromobilenew.jpeg"
            alt="Compare Degrees - Choose Your Future"
            fill
            priority
            sizes="100vw"
            className="object-contain object-top"
          />
          <BubblingBackground />
        </div>

        <h1 className="sr-only">
          Compare Degrees, Colleges & Online Universities in India — Choose Your Future
        </h1>

        {/* ── Part 2: Search + Booking Widget (card) ── */}
        <div className="bg-[#F7F7F7] px-4 pt-1 pb-5 relative z-20">
          {/* Search Bar with Colleges / Courses tabs */}
          <div className="mb-4">
            <SearchBar variant="hero" />
          </div>

          {/* Booking widget — inline, no card border on mobile */}
          <HeroBookingWidget mobileInline />

          {/* Guide me link */}
          <Link
            href="/course-finder"
            className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-crimson transition-colors touch-manipulation py-1"
          >
            <Compass className="h-4 w-4 text-crimson shrink-0" />
            <span>Guide me for course and college</span>
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DESKTOP LAYOUT (lg+)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hidden lg:block relative overflow-visible bg-[#F7F7F7] border-b border-slate-100 z-10">
        {/* Hero Central Image */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
          <Image
            src="/heroimg.jpeg"
            alt="Student and University Background"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center opacity-100"
          />
          <BubblingBackground />
        </div>

        <div className="container-main relative pt-16 pb-14 z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="lg:col-span-6 flex flex-col justify-center min-w-0 w-full relative z-10"
            >
              {/* Social Proof Pill */}
              <motion.div variants={fadeUp} custom={0} className="mb-4">
                <div className="inline-flex max-w-full items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-sm backdrop-blur-sm">
                  <div className="flex -space-x-2 items-center shrink-0">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                        <Image src={`/avatars/avatar-${n}.jpg`} alt="Student" fill sizes="24px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 truncate">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-semibold text-navy shrink-0">4.9/5</span>
                    <span className="text-slate-400 shrink-0">·</span>
                    <span className="text-slate-600 font-medium truncate">50,000+ Students</span>
                  </div>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-[54px] font-bold tracking-tight text-navy leading-[1.14] mb-5"
              >
                Compare Degrees.
                <br />
                <span className="gradient-text-crimson">Choose Your Future.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p variants={fadeUp} custom={2} className="text-[17px] text-slate-700 font-medium leading-relaxed mb-6 max-w-[480px]">
                Unbiased side-by-side comparisons of fees, verified placements, NIRF rankings, and ROI for top colleges across India. Stop guessing, start deciding.
              </motion.p>

              {/* Search */}
              <motion.div variants={fadeUp} custom={3} className="mb-6 max-w-xl">
                <SearchBar variant="hero" />
              </motion.div>

              {/* Buttons */}
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-3">
                <Button
                  asChild
                  className="bg-crimson hover:bg-crimson-dark text-white font-bold px-6 h-11 text-sm rounded-xl shadow-md shadow-crimson/20 transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-98"
                >
                  <Link href="/course-finder">
                    <Compass className="mr-2 h-4 w-4 shrink-0" />
                    <span>Guide me for course and college</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="font-semibold px-5 h-11 text-sm rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs active:scale-98"
                >
                  <Link href="/compare">Compare Colleges</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Booking Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
              className="lg:col-span-4 lg:col-start-9 relative overflow-hidden w-full max-w-full rounded-[2rem] transform-gpu z-10"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-2xl pointer-events-none -z-10 transform-gpu" />
              <HeroBookingWidget />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
