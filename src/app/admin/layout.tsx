"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Calendar,
  Users,
  ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Donations", href: "/admin/donations", icon: Heart },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="w-8 h-8 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-forest fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10">
              <Image
                src="/images/logo.png"
                alt="Ashish Foundation"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span
                className="text-white font-semibold text-sm block"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ashish Foundation
              </span>
              <span className="text-white/50 text-[10px] uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <link.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-saffron" : "text-white/50 group-hover:text-white/80"
                  }`}
                />
                {link.label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/40" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/8 hover:text-white transition-all mb-1"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </Link>
          <div className="px-4 py-3">
            <p className="text-xs text-white/50">Logged in as</p>
            <p className="text-sm text-white font-medium truncate">
              {user.name}
            </p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-forest shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10">
              <Image
                src="/images/logo.png"
                alt="Ashish Foundation"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span
              className="text-white font-semibold text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-forest p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-4 mb-4 border-b border-white/10">
              <p className="text-white font-semibold text-sm px-4">
                Admin Panel
              </p>
            </div>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-white/10">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-300 transition-all w-full mt-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
