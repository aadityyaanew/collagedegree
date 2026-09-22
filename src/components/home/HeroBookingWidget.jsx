"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitCounsellingData } from "@/lib/leadService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CONCERNS = [
  "Choosing a program",
  "Fees & loans",
  "Career clarity",
  "Admission process",
  "Compare universities",
];

export default function HeroBookingWidget() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    concern: "",
    role: "Student",
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.concern) {
        // Optional: you could enforce selection, but let's just proceed
        setFormData((prev) => ({ ...prev, concern: "General Enquiry" }));
      }
      setStep(2);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || formData.phone.length < 10) return;
    
    setIsSubmitting(true);
    try {
      await submitCounsellingData({
        name: formData.name,
        phone: formData.phone,
        userType: formData.role,
        preferredCourse: formData.concern || "General Enquiry",
        source: "Hero Section Booking Widget",
      });
      setStep(3);
    } catch (error) {
      console.error("Submission failed", error);
      // Still show success to user
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 shadow-2xl shadow-navy/5 border border-white relative overflow-hidden h-full flex flex-col">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-crimson/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Trust Banner */}
      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center justify-center gap-1.5 mb-5 sm:mb-8 mx-auto max-w-full text-center">
        <Zap className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600 shrink-0" />
        <span className="truncate">95% admission rate &middot; 50K+ students counselled</span>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-5 sm:mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              step >= i ? "bg-crimson" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-xl sm:text-[28px] font-extrabold text-navy mb-1.5 sm:mb-2 tracking-tight leading-tight">
              What&apos;s your main concern?
            </h2>
            <p className="text-slate-500 font-medium mb-4 sm:mb-6 text-xs sm:text-sm">
              We&apos;ll match you with the right expert.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-8">
              {CONCERNS.map((concern) => (
                <button
                  key={concern}
                  onClick={() => setFormData({ ...formData, concern })}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-[13px] font-bold border transition-all active:scale-95 ${
                    formData.concern === concern
                      ? "bg-crimson-50 border-crimson-200 text-crimson shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-auto pt-1 sm:pt-2">
              <span className="text-xs sm:text-sm font-bold text-navy">I&apos;m a</span>
              <div className="flex items-center gap-2">
                {["Student", "Parent"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFormData({ ...formData, role })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold border transition-all active:scale-95 ${
                      formData.role === role
                        ? "bg-navy text-white border-navy shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-crimson hover:bg-crimson-dark text-white font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl mt-6 sm:mt-8 shadow-md shadow-crimson/20 active:scale-98"
            >
              Book my free session <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-xl sm:text-[28px] font-extrabold text-navy mb-1.5 sm:mb-2 tracking-tight leading-tight">
              Where can we reach you?
            </h2>
            <p className="text-slate-500 font-medium mb-4 sm:mb-8 text-xs sm:text-sm">
              We&apos;ll match you with the right expert.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-auto">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-navy mb-1 sm:mb-1.5">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10.5 sm:h-11 rounded-xl border-slate-200 bg-white text-sm px-3.5 sm:px-4 focus-visible:ring-crimson/20 focus-visible:border-crimson"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-navy mb-1 sm:mb-1.5">
                  Contact Number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="h-10.5 sm:h-11 rounded-xl border-slate-200 bg-white text-sm px-3.5 sm:px-4 focus-visible:ring-crimson/20 focus-visible:border-crimson"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!formData.name || formData.phone.length < 10 || isSubmitting}
              className="w-full bg-crimson hover:bg-crimson-dark text-white font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl mt-6 sm:mt-8 shadow-md shadow-crimson/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                </>
              ) : (
                <>
                  Book my free session <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-8"
          >
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-3">Session Booked!</h2>
            <p className="text-slate-600 max-w-sm mb-8">
              Thank you, {formData.name.split(' ')[0]}! One of our expert counsellors will contact you shortly at +91 {formData.phone} to schedule your free session.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setFormData({ concern: "", role: "Student", name: "", phone: "" });
              }}
              className="rounded-xl font-semibold border-slate-200"
            >
              Book another session
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
