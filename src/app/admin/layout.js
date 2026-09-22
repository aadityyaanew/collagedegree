"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Search,
  Globe,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Colleges", href: "/admin/colleges", icon: Building2 },
  { name: "Courses", href: "/admin/courses", icon: GraduationCap },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Exclude sidebar from login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-navy">

            <span className="text-xl font-bold tracking-tight">Admin Portal</span>
          </div>
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </div>
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? "bg-crimson/10 text-crimson"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-navy"
                    }`}
                >
                  <item.icon
                    className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors ${isActive ? "text-crimson" : "text-slate-400 group-hover:text-navy"
                      }`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-crimson shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="group flex w-full items-center px-3 py-2.5 mb-1 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-100 hover:text-navy transition-colors"
          >
            <Globe className="flex-shrink-0 mr-3 h-5 w-5 text-slate-400 group-hover:text-navy" />
            Go to Website
          </Link>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="flex-shrink-0 mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFBFF]">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center px-4 py-2 bg-slate-100/80 rounded-full border border-slate-200/60 text-slate-500 focus-within:ring-2 focus-within:ring-crimson/20 focus-within:border-crimson/30 transition-all w-72">
              <Search className="h-4 w-4 mr-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anywhere..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-navy"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
