"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Users, Activity, ArrowRight, ShieldCheck, Trophy, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function RewardsClient() {
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
      description: "Rewarding outstanding academic achievements. Top performers can avail up to 100% tuition fee waivers based on their scores.",
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
              Unlock your potential with our comprehensive scholarships, need-based grants, and exciting referral rewards designed to support your career aspirations without the financial stress.
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

      {/* Referral Section */}
      <section className="section-padding bg-white relative border-t border-slate-100 overflow-hidden">
        {/* Ambient Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none -z-10 transform-gpu translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10 transform-gpu -translate-x-1/3 translate-y-1/3" />

        <div className="container-main relative">
          <div className="bg-white border border-slate-200/80 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="absolute inset-0 bg-dot-pattern opacity-30" />

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-8 sm:p-12 lg:p-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold mb-6 border border-emerald-100">
                  <Target className="h-4 w-4" />
                  <span>Refer & Earn</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-5 leading-[1.15]">
                  Refer friends and earn <br />
                  <span className="text-emerald-500">up to ₹25,000</span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                  Help your friends find the best colleges and get rewarded for every successful admission through your referral link. Plus, unlock special campus perks!
                </p>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 border border-emerald-100">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Cash rewards directly to your bank account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 border border-blue-100">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Free career counselling sessions for both</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 mt-0.5 border border-purple-100">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-700 text-sm sm:text-base">Exclusive internship & placement opportunities</span>
                  </li>
                </ul>

                <Button asChild className="bg-crimson hover:bg-crimson-dark text-white font-bold px-8 h-12 rounded-xl text-base shadow-md shadow-crimson/20 transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-98">
                  <Link href="#">
                    Start Referring Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/60 to-blue-50/60 blur-3xl transform translate-x-5 translate-y-5 rounded-full" />
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl relative shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-navy mb-6 text-center">How It Works</h3>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-crimson-50 text-crimson border border-crimson-100 flex items-center justify-center font-bold shrink-0 text-base shadow-sm">1</div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-navy mb-1">Share your link</h4>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">Send your unique referral link or code to friends seeking college admissions.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-crimson-50 text-crimson border border-crimson-100 flex items-center justify-center font-bold shrink-0 text-base shadow-sm">2</div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-navy mb-1">Friend takes admission</h4>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">They get expert counselling, find their match, and secure their seat.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-crimson-50 text-crimson border border-crimson-100 flex items-center justify-center font-bold shrink-0 text-base shadow-sm">3</div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-navy mb-1">Get Rewarded</h4>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">Earn your reward instantly upon their successful fee payment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
