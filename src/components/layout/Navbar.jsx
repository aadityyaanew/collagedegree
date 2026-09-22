"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Colleges", href: "/colleges" },
  { label: "Courses", href: "/courses" },
  { label: "Compare", href: "/compare" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 transform-gpu ${scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-xs"
          : "bg-white border-b border-transparent"
        }`}
    >
      <div className="container-main">
        <nav className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 active:scale-95 transition-transform">
            <Image
              src="/logo.png"
              alt="Compare Degree"
              width={160}
              height={42}
              style={{ width: "auto" }}
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-sm font-semibold text-slate-900 hover:text-crimson transition-colors rounded-md hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Course Finder */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="relative group bg-crimson hover:bg-crimson-dark text-white font-bold px-5 h-9.5 text-xs rounded-xl shadow-md shadow-crimson/20 hover:shadow-lg hover:shadow-crimson/30 transition-all cursor-pointer"
            >
              <Link href="/course-finder" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Course Advisor</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Actions: Course Finder Chip + Drawer Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/course-finder"
              className="flex items-center gap-1.5 bg-crimson hover:bg-crimson-dark text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(225,29,72,0.5)] transition-all active:scale-95 touch-manipulation whitespace-nowrap"
            >
              <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span>Course Advisor</span>
            </Link>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="p-2 -mr-1.5 text-slate-700 hover:text-crimson active:scale-90 transition-all rounded-lg"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 flex flex-col justify-between">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Mobile Drawer Header */}
                  <div className="flex items-center justify-between p-4 pr-11 border-b border-slate-100 bg-slate-50/50">
                    <Image
                      src="/logo.png"
                      alt="Compare Degree"
                      width={140}
                      height={36}
                      style={{ width: "auto" }}
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Mobile Links */}
                  <div className="flex-1 overflow-y-auto py-3 divide-y divide-slate-100/60">
                    <div className="px-3 py-2 space-y-1">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.label}>
                          <Link
                            href={link.href}
                            className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:text-crimson hover:bg-rose-50/50 rounded-xl transition-all"
                          >
                            <span>{link.label}</span>
                            <span className="text-slate-300 text-xs font-normal">&rsaquo;</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    {/* Quick Counselling Contact in Drawer */}
                    <div className="p-4 bg-slate-50/70 m-3 rounded-2xl border border-slate-200/80">
                      <p className="text-xs font-bold text-navy mb-1">
                        Need Expert Guidance?
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                        Talk to an education counselor for 100% free guidance.
                      </p>
                      <div className="space-y-1.5 text-xs font-semibold">
                        <a
                          href="tel:+918377959878"
                          className="flex items-center gap-2 text-slate-600 hover:text-crimson transition-colors"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>+91 83779 59878</span>
                        </a>
                        <a
                          href="mailto:info@comparedegree.com"
                          className="flex items-center gap-2 text-slate-600 hover:text-crimson transition-colors"
                        >
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>info@comparedegree.com</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="p-4 border-t border-slate-100 bg-white">
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full h-11 text-sm font-bold bg-crimson hover:bg-crimson-dark text-white rounded-xl shadow-md shadow-crimson/25 flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Link href="/course-finder">
                          <UserCheck className="h-4 w-4" />
                          <span>Find Best College & Course</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
