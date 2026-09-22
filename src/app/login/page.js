"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/course-finder");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-crimson-50 border border-crimson-100 flex items-center justify-center text-crimson">
            <Compass className="h-8 w-8 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <Target className="h-3.5 w-3.5" />
            <span>100% Free Access &bull; No Login Required</span>
          </div>

          <h1 className="text-2xl font-bold text-navy">
            Welcome to Course Advisor!
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed">
            We removed passwords and sign-ups. You can now directly find your ideal course and colleges with our interactive questionnaire.
          </p>

          <Button
            asChild
            className="w-full h-11 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl shadow-md shadow-crimson/20"
          >
            <Link href="/course-finder">
              <span>Go to Course Advisor</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
