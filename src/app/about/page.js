import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Target, Award, Users } from "lucide-react";
import { getBreadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "About Us — Empowering Students to Choose the Right Degree",
  description:
    "Learn about Compare Degree, India's trusted platform for discovering, comparing, and enrolling in accredited colleges and online universities with unbiased data and free counselling.",
  keywords: [
    "about compare degree",
    "higher education comparison India",
    "online university admissions",
    "unbiased college data",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Compare Degree — Smart Decisions, Brighter Futures",
    description:
      "Learn about our mission to simplify higher education decisions through verified data and free personalized counselling.",
    url: `${SITE_URL}/about`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "About Compare Degree",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Compare Degree",
    description: "Our mission to empower students with verified college comparisons.",
    images: ["/heroimg.jpeg"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <div className="bg-navy text-white pt-12 sm:pt-24 pb-12 sm:pb-16">
          <div className="container-main">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                Empowering Students to Make the Right Choice
              </h1>
              <p className="text-sm sm:text-lg text-slate-300">
                Compare Degree is India&apos;s leading platform for discovering, comparing, and enrolling in top online universities. We bridge the gap between ambition and opportunity.
              </p>
            </div>
          </div>
        </div>

        <div className="container-main py-10 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3 sm:mb-4">Our Mission</h2>
              <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 leading-relaxed">
                Navigating the world of higher education can be overwhelming. With hundreds of universities offering thousands of online courses, students often struggle to find the right fit for their career goals, budget, and lifestyle.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Our mission is to simplify this process. By providing transparent data on fees, placements, and approvals, along with expert counselling, we ensure every student makes a confident and informed decision about their future.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <Target className="h-7 w-7 sm:h-8 sm:w-8 text-crimson mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-1 sm:mb-2">Unbiased Data</h3>
                <p className="text-xs sm:text-sm text-slate-500">100% verified and transparent college data.</p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs mt-0 sm:mt-8">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-crimson mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-1 sm:mb-2">Expert Advice</h3>
                <p className="text-xs sm:text-sm text-slate-500">Free counselling from education experts.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 md:p-12 shadow-2xs text-center">
            <Award className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-navy mb-4">Why Choose Us?</h2>
            <div className="grid sm:grid-cols-3 gap-8 mt-10 text-left">
              {[
                "Comprehensive database of 100+ approved online universities.",
                "AI-powered Course Advisor to match your exact career goals.",
                "Zero hidden fees. Our counselling and platform are completely free.",
              ].map((text, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
