"use client";

import { useState } from "react";
import { Headphones, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import StickyCounsellingForm from "./StickyCounsellingForm";

export default function MobileCounsellingBar({
  initialCourse,
  answersSummary,
  formRef,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleScrollToForm = () => {
    if (formRef?.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setOpenDrawer(true);
    }
  };

  return (
    <>
      {/* Floating Bottom Bar for Mobile Only */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-navy/95 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-crimson flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="h-4 w-4 text-white" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>Free Admission Desk</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                Scholarships & Cut-off assistance
              </p>
            </div>
          </div>

          <Button
            onClick={handleScrollToForm}
            className="h-9 px-4 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs shrink-0 shadow-md shadow-crimson/30 cursor-pointer"
          >
            <span>Get Counselling</span>
            <ChevronUp className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}
