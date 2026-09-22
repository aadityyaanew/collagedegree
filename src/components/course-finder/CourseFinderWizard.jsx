"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Compass,
  Briefcase,
  Layers,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Target,
  CheckCircle2,
  Cpu,
  TrendingUp,
  HeartPulse,
  Palette,
  Scale,
  DollarSign,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitCounsellingData } from "@/lib/leadService";

export const EDUCATION_MAP = {
  "12th": "12th Standard (Appearing / Passed)",
  "graduate": "Bachelor's Degree (Graduate)",
  "diploma": "Diploma / Polytechnic",
  "10th": "10th Standard / Matriculation",
};

export const STREAM_MAP = {
  "pcm": "Science (PCM) - Physics, Chemistry, Maths",
  "pcb": "Science (PCB) - Physics, Chemistry, Biology",
  "commerce": "Commerce - Accounts, Economics, Business",
  "arts": "Arts / Humanities - Social Sciences, Languages",
  "vocational": "Vocational / Others - Applied technical courses",
};

export const PERCENTAGE_MAP = {
  "85_plus": "85% & Above (Top Tier)",
  "70_85": "70% - 85% (Competitive)",
  "55_70": "55% - 70% (Moderate)",
  "below_55": "Under 55% (Skill Driven)",
};

export const INTERESTS_MAP = {
  "tech": "Doctorate and Executive Programs (DBA, EMBA, PGDM, Global MBA)",
  "management": "Management & Business (BBA, MBA, Marketing, Finance)",
  "healthcare": "Hospitality & Healthcare (Hospitality and Healthcare Management)",
  "design": "Arts & Research (BA, MA, BSC, MSC)",
  "law": "Banking & Commerce (B.Com, M.Com, Finance, Banking, Accounting)",
  "analytics": "AI, Data & Computer Applications (Data Science, BCA/MCA, AI, Cloud)",
};

export const CAREER_GOALS_MAP = {
  "high_salary": "High-Paying Tech / Corporate Job (₹12 - ₹30+ LPA)",
  "leadership": "Corporate Leadership & Product Management",
  "research": "Higher Studies & Global Research (MS/M.Tech/Ph.D)",
  "startup": "Entrepreneurship & Building a Startup",
  "govt": "Government Services / PSUs & Civil Exams",
};

export const COURSES_MAP = {
  "all": "Auto-Recommend for Me",
  "ba": "BA",
  "bcom": "B.COM",
  "bba": "BBA",
  "bca": "BCA",
  "ba-hons": "BA (Hons)",
  "bcom-hons": "B.COM (Hons)",
  "bba-hons": "BBA (Hons)",
  "bsc": "BSC",
  "ma": "MA",
  "mcom": "M.COM",
  "mba": "MBA",
  "mca": "MCA",
  "msc-ds": "MSC Data Science",
  "msc-math": "MSC Mathematics",
  "dba": "DBA",
  "exec-prog": "Executive Programs",
  "cert-dip": "Certificate & Diploma",
};

export const WORKING_STATUS_MAP = {
  "student": "Student (Currently pursuing a degree)",
  "working_professional": "Working Professional (Currently employed)",
  "unemployed": "Unemployed (Looking for job opportunities)",
  "self_employed": "Self Employed (Business owner / Freelancer)",
};

export const BUDGET_MAP = {
  "budget_low": "Budget Friendly (< ₹2L / Year)",
  "budget_mid": "Mid-Range (₹2L - ₹4L / Year)",
  "scholarship": "For Working Professionals (Weekend / Evening Batches)",
  "flexible": "Flexible Budget / ROI Focused",
};

const STEPS = [
  { id: "education", title: "Education & Qualification", subtitle: "Your current academic background" },
  { id: "stream", title: "Stream & Performance", subtitle: "Subjects and score bracket" },
  { id: "interests", title: "Fields of Interest", subtitle: "What you enjoy learning and building" },
  { id: "career", title: "Career Ambition", subtitle: "Your primary goal after graduation" },
  { id: "course", title: "Preferred Course", subtitle: "Target degree or let us recommend" },
  { id: "preferences", title: "Working Status & Budget", subtitle: "Your current status and financial preferences" },
  { id: "counselling", title: "Get Free Expert Counselling", subtitle: "Fill this form to unlock your personalized recommendations" },
];

