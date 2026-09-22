import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Why Compare Degree", href: "/about" },
    { label: "Student Reviews", href: "/#testimonials" },
  ],
  explore: [
    { label: "Top Universities", href: "/colleges" },
    { label: "Explore Courses", href: "/courses" },
    { label: "Compare Colleges", href: "/compare" },
    { label: "NIRF Rankings", href: "/colleges" },
  ],
  resources: [
    { label: "Free Counselling", href: "/contact" },
    { label: "Course Advisor", href: "/course-finder" },
    { label: "College Predictor", href: "/course-finder" },
    { label: "Admission Guidance", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Data Integrity", href: "/privacy-policy" },
    { label: "Security & Trust", href: "/about" },
  ],
};

const socialIcons = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/compare-degree/",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 0 0-1.66 1.64c0 .9.74 1.63 1.66 1.63.92 0 1.65-.73 1.65-1.63 0-.9-.73-1.64-1.65-1.64" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/comparedegree?stkn=MXZ5aWw3cm56M3luNg==",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/19ibumY2z2/",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800/80 relative z-10 pb-20 lg:pb-0">
      {/* Main Footer Content */}
      <div className="container-main py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column (takes 4 columns on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-4 transition-opacity hover:opacity-90">
                <Image
                  src="/logo-white.png"
                  alt="Compare Degree"
                  width={210}
                  height={50}
                  style={{ width: "auto" }}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm">
                Smart Decisions, Brighter Futures. India&apos;s most comprehensive
                college and course comparison platform helping students make
                confident, data-driven decisions.
              </p>

              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/60 text-xs text-slate-300 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Trusted by 50,000+ students across India</span>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-sm">
              <a
                href="mailto:info@comparedegree.com"
                className="group flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-crimson group-hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span>info@comparedegree.com</span>
              </a>
              <a
                href="tel:+918377959878"
                className="group flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-crimson group-hover:text-white transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span>+91 8377959878</span>
              </a>
            </div>
          </div>

          {/* Links Columns (takes 8 columns on lg) */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-0.5 inline-flex items-center transition-all duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore Links */}
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-0.5 inline-flex items-center transition-all duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-0.5 inline-flex items-center transition-all duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-0.5 inline-flex items-center transition-all duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Growhys Innovations Private Limited. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                title={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-crimson hover:border-crimson transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
