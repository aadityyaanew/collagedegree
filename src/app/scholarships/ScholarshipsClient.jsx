"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, ShieldCheck, Trophy, Landmark } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ScholarshipsClient() {
  const scholarships = [
    {
      title: "Need-Based Aid",
      description: "Financial support designed for students from economically weaker sections to ensure money is not a barrier to quality education.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Merit Excellence",
      description: "Rewarding outstanding academic achievements. Top performers can avail up to 30% tuition fee waivers based on their scores.",
      icon: Trophy,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      title: "Diversity & Inclusion",
      description: "Special grants to promote inclusivity, empowering women and underrepresented communities in higher education globally.",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      title: "Sports Quota",
      description: "Dedicated scholarships for national and state-level athletes to effectively balance their sports career with academics.",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    }
  ];

  return (
    <div className="flex-1 w-full bg-slate-50 pt-safe pb-mobile-dock lg:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white radial-glow-hero border-b border-slate-100">
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="container-main relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="flex flex-col items-center justify-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-crimson-light text-crimson text-xs font-semibold mb-5 border border-crimson/10 shadow-sm">
                <Landmark className="h-4 w-4" />
                <span>Financial Aid & Grants</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-navy leading-[1.14] mb-5">
              Empowering Your <br className="md:hidden" />
              <span className="gradient-text-crimson">Educational Journey</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-8">
              Unlock your potential with our comprehensive scholarships and need-based grants designed to support your career aspirations without the financial stress.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Scholarships Section */}
      <section className="section-padding bg-slate-50 relative">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-3">Available Scholarships</h2>
            <p className="text-body max-w-2xl mx-auto">
              We believe education should be accessible to everyone. Explore our diverse range of scholarship programs tailored for excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {scholarships.map((scholarship, i) => (
              <motion.div
                key={scholarship.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 transform-gpu flex flex-col h-full"
              >
                <div className={`h-12 w-12 rounded-xl ${scholarship.bgColor} ${scholarship.borderColor} border flex items-center justify-center mb-5 shadow-2xs`}>
                  <scholarship.icon className={`h-6 w-6 ${scholarship.color}`} />
                </div>
                <h3 className="text-base font-bold text-navy mb-2">
                  {scholarship.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                  {scholarship.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