export default function CourseFinderWizard({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form State
  const [answers, setAnswers] = useState({
    education: "12th",
    percentage: "85_plus",
    stream: "pcm",
    interests: ["tech"],
    careerGoals: ["high_salary"],
    preferredCourseId: "all",
    region: "all",
    budget: "flexible",
    workingStatus: "student",
    name: "",
    phone: "",
    email: "",
  });

  const currentStep = STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  const handleNext = async () => {
    if (currentStepIndex === 6) {
      if (!answers.name || !answers.phone || !answers.email) {
        alert("Please fill in all the details to continue.");
        return;
      }
      setIsAnalyzing(true);
      try {
        const selectedEducation = EDUCATION_MAP[answers.education] || answers.education;
        const selectedStream = STREAM_MAP[answers.stream] || answers.stream;
        const selectedPercentage = PERCENTAGE_MAP[answers.percentage] || answers.percentage;
        const selectedInterests = (answers.interests || []).map((id) => INTERESTS_MAP[id] || id);
        const selectedCareerGoals = (answers.careerGoals || []).map((id) => CAREER_GOALS_MAP[id] || id);
        const selectedCourse = COURSES_MAP[answers.preferredCourseId] || answers.preferredCourseId || "Auto-Recommend for Me";
        const selectedWorkingStatus = WORKING_STATUS_MAP[answers.workingStatus] || answers.workingStatus || "Student";
        const selectedBudget = BUDGET_MAP[answers.budget] || answers.budget;

        const stepDetails = [
          {
            step: 1,
            title: "Education & Qualification",
            question: "What is your current or highest qualification?",
            answer: selectedEducation,
            raw: answers.education,
          },
          {
            step: 2,
            title: "Stream & Performance",
            question: "Which academic stream did you study and expected score?",
            answer: `${selectedStream} • Score: ${selectedPercentage}`,
            stream: selectedStream,
            percentage: selectedPercentage,
            raw: { stream: answers.stream, percentage: answers.percentage },
          },
          {
            step: 3,
            title: "Fields of Interest",
            question: "Select your field(s) of interest",
            answer: selectedInterests.join(", "),
            interests: selectedInterests,
            raw: answers.interests,
          },
          {
            step: 4,
            title: "Career Ambition",
            question: "What is your primary career goal after graduation?",
            answer: selectedCareerGoals.join(", "),
            careerGoals: selectedCareerGoals,
            raw: answers.careerGoals,
          },
          {
            step: 5,
            title: "Preferred Course",
            question: "Do you have a specific course in mind?",
            answer: selectedCourse,
            raw: answers.preferredCourseId,
          },
          {
            step: 6,
            title: "Working Status & Budget",
            question: "Your current status and financial preferences",
            answer: `Status: ${selectedWorkingStatus} • Budget: ${selectedBudget}`,
            workingStatus: selectedWorkingStatus,
            budget: selectedBudget,
            raw: { workingStatus: answers.workingStatus, budget: answers.budget },
          },
          {
            step: 7,
            title: "Lead Contact Information",
            question: "Student Details for Counselling",
            answer: `Name: ${answers.name.trim()} • Phone: ${answers.phone.trim()} • Email: ${answers.email.trim().toLowerCase()}`,
            name: answers.name.trim(),
            phone: answers.phone.trim(),
            email: answers.email.trim().toLowerCase(),
          },
        ];

        const summaryText = `${selectedEducation} • ${selectedStream.split(" - ")[0]} (${answers.percentage === "85_plus" ? "85%+" : answers.percentage}) • Preferred: ${selectedCourse} • ${selectedWorkingStatus.split(" (")[0]} • ${selectedBudget.split(" (")[0]}`;

        await submitCounsellingData({
          name: answers.name.trim(),
          phone: answers.phone.trim(),
          email: answers.email.trim().toLowerCase(),
          preferredCourse: selectedCourse,
          source: "Course Advisor Wizard",
          education: selectedEducation,
          stream: selectedStream,
          percentage: selectedPercentage,
          workingStatus: selectedWorkingStatus,
          budget: selectedBudget,
          answersSummary: {
            education: selectedEducation,
            stream: selectedStream,
            percentage: selectedPercentage,
            interests: selectedInterests,
            careerGoals: selectedCareerGoals,
            preferredCourse: selectedCourse,
            preferredCourseId: answers.preferredCourseId,
            workingStatus: selectedWorkingStatus,
            budget: selectedBudget,
            region: answers.region || "all",
            summaryText,
            stepDetails,
            allAnswers: {
              ...answers,
              workingStatus: answers.workingStatus || "student",
            },
          },
        });
      } catch (err) {
        console.error("Failed to submit counselling data", err);
      }
      setTimeout(() => {
        setIsAnalyzing(false);
        if (onComplete) onComplete(answers);
      }, 1200);
      return;
    }

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        if (onComplete) onComplete(answers);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const toggleInterest = (val) => {
    setAnswers((prev) => {
      const exists = prev.interests.includes(val);
      let updated = exists
        ? prev.interests.filter((i) => i !== val)
        : [...prev.interests, val];
      if (updated.length === 0) updated = [val]; // keep at least one
      return { ...prev, interests: updated };
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Questionnaire Card Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
        {/* Progress Bar Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2.5">
            <span className="flex items-center gap-1.5 text-crimson uppercase tracking-wider font-bold">
              <Target className="h-3.5 w-3.5" />
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-navy font-bold">{progressPercent}% Completed</span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-crimson to-crimson-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          <div className="mt-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              {currentStep.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Wizard Steps with AnimatePresence */}
        <div className="min-h-[320px]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-crimson/20 animate-ping" />
                <div className="h-16 w-16 rounded-full border-4 border-crimson border-t-transparent animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-navy">
                Analyzing Your Profile...
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                Comparing fees, verified placement packages, and cutoff scores across 500+ Indian colleges.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <label className="block text-sm font-bold text-navy mb-3">
                    What is your current or highest qualification?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      {
                        id: "12th",
                        title: "12th Standard (Appearing / Passed)",
                        desc: "Looking for undergraduate degrees (B.Tech, BBA, B.Sc)",
                        icon: GraduationCap,
                      },
                      {
                        id: "graduate",
                        title: "Bachelor's Degree (Graduate)",
                        desc: "Looking for postgraduate programs (MBA, M.Tech, MCA)",
                        icon: Briefcase,
                      },
                      {
                        id: "diploma",
                        title: "Diploma / Polytechnic",
                        desc: "Looking for lateral entry or specialized programs",
                        icon: Layers,
                      },
                      {
                        id: "10th",
                        title: "10th Standard / Matriculation",
                        desc: "Exploring streams, polytechnic, or future roadmap",
                        icon: BookOpen,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const selected = answers.education === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setAnswers({ ...answers, education: item.id })}
                          className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 ${selected
                            ? "border-crimson bg-crimson-50/50 shadow-md shadow-crimson/10"
                            : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-xl shrink-0 ${selected
                                ? "bg-crimson text-white"
                                : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-navy leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-navy mb-3">
                      Which academic stream did you study?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "pcm", label: "Science (PCM)", sub: "Physics, Chemistry, Maths" },
                        { id: "pcb", label: "Science (PCB)", sub: "Physics, Chemistry, Biology" },
                        { id: "commerce", label: "Commerce", sub: "Accounts, Economics, Business" },
                        { id: "arts", label: "Arts / Humanities", sub: "Social Sciences, Languages" },
                        { id: "vocational", label: "Vocational / Others", sub: "Applied technical courses" },
                      ].map((st) => (
                        <div
                          key={st.id}
                          onClick={() => setAnswers({ ...answers, stream: st.id })}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${answers.stream === st.id
                            ? "border-crimson bg-crimson-50/60 text-navy font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold">{st.label}</div>
                              <div className="text-xs text-slate-500">{st.sub}</div>
                            </div>
                            {answers.stream === st.id && (
                              <CheckCircle2 className="h-4 w-4 text-crimson shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">
                      Academic Score / Expected Percentage
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: "85_plus", label: "85% & Above", tag: "Top Tier" },
                        { id: "70_85", label: "70% - 85%", tag: "Competitive" },
                        { id: "55_70", label: "55% - 70%", tag: "Moderate" },
                        { id: "below_55", label: "Under 55%", tag: "Skill Driven" },
                      ].map((pct) => (
                        <div
                          key={pct.id}
                          onClick={() => setAnswers({ ...answers, percentage: pct.id })}
                          className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all ${answers.percentage === pct.id
                            ? "border-crimson bg-crimson-50/70 text-navy font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                        >
                          <div className="text-xs font-bold">{pct.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{pct.tag}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-bold text-navy mb-1">
                    Select your field(s) of interest (select at least one):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: "tech",
                        title: "Doctorate and Executive Programs",
                        desc: "DBA, EMBA , PGDM , Global MBA",
                        icon: Cpu,
                      },
                      {
                        id: "management",
                        title: "Management & Business",
                        desc: "BBA, MBA,Marketing, Finance",
                        icon: TrendingUp,
                      },
                      {
                        id: "healthcare",
                        title: "Hospitality & Healthcare",
                        desc: "Hospitality and Healthcare Management",
                        icon: HeartPulse,
                      },
                      {
                        id: "design",
                        title: "Arts & Research",
                        desc: "BA, MA, BSC, MSC",
                        icon: Palette,
                      },
                      {
                        id: "law",
                        title: "Banking & Commerce",
                        desc: "B.Com, M.Com, Finance, Banking, Accounting",
                        icon: Scale,
                      },
                      {
                        id: "analytics",
                        title: "AI, Data & Computer Applications",
                        desc: "Data Science, BCA/MCA, AI, Cloud",
                        icon: Layers,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = answers.interests.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleInterest(item.id)}
                          className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${isSelected
                            ? "border-crimson bg-crimson-50/50 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-xl shrink-0 ${isSelected
                                ? "bg-crimson text-white"
                                : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-navy truncate">
                                  {item.title}
                                </h4>
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-crimson shrink-0 ml-1" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-bold text-navy mb-1">
                    What is your primary career goal after graduation?
                  </label>
                  <div className="space-y-2.5">
                    {[
                      {
                        id: "high_salary",
                        title: "High-Paying Tech / Corporate Job",
                        desc: "Targeting top-tier CTC offers (₹12 - ₹30+ LPA) with leading MNCs",
                        icon: DollarSign,
                      },
                      {
                        id: "leadership",
                        title: "Corporate Leadership & Product Management",
                        desc: "Fast track to consulting, business strategy, and management roles",
                        icon: TrendingUp,
                      },
                      {
                        id: "research",
                        title: "Higher Studies & Global Research",
                        desc: "Preparation for MS/M.Tech/Ph.D in India or premier global universities",
                        icon: BookOpen,
                      },
                      {
                        id: "startup",
                        title: "Entrepreneurship & Building a Startup",
                        desc: "Seeking colleges with incubators, angel networks, and founder ecosystems",
                        icon: Target,
                      },
                      {
                        id: "govt",
                        title: "Government Services / PSUs & Civil Exams",
                        desc: "Targeting UPSC, GATE, IES, or Public Sector Undertakings",
                        icon: Award,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const selected = answers.careerGoals.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setAnswers({ ...answers, careerGoals: [item.id] })}
                          className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${selected
                            ? "border-crimson bg-crimson-50/50 shadow-xs"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg shrink-0 ${selected
                                ? "bg-crimson text-white"
                                : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-navy">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                            {selected && (
                              <CheckCircle2 className="h-4 w-4 text-crimson shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-bold text-navy mb-1">
                    Do you have a specific course in mind?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "all", label: "Auto-Recommend for Me", highlight: true },
                      { id: "ba", label: "BA" },
                      { id: "bcom", label: "B.COM" },
                      { id: "bba", label: "BBA" },
                      { id: "bca", label: "BCA" },
                      { id: "ba-hons", label: "BA (Hons)" },
                      { id: "bcom-hons", label: "B.COM (Hons)" },
                      { id: "bba-hons", label: "BBA (Hons)" },
                      { id: "bsc", label: "BSC" },
                      { id: "ma", label: "MA" },
                      { id: "mcom", label: "M.COM" },
                      { id: "mba", label: "MBA" },
                      { id: "mca", label: "MCA" },
                      { id: "msc-ds", label: "MSC Data Science" },
                      { id: "msc-math", label: "MSC Mathematics" },
                      { id: "dba", label: "DBA" },
                      { id: "exec-prog", label: "Executive Programs" },
                      { id: "cert-dip", label: "Certificate & Diploma" },
                    ].map((c) => {
                      const selected = answers.preferredCourseId === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setAnswers({ ...answers, preferredCourseId: c.id })}
                          className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${selected
                            ? "border-crimson bg-crimson text-white font-bold shadow-md shadow-crimson/20"
                            : c.highlight
                              ? "border-amber-300 bg-amber-50/50 text-navy font-semibold hover:border-amber-400"
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                            }`}
                        >
                          <div className="text-xs font-semibold">{c.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2.5">
                      Your Working status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "student", label: "Student", sub: "Currently pursuing a degree" },
                        { id: "working_professional", label: "Working Professional", sub: "Currently employed" },
                        { id: "unemployed", label: "Unemployed", sub: "Looking for job opportunities" },
                        { id: "self_employed", label: "Self Employed", sub: "Business owner / Freelancer" },
                      ].map((status) => (
                        <div
                          key={status.id}
                          onClick={() => setAnswers({ ...answers, workingStatus: status.id })}
                          className={`p-3 rounded-xl border-2 cursor-pointer text-left transition-all ${answers.workingStatus === status.id
                            ? "border-crimson bg-crimson-50/60 font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                        >
                          <div className="text-xs font-bold text-navy">{status.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{status.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-navy mb-2.5">
                      Budget Preferences
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: "budget_low", label: "Budget Friendly (< ₹2L / Year)", sub: "Top Private Universities with your Budget" },
                        { id: "budget_mid", label: "Mid-Range (₹2L - ₹4L / Year)", sub: "Top private & deemed universities" },
                        { id: "scholarship", label: "For working professionals", sub: "Weekend / Evening Batches" },
                        { id: "flexible", label: "Flexible Budget / ROI Focused", sub: "Quality and placements matter most" },
                      ].map((bg) => (
                        <div
                          key={bg.id}
                          onClick={() => setAnswers({ ...answers, budget: bg.id })}
                          className={`p-3 rounded-xl border-2 cursor-pointer text-left transition-all ${answers.budget === bg.id
                            ? "border-crimson bg-crimson-50/60 font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                        >
                          <div className="text-xs font-bold text-navy">{bg.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{bg.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStepIndex === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="bg-crimson-50/50 p-4 rounded-xl border border-crimson-100 mb-6 text-left">
                    <p className="text-sm text-navy">
                      You're almost there! We've found <span className="font-bold text-crimson">colleges & courses</span> matching your profile. Please provide your details to view your personalized recommendations and get free expert guidance.
                    </p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-crimson">*</span></label>
                      <input
                        type="text"
                        required
                        value={answers.name}
                        onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number <span className="text-crimson">*</span></label>
                      <input
                        type="tel"
                        required
                        value={answers.phone}
                        onChange={(e) => setAnswers({ ...answers, phone: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-crimson">*</span></label>
                      <input
                        type="email"
                        required
                        value={answers.email}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="e.g. john@example.com"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Wizard Controls */}
        {!isAnalyzing && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={currentStepIndex === 0}
              onClick={handleBack}
              className="text-xs font-semibold text-slate-600 border-slate-200 h-10 px-4 rounded-xl disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="h-10 px-6 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs shadow-md shadow-crimson/20 cursor-pointer transition-all hover:scale-102"
            >
              {currentStepIndex === STEPS.length - 1 ? (
                <>
                  <span>View My Recommendations</span>
                  <Target className="h-3.5 w-3.5 ml-1.5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
