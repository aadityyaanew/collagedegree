"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseFinderWizard from "@/components/course-finder/CourseFinderWizard";
import RecommendationsView from "@/components/course-finder/RecommendationsView";
import { getPersonalizedRecommendations } from "@/lib/recommendations";
import { Target, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

export default function CourseFinderPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);
  const [dbColleges, setDbColleges] = useState([]);

  useEffect(() => {
    fetch("/api/courses", { cache: "no-store" }).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setDbCourses(data);
    }).catch(console.error);
    fetch("/api/colleges", { cache: "no-store" }).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setDbColleges(data);
    }).catch(console.error);
  }, []);

  const handleWizardComplete = (answers) => {
    setUserAnswers(answers);
    const results = getPersonalizedRecommendations(answers, dbCourses, dbColleges);
    setRecommendations(results);
    // Smooth scroll up to top of results
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRetake = () => {
    setRecommendations(null);
    setUserAnswers(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/70">
        {/* Header Hero Bar */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200/80 py-10 sm:py-14">
          <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-50 border border-crimson-100 text-xs font-semibold text-crimson mb-4">
              <Target className="h-3.5 w-3.5" />
              <span>Smart AI-Assisted College & Course Matching</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight mb-3">
              {recommendations ? (
                <>
                  Your Personalized{" "}
                  <span className="gradient-text-crimson">Recommendations</span>
                </>
              ) : (
                <>
                  Find Your Ideal Degree.{" "}
                  <span className="gradient-text-crimson">Backed by Real Data.</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {recommendations
                ? "Based on your academic stream, interests, and career ambitions, here are the top matched courses and verified colleges for 2025."
                : "Answer 6 quick questions about your education, interests, career ambitions, and study preferences to unlock verified college shortlists."}
            </p>

            {/* Social Proof Strip */}
            {!recommendations && (
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Free & Transparent</span>
                </div>
                <span className="text-slate-300">&bull;</span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-navy">4.9/5 Rating</span>
                  <span>(50,000+ Students)</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Content Container */}
        <section className="container-main py-10 sm:py-12">
          {recommendations ? (
            <RecommendationsView
              recommendations={recommendations}
              answers={userAnswers}
              onRetake={handleRetake}
            />
          ) : (
            <CourseFinderWizard onComplete={handleWizardComplete} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
