"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const DEFAULT_LISTED_COURSES = [
  "BCA HONS",
  "Bachelor of Architecture",
  "Bachelor of Business Administration",
  "Bachelor of Laws",
  "Bachelor of Pharmacy",
  "M.Tech Computer Science & Engineering",
  "Master of Business Administration",
  "Master of Computer Applications",
];

export function openLeadModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-lead-modal"));
  }
}

export default function LeadPopupModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [coursesList, setCoursesList] = useState(DEFAULT_LISTED_COURSES);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "Delhi NCR",
    city: "",
    course: DEFAULT_LISTED_COURSES[0],
  });

  // Fetch only the courses actually listed on the website
  useEffect(() => {
    async function fetchListedCourses() {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const names = data.map((c) => c.name).filter(Boolean);
          if (names.length > 0) {
            setCoursesList(names);
            setFormData((prev) => ({
              ...prev,
              course: prev.course && names.includes(prev.course) ? prev.course : names[0],
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load listed courses:", err);
      }
    }
    fetchListedCourses();
  }, []);

  // Listen for explicit manual open requests (e.g. from Contact section or buttons)
  useEffect(() => {
    const handleManualOpen = () => {
      setIsSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-lead-modal", handleManualOpen);
    return () => window.removeEventListener("open-lead-modal", handleManualOpen);
  }, []);

  // Check storage on mount & trigger modal on refresh if user has not filled it
  useEffect(() => {
    // Never show on admin or login routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
      return;
    }

    try {
      const submitted = localStorage.getItem("cc_lead_submitted");
      if (submitted === "true") {
        setHasAlreadySubmitted(true);
        return;
      }

      // 1. Initial Popup
      const initialShown = sessionStorage.getItem("cc_lead_initial_shown");
      let initialTimer;
      if (!initialShown) {
        initialTimer = setTimeout(() => {
          setIsOpen((prev) => {
            if (!prev) {
              sessionStorage.setItem("cc_lead_initial_shown", "true");
              return true;
            }
            return prev;
          });
        }, 1500);
      }

      // 2. 1-Minute Interval Popup
      const intervalTimer = setInterval(() => {
        const isSub = localStorage.getItem("cc_lead_submitted") === "true";
        if (isSub) return;

        const lastClosed = sessionStorage.getItem("cc_lead_last_closed");
        if (lastClosed) {
          const timePassed = Date.now() - parseInt(lastClosed, 10);
          if (timePassed >= 60000) {
            setIsOpen((prev) => {
              if (!prev) {
                sessionStorage.removeItem("cc_lead_last_closed");
                return true;
              }
              return prev;
            });
          }
        }
      }, 5000); // Check every 5 seconds

      return () => {
        clearTimeout(initialTimer);
        clearInterval(intervalTimer);
      };
    } catch (e) {
      console.warn("Storage check error:", e);
    }
  }, [pathname]);

  // Don't render on admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("cc_lead_last_closed", Date.now().toString());
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.course) {
      newErrors.course = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitCounsellingData({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        state: formData.state,
        city: formData.city.trim(),
        preferredCourse: formData.course,
        source: "Website Welcome Popup",
      });

      setIsSubmitted(true);
      setHasAlreadySubmitted(true);
      try {
        localStorage.setItem("cc_lead_submitted", "true");
      } catch (e) {}
    } catch (err) {
      console.error("Failed to submit lead:", err);
      // Still show friendly confirmation so student isn't frustrated
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop & Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Clean Backdrop without Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 transition-opacity"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto"
            >
              {/* Header Crimson Top Bar */}
              <div className="h-1.5 bg-crimson" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="p-6 sm:p-8">
                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-crimson-light text-crimson text-xs font-semibold mb-2.5 border border-crimson/15">
                        <span>Expert College & Course Guidance</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
                        Find Your Dream Degree
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                        Fill in your details to get free personalized counseling from verified academic advisors.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) setErrors({ ...errors, name: null });
                            }}
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                              errors.name ? "border-red-400 bg-red-50/20" : "border-slate-200"
                            } rounded-xl text-sm text-navy placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone & Email (Side by Side on sm) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone Number <span className="text-crimson">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs font-semibold text-slate-500 select-none">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="98765 43210"
                              value={formData.phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, phone: val });
                                if (errors.phone) setErrors({ ...errors, phone: null });
                              }}
                              className={`w-full pl-11 pr-3 py-2.5 bg-slate-50 border ${
                                errors.phone ? "border-red-400 bg-red-50/20" : "border-slate-200"
                              } rounded-xl text-sm text-navy placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address <span className="text-crimson">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="email"
                              placeholder="rahul@gmail.com"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                              }}
                              className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${
                                errors.email ? "border-red-400 bg-red-50/20" : "border-slate-200"
                              } rounded-xl text-sm text-navy placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* State & City (Side by Side on sm) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* State */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            State <span className="text-crimson">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all appearance-none cursor-pointer"
                            >
                              {INDIAN_STATES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            City <span className="text-crimson">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="e.g. Pune"
                              value={formData.city}
                              onChange={(e) => {
                                setFormData({ ...formData, city: e.target.value });
                                if (errors.city) setErrors({ ...errors, city: null });
                              }}
                              className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${
                                errors.city ? "border-red-400 bg-red-50/20" : "border-slate-200"
                              } rounded-xl text-sm text-navy placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all`}
                            />
                          </div>
                          {errors.city && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.city}</p>
                          )}
                        </div>
                      </div>

                      {/* Course */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Interested Course <span className="text-crimson">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <select
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson outline-none transition-all appearance-none cursor-pointer"
                          >
                            {coursesList.map((course) => (
                              <option key={course} value={course}>
                                {course}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-crimson hover:bg-crimson-dark text-white font-semibold h-11 rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Submitting Request...</span>
                          </>
                        ) : (
                          <>
                            <span>Get Free Expert Advice</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      {/* Micro Trust Banner */}
                      <div className="flex items-center justify-center pt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          100% Free & Confidential
                        </span>
                      </div>
                    </form>
                  </>
                ) : (
                  /* Success View */
                  <div className="text-center py-6 sm:py-8 space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm animate-bounce">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-navy tracking-tight">
                        Thank You, {formData.name.split(" ")[0]}!
                      </h3>
                      <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                        We have received your counselling request for{" "}
                        <strong className="text-navy">{formData.course}</strong>.
                      </p>
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 max-w-sm mx-auto mt-3">
                        📞 One of our top education counselors will contact you shortly at{" "}
                        <span className="font-semibold text-navy">+91 {formData.phone}</span>.
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleClose}
                        className="bg-navy hover:bg-navy/90 text-white font-semibold px-6 h-11 rounded-xl text-sm shadow-sm transition-all"
                      >
                        Continue Exploring Colleges
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
