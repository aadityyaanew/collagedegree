"use client";

import { motion } from "framer-motion";
import { Headphones, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { openLeadModal } from "@/components/shared/LeadPopupModal";

export default function ContactSection() {
  return (
    <SectionWrapper id="contact" className="section-padding bg-white border-t border-slate-200/80 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="max-w-3xl mx-auto bg-crimson-50/50 rounded-2xl sm:rounded-3xl border-2 border-crimson/20 p-8 sm:p-12 text-center relative"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-crimson-light text-crimson text-xs font-semibold mb-4 border border-crimson/15">
            <Headphones className="h-3.5 w-3.5" />
            <span>100% Free 1-on-1 Counselling</span>
          </div>

          {/* Heading */}
          <h2 className="heading-2 mb-3">Talk to an Education Advisor</h2>

          {/* Description */}
          <p className="text-body max-w-xl mx-auto mb-8">
            Need help comparing colleges, understanding fee structures, or choosing the right degree? Submit your details to get a personalized callback from our senior counselor.
          </p>

          {/* Action Button that opens Lead Form */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={openLeadModal}
              className="inline-flex items-center justify-center gap-2.5 px-8 h-12 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-semibold text-sm sm:text-base shadow-xs transition-all active:scale-98 cursor-pointer w-full sm:w-auto"
            >
              <span>Book Free Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
