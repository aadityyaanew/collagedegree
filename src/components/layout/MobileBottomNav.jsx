"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ArrowLeftRight, BookOpen, Compass } from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "Colleges",
    href: "/colleges",
    icon: Building2,
    isActive: (pathname) => pathname.startsWith("/colleges"),
  },
  {
    label: "Compare",
    href: "/compare",
    icon: ArrowLeftRight,
    isActive: (pathname) => pathname.startsWith("/compare"),
  },
  {
    label: "Courses",
    href: "/courses",
    icon: BookOpen,
    isActive: (pathname) => pathname.startsWith("/courses"),
  },
  {
    label: "Finder",
    href: "/course-finder",
    icon: Compass,
    isSpecial: true,
    isActive: (pathname) => pathname.startsWith("/course-finder"),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] transition-all transform-gpu"
      style={{
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))",
      }}
    >
      <div className="max-w-md mx-auto px-2 pt-1.5 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 py-1 group relative active:scale-90 transition-transform duration-150"
              >
                <div
                  className={`relative flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-crimson text-white shadow-md shadow-crimson/30 scale-105"
                      : "bg-crimson/10 text-crimson hover:bg-crimson/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
                  </span>
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors ${
                    active ? "text-crimson font-bold" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-1 group relative active:scale-90 transition-transform duration-150"
            >
              <div
                className={`relative flex items-center justify-center h-7 w-7 rounded-lg transition-all duration-200 ${
                  active
                    ? "text-crimson"
                    : "text-slate-500 group-hover:text-navy"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    active ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                  active
                    ? "text-crimson font-bold"
                    : "text-slate-500 font-medium group-hover:text-navy"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="h-1 w-3.5 bg-crimson rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
