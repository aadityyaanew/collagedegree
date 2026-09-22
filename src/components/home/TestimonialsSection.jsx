"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import TestimonialCard from "@/components/shared/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection({
  testimonialList = testimonials,
}) {
  return (
    <SectionWrapper className="section-padding bg-slate-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-3">What Students Say</h2>
          <p className="text-body max-w-xl mx-auto">
            Thousands of students have used Compare Degree to make smarter
            decisions.
          </p>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative overflow-hidden w-full flex items-center pt-2 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* Fading Edges for smooth entry/exit */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          
          <div 
            className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 sm:gap-6 px-2"
            style={{ animationDirection: "reverse" }} /* Reverses to move Left to Right as requested */
          >
            {/* Duplicated list for seamless infinite loop (must be exactly 2 sets for -50% translation) */}
            {[...testimonialList, ...testimonialList].map((t, i) => (
              <div key={`${t.id}-${i}`} className="w-[280px] sm:w-[350px] shrink-0 transform-gpu">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
