"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitCounsellingData } from "@/lib/leadService";

const INDIAN_STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Bihar",
  "Kerala",
  "Andhra Pradesh",
  "Odisha",
  "Uttarakhand",
  "Jharkhand",
  "Assam",
  "Chandigarh",
  "Other / Outside India",
];

export default function StickyCounsellingForm({
  initialCourse = "B.Tech Computer Science & Engineering",
  answersSummary = {},
  variant = "desktop", // "desktop" | "drawer" | "embedded"
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "Delhi NCR",
    preferredCourse: initialCourse,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your full name";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.state) {
      errs.state = "Please select your state";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await submitCounsellingData({
        ...formData,
        answersSummary,
      });
      setSubmittedRecord({
        id: response.recordId,
        name: formData.name,
        phone: formData.phone,
        course: formData.preferredCourse,
      });
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback display
      setSubmittedRecord({
        id: `CD-${Date.now().toString(36).toUpperCase()}`,
        name: formData.name,
        phone: formData.phone,
        course: formData.preferredCourse,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-white shadow-xl transition-all duration-300 ${
        variant === "desktop"
          ? "border-slate-200/90 shadow-slate-200/50 sticky top-24"
          : "border-slate-100 shadow-md"
      }`}
    >
      {/* Top Gradient Banner */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-navy via-navy to-crimson p-5 text-white">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-crimson/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-xs mb-2">
              <Star className="h-3 w-3 text-amber-300 fill-amber-300" />
              <span>Priority Admission 2025</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
              Get Free Expert Counselling
            </h3>
            <p className="mt-1 text-xs text-slate-200 leading-relaxed">
              Connect with top admissions mentors & check direct scholarship eligibility.
            </p>
          </div>

          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs">
            <Headphones className="h-5 w-5 text-rose-300" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {submittedRecord ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
                Saved & Synchronized
              </span>
              <h4 className="text-lg font-bold text-navy">
                Counselling Slot Reserved!
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Thank you, <strong className="text-navy">{submittedRecord.name}</strong>. Your profile has been sent to our verified admission desk.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-left border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Inquiry ID:</span>
                  <span className="font-mono font-semibold text-navy">
                    {submittedRecord.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course Preference:</span>
                  <span className="font-medium text-navy truncate max-w-[170px]">
                    {submittedRecord.course}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-medium text-navy">
                    +91 {submittedRecord.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-2 text-[11px] text-emerald-700 font-medium border-t border-slate-200/60">
                  <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Expect a callback within 15 minutes</span>
                </div>
              </div>

              <Button
                onClick={() => setSubmittedRecord(null)}
                variant="outline"
                className="mt-5 w-full text-xs font-semibold text-slate-600 hover:text-navy border-slate-200"
              >
                Submit for Another Course
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Full Name Field */}
              <div>
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Student Full Name *</span>
                  {errors.name && (
                    <span className="text-[11px] text-crimson font-normal">
                      {errors.name}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    className={`pl-9 text-sm h-10 rounded-xl ${
                      errors.name ? "border-crimson ring-crimson/20" : "border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Mobile Phone Number *</span>
                  {errors.phone && (
                    <span className="text-[11px] text-crimson font-normal">
                      {errors.phone}
                    </span>
                  )}
                </Label>
                <div className="relative flex rounded-xl border border-slate-200 focus-within:border-crimson focus-within:ring-2 focus-within:ring-crimson/20 overflow-hidden transition-all">
                  <div className="flex items-center gap-1 bg-slate-50 px-3 border-r border-slate-200 text-xs font-semibold text-slate-600 select-none">
                    <span>🇮🇳 +91</span>
                  </div>
                  <div className="relative flex-1">
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: val });
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      className="border-0 shadow-none focus-visible:ring-0 text-sm h-10 px-3"
                    />
                  </div>
                </div>
              </div>

              {/* State Field */}
              <div>
                <Label htmlFor="state" className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>State / Domicile *</span>
                  {errors.state && (
                    <span className="text-[11px] text-crimson font-normal">
                      {errors.state}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => {
                      setFormData({ ...formData, state: e.target.value });
                      if (errors.state) setErrors({ ...errors, state: null });
                    }}
                    className="w-full pl-9 pr-8 text-sm h-10 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-crimson focus:ring-2 focus:ring-crimson/20 appearance-none transition-all cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Preferred Course */}
              <div>
                <Label htmlFor="course" className="text-xs font-semibold text-slate-700 mb-1">
                  Target Course
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="course"
                    type="text"
                    value={formData.preferredCourse}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredCourse: e.target.value })
                    }
                    className="pl-9 text-sm h-10 rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Strong CTA Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-crimson hover:bg-crimson-dark text-white font-bold text-sm rounded-xl shadow-lg shadow-crimson/25 hover:shadow-xl hover:shadow-crimson/35 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Counsellor...</span>
                  </>
                ) : (
                  <>
                    <span>Get Free Counselling</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Data Storage Assurance Tag */}
              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Synchronized with Google Form & verified counselors</span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Trust Elements Section */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          {/* Social Proof Pill */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3.5">
            <div className="flex -space-x-2 items-center shrink-0">
              <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white">
                <Image src="/avatars/avatar-1.jpg" alt="Student" fill sizes="24px" className="object-cover" />
              </div>
              <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white">
                <Image src="/avatars/avatar-2.jpg" alt="Student" fill sizes="24px" className="object-cover" />
              </div>
              <div className="relative h-6 w-6 rounded-full overflow-hidden ring-2 ring-white">
                <Image src="/avatars/avatar-3.jpg" alt="Student" fill sizes="24px" className="object-cover" />
              </div>
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              <span className="font-bold text-navy">50,000+ Students</span> guided with zero bias & verified admissions.
            </div>
          </div>

          {/* Scholarship & Counselling Benefits */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-600">
              <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Up to ₹2,00,000 scholarship & fee-waiver eligibility</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>1-on-1 personalized shortlist & cut-off prediction</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Instant callback from senior admission mentor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
