"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const finishTimerRef = useRef(null);

  // Complete progress when pathname or searchParams change
  useEffect(() => {
    if (loading) {
      const immediateTimer = setTimeout(() => {
        setProgress(100);
        finishTimerRef.current = setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 250);
      }, 0);
      
      return () => {
        clearTimeout(immediateTimer);
        if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      };
    }
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept internal link clicks to give instant zero-latency feedback
  useEffect(() => {
    const handleAnchorClick = (event) => {
      const target = event.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, anchor links, mailto, tel, or modifier keys
      if (
        href.startsWith("http") &&
        !href.startsWith(window.location.origin)
      )
        return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      if (target.getAttribute("target") === "_blank") return;
      if (target.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const targetUrl = new URL(href, window.location.href);
      // If clicking the exact current page with no new query params, skip
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search &&
        !targetUrl.hash
      ) {
        return;
      }

      // Start navigation progress
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);

      setLoading(true);
      setProgress(25);

      // Increment progress gradually until route settles
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(timerRef.current);
            return 85;
          }
          return prev + Math.random() * 18;
        });
      }, 120);
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: loading ? 1 : 0 }}
    >
      {/* Top Bar Track */}
      <div className="h-[3px] w-full bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-crimson-800 via-crimson to-red-600 shadow-[0_0_14px_rgba(185,28,28,0.9)] transition-all duration-200 ease-out transform-gpu"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Leading Glow Pulse */}
      <div
        className="absolute top-0 h-[3px] w-24 bg-red-200/80 blur-xs transition-all duration-200 ease-out pointer-events-none transform-gpu"
        style={{ left: `calc(${progress}% - 96px)` }}
      />
    </div>
  );
}
